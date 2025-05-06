import * as cheerio from "cheerio";

export async function scrapeBestBuyReviews(page, url) {
  // Jika input adalah product URL, ubah jadi review URL
  const reviewUrl = url.includes("/reviews/")
    ? url
    : url.replace(".p?", "/reviews?").replace("/site/", "/site/reviews/");

  await page.goto(reviewUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await page.waitForTimeout(2000);

  // Tunggu halaman termuat
  await page.waitForSelector(".review-item", { timeout: 10000 });

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
