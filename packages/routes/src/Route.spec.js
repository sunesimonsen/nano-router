import expect from "unexpected";
import { Route } from "./index";

describe("Route", () => {
  describe("constructor", () => {
    it("create a new named path", () => {
      const route = new Route("edit", "/posts/edit/:id");

      expect(route, "to satisfy", {
        name: "edit",
      });
    });

    it("fails when given the name default", () => {
      expect(
        () => new Route("default", "/foo/bar"),
        "to throw",
        "default is a reserved route name"
      );
    });
  });

  describe("match", () => {
    describe("on a url that matches", () => {
      it("returns the named parts", () => {
        const route = new Route("edit", "/posts/edit/:id");

        expect(route.match("/posts/edit/123"), "to equal", {
          id: "123",
        });
      });
    });

    describe("on a url that doesn't matches", () => {
      it("returns null", () => {
        const route = new Route("edit", "/posts/edit/:id");

        expect(route.match("/posts/edit/"), "to be null");
      });
    });
  });

  describe("stringify", () => {
    it("build a url from the given route", () => {
      const route = new Route("edit", "/posts/edit/:id");

      expect(route.stringify({ id: 123 }), "to equal", "/posts/edit/123");
    });
  });
});
