import React, { useEffect } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

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
  let history;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ["/posts"] });

    render(
      <div>
        <Router history={history} routes={routes}>
          <App />
        </Router>
      </div>
    );
  });

  it("returns the name of the current route", () => {
    expect(screen.getByTestId("route-name")).toHaveTextContent("posts");
  });

  describe("when navigating", () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByTestId("new"));
    });

    it("updates the route name", () => {
      expect(screen.getByTestId("route-name")).toHaveTextContent("posts/new");
      expect(screen.getByTestId("new-view")).toBeInTheDocument();
    });
  });

  describe("when navigating to a unknown page", () => {
    beforeEach(() => {
      act(() => {
        history.push("/nowhere", {});
      });
    });

    it("uses the default route and the app redirects", () => {
      expect(screen.getByTestId("route-name")).toHaveTextContent("posts");
    });
  });
});
