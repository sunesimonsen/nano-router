import React, { useMemo } from "react";
import { createMemoryHistory } from "history";
import expect, { mount, unmount } from "./expect";

import { Routes, Route, Router, useQueryParams } from "./index";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteQueryParams = () => {
  const { message } = useQueryParams();

  return <div data-test-id="query-params-message">{message}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts/42?message=hello"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <RouteQueryParams />
      </Router>
    </div>
  );
};

describe("useQueryParams", () => {
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("returns route query params", () => {
    expect(
      component,
      "queried for test id",
      "query-params-message",
      "to have text",
      "hello"
    );
  });
});
