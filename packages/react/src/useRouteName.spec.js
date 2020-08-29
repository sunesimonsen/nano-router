import React from "react";
import expect, { mount, unmount, simulate } from "./expect";

import { Routes, Route, MemoryRouter, useRouteName, useRouter } from "./index";

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
  const router = useRouter();

  const navigate = () => {
    router.navigate({ route: "posts/new" });
  };

  return (
    <button data-test-id="new" onClick={navigate}>
      New post
    </button>
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
  return (
    <div>
      <MemoryRouter routes={routes} initialPath="/posts">
        <RootView />
        <RouteName />
      </MemoryRouter>
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
