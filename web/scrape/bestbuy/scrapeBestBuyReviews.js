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
        await page.waitForSelector(".ugc-recommendation", { timeout: 10000 });
      } catch {
        console.warn("Elemen .ugc-recommendation tidak muncul.");
        return [];
      }
      break;
    }
  }

  const content = await page.content();
  const $ = cheerio.load(content);
  const reviews = [];

  $(".review-item")
    .slice(0, 2)
    .each((_, el) => {
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
  console.log(reviews);
  return reviews;
}
