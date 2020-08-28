import React from "react";
import expect, { mount, unmount, simulate } from "./expect";

import {
  Routes,
  Route,
  InMemoryRouter,
  useRouteName,
  useRouter,
  useParams,
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
    case "posts/edit":
      return <EditView />;
    default:
      return <PostsView />;
  }
};

const App = () => {
  return (
    <div>
      <InMemoryRouter routes={routes} initialPath="/posts">
        <RootView />
        <RouteName />
      </InMemoryRouter>
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
      simulate(component, [
        { type: "click", target: "[data-test-id=new]" },
        { type: "click", target: "[data-test-id=create]" },
      ]);
    });

    it("re-renders the subscribed parts", () => {
      expect(
        component,
        "queried for test id",
        "edit-view",
        "to have text",
        "Id 42"
      );
    });
  });
});
