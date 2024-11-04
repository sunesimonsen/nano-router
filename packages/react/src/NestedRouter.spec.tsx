import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import {
  NestedRouter,
  Route,
  Router,
  Routes,
  useLink,
  useLocation,
  useParams,
} from "./index";

const routes = new Routes(
  new Route("posts", "/posts"),
  new Route("comments", "/comments/:id")
);

const nestedRoutes = new Routes(
  new Route("posts/new", "/new"),
  new Route("posts/edit", "/edit/:id"),
  new Route("posts/show", "/:id")
);

type LocationProps = {
  name: string;
};

const Location: React.FC<LocationProps> = ({ name }) => {
  const location = useLocation();

  return <div data-test-id={`location-${name}`}>{location.pathname}</div>;
};

const PostViews = () => {
  const { id } = useParams();

  const showNewPost = useLink("posts/new");
  const showEditPost = useLink({ route: "posts/edit", params: { id } });
  const showComments = useLink({ route: "comments", params: { id } });

  return (
    <>
      <a data-test-id="new" {...showNewPost}>
        New post
      </a>
      <a data-test-id="edit" {...showEditPost}>
        Edit post
      </a>
      <a data-test-id="comments" {...showComments}>
        Show comments
      </a>
    </>
  );
};

const NestedApp = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/42"] }),
    []
  );

  return (
    <div>
      <NestedRouter history={history} routes={nestedRoutes}>
        <PostViews />
        <Location name="nested-app" />
      </NestedRouter>
    </div>
  );
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <NestedApp />
        <Location name="app" />
      </Router>
    </div>
  );
};

describe("NestedRouter", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("returns the router from the context", () => {
    expect(screen.getByTestId("location-app")).toHaveTextContent("/posts");

    expect(screen.getByTestId("location-nested-app")).toHaveTextContent("/42");
  });

  describe("when navigating in the nested router", () => {
    describe("and the route exist", () => {
      beforeEach(async () => {
        await userEvent.click(screen.getByTestId("edit"));
      });

      it("updates the routing information in the nested router", () => {
        expect(screen.getByTestId("location-app")).toHaveTextContent("/posts");

        expect(screen.getByTestId("location-nested-app")).toHaveTextContent(
          "/edit/42"
        );
      });
    });

    describe("and the route does't exist", () => {
      beforeEach(async () => {
        await userEvent.click(screen.getByTestId("comments"));
      });

      it("forwards the navigation to the parent router", () => {
        expect(screen.getByTestId("location-app")).toHaveTextContent(
          "/comments/42"
        );

        expect(screen.getByTestId("location-nested-app")).toHaveTextContent(
          "/42"
        );
      });
    });
  });
});
