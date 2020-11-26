import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount, simulate } from "./expect";

import { Routes, Route, Router, useLocation, useRouter } from "./index";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteLocation = () => {
  const { pathname, state, search, hash } = useLocation();

  const url = pathname + search + hash;

  return (
    <div data-test-id="location">
      {url} - {state || "no state"}
    </div>
  );
};

const SetMessage = () => {
  const router = useRouter();

  const setMessage = () => {
    router.navigate({ state: "Hello world" });
  };

  return (
    <button data-test-id="set-message" onClick={setMessage}>
      Set message
    </button>
  );
};

const App = () => {
  const history = useMemo(
    () =>
      createMemoryHistory({ initialEntries: ["/posts/42?message=hello#h2"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <RouteLocation />
        <SetMessage />
      </Router>
    </div>
  );
};

describe("useLocation", () => {
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("retrieves the current history location", () => {
    simulate(component, {
      type: "click",
      target: "[data-test-id=set-message]",
    });

    expect(
      component,
      "queried for test id",
      "location",
      "to have text",
      "/posts/42?message=hello#h2 - Hello world"
    );
  });
});
