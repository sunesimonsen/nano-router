import { parseUrl, PartialRouterLocation } from "./utils.js";

type TestCase = [string, PartialRouterLocation];

describe("parseUrl", () => {
  const testCases: TestCase[] = [
    [
      "/foo/bar/baz",
      { href: "/foo/bar/baz", pathname: "/foo/bar/baz", search: "", hash: "" },
    ],
    [
      "/foo/bar/baz#hash",
      {
        href: "/foo/bar/baz#hash",
        pathname: "/foo/bar/baz",
        search: "",
        hash: "#hash",
      },
    ],
    [
      "/foo/bar/baz?qux=quux#hash",
      {
        href: "/foo/bar/baz?qux=quux#hash",
        pathname: "/foo/bar/baz",
        search: "?qux=quux",
        hash: "#hash",
      },
    ],
    [
      "https://www.example.com/foo/bar/baz?qux=quux#hash",
      {
        href: "https://www.example.com/foo/bar/baz?qux=quux#hash",
        pathname: "/foo/bar/baz",
        search: "?qux=quux",
        hash: "#hash",
      },
    ],
  ];

  testCases.forEach(([input, output]) => {
    it(`${input} -> ${JSON.stringify(output)}`, () => {
      expect(parseUrl(input)).toEqual(output);
    });
  });
});
