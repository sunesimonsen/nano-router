export function createKey() {
  return Math.random().toString(36).substring(2, 10);
}

export const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export function ensureRootRelative(location) {
  if (isDev && location.pathname[0] !== "/") {
    console.warn(`Relative pathnames are not supported`);
  }
}

export function promptBeforeUnload(event) {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = "";
}

export function createEvents() {
  let handlers = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    call(arg) {
      handlers.forEach((fn) => fn && fn(arg));
    },
  };
}

export function parseUrl(url) {
  const partialPath = { href: url, search: "", hash: "" };

  if (url) {
    let path = url;
    const protocolIndex = url.indexOf("//");
    if (protocolIndex !== -1) {
      const pathIndex = url.indexOf("/", protocolIndex + 2);
      path = url.slice(pathIndex);
    }

    const hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      partialPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    const searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      partialPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      partialPath.pathname = path;
    }
  }

  return partialPath;
}

export function getNextLocation(_currentLocation, to, state = null) {
  return {
    ...(typeof to === "string" ? parseUrl(to) : to),
    state,
    key: createKey(),
  };
}

export function allowTx(blockers, action, location, retry) {
  return (
    !blockers.length || (blockers.call({ action, location, retry }), false)
  );
}
