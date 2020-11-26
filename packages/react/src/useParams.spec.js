import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import expect, { mount, unmount } from "./expect";

import { Routes, Route, Router, useParams } from "./index";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteParams = () => {
  const { id } = useParams();

  return <div data-test-id="params-id">{id}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts/42"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <RouteParams />
      </Router>
    </div>
  );
};

describe("useParams", () => {
  let component;

  beforeEach(() => {
    component = mount(<App />);
  });

  afterEach(() => {
    unmount(component);
  });

  it("returns route params", () => {
    expect(component, "queried for test id", "params-id", "to have text", "42");
  });
});
