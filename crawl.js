const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalisedCurrentURL = normaliseURL(currentURL);
  if (pages[normalisedCurrentURL] > 0) {
    pages[normalisedCurrentURL]++;
    return pages;
  }

  pages[normalisedCurrentURL] = 1;
  console.log("Actively Crawling:", currentURL);

  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      console.log(
        `Error in fetch with status code: ${res.status} on page : ${currentURL}`
      );
      return pages;
    }
    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`No HTML content found on page: ${currentURL}`);
      return pages;
    }
    const htmlBody = await res.text();
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for(const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (e) {
    console.log(`error in Fetch ${e.message} on page : ${currentURL}`);
  }
  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  linkElements.forEach((element) => {
    const href = element.href;
    if (href.slice(0, 1) == "/") {
      // relative URL and invalid url
      try {
        const urlObj = new URL(`${baseURL}${href}`);
        urls.push(urlObj.href);
      } catch (e) {
        console.log(e);
      }
    } else {
      // absolute URL
      try {
        const urlObj = new URL(href);
        urls.push(urlObj.href);
      } catch (e) {
        console.log(e);
      }
    }
  });
  return urls;
}

function normaliseURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname.toLowerCase()}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normaliseURL,
  getURLsFromHTML,
  crawlPage,
};
