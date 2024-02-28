const { crawlPage } = require("./crawl");
async function main() {
  if (process.argv.length < 3) {
    console.log("NO WEBSITE PROVIDED");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("Too many arguments provided. Only one website is allowed.");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log("Crawling website:", baseURL);
  const pages = await crawlPage(baseURL, baseURL, {});
  for (const page of Object.entries(pages)) {
    console.log(page);
  }
}

main();
