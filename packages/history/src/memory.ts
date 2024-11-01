import {
  RouterAction,
  RouterHistory,
  RouterLocation,
  TransitionHandler,
} from "./history";
import {
  allowTx,
  createEvents,
  createKey,
  parseUrl,
  getNextLocation,
  ensureRootRelative,
} from "./utils";

function clamp(n: number, lowerBound: number, upperBound: number) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

type Options = {
  initialEntries?: string[];
  initialIndex?: number;
};

export type OpenedWindow = { url: string; target: string };

export type MemoryRouterHistory = RouterHistory & {
  readonly openedWindow: OpenedWindow | null;
};

export function createMemoryHistory(options: Options): MemoryRouterHistory {
  const { initialEntries = ["/"], initialIndex } = options;
  const entries = initialEntries.map((entry) => {
    const location: RouterLocation = {
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

  let action: RouterAction = "POP";
  let location = entries[index] as RouterLocation;
  let openedWindow: OpenedWindow | null = null;
  const listeners = createEvents();
  const blockers = createEvents();

  function applyTx(nextAction: RouterAction, nextLocation: RouterLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to: string, state: any) {
    const nextAction = "PUSH";
    const nextLocation = getNextLocation(to, state);
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

  function replace(to: string, state: any) {
    const nextAction = "REPLACE";
    const nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    ensureRootRelative(location);

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function pushLocation(url: string, target?: string) {
    function retry() {
      pushLocation(url);
    }

    if (target && target !== "_self") {
      openedWindow = { url, target };
    } else {
      const nextAction = "PUSH";
      const nextLocation = getNextLocation(url);

      if (allowTx(blockers, nextAction, nextLocation, retry)) {
        entries[index] = nextLocation;
        action = nextAction;
        location = nextLocation;
      }
    }
  }

  function replaceLocation(url: string) {
    const nextAction = "REPLACE";
    const nextLocation = getNextLocation(url);

    function retry() {
      replaceLocation(url);
    }

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      action = nextAction;
      location = nextLocation;
    }
  }

  function go(delta: number) {
    const nextIndex = clamp(index + delta, 0, entries.length - 1);
    const nextAction = "POP";
    const nextLocation = entries[nextIndex] as RouterLocation;
    function retry() {
      go(delta);
    }

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  const history: MemoryRouterHistory = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    get openedWindow() {
      return openedWindow;
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
    listen(listener: TransitionHandler) {
      return listeners.push(listener);
    },
    block(blocker: TransitionHandler) {
      return blockers.push(blocker);
    },
  };

  return history;
}
