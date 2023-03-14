import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount } from "./expect.js";

import { Routes, Route, Router, useLocation, Navigate } from "./index.js";

const routes = new Routes(
  new Route("posts", "/posts"),
  new Route("new", "/new")
);

const Location = () => {
  const location = useLocation();

  return <div data-test-id="location">{location.pathname}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <Navigate route="new" />
        <Location />
      </Router>
    </div>
  );
};

describe("Navigate", () => {
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("navigates to new route", () => {
    expect(
      component,
      "queried for test id",
      "location",
      "to have text",
      "/new"
    );
  });
});
