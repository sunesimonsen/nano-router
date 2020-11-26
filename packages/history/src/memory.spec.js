import unexpected from "unexpected";
import unexpectedSinon from "unexpected-sinon";
import sinon from "sinon";
import { createMemoryHistory } from "./memory";

const expect = unexpected.clone().use(unexpectedSinon);

describe("memory", () => {
  let history, clearListener, transitionSpy;

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/posts"],
    });

    transitionSpy = sinon.spy();
    clearListener = history.listen(transitionSpy);
  });

  afterEach(() => {
    clearListener();
  });

  describe("push", () => {
    it("pushes the given location on the history", () => {
      history.push("/posts/edit/123?hello=you#anchor", "hello");
      history.push("/posts/new");

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
            state: null,
          },
        });
      });

      expect(history.location, "to satisfy", {
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

        history.push("/posts/edit/123?hello=you#anchor", "hello");

        expect(transitionSpy, "was not called");

        expect(history.location, "to satisfy", {
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

      expect(transitionSpy, "to have calls satisfying", () => {
        transitionSpy({
          action: "REPLACE",
          location: {
            pathname: "/posts/edit/123",
            search: "?hello=you",
            hash: "#anchor",
            state: "hello",
          },
        });

        transitionSpy({
          action: "REPLACE",
          location: {
            pathname: "/posts/new",
            state: null,
          },
        });
      });

      expect(history.location, "to satisfy", {
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

        expect(transitionSpy, "was not called");

        expect(history.location, "to satisfy", {
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

      expect(history.location, "to satisfy", {
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

        expect(history.location, "to satisfy", {
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

      expect(history.location, "to satisfy", {
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

        expect(history.location, "to satisfy", {
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

      expect(transitionSpy, "was not called");

      expect(history.action, "to equal", "PUSH");

      expect(history.location, "to satisfy", {
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
        expect(history.openedWindow, "to equal", {
          url: "https://example.com/posts/edit/123?hello=you#anchor",
          target: "_blank",
        });
      });

      it("doesn't affect the current history", () => {
        expect(transitionSpy, "was not called");

        expect(history.action, "to equal", "POP");

        expect(history.location, "to satisfy", {
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

        expect(transitionSpy, "was not called");

        expect(history.location, "to satisfy", {
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

          expect(history.openedWindow, "to equal", {
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

      expect(transitionSpy, "was not called");

      expect(history.action, "to equal", "REPLACE");

      expect(history.location, "to satisfy", {
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

        expect(transitionSpy, "was not called");

        expect(history.location, "to satisfy", {
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
