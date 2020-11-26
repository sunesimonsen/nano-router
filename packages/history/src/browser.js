import {
  allowTx,
  createEvents,
  getNextLocation,
  ensureRootRelative,
  promptBeforeUnload,
  isDev,
} from "./utils";

const BeforeUnloadEventType = "beforeunload";
const PopStateEventType = "popstate";

function createPath({ pathname = "/", search = "", hash = "" }) {
  return pathname + search + hash;
}

function createHref(to) {
  return typeof to === "string" ? to : createPath(to);
}

export function createBrowserHistory(options = {}) {
  const { window = document.defaultView } = options;
  const globalHistory = window.history;

  function getIndexAndLocation() {
    const { pathname, search, hash } = window.location;
    const state = globalHistory.state || {};
    return [
      state.idx,
      {
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || "default",
      },
    ];
  }

  let blockedPopTx;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      const nextAction = "POP";
      const [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          const delta = index - nextIndex;
          if (delta) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(delta * -1);
              },
            };

            go(delta);
          }
        } else if (isDev) {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          console.warn(
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);

  let action = "POP";
  let [index, location] = getIndexAndLocation();
  const listeners = createEvents();
  const blockers = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, "");
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index,
      },
      createHref(nextLocation),
    ];
  }

  function applyTx(nextAction) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
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
      const [historyState, url] = getHistoryStateAndUrl(
        nextLocation,
        index + 1
      );

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
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
      const [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, "", url);

      applyTx(nextAction);
    }
  }

  function pushLocation(url, target) {
    function retry() {
      pushLocation(url);
    }

    if (target && target !== "_self") {
      window.open(url, target, "noopener");
    } else {
      const nextAction = "PUSH";
      const nextLocation = getNextLocation(location, url);

      if (allowTx(blockers, nextAction, nextLocation, retry)) {
        window.location.assign(url);
      }
    }
  }

  function replaceLocation(url) {
    const nextAction = "REPLACE";
    const nextLocation = getNextLocation(location, url);

    function retry() {
      replaceLocation(url);
    }

    if (allowTx(blockers, nextAction, nextLocation, retry)) {
      window.location.replace(url);
    }
  }

  function go(delta) {
    globalHistory.go(delta);
  }

  const history = {
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
      const unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function () {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    },
  };

  return history;
}
