import expect from "unexpected";
import { PathPattern } from "./PathPattern";

describe("PathPattern", () => {
  describe("match", () => {
    it("trims slashes from the pattern", () => {
      const pattern = new PathPattern("/posts/edit/:id/");

      expect(pattern.match("/posts/edit/123"), "to equal", { id: "123" });
    });

    it("trims slashes from the path", () => {
      const pattern = new PathPattern("posts/edit/:id");

      expect(pattern.match("/posts/edit/123/"), "to equal", { id: "123" });
    });

    it("captures variables from the match", () => {
      const pattern = new PathPattern("/posts/:locale/edit/:id");

      expect(pattern.match("/posts/da/edit/123"), "to equal", {
        id: "123",
        locale: "da",
      });
    });

    it("returns the path match to be exact", () => {
      const pattern = new PathPattern("/posts/:locale/edit/:id");

      expect(pattern.match("/posts/da/edit/123/extra/stuff"), "to be null");
    });

    it("returns null if pattern doesn't match", () => {
      expect(
        new PathPattern("/posts/:locale/edit/:id").match("/posts/da/edit"),
        "to be null"
      );

      expect(new PathPattern(":id").match(""), "to be null");

      expect(
        new PathPattern("/posts/:locale/edit/:id").match("/posts/da/new/123"),
        "to be null"
      );
    });

    it("URI decodes variables", () => {
      const pattern = new PathPattern("/posts/:locale/edit/:id");

      expect(
        pattern.match(
          "/posts/da%25%3F%26/edit/123%2B%20%2F%20%C3%A6%C3%B8%C3%A5"
        ),
        "to equal",
        {
          id: "123+ / æøå",
          locale: "da%?&",
        }
      );
    });
  });

  describe("stringify", () => {
    it("always builds a root relative path with no trailing slash", () => {
      const pattern = new PathPattern("posts/new/");

      expect(pattern.stringify(), "to equal", "/posts/new");
    });

    it("fails if you don't supply a variable", () => {
      const pattern = new PathPattern("posts/edit/:id");

      expect(
        () => pattern.stringify(),
        "to throw",
        "No value provided for variable: id"
      );
    });

    it("interpolate any given variables", () => {
      const pattern = new PathPattern("/posts/:locale/edit/:id");

      expect(
        pattern.stringify({
          id: "123",
          locale: "da",
          other: "not needed",
        }),
        "to equal",
        "/posts/da/edit/123"
      );
    });

    it("URI encodes variables", () => {
      const pattern = new PathPattern("/posts/:locale/edit/:id");

      expect(
        pattern.stringify({
          id: "123+ / æøå",
          locale: "da%?&",
          other: "not needed",
        }),
        "to equal",
        "/posts/da%25%3F%26/edit/123%2B%20%2F%20%C3%A6%C3%B8%C3%A5"
      );
    });
  });
});
