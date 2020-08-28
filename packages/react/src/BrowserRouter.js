import React, { useMemo } from "react";
import { createBrowserHistory } from "history";
import { Router } from "./Router";

export const BrowserRouter = ({ routes, children }) => {
  const history = useMemo(() => createBrowserHistory(), []);

  return (
    <Router routes={routes} history={history}>
      {children}
    </Router>
  );
};
