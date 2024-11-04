import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import { Routes, Route, Router, useParams } from "./index";

const routes = new Routes(new Route("posts/edit", "/posts/:id"));

const RouteParams = () => {
  const { id } = useParams();

  return <div data-test-id="params-id">{id}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts/42"] }),
    [],
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
  it("returns route params", () => {
    render(<App />);

    expect(screen.getByTestId("params-id")).toHaveTextContent("42");
  });
});
