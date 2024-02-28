const { JSDOM } = require("jsdom");
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
      // absoute URL
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
};
