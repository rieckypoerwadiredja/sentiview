import express from "express";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { scrapeBestBuyDetails } from "./bestbuy/scrapeBestBuyDetails.js";
import { scrapeBestBuyReviews } from "./bestbuy/scrapeBestBuyReviews.js";
import cors from "cors";

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.post("/scrape/details", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  try {
    const details = await scrapeBestBuyDetails(page, url);
    res.json(details);
  } catch (err) {
    console.error("Error scraping details:", err);
    res.status(500).json({ error: "Gagal scraping detail produk" });
  } finally {
    await browser.close();
  }
});

app.post("/scrape/reviews", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL parameter is required");
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  try {
    const reviews = await scrapeBestBuyReviews(page, url);
    res.json(reviews);
  } catch (err) {
    console.error("Error scraping reviews:", err);
    res.status(500).json({ error: "Gagal scraping review" });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
