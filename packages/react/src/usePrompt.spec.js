import React, { useState, useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount, simulate } from "./expect";

import {
  Routes,
  Route,
  ExternalRoute,
  Router,
  useRouteName,
  useRouter,
  usePrompt,
  useLink,
} from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id")
);

const NewView = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const isDirty = Boolean(name);
  const confirmation = usePrompt(isDirty);

  const showPosts = useLink("posts");
  const showExternal = useLink({ route: "external", params: { id: 42 } });

  const onChange = (e) => {
    setName(e.target.value);
  };

  const onSave = () => {
    // Save
    // Success
    router.navigate({
      route: "posts",
      state: { skipPrompt: true },
    });
  };

  return (
    <div>
      <input data-test-id="name" value={name} onChange={onChange} />
      {confirmation.isVisible && (
        <div>
          <button data-test-id="reject" onClick={confirmation.reject}>
            Reject
          </button>
          <button data-test-id="approve" onClick={confirmation.approve}>
            Approve
          </button>
        </div>
      )}
      <button data-test-id="save" onClick={onSave}>
        Save
      </button>
      <a data-test-id="show-list" {...showPosts}>
        Show list
      </a>
      <a data-test-id="external" {...showExternal}>
        External
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
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts/new"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <RootView />
      </Router>
    </div>
  );
};

describe("usePrompt", () => {
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
      expect(component, "to contain test id", "approve");
    });
  });

  describe("when navigation is blocked to an external route", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=external]" },
      ]);
    });

    it("shows a confirmation", () => {
      expect(component, "to contain test id", "approve");
    });
  });

  describe("when block navigation is confirmed", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=show-list]" },
        { type: "click", target: "[data-test-id=approve]" },
      ]);
    });

    it("navigates", () => {
      expect(component, "to contain test id", "posts-list");
    });
  });

  describe("when block navigation is rejected", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=show-list]" },
        { type: "click", target: "[data-test-id=reject]" },
      ]);
    });

    it("removes the confirmation but it doesn't navigate", () => {
      expect(component, "not to contain test id", "approve").and(
        "not to contain test id",
        "posts-list"
      );
    });
  });

  describe("when block navigation is rejected multiple times", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=show-list]" },
        { type: "click", target: "[data-test-id=reject]" },
        { type: "click", target: "[data-test-id=show-list]" },
        { type: "click", target: "[data-test-id=reject]" },
      ]);
    });

    it("removes the confirmation but it doesn't navigate", () => {
      expect(component, "not to contain test id", "approve").and(
        "not to contain test id",
        "posts-list"
      );
    });
  });

  describe("when removing a confirmation", () => {
    beforeEach(() => {
      simulate(component, [
        { type: "change", target: "[data-test-id=name]", value: "Sune" },
        { type: "click", target: "[data-test-id=save]" },
      ]);
    });

    it("won't prompt on navigation", () => {
      expect(component, "to contain test id", "posts-list");
    });
  });
});
