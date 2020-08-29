import React from "react";
import expect, { mount, unmount } from "./expect";

import { Routes, Route, MemoryRouter, useParams } from "./index";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteParams = () => {
  const { id } = useParams();

  return <div data-test-id="params-id">{id}</div>;
};

const App = () => {
  return (
    <div>
      <MemoryRouter routes={routes} initialPath="/posts/42">
        <RouteParams />
      </MemoryRouter>
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
