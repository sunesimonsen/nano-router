import { PathPattern } from "@nano-router/path";
import type { PathValues } from "@nano-router/path";

export class Route {
  name: string;
  external: boolean;
  #pattern: PathPattern;

  constructor(name: string, pattern: string, external: boolean = false) {
    if (name === "default") {
      throw new Error("default is a reserved route name");
    }

    this.name = name;
    this.#pattern = new PathPattern(pattern);
    this.external = external;
  }

  match(path: string) {
    return this.#pattern.match(path);
  }

  stringify(params: PathValues) {
    return this.#pattern.stringify(params);
  }
}
