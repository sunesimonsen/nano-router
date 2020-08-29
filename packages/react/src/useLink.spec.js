import React from "react";
import expect, { mount, unmount, simulate } from "./expect";

import { Routes, Route, MemoryRouter, useRouteName, useLink } from "./index";

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
  return (
    <div>
      <MemoryRouter routes={routes} initialPath="/posts">
        <RootView />
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
