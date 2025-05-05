import * as cheerio from "cheerio";
export async function scrapeBestBuyDetails(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000, // Lebih longgar
  });

  await page.waitForSelector("#large-customer-price", { timeout: 10000 });
  const content = await page.content();
  const $ = cheerio.load(content);

  const title = $("h1").first().text().trim();
  const price = $("#large-customer-price").text().trim();
  const description = $("div.body-copy-lg.pt-200.pb-300").text().trim();

  const imageLinks = [];
  $("div.pr-300 img").each((_, el) => {
    const src = $(el).attr("src");
    if (src) imageLinks.push(src);
  });

  let totalReviews = null;
  const reviewText = $('div.v-text-dark-gray.text-center[aria-hidden="true"]')
    .text()
    .trim();
  const match = reviewText.match(/\d+/);
  if (match) totalReviews = parseInt(match[0].replace(/,/g, ""));

  return { title, price, description, images: imageLinks, totalReviews };
}
