import expect from "unexpected";
import { Routes, Route } from "./index.js";

const routes = new Routes(
  new Route("new", "/posts/new"),
  new Route("edit", "/posts/edit/:id"),
  new Route("view", "/posts/:id")
);

describe("Routes", () => {
  describe("match", () => {
    describe("on a url that matches a route", () => {
      it("returns the matching route match", () => {
        expect(routes.match("/posts/123"), "to equal", {
          name: "view",
          params: { id: "123" },
        });

        expect(routes.match("/posts/edit/123"), "to exhaustively satisfy", {
          name: "edit",
          params: { id: "123" },
        });
      });
    });

    describe("on a url that doesn't matches", () => {
      it("returns the default route", () => {
        expect(routes.match("/post/edit/"), "to equal", {
          name: "default",
          params: {},
        });
      });
    });
  });
});
