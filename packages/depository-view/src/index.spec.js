import unexpected from "unexpected";
import unexpectedDom from "unexpected-dom";
import sinon from "sinon";
import { html, render } from "@depository/view";
import { createMemoryHistory } from "@nano-router/history";
import {
  Routing,
  Link,
  Router,
  Routes,
  Route,
  ExternalRoute,
} from "./index.js";
import { Store } from "@depository/store";

const expect = unexpected.clone().use(unexpectedDom);

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id"),
);

class NewView {
  render() {
    return html`<div data-test-id="new-view" />`;
  }
}

class PostsView {
  render() {
    return html`
      <${Link}
        data-test-id="external"
        route="external"
        params=${{ id: 42 }}
        target="_blank"
      >
        External
      <//>
      <${Link} data-test-id="new" route="posts/new">New post<//>
      <${Link} data-test-id="new-open" route="posts/new" target="_blank">
        New post (new window)
      <//>
    `;
  }
}

class RootView {
  data() {
    return {
      route: "routing.route",
    };
  }

  render({ route }) {
    switch (route) {
      case "posts/new":
        return html`<${NewView} />`;
      default:
        return html`<${PostsView} />`;
    }
  }
}

describe("Link", () => {
  let container, store, clock;

  beforeEach(async () => {
    clock = sinon.useFakeTimers();

    const history = createMemoryHistory({ initialEntries: ["/posts"] });
    container = document.createElement("div");
    store = new Store();

    const router = new Router({ routes, history });

    render(
      html`<${Routing} router=${router}><${RootView} /><//>`,
      store,
      container,
    );

    await clock.runAllAsync();
  });

  afterEach(() => {
    clock.restore();
  });

  it("sets the href", () => {
    expect(container, "queried for test id", "new", "to have attributes", {
      href: "/posts/new",
    });
  });

  describe("when a target is specified", () => {
    it("sets the href, rel and target", () => {
      expect(
        container,
        "queried for test id",
        "new-open",
        "to have attributes",
        {
          href: "/posts/new",
          target: "_blank",
          rel: "noopener",
        },
      );
    });
  });

  describe("when navigating", () => {
    beforeEach(async () => {
      const newLink = container.querySelector("[data-test-id=new]");
      newLink.dispatchEvent(new window.CustomEvent("click"));

      await clock.runAllAsync();
    });

    it("re-renders the subscribed parts", () => {
      expect(store.get("routing"), "to satisfy", {
        route: "posts/new",
        location: {
          href: "/posts/new",
          search: "",
          hash: "",
          pathname: "/posts/new",
          state: null,
        },
        params: {},
        queryParams: {},
      });

      expect(container, "to contain test id", "new-view");
    });
  });

  describe("when pressing a modifyer key", () => {
    beforeEach(async () => {
      const newLink = container.querySelector("[data-test-id=new]");
      const event = new window.CustomEvent("click");
      event.ctrlKey = true;
      event.button = 1;
      newLink.dispatchEvent(event);

      await clock.runAllAsync();
    });

    it("doesn't prevent default", () => {
      expect(container, "not to contain test id", "new-view");
    });
  });

  it("supports external routes", () => {
    expect(container, "queried for test id", "external", "to have attributes", {
      href: "https://www.example.com/blog/42",
    });
  });
});
