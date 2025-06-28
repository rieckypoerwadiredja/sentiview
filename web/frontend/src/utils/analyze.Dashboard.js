export function analyzeRatingFromChartData(ratingChartData) {
  const total = ratingChartData.reduce((sum, r) => sum + r.data, 0);
  if (total === 0) {
    return [
      {
        sentiment: "neutral",
        message: "Not enough rating data available for analysis.",
      },
    ];
  }

  const insights = [];

  const ratings = Object.fromEntries(
    ratingChartData.map((r) => [r.key, r.data])
  );

  const sorted = [...ratingChartData].sort((a, b) => b.data - a.data);
  const [topKeySorted, topCountSorted] = [sorted[0].key, sorted[0].data];
  const topPercentage = topCountSorted / total;

  // 1. Dominasi rating
  if (topPercentage >= 0.6) {
    if (topKeySorted === 5) {
      insights.push({
        sentiment: "positive",
        message:
          "The majority of users are very satisfied. This product is considered highly satisfactory.",
      });
    } else if (topKeySorted === 4) {
      insights.push({
        sentiment: "positive",
        message:
          "Most users are fairly satisfied. The product is considered to be of good quality.",
      });
    } else if (topKeySorted === 3) {
      insights.push({
        sentiment: "neutral",
        message:
          "Many users gave average ratings. The product may be mediocre or not meet expectations.",
      });
    } else {
      insights.push({
        sentiment: "negative",
        message:
          "The majority of users gave low ratings. The product is considered disappointing.",
      });
    }
  } else {
    insights.push({
      sentiment: "neutral",
      message: "No dominant rating. User perceptions are quite diverse.",
    });
  }

  // 2. Perbandingan rating tertinggi dan kedua terbanyak
  const dominant = Object.entries(ratings).sort((a, b) => b[1] - a[1]);
  const [topKey, topCount] = dominant[0];
  const [secondKey, secondCount] = dominant[1];

  if (parseInt(topKey) === 5 && parseInt(secondKey) === 1) {
    insights.push({
      sentiment: "neutral",
      message:
        "Rating 5 is the highest, but rating 1 is also quite high. This product likely creates very different experiences among users — possibly controversial.",
    });
  } else if (parseInt(topKey) === 5 && parseInt(secondKey) === 4) {
    insights.push({
      sentiment: "positive",
      message:
        "Ratings 5 and 4 are the highest. Most users are consistently satisfied with the product's quality.",
    });
  } else if (parseInt(topKey) === 5 && parseInt(secondKey) <= 3) {
    insights.push({
      sentiment: "neutral",
      message:
        "Although rating 5 is the highest, many other users gave moderate or low ratings. This may indicate a mismatch in expectations for some users.",
    });
  } else if (parseInt(topKey) <= 2 && parseInt(secondKey) === 5) {
    insights.push({
      sentiment: "negative",
      message:
        "Low ratings dominate, but rating 5 is also quite significant. This suggests highly varied user experiences and the product may be seen as inconsistent in quality.",
    });
  } else if (parseInt(topKey) <= 2 && parseInt(secondKey) <= 2) {
    insights.push({
      sentiment: "negative",
      message:
        "Most users gave low ratings. The product tends to be disappointing and needs significant improvement.",
    });
  } else {
    insights.push({
      sentiment: "neutral",
      message:
        "The rating distribution is quite diverse without a clear dominant pattern. User experiences seem to vary.",
    });
  }

  // 3. Pola distribusi (skewness)
  const isSkewedToHigh = ratings[5] > ratings[4] && ratings[4] > ratings[3];
  const isSkewedToLow = ratings[1] > ratings[2] && ratings[2] > ratings[3];

  if (isSkewedToHigh) {
    insights.push({
      sentiment: "positive",
      message:
        "The rating distribution is skewed toward the high end. The product is considered very good by many users.",
    });
  } else if (isSkewedToLow) {
    insights.push({
      sentiment: "negative",
      message:
        "The rating distribution is skewed toward the low end. The product appears to be unsatisfactory for most users.",
    });
  }

  return insights;
}

