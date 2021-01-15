import { Route } from "./Route.js";

export class ExternalRoute extends Route {
  constructor(...args) {
    super(...args);
    this.external = true;
  }
}
