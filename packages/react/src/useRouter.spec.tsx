import React, { useMemo } from "react";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

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
  it("returns the router from the context", () => {
    render(<App />);

    expect(screen.getByTestId("location")).toHaveTextContent("/posts");
  });
});
