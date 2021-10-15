import { createUrl, searchToObject } from "@nano-router/url";

export class Router {
  constructor({ routes, history }) {
    this.listenerCount = 0;
    this.routes = routes;
    this.history = history;

    ["block", "go", "forward", "back"].forEach((method) => {
      this[method] = this.history[method].bind(history);
    });

    ["listen", "updateState", "createUrl", "navigate"].forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this._createRouteOptions = this._createRouteOptions.bind(this);

    this.updateState();
  }

  _createRouteOptions(routeNameOrOptions) {
    const options =
      typeof routeNameOrOptions === "string"
        ? { route: routeNameOrOptions }
        : routeNameOrOptions;

    if (options.url) {
      return { external: true, ...options };
    }

    const {
      route: routeName = this.route,
      params = this.params,
      queryParams = this.queryParams,
      hash = this.location.hash,
      state,
      replace = false,
      target,
    } = options;

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

  createUrl(routeNameOrOptions) {
    const { url } = this._createRouteOptions(routeNameOrOptions);

    return url;
  }

  navigate(routeNameOrOptions) {
    const { url, replace, target, state, external } =
      this._createRouteOptions(routeNameOrOptions);

    if (target && target !== "_self") {
      this.history.pushLocation(url, target);
    } else if (external) {
      if (replace) {
        this.history.replaceLocation(url);
      } else {
        this.history.pushLocation(url);
      }
    } else {
      if (replace) {
        this.history.replace(url, state);
      } else {
        this.history.push(url, state);
      }
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

    let subscribed = true;
    this.listenerCount++;

    const clearListener = this.history.listen((...args) => {
      if (subscribed && listener) {
        listener(...args);
      }
    });

    return () => {
      this.listenerCount--;

      if (this.listenerCount === 0) {
        if (this.stateListener) {
          this.stateListener();
          this.stateListener = null;
        }
      }

      clearListener();
      subscribed = false;
    };
  }
}
