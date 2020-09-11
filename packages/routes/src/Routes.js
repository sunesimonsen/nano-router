export class Routes {
  constructor(...routes) {
    this.routes = routes;
  }

  match(path) {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const match = route.match(path);

      if (match) {
        return {
          name: route.name,
          params: match,
        };
      }
    }

    return {
      name: "default",
      params: {},
    };
  }

  byName(name) {
    return this.routes.find((route) => route.name === name) || null;
  }
}
