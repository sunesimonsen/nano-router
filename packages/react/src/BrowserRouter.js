import React, { useMemo } from "react";
import { Router } from "./Router";
import { createBrowserHistory } from "@nano-router/history";

export const BrowserRouter = ({ routes, children }) => {
  const history = useMemo(() => createBrowserHistory(), []);

  return (
    <Router routes={routes} history={history}>
      {children}
    </Router>
  );
};
