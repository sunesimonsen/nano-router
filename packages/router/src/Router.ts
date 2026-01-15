import { Routes } from "@nano-router/routes";
import type { PathValues } from "@nano-router/path";
import type { QueryParams } from "@nano-router/url";
import { createUrl, searchToObject } from "@nano-router/url";
import type {
  RouterHistory,
  RouterLocation,
  TransitionHandler,
  Unsubscriber,
} from "@nano-router/history";

type RouterArgs = {
  routes: Routes;
  history: RouterHistory;
};

export type NavigateOptions = {
  route?: string;
  params?: PathValues;
  queryParams?: QueryParams;
  hash?: string;
  state?: any;
  replace?: boolean;
  target?: string;
  url?: string;
};

type NavigateTarget = {
  state?: any | undefined;
  replace: boolean;
  target?: string | undefined;
  url: string;
  external: boolean;
};

export class Router {
  #listenerCount: number = 0;
  routes: Routes;
  #history: RouterHistory;
  #stateListener: Unsubscriber | null = null;

  #route: string;
  #params: Record<string, string>;
  #queryParams: QueryParams;

  constructor({ routes, history }: RouterArgs) {
    this.routes = routes;

    const location = history.location;
    const match = this.routes.match(location.pathname);

    this.#route = match.name;
    this.#params = match.params;
    this.#queryParams = searchToObject(location.search);

    this.#history = history;
  }

  get location(): RouterLocation {
    return this.#history.location;
  }

  get route(): string {
    return this.#route;
  }

  get params(): Record<string, string> {
    return this.#params;
  }

  get queryParams(): QueryParams {
    return this.#queryParams;
  }

  go(delta: number): void {
    this.#history.go(delta);
  }

  block(blocker: TransitionHandler): Unsubscriber {
    return this.#history.block(blocker);
  }

  back(): void {
    this.#history.back();
  }

  forward(): void {
    this.#history.forward();
  }

  #createRouteOptions(
    routeNameOrOptions: string | NavigateOptions,
  ): NavigateTarget {
    const options =
      typeof routeNameOrOptions === "string"
        ? { route: routeNameOrOptions }
        : routeNameOrOptions;

    if (options.url) {
      return {
        url: options.url,
        external: true,
        replace: false,
        ...options,
      };
    }

    const {
      route: routeName = this.route,
      params = this.params,
      queryParams = this.queryParams,
      hash = this.location.hash,
      state,
      replace = false,
      target,
    }: NavigateOptions = options;

    const route = this.routes.byName(routeName);

    if (!route) {
      throw new Error(`Unknown route: ${routeName}`);
    }

    const url = createUrl({
      pathname: route.stringify(params),
      queryParams,
      hash,
    });

    return { external: route.external, url, state, replace, target };
  }

  createUrl(routeNameOrOptions: string | NavigateOptions) {
    const { url } = this.#createRouteOptions(routeNameOrOptions);

    return url;
  }

  navigate(routeNameOrOptions: string | NavigateOptions) {
    const { url, replace, target, state, external } =
      this.#createRouteOptions(routeNameOrOptions);

    if (target && target !== "_self") {
      this.#history.pushLocation(url, target);
    } else if (external) {
      if (replace) {
        this.#history.replaceLocation(url);
      } else {
        this.#history.pushLocation(url);
      }
    } else {
      if (replace) {
        this.#history.replace(url, state);
      } else {
        this.#history.push(url, state);
      }
    }
  }

  updateState() {
    const location = this.location;
    const match = this.routes.match(location.pathname);

    this.#route = match.name;
    this.#params = match.params;
    this.#queryParams = searchToObject(location.search);
  }

  listen(listener: TransitionHandler): Unsubscriber {
    if (!this.#stateListener) {
      this.#stateListener = this.#history.listen(() => {
        this.updateState();
      });
    }

    let subscribed = true;
    this.#listenerCount++;

    const clearListener = this.#history.listen((...args) => {
      if (subscribed && listener) {
        listener(...args);
      }
    });

    return () => {
      this.#listenerCount--;

      if (this.#listenerCount === 0) {
        if (this.#stateListener) {
          this.#stateListener();
          this.#stateListener = null;
        }
      }

      clearListener();
      subscribed = false;
    };
  }
}
