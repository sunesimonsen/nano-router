import React, { useState } from "react";
import expect, { mount, unmount, simulate } from "./expect";

import {
  Routes,
  Route,
  InMemoryRouter,
  useRouteName,
  useRouter,
  usePrompt,
} from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts")
);

const NewView = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const isDirty = Boolean(name);
  const confirm = usePrompt(isDirty);

  const showList = () => {
    router.navigate({ route: "posts" });
  };

  const onChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <input data-test-id="name" value={name} onChange={onChange} />
      {confirm && (
        <button data-test-id="confirm" onClick={confirm}>
          Confirm
        </button>
      )}
      <button data-test-id="show-list" onClick={showList}>
        Show list
      </button>
    </div>
  );
};

const RootView = () => {
  const routeName = useRouteName();

  switch (routeName) {
    case "posts/new":
      return <NewView />;
    default:
      return <div data-test-id="posts-list" />;
  }
};

const App = () => {
  return (
    <div>
      <InMemoryRouter routes={routes} initialPath="/posts/new">
        <RootView />
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

  describe("when navigation is blocked", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=show-list]" },
      ]);
    });

    it("shows a confirmation", () => {
      expect(component, "to contain test id", "confirm");
    });
  });

  describe("when block navigation is confirmed", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=show-list]" },
        { type: "click", target: "[data-test-id=confirm]" },
      ]);
    });

    it("shows a confirmation", () => {
      expect(component, "to contain test id", "posts-list");
    });
  });
});
