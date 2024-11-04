import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import { Routes, Route, Router, useLocation, Navigate } from "./index";

const routes = new Routes(
  new Route("posts", "/posts"),
  new Route("new", "/new"),
);

const Location = () => {
  const location = useLocation();

  return <div data-test-id="location">{location.pathname}</div>;
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts"] }),
    [],
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
  beforeEach(() => {
    render(<App />);
  });

  it("navigates to new route", () => {
    expect(screen.getByTestId("location")).toHaveTextContent("/new");
  });
});
