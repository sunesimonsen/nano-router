import { Route } from "./Route";

export class Routes {
  #routes: Route[];

  constructor(...routes: Route[]) {
    this.#routes = routes;
  }

  match(path: string) {
    for (let i = 0; i < this.#routes.length; i++) {
      const route = this.#routes[i];

      if (route) {
        const match = route.match(path);

        if (match) {
          return { name: route.name, params: match };
        }
      }
    }

    return { name: "default", params: {} };
  }

  byName(name: string) {
    return this.#routes.find((route) => route.name === name) || null;
  }
}
