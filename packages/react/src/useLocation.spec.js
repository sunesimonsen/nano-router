import React from "react";
import expect, { mount, unmount, simulate } from "./expect";

import { Routes, Route, InMemoryRouter, useLocation, useRouter } from "./index";

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

const App = () => (
  <div>
    <InMemoryRouter routes={routes} initialPath="/posts/42?message=hello#h2">
      <RouteLocation />
      <SetMessage />
    </InMemoryRouter>
  </div>
);

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
