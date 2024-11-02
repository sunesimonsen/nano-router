import {
  createMemoryHistory,
  Unsubscriber,
  TransitionHandler,
  MemoryRouterHistory,
} from "@nano-router/history";
import { Router, Routes, Route, ExternalRoute } from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/edit/:id"),
  new Route("posts/view", "/posts/:id"),
  new Route("posts", "/posts"),
  new ExternalRoute("blog", "/blog/:id"),
  new ExternalRoute("examples", "https://www.example.com/examples")
);

describe("Router", () => {
  let router: Router,
    history: MemoryRouterHistory,
    clearListener: Unsubscriber,
    transitionSpy: jest.Mock<TransitionHandler>;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ["/posts"] });
    router = new Router({ routes, history });

    transitionSpy = jest.fn();
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

        expect(transitionSpy).toHaveBeenCalledTimes(2);

        const calls = transitionSpy.mock.calls;

        expect(calls[0][0]).toMatchObject({
          action: "PUSH",
          location: {
            pathname: "/posts/edit/123",
            search: "?hello=you",
            hash: "#anchor",
            state: "hello",
          },
        });

        expect(calls[1][0]).toMatchObject({
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

    describe("when the pathname matches", () => {
      it("transition the url to the new route", () => {
        router.navigate({
          route: "posts/edit",
          params: { id: 123 },
          queryParams: { hello: "you" },
          hash: "#anchor",
          state: "hello",
        });

        expect(router).toMatchObject({
          route: "posts/edit",
          params: { id: "123" },
          queryParams: { hello: "you" },
          location: { state: "hello" },
        });

        expect(transitionSpy).toHaveBeenCalledTimes(1);

        const calls = transitionSpy.mock.calls;

        expect(calls[0][0]).toMatchObject({
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

    it("fails it you try to navigate to an unknown route", () => {
      expect(() => {
        router.navigate({
          route: "foobar",
        });
      }).toThrow("Unknown route: foobar");
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

      expect(transitionSpy).toHaveBeenCalledTimes(2);

      const calls = transitionSpy.mock.calls;

      expect(calls[0][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/edit/123" },
      });

      expect(calls[1][0]).toMatchObject({
        action: "REPLACE",
        location: { pathname: "/posts/edit/42" },
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

      expect(transitionSpy).toHaveBeenCalledTimes(5);

      const calls = transitionSpy.mock.calls;

      expect(calls[0][0]).toMatchObject({
        action: "PUSH",
        location: {
          pathname: "/posts/edit/123",
          search: "?hello=you",
          hash: "#anchor",
          state: "hello",
        },
      });

      expect(calls[1][0]).toMatchObject({
        action: "PUSH",
        location: {
          pathname: "/posts/edit/123",
          search: "?hello=you",
          hash: "#anchor",
          state: "stateless?",
        },
      });

      expect(calls[2][0]).toMatchObject({
        action: "PUSH",
        location: {
          pathname: "/posts/edit/42",
          search: "?hello=you",
          hash: "#anchor",
          state: null,
        },
      });

      expect(calls[3][0]).toMatchObject({
        action: "PUSH",
        location: {
          pathname: "/posts/edit/42",
          search: "?version=new",
          hash: "#anchor",
          state: null,
        },
      });

      expect(calls[4][0]).toMatchObject({
        action: "PUSH",
        location: {
          pathname: "/posts/edit/42",
          search: "?version=new",
          hash: "#wat",
          state: null,
        },
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

        expect(router).toMatchObject({
          route: "posts",
          params: {},
          location: { state: null },
        });

        expect(transitionSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the route is external", () => {
      describe("and a new location is pushed", () => {
        it("updates the memory history but doesn't call the listeners", () => {
          router.navigate({
            route: "blog",
            params: { id: 123 },
            queryParams: { hello: "you" },
            hash: "#anchor",
          });

          expect(transitionSpy).not.toHaveBeenCalled();

          expect(history).toMatchObject({
            action: "PUSH",
            location: {
              href: "/blog/123?hello=you#anchor",
              search: "?hello=you",
              hash: "#anchor",
              pathname: "/blog/123",
              state: null,
            },
          });
        });
      });

      describe("and the current location is replaced", () => {
        it("updates the memory history but doesn't call the listeners", () => {
          router.navigate({
            route: "blog",
            params: { id: 123 },
            queryParams: { hello: "you" },
            hash: "#anchor",
            replace: true,
          });

          expect(transitionSpy).not.toHaveBeenCalled();

          expect(history).toMatchObject({
            action: "REPLACE",
            location: {
              href: "/blog/123?hello=you#anchor",
              search: "?hello=you",
              hash: "#anchor",
              pathname: "/blog/123",
              state: null,
            },
          });
        });
      });

      describe("when navigation is blocked", () => {
        it("doesn't navigation", () => {
          router.block(() => {});
          router.navigate({
            route: "blog",
            params: { id: 123 },
            queryParams: { hello: "you" },
            hash: "#anchor",
          });

          expect(transitionSpy).not.toHaveBeenCalled();

          expect(history).toMatchObject({
            location: {
              href: "/posts",
              search: "",
              hash: "",
              pathname: "/posts",
              state: null,
            },
          });
        });
      });
    });

    describe("when the route is url", () => {
      describe("and a new location is pushed", () => {
        it("updates the memory history but doesn't call the listeners", () => {
          router.navigate({
            url: "https://www.example.com/examples?hello=you#anchor",
          });

          expect(transitionSpy).not.toHaveBeenCalled();

          expect(history).toMatchObject({
            action: "PUSH",
            location: {
              href: "https://www.example.com/examples?hello=you#anchor",
              search: "?hello=you",
              hash: "#anchor",
              pathname: "/examples",
              state: null,
            },
          });
        });
      });

      describe("and the current location is replaced", () => {
        it("updates the memory history but doesn't call the listeners", () => {
          router.navigate({
            url: "https://www.example.com/examples?hello=you#anchor",
            replace: true,
          });

          expect(transitionSpy).not.toHaveBeenCalled();

          expect(history).toMatchObject({
            action: "REPLACE",
            location: {
              href: "https://www.example.com/examples?hello=you#anchor",
              search: "?hello=you",
              hash: "#anchor",
              pathname: "/examples",
              state: null,
            },
          });
        });
      });

      describe("when navigation is blocked", () => {
        it("doesn't navigation", () => {
          router.block(() => {});
          router.navigate({
            url: "https://www.example.com/examples?hello=you#anchor",
          });

          expect(transitionSpy).not.toHaveBeenCalled();

          expect(history).toMatchObject({
            location: {
              href: "/posts",
              search: "",
              hash: "",
              pathname: "/posts",
              state: null,
            },
          });
        });
      });
    });

    describe("when given a target", () => {
      beforeEach(() => {
        router.navigate({
          url: "https://www.example.com/examples?hello=you#anchor",
          target: "_blank",
        });
      });

      it("navigates in that target", () => {
        expect(history).toMatchObject({
          openedWindow: {
            url: "https://www.example.com/examples?hello=you#anchor",
            target: "_blank",
          },
        });
      });

      it("doesn't change the current history", () => {
        expect(transitionSpy).not.toHaveBeenCalled();

        expect(history).toMatchObject({
          location: {
            pathname: "/posts",
            search: "",
            hash: "",
            state: null,
            href: "/posts",
          },
        });
      });
    });
  });

  describe("back", () => {
    it("moves to the previous history entry", () => {
      history.push("/posts/edit/123?hello=you#anchor", "0");
      history.push("/posts/123", "1");
      history.push("/posts/666", "2");
      history.replace("/posts/333", "3");
      history.push("/posts/new", "4");

      router.back();
      router.back();

      expect(router).toMatchObject({
        route: "posts/view",
        params: { id: "123" },
        location: { state: "1" },
      });

      expect(transitionSpy).toHaveBeenCalledTimes(7);

      const calls = transitionSpy.mock.calls;

      expect(calls[0][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/edit/123", state: "0" },
      });

      expect(calls[1][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/123", state: "1" },
      });

      expect(calls[2][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/666", state: "2" },
      });

      expect(calls[3][0]).toMatchObject({
        action: "REPLACE",
        location: { pathname: "/posts/333", state: "3" },
      });

      expect(calls[4][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/new", state: "4" },
      });

      expect(calls[5][0]).toMatchObject({
        action: "POP",
        location: { pathname: "/posts/333", state: "3" },
      });

      expect(calls[6][0]).toMatchObject({
        action: "POP",
        location: { pathname: "/posts/123", state: "1" },
      });
    });
  });

  describe("forward", () => {
    it("moves to the previous history entry", () => {
      history.push("/posts/edit/123?hello=you#anchor", "0");
      history.push("/posts/123", "1");
      history.push("/posts/666", "2");
      history.push("/posts/333", "3");
      history.push("/posts/new", "4");

      router.go(-2);
      router.forward();
      router.forward();

      expect(router).toMatchObject({
        route: "posts/new",
        params: {},
        location: { state: "4" },
      });

      expect(transitionSpy).toHaveBeenCalledTimes(8);

      const calls = transitionSpy.mock.calls;

      expect(calls[0][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/edit/123", state: "0" },
      });

      expect(calls[1][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/123", state: "1" },
      });

      expect(calls[2][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/666", state: "2" },
      });

      expect(calls[3][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/333", state: "3" },
      });

      expect(calls[4][0]).toMatchObject({
        action: "PUSH",
        location: { pathname: "/posts/new", state: "4" },
      });

      expect(calls[5][0]).toMatchObject({
        action: "POP",
        location: { pathname: "/posts/666", state: "2" },
      });

      expect(calls[6][0]).toMatchObject({
        action: "POP",
        location: { pathname: "/posts/333", state: "3" },
      });

      expect(calls[7][0]).toMatchObject({
        action: "POP",
        location: { pathname: "/posts/new", state: "4" },
      });
    });
  });
});
