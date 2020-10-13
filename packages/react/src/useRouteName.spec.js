import React, { useEffect } from "react";
import { createMemoryHistory } from "history";
import expect, { act, mount, unmount, simulate } from "./expect";

import {
  Routes,
  Route,
  Router,
  useRouter,
  useRouteName,
  useLink,
} from "./index";

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
  const router = useRouter();
  const routeName = useRouteName();

  useEffect(() => {
    if (routeName === "default") {
      router.navigate({ route: "posts", replace: true });
    }
  }, [router, routeName]);

  switch (routeName) {
    case "posts/new":
      return <NewView />;
    case "posts":
      return <PostsView />;
  }

  return null; // redirect
};

const App = () => (
  <>
    <RootView />
    <RouteName />
  </>
);

describe("useRouteName", () => {
  let component, history;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ["/posts"] });

    component = mount(
      <div>
        <Router history={history} routes={routes}>
          <App />
        </Router>
      </div>
    );
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

  describe("when navigating to a unknown page", () => {
    beforeEach(() => {
      act(() => {
        history.push("/nowhere", {});
      });
    });

    it("uses the default route and the app redirects", () => {
      expect(
        component,
        "queried for test id",
        "route-name",
        "to have text",
        "posts"
      );
    });
  });
});
