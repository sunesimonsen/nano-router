import React, { ReactNode, useMemo } from "react";
import { RouterContext } from "./RouterContext.js";
import {
  Router as NanoRouter,
  NavigateOptions,
  Routes,
} from "@nano-router/router";
import { RouterSubscription } from "./RouterSubscription.js";
import { useRouter } from "./useRouter.js";
import { RouterHistory } from "@nano-router/history";

type NestedNanoRouterArgs = {
  routes: Routes;
  history: RouterHistory;
  parentRouter: NanoRouter;
};

// Maybe move to @nano-router/router if it works well
class NestedNanoRouter extends NanoRouter {
  #parentRouter: NanoRouter;

  constructor({ routes, history, parentRouter }: NestedNanoRouterArgs) {
    super({ routes, history });
    this.#parentRouter = parentRouter;
  }

  #ownsRoute(routeNameOrOptions: string | NavigateOptions) {
    const routeName =
      typeof routeNameOrOptions === "string"
        ? routeNameOrOptions
        : routeNameOrOptions.route;

    const route = this.routes.byName(routeName || this.route);

    return Boolean(route);
  }

  override navigate(routeNameOrOptions: string | NavigateOptions) {
    if (this.#ownsRoute(routeNameOrOptions)) {
      super.navigate(routeNameOrOptions);
    } else {
      this.#parentRouter.navigate(routeNameOrOptions);
    }
  }

  override createUrl(routeNameOrOptions: string | NavigateOptions): string {
    if (this.#ownsRoute(routeNameOrOptions)) {
      return super.createUrl(routeNameOrOptions);
    } else {
      return this.#parentRouter.createUrl(routeNameOrOptions);
    }
  }
}

type NestedRouterProps = {
  routes: Routes;
  history: RouterHistory;
  children: ReactNode;
};

export const NestedRouter: React.FC<NestedRouterProps> = ({
  routes,
  history,
  children,
}) => {
  const parentRouter = useRouter();
  const router = useMemo(
    () => new NestedNanoRouter({ parentRouter, routes, history }),
    [parentRouter, routes, history],
  );

  return (
    <RouterContext.Provider value={router}>
      <RouterSubscription>{children}</RouterSubscription>
    </RouterContext.Provider>
  );
};
