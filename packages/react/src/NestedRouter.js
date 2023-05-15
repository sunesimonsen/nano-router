import React, { useMemo } from "react";
import { RouterContext } from "./RouterContext.js";
import { Router as NanoRouter } from "@nano-router/router";
import { RouterSubscription } from "./RouterSubscription.js";
import { useRouter } from "./useRouter.js";

// Maybe move to @nano-router/router if it works well
class NestedNanoRouter extends NanoRouter {
  constructor({ routes, history, parentRouter }) {
    super({ routes, history });
    this.parentRouter = parentRouter;
  }

  _ownsRoute(routeNameOrOptions) {
    const routeName =
      typeof routeNameOrOptions === "string"
        ? routeNameOrOptions
        : routeNameOrOptions.route;

    const route = this.routes.byName(routeName || this.route);

    return Boolean(route);
  }

  navigate(routeNameOrOptions) {
    if (this._ownsRoute(routeNameOrOptions)) {
      super.navigate(routeNameOrOptions);
    } else {
      this.parentRouter.navigate(routeNameOrOptions);
    }
  }

  createUrl(routeNameOrOptions) {
    if (this._ownsRoute(routeNameOrOptions)) {
      super.createUrl(routeNameOrOptions);
    } else {
      this.parentRouter.createUrl(routeNameOrOptions);
    }
  }
}

export const NestedRouter = ({ routes, history, children }) => {
  const parentRouter = useRouter();
  const router = useMemo(
    () => new NestedNanoRouter({ parentRouter, routes, history }),
    [parentRouter, routes, history]
  );

  return (
    <RouterContext.Provider value={router}>
      <RouterSubscription>{children}</RouterSubscription>
    </RouterContext.Provider>
  );
};
