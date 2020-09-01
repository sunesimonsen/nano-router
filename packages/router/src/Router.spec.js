import unexpected from "unexpected";
import unexpectedSinon from "unexpected-sinon";
import sinon from "sinon";
import { createMemoryHistory } from "@nano-router/history";
import { Router, Routes, Route } from "./index";

const expect = unexpected.clone().use(unexpectedSinon);

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/edit/:id"),
  new Route("posts/view", "/posts/:id"),
  new Route("posts", "/posts")
);

describe("BrowserRouter", () => {
  let router, clearListener, transitionSpy;

  beforeEach(() => {
    router = new Router({
      routes,
      history: createMemoryHistory({
        initialEntries: ["/posts"],
      }),
    });

    transitionSpy = sinon.spy();
    clearListener = router.listen(transitionSpy);
  });

  afterEach(() => {
    clearListener();
  });

  describe("navigate", () => {
    describe("when only given a string", () => {
      it("uses the string as the route name", () => {
        router.navigate({
          route: "posts/edit",
          params: { id: 123 },
          queryParams: { hello: "you" },
          hash: "#anchor",
          state: "hello",
        });

        router.navigate("posts/new");

        expect(transitionSpy, "to have calls satisfying", () => {
          transitionSpy({
            action: "PUSH",
            location: {
              pathname: "/posts/edit/123",
              search: "?hello=you",
              hash: "#anchor",
              state: "hello",
            },
          });

          transitionSpy({
            action: "PUSH",
            location: {
              pathname: "/posts/new",
              search: "?hello=you",
              hash: "#anchor",
              state: null,
            },
          });
        });
      });
    });

    describe("when the pathname matches", () => {
      it("transition the url to the new route", () => {
        router.navigate({
          route: "posts/edit",
          params: { id: 123 },
          queryParams: { hello: "you" },
          hash: "#anchor",
          state: "hello",
        });

        expect(router, "to satisfy", {
          route: "posts/edit",
          params: { id: "123" },
          queryParams: { hello: "you" },
          location: { state: "hello" },
        });

        expect(transitionSpy, "to have calls satisfying", () => {
          transitionSpy({
            action: "PUSH",
            location: {
              pathname: "/posts/edit/123",
              search: "?hello=you",
              hash: "#anchor",
              state: "hello",
            },
          });
        });
      });
    });

    it("fails it you try to navigate to an unknown route", () => {
      expect(
        () => {
          router.navigate({
            route: "foobar",
          });
        },
        "to throw",
        "Unknown route: foobar"
      );
    });

    it("allows you to replace the current history entry", () => {
      router.navigate({
        route: "posts/edit",
        params: { id: 123 },
      });

      router.navigate({
        params: { id: 42 },
        replace: true,
      });

      expect(transitionSpy, "to have calls satisfying", () => {
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/edit/123" },
        });
        transitionSpy({
          action: "REPLACE",
          location: { pathname: "/posts/edit/42" },
        });
      });
    });

    it("allows you to set partial routing information", () => {
      router.navigate({
        route: "posts/edit",
        params: { id: 123 },
        queryParams: { hello: "you" },
        hash: "#anchor",
        state: "hello",
      });

      router.navigate({
        state: "stateless?",
      });

      router.navigate({
        params: { id: 42 },
      });

      router.navigate({
        queryParams: { version: "new" },
      });

      router.navigate({
        hash: "#wat",
      });

      expect(transitionSpy, "to have calls satisfying", () => {
        transitionSpy({
          action: "PUSH",
          location: {
            pathname: "/posts/edit/123",
            search: "?hello=you",
            hash: "#anchor",
            state: "hello",
          },
        });
        transitionSpy({
          action: "PUSH",
          location: {
            pathname: "/posts/edit/123",
            search: "?hello=you",
            hash: "#anchor",
            state: "stateless?",
          },
        });
        transitionSpy({
          action: "PUSH",
          location: {
            pathname: "/posts/edit/42",
            search: "?hello=you",
            hash: "#anchor",
            state: null,
          },
        });
        transitionSpy({
          action: "PUSH",
          location: {
            pathname: "/posts/edit/42",
            search: "?version=new",
            hash: "#anchor",
            state: null,
          },
        });
        transitionSpy({
          action: "PUSH",
          location: {
            pathname: "/posts/edit/42",
            search: "?version=new",
            hash: "#wat",
            state: null,
          },
        });
      });
    });

    describe("when navigation is blocked", () => {
      it("doesn't navigation", () => {
        router.block(() => {});

        router.navigate({
          route: "posts/edit",
          params: { id: 123 },
          state: "hello",
        });

        expect(router, "to satisfy", {
          route: "posts",
          params: {},
          location: { state: null },
        });

        expect(transitionSpy, "was not called");
      });
    });
  });

  describe("back", () => {
    it("moves to the previous history entry", () => {
      router.history.push("/posts/edit/123?hello=you#anchor", "0");
      router.history.push("/posts/123", "1");
      router.history.push("/posts/666", "2");
      router.history.replace("/posts/333", "3");
      router.history.push("/posts/new", "4");

      router.back();
      router.back();

      expect(router, "to satisfy", {
        route: "posts/view",
        params: { id: "123" },
        location: { state: "1" },
      });

      expect(transitionSpy, "to have calls satisfying", () => {
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/edit/123", state: "0" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/123", state: "1" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/666", state: "2" },
        });
        transitionSpy({
          action: "REPLACE",
          location: { pathname: "/posts/333", state: "3" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/new", state: "4" },
        });
        transitionSpy({
          action: "POP",
          location: { pathname: "/posts/333", state: "3" },
        });
        transitionSpy({
          action: "POP",
          location: { pathname: "/posts/123", state: "1" },
        });
      });
    });
  });

  describe("forward", () => {
    it("moves to the previous history entry", () => {
      router.history.push("/posts/edit/123?hello=you#anchor", "0");
      router.history.push("/posts/123", "1");
      router.history.push("/posts/666", "2");
      router.history.push("/posts/333", "3", true);
      router.history.push("/posts/new", "4");

      router.go(-2);
      router.forward();
      router.forward();

      expect(router, "to satisfy", {
        route: "posts/new",
        params: {},
        location: { state: "4" },
      });

      expect(transitionSpy, "to have calls satisfying", () => {
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/edit/123", state: "0" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/123", state: "1" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/666", state: "2" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/333", state: "3" },
        });
        transitionSpy({
          action: "PUSH",
          location: { pathname: "/posts/new", state: "4" },
        });
        transitionSpy({
          action: "POP",
          location: { pathname: "/posts/666", state: "2" },
        });
        transitionSpy({
          action: "POP",
          location: { pathname: "/posts/333", state: "3" },
        });
        transitionSpy({
          action: "POP",
          location: { pathname: "/posts/new", state: "4" },
        });
      });
    });
  });
});
