import { TransitionArgs, TransitionHandler, Unsubscriber } from "./history";
import { createMemoryHistory } from "./memory";
import type { MemoryRouterHistory } from "./memory";

describe("memory", () => {
  let history: MemoryRouterHistory,
    clearListener: Unsubscriber,
    transitionSpy: jest.Mock<TransitionHandler>;

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/posts"],
    });

    transitionSpy = jest.fn();
    clearListener = history.listen(transitionSpy);
  });

  afterEach(() => {
    clearListener();
  });

  describe("push", () => {
    it("pushes the given location on the history", () => {
      history.push("/posts/edit/123?hello=you#anchor", "hello");
      history.push("/posts/new");

      const calls = transitionSpy.mock.calls;

      expect(transitionSpy).toHaveBeenCalledTimes(2);

      expect(calls[0][0]).toMatchObject({
        action: "PUSH",
        location: {
          href: "/posts/edit/123?hello=you#anchor",
          pathname: "/posts/edit/123",
          search: "?hello=you",
          hash: "#anchor",
          state: "hello",
        },
      });

      expect(calls[1][0]).toMatchObject({
        action: "PUSH",
        location: {
          href: "/posts/new",
          pathname: "/posts/new",
          state: null,
          search: "",
          hash: "",
        },
      });

      expect(history.location).toMatchObject({
        pathname: "/posts/new",
        search: "",
        hash: "",
        state: null,
        href: "/posts/new",
      });
    });

    describe("when navitation is blocked", () => {
      it("doesn't navigate", () => {
        history.block((_arg: TransitionArgs) => {});

        history.push("/posts/edit/123?hello=you#anchor", "hello");

        expect(transitionSpy).not.toHaveBeenCalled();

        expect(history.location).toMatchObject({
          pathname: "/posts",
          search: "",
          hash: "",
          state: null,
          href: "/posts",
        });
      });
    });
  });

  describe("replace", () => {
    it("replace the current history location", () => {
      history.replace("/posts/edit/123?hello=you#anchor", "hello");
      history.replace("/posts/new");

      const calls = transitionSpy.mock.calls;

      expect(transitionSpy).toHaveBeenCalledTimes(2);

      expect(calls[0][0]).toMatchObject({
        action: "REPLACE",
        location: {
          href: "/posts/edit/123?hello=you#anchor",
          pathname: "/posts/edit/123",
          search: "?hello=you",
          hash: "#anchor",
          state: "hello",
        },
      });

      expect(calls[1][0]).toMatchObject({
        action: "REPLACE",
        location: {
          href: "/posts/new",
          pathname: "/posts/new",
          state: null,
          search: "",
          hash: "",
        },
      });

      expect(history.location).toMatchObject({
        pathname: "/posts/new",
        search: "",
        hash: "",
        state: null,
        href: "/posts/new",
      });
    });

    describe("when navitation is blocked", () => {
      it("doesn't navigate", () => {
        history.block(() => {});

        history.replace("/posts/edit/123?hello=you#anchor", "hello");

        expect(transitionSpy).not.toHaveBeenCalled();

        expect(history.location).toMatchObject({
          pathname: "/posts",
          search: "",
          hash: "",
          state: null,
          href: "/posts",
        });
      });
    });
  });

  describe("back", () => {
    it("navigates to the previous history entry", () => {
      history.push("/posts/edit/123?hello=you#anchor", "hello");
      history.push("/posts/new");
      history.replace("/posts/new/da");
      history.back();

      expect(history.location).toMatchObject({
        pathname: "/posts/edit/123",
        search: "?hello=you",
        hash: "#anchor",
        state: "hello",
        href: "/posts/edit/123?hello=you#anchor",
      });
    });

    describe("when navitation is blocked", () => {
      it("doesn't navigate", () => {
        history.push("/posts/edit/123?hello=you#anchor", "hello");
        history.push("/posts/new");
        history.replace("/posts/new/da");

        history.block(() => {});

        history.back();

        expect(history.location).toMatchObject({
          href: "/posts/new/da",
          search: "",
          hash: "",
          pathname: "/posts/new/da",
          state: null,
        });
      });
    });
  });

  describe("forward", () => {
    it("navigates to the next history entry", () => {
      history.push("/posts/edit/123?hello=you#anchor", "hello");
      history.push("/posts/new");
      history.replace("/posts/new/da");
      history.back();
      history.forward();

      expect(history.location).toMatchObject({
        pathname: "/posts/new/da",
        search: "",
        hash: "",
        state: null,
        href: "/posts/new/da",
      });
    });

    describe("when navitation is blocked", () => {
      it("doesn't navigate", () => {
        history.push("/posts/edit/123?hello=you#anchor", "hello");
        history.push("/posts/new");
        history.replace("/posts/new/da");
        history.back();

        history.block(() => {});

        history.forward();

        expect(history.location).toMatchObject({
          href: "/posts/edit/123?hello=you#anchor",
          search: "?hello=you",
          hash: "#anchor",
          pathname: "/posts/edit/123",
          state: "hello",
        });
      });
    });
  });

  describe("pushLocation", () => {
    it("pushes an external location", () => {
      history.pushLocation(
        "https://example.com/posts/edit/123?hello=you#anchor"
      );

      expect(transitionSpy).not.toHaveBeenCalled();

      expect(history.action).toEqual("PUSH");

      expect(history.location).toMatchObject({
        href: "https://example.com/posts/edit/123?hello=you#anchor",
        hash: "#anchor",
        search: "?hello=you",
        pathname: "/posts/edit/123",
        state: null,
      });
    });

    describe("when given a target", () => {
      beforeEach(() => {
        history.pushLocation(
          "https://example.com/posts/edit/123?hello=you#anchor",
          "_blank"
        );
      });

      it("simulates opening up a window", () => {
        expect(history.openedWindow).toEqual({
          url: "https://example.com/posts/edit/123?hello=you#anchor",
          target: "_blank",
        });
      });

      it("doesn't affect the current history", () => {
        expect(transitionSpy).not.toHaveBeenCalled();

        expect(history.action).toEqual("POP");

        expect(history.location).toMatchObject({
          pathname: "/posts",
          search: "",
          hash: "",
          state: null,
          href: "/posts",
        });
      });
    });

    describe("when navitation is blocked", () => {
      it("doesn't navigate", () => {
        history.block(() => {});

        history.pushLocation(
          "https://example.com/posts/edit/123?hello=you#anchor"
        );

        expect(transitionSpy).not.toHaveBeenCalled();

        expect(history.location).toMatchObject({
          pathname: "/posts",
          search: "",
          hash: "",
          state: null,
          href: "/posts",
        });
      });

      describe("when given a target", () => {
        it("doesn't block opening the window", () => {
          history.block(() => {});

          history.pushLocation(
            "https://example.com/posts/edit/123?hello=you#anchor",
            "_blank"
          );

          expect(history.openedWindow).toEqual({
            url: "https://example.com/posts/edit/123?hello=you#anchor",
            target: "_blank",
          });
        });
      });
    });
  });

  describe("replaceLocation", () => {
    it("replaces the current location", () => {
      history.replaceLocation(
        "https://example.com/posts/edit/123?hello=you#anchor"
      );

      expect(transitionSpy).not.toHaveBeenCalled();

      expect(history.action).toEqual("REPLACE");

      expect(history.location).toMatchObject({
        href: "https://example.com/posts/edit/123?hello=you#anchor",
        hash: "#anchor",
        search: "?hello=you",
        pathname: "/posts/edit/123",
        state: null,
      });
    });

    describe("when navitation is blocked", () => {
      it("doesn't navigate", () => {
        history.block(() => {});

        history.pushLocation(
          "https://example.com/posts/edit/123?hello=you#anchor"
        );

        expect(transitionSpy).not.toHaveBeenCalled();

        expect(history.location).toMatchObject({
          pathname: "/posts",
          search: "",
          hash: "",
          state: null,
          href: "/posts",
        });
      });
    });
  });
});
