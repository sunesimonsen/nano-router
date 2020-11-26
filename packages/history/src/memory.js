import {
  allowTx,
  createEvents,
  createKey,
  parseUrl,
  getNextLocation,
  ensureRootRelative,
} from "./utils";

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

export function createMemoryHistory(options) {
  const { initialEntries = ["/"], initialIndex } = options;
  const entries = initialEntries.map((entry) => {
    const location = {
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: createKey(),
      ...(typeof entry === "string" ? parseUrl(entry) : entry),
    };

    ensureRootRelative(location);

    return location;
  });
  let index = clamp(
    initialIndex == null ? entries.length - 1 : initialIndex,
    0,
    entries.length - 1
  );

  let action = "POP";
  let location = entries[index];
  const listeners = createEvents();
  const blockers = createEvents();

  function applyTx(nextAction, nextLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to, state) {
    const nextAction = "PUSH";
    const nextLocation = getNextLocation(location, to, state);
    function retry() {
      push(to, state);
    }

    ensureRootRelative(location);

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to, state) {
    const nextAction = "REPLACE";
    const nextLocation = getNextLocation(location, to, state);
    function retry() {
      replace(to, state);
    }

    ensureRootRelative(location);

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function pushLocation(url) {
    const nextAction = "PUSH";
    const nextLocation = getNextLocation(location, url);

    function retry() {
      pushLocation(url);
    }

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      action = nextAction;
      location = nextLocation;
    }
  }

  function replaceLocation(url) {
    const nextAction = "REPLACE";
    const nextLocation = getNextLocation(location, url);

    function retry() {
      replaceLocation(url);
    }

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      action = nextAction;
      location = nextLocation;
    }
  }

  function go(delta) {
    const nextIndex = clamp(index + delta, 0, entries.length - 1);
    const nextAction = "POP";
    const nextLocation = entries[nextIndex];
    function retry() {
      go(delta);
    }

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  const history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    push,
    replace,
    pushLocation,
    replaceLocation,
    go,
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(listener) {
      return listeners.push(listener);
    },
    block(blocker) {
      return blockers.push(blocker);
    },
  };

  return history;
}
