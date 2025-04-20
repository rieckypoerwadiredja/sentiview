const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process"); // To run Python script
const app = express();
const cors = require("cors");

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://sentiview.vercel.app/", // React dev server
  })
);

// Route to predict sentiment
app.get("/predict", (req, res) => {
  res.json({ sentiment: "predict" });
});
app.post("/predict", (req, res) => {
  const text = req.body.text;

  // Run the Python script and pass the text to it
  const python = spawn("python", ["../predict_sentiment.py", text]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    if (code === 0) {
      // Send the result to the client
      res.json({ sentiment: result.trim() });
    } else {
      res.status(500).send("Error processing the sentiment");
    }
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
