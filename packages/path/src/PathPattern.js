const splitPattern = (pattern) => {
  let prefix = "";

  const protocolIndex = pattern.indexOf("//");
  if (protocolIndex !== -1) {
    const prefixIndex = pattern.indexOf("/", protocolIndex + 2);

    if (prefixIndex > 0) {
      prefix = pattern.slice(0, prefixIndex);
      pattern = pattern.slice(prefixIndex);
    }
  }

  return {
    prefix,
    segments: pattern.split("/"),
  };
};

export class PathPattern {
  constructor(pattern) {
    this.pattern = splitPattern(pattern);
  }

  match(path) {
    const pattern = this.pattern;
    const { prefix, segments } = splitPattern(path);

    if (pattern.prefix !== prefix) {
      return null;
    }

    const patternSegments = pattern.segments.filter(Boolean);
    const pathSegments = segments.filter(Boolean);

    if (patternSegments.length !== pathSegments.length) {
      return null;
    }

    const match = {};

    for (let i = 0; i < patternSegments.length; i++) {
      const pathSegment = pathSegments[i];
      const patternSegment = patternSegments[i];

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
    const { prefix, segments } = this.pattern;

    const path =
      prefix +
      segments
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

    return path;
  }
}
