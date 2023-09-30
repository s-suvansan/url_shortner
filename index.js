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
});

// Create a URL model
const Url = mongoose.model("Url", urlSchema);

// Create a shortened URL
app.post("/shorten", async (req, res) => {
  const longUrl = req.body.longUrl;
  if (!longUrl) {
    return res.status(400).json({ error: "Long URL is required" });
  }

  const existingUrl = await Url.findOne({ longUrl });
  if (existingUrl) {
    return res.status(200).json({ shortUrl: existingUrl.shortCode });
  }

  const shortCode = shortid.generate();
  const shortUrl = `http://localhost:${PORT}/${shortCode}`;

  const url = new Url({ longUrl, shortCode });
  await url.save();

  res.status(201).json({ shortUrl });
});

app.get("/dynamic-page", (req, res) => {
  // Dynamic data for OG tags
  const pageTitle = "Allium";
  const pageDescription = "Allium, Flowers, Plant image. Free for use.";
  const pageImageURL =
    "https://cdn.pixabay.com/photo/2023/07/05/13/34/allium-8108318_1280.jpg";

  // Generate the HTML with dynamic OG tags
  const html = `
    <!DOCTYPE html>
    <html prefix="og: https://ogp.me/ns#">
    <head>
        <meta charset="UTF-8">
        <title>${pageTitle}</title>
        <meta name="description" content="${pageDescription}">
        
        <!-- Open Graph tags -->
        <meta property="og:title" content="${pageTitle}">
        <meta property="og:description" content="${pageDescription}">
        <meta property="og:image" content="${pageImageURL}">
    </head>
    <body>
        Short Link Started.....
    </body>
    </html>
  `;

  // Send the HTML as a response
  res.send(html);
});

// Redirect to the original URL
// app.get("/:shortCode", async (req, res) => {
//   const shortCode = req.params.shortCode;
//   const url = await Url.findOne({ shortCode });

//   if (!url) {
//     return res.status(404).json({ error: "Short URL not found" });
//   }
//   //   if(isFromAndroid){
//   //   res.redirect(playstore url);

//   //    }else if(isIOS){
//   //   res.redirect(appstore url);

//   //    }

//   res.redirect(url.longUrl);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// <!--  <meta property="og:url" content="${req.protocol}://${req.get("host")}${req.originalUrl}"> -->
//
