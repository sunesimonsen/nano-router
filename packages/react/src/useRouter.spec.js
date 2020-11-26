import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount } from "./expect";

import { Routes, Route, Router, useRouter } from "./index";

const routes = new Routes(new Route("posts", "/posts"));

const Location = () => {
  const router = useRouter();

  return <div data-test-id="location">{router.location.pathname}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <Location />
      </Router>
    </div>
  );
};

describe("useRouter", () => {
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
      "location",
      "to have text",
      "/posts"
    );
  });
});
