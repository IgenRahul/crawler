const { crawlPage } = require("./crawl");

async function main(baseURL) {
  const pages = await crawlPage(baseURL, baseURL, {
    internalLinks: {},
    externalLinks: {},
    invalid: 0,
  });
  return pages;
}

module.exports = {
  main,
};
