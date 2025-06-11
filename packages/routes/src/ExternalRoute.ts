import { Route } from "./Route.js";

export class ExternalRoute extends Route {
  constructor(name: string, pattern: string) {
    super(name, pattern, true);
  }
}
