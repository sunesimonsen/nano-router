import { PathPattern } from "@nano-router/path";

export class Route {
  constructor(name, pattern) {
    if (name === "default") {
      throw new Error("default is a reserved route name");
    }

    this.name = name;
    this.pattern = new PathPattern(pattern);
  }

  match(path) {
    return this.pattern.match(path);
  }

  stringify(params) {
    return this.pattern.stringify(params);
  }
}
