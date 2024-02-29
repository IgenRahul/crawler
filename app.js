const express = require("express");
const bodyParser = require("body-parser");
const { main } = require("./index.js");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON body
app.use(bodyParser.json());

// POST endpoint to accept link input
app.post("/link/", async (req, res) => {
  const url = req.body.link;

  // Here you can process the URL and generate JSON data
  // For demonstration, let's just send back a sample JSON response
  const pages = await main(url);
  const jsonData = {
    message: "Received URL",
    receivedUrl: url,
    internalLinks: [],
    externalLinks: [],
    pages,
  };

  res.json(jsonData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
