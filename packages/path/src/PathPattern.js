const trimSlashes = (path) => path.replace(/^\/|\/$/g, "");

export class PathPattern {
  constructor(pattern) {
    this.hasTrainlingSlash = pattern.endsWith("/");
    this.pattern = trimSlashes(pattern).split("/");
  }

  match(path) {
    const pathSegments = trimSlashes(path).split("/");

    if (this.pattern.length !== pathSegments.length) {
      return null;
    }

    const match = {};

    for (let i = 0; i < this.pattern.length; i++) {
      const pathSegment = pathSegments[i];
      const patternSegment = this.pattern[i];

      if (patternSegment.startsWith(":")) {
        if (!pathSegment) {
          return null;
        }

        match[patternSegment.slice(1)] = decodeURIComponent(pathSegment);
      } else if (pathSegment !== patternSegment) {
        return null;
      }
    }

    return match;
  }

  stringify(values = {}) {
    const trailingSlash = this.hasTrainlingSlash ? "/" : "";

    const path =
      "/" +
      this.pattern
        .map((patternSegment) => {
          if (patternSegment.startsWith(":")) {
            const variableName = patternSegment.slice(1);
            const value = values[variableName];

            if (!value) {
              throw new Error(
                `No value provided for variable: ${variableName}`
              );
            }

            return encodeURIComponent(value);
          } else {
            return patternSegment;
          }
        })
        .join("/");

    if (path === "/") {
      return path;
    }

    return path + trailingSlash;
  }
}
