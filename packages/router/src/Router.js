import { createUrl, searchToObject } from "@nano-router/url";

export class Router {
  constructor({ routes, history }) {
    this.listenerCount = 0;
    this.routes = routes;
    this.history = history;

    ["block", "go", "forward", "back"].forEach((method) => {
      this[method] = this.history[method].bind(history);
    });

    this.listen = this.listen.bind(this);
    this.updateState = this.updateState.bind(this);

    this.updateState();
  }

  navigate({
    route: routeName = this.route,
    params = this.params,
    queryParams = this.queryParams,
    hash = this.location.hash,
    state,
    replace = false,
  }) {
    const route = this.routes.byName(routeName);

    if (!route) {
      throw new Error(`Unknown route: ${routeName}`);
    }

    const url = createUrl({
      basename: route.stringify(params),
      queryParams,
      hash,
    });

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
      this.stateListener = this.history.listen(({ action, location }) => {
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
