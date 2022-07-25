import unexpected from "unexpected";
import unexpectedDom from "unexpected-dom";
import { html, render } from "@dependable/view";
import { flush } from "@dependable/state";
import { createMemoryHistory } from "@nano-router/history";
import {
  Routing,
  Link,
  Router,
  Routes,
  Route,
  ExternalRoute,
  route,
  location,
  params,
  queryParams,
} from "./index.js";

const expect = unexpected.clone().use(unexpectedDom);

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id")
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
  render() {
    switch (route()) {
      case "posts/new":
        return html`<${NewView} />`;
      default:
        return html`<${PostsView} />`;
    }
  }
}

describe("Link", () => {
  let container;

  beforeEach(() => {
    const history = createMemoryHistory({ initialEntries: ["/posts"] });
    container = document.createElement("div");

    const router = new Router({ routes, history });

    render(html`<${Routing} router=${router}><${RootView} /><//>`, container);
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
        }
      );
    });
  });

  describe("when navigating", () => {
    beforeEach(() => {
      const newLink = container.querySelector("[data-test-id=new]");
      newLink.dispatchEvent(new CustomEvent("click"));

      flush();
    });

    it("re-renders the subscribed parts", () => {
      expect(route(), "to equal", "posts/new");
      expect(location(), "to satisfy", {
        href: "/posts/new",
        search: "",
        hash: "",
        pathname: "/posts/new",
        state: null,
      });
      expect(params(), "to equal", {});
      expect(queryParams(), "to equal", {});

      expect(container, "to contain test id", "new-view");
    });
  });

  describe("when pressing a modifyer key", () => {
    beforeEach(() => {
      const newLink = container.querySelector("[data-test-id=new]");
      const event = new CustomEvent("click");
      event.ctrlKey = true;
      event.button = 1;
      newLink.dispatchEvent(event);

      flush();
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
