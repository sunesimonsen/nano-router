import { createUrl, searchToObject } from "@nano-router/url";

export class Router {
  constructor({ routes, history }) {
    this.listenerCount = 0;
    this.routes = routes;
    this.history = history;

    ["block", "go", "forward", "back"].forEach((method) => {
      this[method] = this.history[method].bind(history);
    });

    [
      "listen",
      "updateState",
      "createUrl",
      "createRouteOptions",
      "navigate",
    ].forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.updateState();
  }

  createRouteOptions(routeNameOrOptions) {
    const options =
      typeof routeNameOrOptions === "string"
        ? { route: routeNameOrOptions }
        : routeNameOrOptions;

    const {
      route = this.route,
      params = this.params,
      queryParams = this.queryParams,
      hash = this.location.hash,
      state,
      replace = false,
    } = options;

    return { route, params, queryParams, hash, state, replace };
  }

  createUrl(routeNameOrOptions) {
    const {
      route: routeName,
      params,
      queryParams,
      hash,
    } = this.createRouteOptions(routeNameOrOptions);

    const route = this.routes.byName(routeName);

    if (!route) {
      throw new Error(`Unknown route: ${routeName}`);
    }

    return createUrl({
      basename: route.stringify(params),
      queryParams,
      hash,
    });
  }

  navigate(routeNameOrOptions) {
    const options = this.createRouteOptions(routeNameOrOptions);
    const url = this.createUrl(options);

    const { replace, state } = options;

    if (replace) {
      this.history.replace(url, state);
    } else {
      this.history.push(url, state);
    }
  }

  updateState() {
    this.location = this.history.location;

    const match = this.routes.match(this.location.pathname);

    this.route = match.name;
    this.params = match.params;
    this.queryParams = searchToObject(this.location.search);
  }

  listen(listener) {
    if (!this.stateListener) {
      this.stateListener = this.history.listen(() => {
        this.updateState();
      });
    }

    this.listenerCount++;

    const clearListener = this.history.listen(listener);

    return () => {
      this.listenerCount--;

      if (this.listenerCount === 0) {
        if (this.stateListener) {
          this.stateListener();
          this.stateListener = null;
        }
      }

      clearListener();
    };
  }
}
