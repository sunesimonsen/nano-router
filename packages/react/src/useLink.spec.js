import React, { useMemo } from "react";
import { createMemoryHistory } from "history";
import expect, { mount, unmount, simulate } from "./expect";

import { Routes, Route, Router, useRouteName, useLink } from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts")
);

const NewView = () => <div data-test-id="new-view" />;

const PostsView = () => {
  const showNewPost = useLink("posts/new");

  return (
    <a data-test-id="new" {...showNewPost}>
      New post
    </a>
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
});
