import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount, simulate } from "./expect.js";

import {
  NestedRouter,
  Route,
  Router,
  Routes,
  useLink,
  useLocation,
  useParams,
} from "./index.js";

const routes = new Routes(
  new Route("posts", "/posts"),
  new Route("comments", "/comments/:id")
);

const nestedRoutes = new Routes(
  new Route("posts/new", "/new"),
  new Route("posts/edit", "/edit/:id"),
  new Route("posts/show", "/:id")
);

const Location = ({ name }) => {
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
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("returns the router from the context", () => {
    expect(
      component,
      "queried for test id",
      "location-app",
      "to have text",
      "/posts"
    );

    expect(
      component,
      "queried for test id",
      "location-nested-app",
      "to have text",
      "/42"
    );
  });

  describe("when navigating in the nested router", () => {
    describe("and the route exist", () => {
      beforeEach(() => {
        simulate(component, [{ type: "click", target: "[data-test-id=edit]" }]);
      });

      it("updates the routing information in the nested router", () => {
        expect(
          component,
          "queried for test id",
          "location-app",
          "to have text",
          "/posts"
        );

        expect(
          component,
          "queried for test id",
          "location-nested-app",
          "to have text",
          "/edit/42"
        );
      });
    });

    describe("and the route does't exist", () => {
      beforeEach(() => {
        simulate(component, [
          { type: "click", target: "[data-test-id=comments]" },
        ]);
      });

      it("forwards the navigation to the parent router", () => {
        expect(
          component,
          "queried for test id",
          "location-app",
          "to have text",
          "/comments/42"
        );

        expect(
          component,
          "queried for test id",
          "location-nested-app",
          "to have text",
          "/42"
        );
      });
    });
  });
});