export function analyzeUsageDurationChartData(durationChartData) {
  const total = durationChartData.reduce((sum, d) => sum + d.data, 0);
  if (total === 0) {
    return [
      {
        sentiment: "neutral",
        message: "Not enough rating data available for analysis.",
      },
    ];
  }
  const insights = [];

  const durations = Object.fromEntries(
    durationChartData.map((d) => [d.key, d.data])
  );

  // 1. Dominan kategori
  const sorted = [...durationChartData].sort((a, b) => b.data - a.data);
  const [topKey, topCount] = [sorted[0]?.key, sorted[0]?.data];

  if (topCount > 0) {
    insights.push({
      sentiment:
        topKey === "more than a year" || topKey === "6 - 12 months"
          ? "positive"
          : topKey === "less than 1 month"
          ? "neutral"
          : "neutral",
      message: `The majority of users have used the product for ${topKey}. This indicates a strong tendency toward this category.`,
    });
  } else {
    insights.push({
      sentiment: "neutral",
      message: "There is no dominant usage duration category yet.",
    });
  }

  // 2. Analisis berdasarkan total durasi panjang
  const longTermUsage =
    (durations["6 - 12 months"] || 0) + (durations["more than a year"] || 0);
  if (longTermUsage / total > 0.5) {
    insights.push({
      sentiment: "positive",
      message:
        "The majority of users have used the product long-term. This indicates loyalty and product durability.",
    });
  } else if ((durations["less than 1 month"] || 0) / total > 0.5) {
    insights.push({
      sentiment: "neutral",
      message:
        "Most users are new users. It takes time to assess long-term retention.",
    });
  } else {
    insights.push({
      sentiment: "neutral",
      message:
        "Product usage is spread across various durations, indicating variation in user experience.",
    });
  }

  // 3. Analisis untuk yang belum menggunakan
  if (durations["not used yet"] && durations["not used yet"] / total > 0.2) {
    insights.push({
      sentiment: "neutral",
      message:
        "A number of users gave ratings despite not having used the product directly. This may indicate high initial expectations or bias based on reputation.",
    });
  } else {
    insights.push({
      sentiment: "neutral",
      message:
        "Most users have tried the product directly before giving a rating.",
    });
  }

  return insights;
}

export function analyzeRatingTrend(postedMonthChartData) {
  if (!postedMonthChartData || postedMonthChartData.length === 0) {
    return [
      {
        sentiment: "neutral",
        message: "No review time data available for analysis.",
      },
    ];
  }

  const insights = [];

  // 1. Bulan paling aktif
  const peak = postedMonthChartData.reduce((a, b) => (a.data > b.data ? a : b));
  const peakMonth = peak.key.toLocaleString("default", { month: "long" });
  insights.push({
    sentiment: "positive",
    message: `The highest number of ratings was recorded in ${peakMonth}. This indicates a peak in user activity.`,
  });

  // 2. Deteksi tren naik/turun
  const trend = [];
  for (let i = 1; i < postedMonthChartData.length; i++) {
    const prev = postedMonthChartData[i - 1].data;
    const curr = postedMonthChartData[i].data;
    if (curr > prev) trend.push("up");
    else if (curr < prev) trend.push("down");
    else trend.push("flat");
  }

  const ups = trend.filter((t) => t === "up").length;
  const downs = trend.filter((t) => t === "down").length;

  if (ups > trend.length * 0.6) {
    insights.push({
      sentiment: "positive",
      message:
        "There is an upward trend in the number of ratings month over month. This product is gaining increasing attention.",
    });
  } else if (downs > trend.length * 0.6) {
    insights.push({
      sentiment: "negative",
      message:
        "The number of ratings shows a downward trend. Interest in the product may be starting to decline.",
    });
  } else {
    insights.push({
      sentiment: "neutral",
      message:
        "The number of ratings fluctuates up and down. There is no consistent trend direction.",
    });
  }

  // 3. Stabilitas volume rating
  const values = postedMonthChartData.map((d) => d.data);
  const avg =
    values.reduce((sum, v) => sum + v, 0) / postedMonthChartData.length;
  const stddev = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) /
      postedMonthChartData.length
  );

  if (stddev < avg * 0.3) {
    insights.push({
      sentiment: "positive",
      message:
        "The number of ratings per month is relatively stable. User activity has been fairly consistent over time.",
    });
  } else {
    insights.push({
      sentiment: "neutral",
      message:
        "There is significant variation between months. Review activity appears seasonal or inconsistent.",
    });
  }

  return insights;
}
