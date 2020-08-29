import React, { useState } from "react";
import expect, { mount, unmount, simulate } from "./expect";

import {
  Routes,
  Route,
  MemoryRouter,
  useRouteName,
  usePrompt,
  useLink,
} from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts")
);

const NewView = () => {
  const [name, setName] = useState("");
  const isDirty = Boolean(name);
  const confirm = usePrompt(isDirty);

  const showPosts = useLink("posts");

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
      <a data-test-id="show-list" {...showPosts}>
        Show list
      </a>
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
      <MemoryRouter routes={routes} initialPath="/posts/new">
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
