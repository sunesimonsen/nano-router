import { Route } from "./index";

describe("Route", () => {
  describe("constructor", () => {
    it("create a new named path", () => {
      const route = new Route("edit", "/posts/edit/:id");

      expect(route).toMatchObject({ name: "edit" });
    });

    it("fails when given the name default", () => {
      expect(() => new Route("default", "/foo/bar")).toThrow(
        "default is a reserved route name"
      );
    });
  });

  describe("match", () => {
    describe("on a url that matches", () => {
      it("returns the named parts", () => {
        const route = new Route("edit", "/posts/edit/:id");

        expect(route.match("/posts/edit/123")).toEqual({ id: "123" });
      });
    });

    describe("on a url that doesn't matches", () => {
      it("returns null", () => {
        const route = new Route("edit", "/posts/edit/:id");

        expect(route.match("/posts/edit/")).toBe(null);
      });
    });
  });

  describe("stringify", () => {
    it("build a url from the given route", () => {
      const route = new Route("edit", "/posts/edit/:id");

      expect(route.stringify({ id: 123 })).toEqual("/posts/edit/123");
    });
  });
});
