import React, { useMemo } from "react";
import { createMemoryHistory } from "@nano-router/history";
import { Router } from "./Router";

export const MemoryRouter = ({ routes, initialPath = "/", children }) => {
  const history = useMemo(
    () =>
      createMemoryHistory({
        initialEntries: [initialPath],
      }),
    [initialPath]
  );

  return (
    <Router routes={routes} history={history}>
      {children}
    </Router>
  );
};
