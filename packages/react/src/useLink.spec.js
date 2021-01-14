import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount, simulate } from "./expect.js";

import {
  Routes,
  Route,
  ExternalRoute,
  Router,
  useRouteName,
  useLink,
} from "./index.js";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id")
);

const NewView = () => <div data-test-id="new-view" />;

const PostsView = () => {
  const showNewPost = useLink("posts/new");

  const showNewPostInNewWindow = useLink({
    route: "posts/new",
    target: "_blank",
  });

  const showExternal = useLink({ route: "external", params: { id: 42 } });

  return (
    <>
      <a data-test-id="external" {...showExternal}>
        External
      </a>
      <a data-test-id="new" {...showNewPost}>
        New post
      </a>
      <a data-test-id="new-open" {...showNewPostInNewWindow}>
        New post (new window)
      </a>
    </>
  );
};

const RootView = () => {
  const routeName = useRouteName();

  switch (routeName) {
    case "posts/new":
      return <NewView />;
    default:
      return <PostsView />;
  }
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <RootView />
      </Router>
    </div>
  );
};

describe("useLink", () => {
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("sets the href", () => {
    expect(component, "queried for test id", "new", "to have attributes", {
      href: "/posts/new",
    });
  });

  describe("when a target is specified", () => {
    it("sets the href, rel and target", () => {
      expect(
        component,
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
      simulate(component, { type: "click", target: "[data-test-id=new]" });
    });

    it("re-renders the subscribed parts", () => {
      expect(component, "to contain test id", "new-view");
    });
  });

  describe("when pressing a modifyer key", () => {
    beforeEach(() => {
      simulate(component, {
        type: "click",
        data: { ctrlKey: true },
        target: "[data-test-id=new]",
      });
    });

    it("doesn't prevent default", () => {
      expect(component, "not to contain test id", "new-view");
    });
  });

  it("supports external routes", () => {
    expect(component, "queried for test id", "external", "to have attributes", {
      href: "https://www.example.com/blog/42",
    });
  });
});
