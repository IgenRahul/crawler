const { crawlPage } = require("./crawl");

async function main(baseURL) {
  const pages = await crawlPage(baseURL, baseURL, {});
  return pages;
}

module.exports = {
  main,
};
