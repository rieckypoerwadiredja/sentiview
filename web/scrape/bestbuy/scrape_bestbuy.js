import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import * as cheerio from "cheerio";

export default async function scrapeBestBuyProduct(url) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(), // Penting!
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  try {
    const startTotal = Date.now();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector("#large-customer-price", { timeout: 10000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const title = $("h1").first().text().trim();
    const price = $("#large-customer-price").text().trim();
    const description = $("div.body-copy-lg.pt-200.pb-300").text().trim();

    const imageLinks = [];
    $("div.pr-300 img").each((i, el) => {
      const src = $(el).attr("src");
      if (src) imageLinks.push(src);
    });

    const endTotalDetail = Date.now();

    let totalReviews = null;
    const reviewText = $('div.v-text-dark-gray.text-center[aria-hidden="true"]')
      .text()
      .trim();
    if (reviewText) {
      const match = reviewText.match(/\d+/);
      if (match) totalReviews = parseInt(match[0].replace(/,/g, ""));
    }

    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text.includes("See All Customer Reviews")) {
        await btn.click();
        await page.waitForSelector(".ugc-recommendation", { timeout: 10000 });
        break;
      }
    }

    const reviewContent = await page.content();
    const $$ = cheerio.load(reviewContent);

    const reviews = [];
    const reviewItems = $$(".review-item").slice(0, 10);
    const startTotalReview = Date.now();

    reviewItems.each((i, el) => {
      const rating = $$(el).find(".c-ratings-reviews p").text().trim();
      const reviewTitle = $$(el).find("h4.review-title").text().trim();
      const reviewContent = $$(el).find("p.pre-white-space").text().trim();
      const recommended =
        $$(el).find(".ugc-recommendation").length > 0 ? "true" : "false";

      reviews.push({
        rating,
        review_title: reviewTitle,
        review_content: reviewContent,
        recommended,
      });
    });

    const endTotalReview = Date.now();
    const rataPerReview = reviews.length
      ? ((endTotalReview - startTotalReview) / reviews.length / 1000).toFixed(4)
      : 0;

    console.log(
      `Total waktu scraping: ${((Date.now() - startTotal) / 1000).toFixed(
        2
      )} detik`
    );
    console.log(
      `Total waktu scraping Review: ${(
        (endTotalReview - startTotalReview) /
        1000
      ).toFixed(2)} detik`
    );
    console.log(
      `Total waktu scraping Details: ${(
        (endTotalDetail - startTotal) /
        1000
      ).toFixed(2)} detik`
    );
    console.log(`Rata-rata waktu per review: ${rataPerReview} detik`);

    return {
      product_details: {
        title,
        price,
        description,
        images: imageLinks,
      },
      reviews,
    };
  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    throw err;
  } finally {
    await browser.close();
  }
}
