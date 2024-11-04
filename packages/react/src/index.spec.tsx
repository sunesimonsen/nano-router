import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import {
  Routes,
  Route,
  Router,
  useRouteName,
  useRouter,
  useParams,
  useLink,
} from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts")
);

const RouteName = () => {
  const routeName = useRouteName();

  return <div data-test-id="route-name">{routeName}</div>;
};

const NewView = () => {
  const router = useRouter();

  const createPost = () => {
    router.navigate({ route: "posts/edit", params: { id: 42 } });
  };

  return (
    <div data-test-id="new-view">
      <button data-test-id="create" onClick={createPost}>
        Create
      </button>
    </div>
  );
};

const EditView = () => {
  const { id } = useParams();

  return <div data-test-id="edit-view">Id {id}</div>;
};

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
    case "posts/edit":
      return <EditView />;
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
  beforeEach(() => {
    render(<App />);
  });

  describe("when navigating", () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByTestId("new"));
      await userEvent.click(screen.getByTestId("create"));
    });

    it("re-renders the subscribed parts", () => {
      expect(screen.getByTestId("edit-view")).toHaveTextContent("Id 42");
    });
  });
});
