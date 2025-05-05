// server.js
import express from "express";
import scrapeBestBuyProduct from "./bestbuy/scrape_bestbuy.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/scrape-bestbuy", async (req, res) => {
  console.log("EE");
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL produk diperlukan" });
  }

  try {
    const data = await scrapeBestBuyProduct(url);
    res.json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Gagal melakukan scraping", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
