import { Route } from "./Route";

export class ExternalRoute extends Route {
  constructor(...args) {
    super(...args);
    this.external = true;
  }
}
