import React, { useMemo } from "react";
import { createMemoryHistory } from "history";
import expect, { mount, unmount, simulate } from "./expect";

import { Routes, Route, Router, useRouteName, useLink } from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts")
);

const RouteName = () => {
  const routeName = useRouteName();

  return <div data-test-id="route-name">{routeName}</div>;
};

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
        <RouteName />
      </Router>
    </div>
  );
};

describe("useRouteName", () => {
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("returns the name of the current route", () => {
    expect(
      component,
      "queried for test id",
      "route-name",
      "to have text",
      "posts"
    );
  });

  describe("when navigating", () => {
    beforeEach(() => {
      simulate(component, { type: "click", target: "[data-test-id=new]" });
    });

    it("updates the route name", () => {
      expect(
        component,
        "queried for test id",
        "route-name",
        "to have text",
        "posts/new"
      ).and("to contain test id", "new-view");
    });
  });
});
