import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import {
  Routes,
  Route,
  ExternalRoute,
  Router,
  useRouteName,
  useLink,
} from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id"),
);

const NewView = () => <div data-test-id="new-view" />;

const PostsView = () => {
  const showNewPost = useLink("posts/new");

  const showNewPostInNewWindow = useLink({
    route: "posts/new",
    target: "_blank",
  });

  const showExternalRoute = useLink({ route: "external", params: { id: 42 } });

  const showExternalUrl = useLink({
    url: "https://www.example.com/examples?hello=you#anchor",
    target: "_blank",
  });

  return (
    <>
      <a data-test-id="external" {...showExternalRoute}>
        External
      </a>
      <a data-test-id="external-url" {...showExternalUrl}>
        External URL
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
    [],
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
  beforeEach(() => {
    render(<App />);
  });

  it("sets the href", () => {
    expect(screen.getByTestId("new")).toHaveAttribute("href", "/posts/new");
  });

  describe("when a target is specified", () => {
    it("sets the href, rel and target", () => {
      const newOpen = screen.getByTestId("new-open");

      expect(newOpen).toHaveAttribute("href", "/posts/new");
      expect(newOpen).toHaveAttribute("target", "_blank");
      expect(newOpen).toHaveAttribute("rel", "noopener");
    });
  });

  describe("when navigating", () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByTestId("new"));
    });

    it("re-renders the subscribed parts", () => {
      expect(screen.getByTestId("new-view")).toBeInTheDocument();
    });
  });

  describe("when pressing a modifyer key", () => {
    beforeEach(async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});

      const user = userEvent.setup();
      await user.keyboard("{Control>}");
      await user.click(screen.getByTestId("new"));
      await user.keyboard("{/Control}");
    });

    afterEach(() => {
      (console.error as jest.Mock).mockRestore();
    });

    it("doesn't prevent default", () => {
      expect(screen.queryByTestId("new-view")).toBe(null);
    });
  });

  it("supports external routes", () => {
    expect(screen.getByTestId("external")).toHaveAttribute(
      "href",
      "https://www.example.com/blog/42",
    );
  });

  it("supports external URLs", () => {
    const externalUrl = screen.getByTestId("external-url");

    expect(externalUrl).toHaveAttribute(
      "href",
      "https://www.example.com/examples?hello=you#anchor",
    );
    expect(externalUrl).toHaveAttribute("target", "_blank");
  });
});
