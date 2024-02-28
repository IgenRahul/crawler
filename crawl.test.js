const { normaliseURL, getURLsFromHTML } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("normaliseURL strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normaliseURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("normaliseURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normaliseURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("normaliseURL capitals", () => {
  const input = "https://Blog.Boot.dev/Path";
  const actual = normaliseURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("normaliseURL strip http", () => {
  const input = "http://blog.boot.dev/path";
  const actual = normaliseURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("getURlsFormHTML absolute", () => {
  const inputHTMLBody = `
<html>
  <body>
    <a href="https://blog.boot.dev/path/">Blog</a>
   </body>
</html>
`;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURlsFormHTML relative", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/path/">path</a>
     </body>
  </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURlsFormHTML invalid", () => {
    const inputHTMLBody = `
    <html>
      <body>
        <a href="invalid">invalid url</a>
       </body>
    </html>
    `;
    const inputBaseURL = "https://blog.boot.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected);
  });

test("getURlsFormHTML mutiple", () => {
    const inputHTMLBody = `
    <html>
      <body>
      <a href="/path1/">path1</a>
      <a href="https://blog.boot.dev/path2/">Blog</a>
       </body>
    </html>
    `;
    const inputBaseURL = "https://blog.boot.dev";
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path1/","https://blog.boot.dev/path2/"];
    expect(actual).toEqual(expected);
  });
