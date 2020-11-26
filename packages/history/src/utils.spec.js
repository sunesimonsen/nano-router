import expect from "unexpected";
import { parseUrl } from "./utils";

describe("parseUrl", () => {
  [
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
  ].forEach(([input, output]) => {
    it(`${input} -> ${JSON.stringify(output)}`, () => {
      expect(parseUrl(input), "to equal", output);
    });
  });
});
