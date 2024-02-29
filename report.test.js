const { test, expect } = require("@jest/globals");
const {sortPages} = require("./report");
test("sort pages", () => {
  const input = {
    "https://blog.boot.dev/path": 1,
    "https://blog.boot.dev/path1/": 4,
    "https://blog.boot.dev/path2/": 8,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://blog.boot.dev/path2/", 8],
    ["https://blog.boot.dev/path1/", 4],
    ["https://blog.boot.dev/path", 1],
  ];
  expect(actual).toEqual(expected);
});
