import * as cheerio from "cheerio";

export async function scrapeBestBuyReviews(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  const buttons = await page.$$("button");

  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.includes("See All Customer Reviews")) {
      await btn.click();
      try {
        // Tunggu review-item muncul (lebih spesifik)
        await page.waitForSelector(".review-item", { timeout: 15000 });
      } catch {
        console.warn("Elemen .review-item tidak muncul.");
        return [];
      }
      break;
    }
  }

  // Tunggu sedikit lagi agar konten benar-benar termuat
  await page.waitForTimeout(2000);

  const content = await page.content();
  const $ = cheerio.load(content);
  const reviews = [];

  const reviewItems = $(".review-item");
  if (reviewItems.length === 0) {
    console.warn("Tidak ada review-item yang ditemukan.");
  }

  reviewItems.slice(0, 2).each((_, el) => {
    const rating = $(el).find(".c-ratings-reviews p").text().trim();
    const reviewTitle = $(el).find("h4.review-title").text().trim();
    const reviewContent = $(el).find("p.pre-white-space").text().trim();
    const recommended =
      $(el).find(".ugc-recommendation").length > 0 ? "true" : "false";

    reviews.push({
      rating,
      review_title: reviewTitle,
      review_content: reviewContent,
      recommended,
    });
  });

  console.log("✅ Reviews scraped:", reviews);
  return reviews;
}
