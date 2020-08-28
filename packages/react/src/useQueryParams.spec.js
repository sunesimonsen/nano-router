import React from "react";
import expect, { mount, unmount } from "./expect";

import { Routes, Route, InMemoryRouter, useQueryParams } from "./index";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteQueryParams = () => {
  const { message } = useQueryParams();

  return <div data-test-id="query-params-message">{message}</div>;
};

const App = () => {
  return (
    <div>
      <InMemoryRouter routes={routes} initialPath="/posts/42?message=hello">
        <RouteQueryParams />
      </InMemoryRouter>
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
