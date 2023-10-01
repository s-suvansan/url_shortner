// index.js
const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://dummymaily123:ILfBSEcoLZs1d0zr@cluster0.3yr6xi8.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a URL schema
const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
  title: String,
  desc: String,
  image: String,
});

// Create a URL model
const Url = mongoose.model("Url", urlSchema);

// Create a shortened URL
app.post("/shorten", async (req, res) => {
  const longUrl = req.body.longUrl;
  const title = req.body.title;
  const desc = req.body.desc;
  const image = req.body.image;

  if (!longUrl) {
    return res.status(400).json({ error: "Long URL is required" });
  }

  const existingUrl = await Url.findOne({ longUrl });
  if (existingUrl) {
    const shortUrl = `https://short-link-py7b.onrender.com/${existingUrl.shortCode}`;
    return res.status(200).json({ shortUrl });
  }

  const shortCode = shortid.generate();
  const shortUrl = `https://short-link-py7b.onrender.com/${shortCode}`;

  const url = new Url({ longUrl, shortCode, title, desc, image });
  await url.save();

  res.status(201).json({ shortUrl });
});

// Redirect to the original URL
app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;
  const url = await Url.findOne({ shortCode });

  if (!url) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  //   if(isFromAndroid){
  //   res.redirect(playstore url);

  //    }else if(isIOS){
  //   res.redirect(appstore url);

  //    }

  res.status(200).json(url);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// <!--  <meta property="og:url" content="${req.protocol}://${req.get("host")}${req.originalUrl}"> -->
//
