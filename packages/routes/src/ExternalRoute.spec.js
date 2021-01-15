import expect from "unexpected";
import { ExternalRoute } from "./index.js";

describe("ExternalRoute", () => {
  describe("constructor", () => {
    it("create a new named path that is external", () => {
      const route = new ExternalRoute("edit", "/posts/edit/:id");

      expect(route, "to satisfy", {
        name: "edit",
        external: true,
      });
    });

    it("supports full urls", () => {
      const route = new ExternalRoute(
        "edit",
        "https://example.com/posts/edit/:id"
      );

      expect(route, "to satisfy", {
        name: "edit",
        external: true,
      });
    });
  });

  describe("match", () => {
    describe("on a url that matches", () => {
      it("returns the named parts", () => {
        const route = new ExternalRoute(
          "edit",
          "https://www.example.com/posts/edit/:id"
        );

        expect(
          route.match("https://www.example.com/posts/edit/123"),
          "to equal",
          {
            id: "123",
          }
        );
      });
    });

    describe("on a url that doesn't matches", () => {
      it("returns null", () => {
        const route = new ExternalRoute(
          "edit",
          "https://www.example.com/posts/edit/:id"
        );

        expect(route.match("/posts/edit/43"), "to be null");
      });
    });
  });

  describe("stringify", () => {
    it("build a url from the given route", () => {
      const route = new ExternalRoute(
        "edit",
        "https://www.example.com/posts/edit/:id"
      );

      expect(
        route.stringify({ id: 123 }),
        "to equal",
        "https://www.example.com/posts/edit/123"
      );
    });
  });
});
