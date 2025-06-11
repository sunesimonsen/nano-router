import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import { Routes, Route, Router, useQueryParams } from "./index.js";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteQueryParams = () => {
  const { message } = useQueryParams();

  return <div data-test-id="query-params-message">{message}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts/42?message=hello"] }),
    [],
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
  it("returns route query params", () => {
    render(<App />);

    expect(screen.getByTestId("query-params-message")).toHaveTextContent(
      "hello",
    );
  });
});
