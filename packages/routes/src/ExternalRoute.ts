import { Route } from "./Route";

export class ExternalRoute extends Route {
  constructor(name: string, pattern: string) {
    super(name, pattern, true);
  }
}
