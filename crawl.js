const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  const normalisedCurrentURL = normaliseURL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    if (pages.externalLinks[normalisedCurrentURL] > 0) {
      pages.externalLinks[normalisedCurrentURL]++;
    } else {
      pages.externalLinks[normalisedCurrentURL] = 1;
    }
    return pages;
  }

  if (pages.internalLinks[normalisedCurrentURL] > 0) {
    pages.internalLinks[normalisedCurrentURL]++;
    return pages;
  }

  pages.internalLinks[normalisedCurrentURL] = 1;

  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      return pages;
    }
    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      return pages;
    }
    const htmlBody = await res.text();
    const { nextURLs, invalid } = getURLsFromHTML(htmlBody, baseURL);
    pages.invalid += invalid;
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (e) {
    console.log(`error in Fetch ${e.message} on page : ${currentURL}`);
  }
  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const nextURLs = [];
  let invalid = 0;
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  linkElements.forEach((element) => {
    const href = element.href;
    if (href.slice(0, 1) == "/") {
      // relative URL and invalid url
      try {
        const urlObj = new URL(`${baseURL}${href}`);
        nextURLs.push(urlObj.href);
      } catch (e) {
        invalid++;
      }
    } else {
      // absolute URL
      try {
        const urlObj = new URL(href);
        nextURLs.push(urlObj.href);
      } catch (e) {
        invalid++;
      }
    }
  });
  return { nextURLs, invalid };
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
