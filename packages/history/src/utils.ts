import {
  RetryFunction,
  RouterAction,
  RouterLocation,
  TransitionArgs,
  TransitionHandler,
  TransitionHandlers,
} from "./history";

export const isDev = (globalThis as any).__DEV__;

export function createKey() {
  return Math.random().toString(36).substring(2, 10);
}

export function ensureRootRelative(location: RouterLocation) {
  if (isDev && location.pathname[0] !== "/") {
    console.warn(`Relative pathnames are not supported`);
  }
}

export function promptBeforeUnload(event: BeforeUnloadEvent) {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = "";
}

export function createEvents(): TransitionHandlers {
  let handlers: TransitionHandler[] = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn: TransitionHandler) {
      handlers.push(fn);
      return function () {
        handlers = handlers.filter((handler) => handler !== fn);
      };
    },
    call(arg: TransitionArgs) {
      handlers.forEach((fn) => fn && fn(arg));
    },
  };
}

export type PartialRouterLocation = Pick<RouterLocation, "href"> &
  Pick<RouterLocation, "pathname"> &
  Pick<RouterLocation, "search"> &
  Pick<RouterLocation, "hash">;

export function parseUrl(url: string): PartialRouterLocation {
  const partialPath: PartialRouterLocation = {
    href: url,
    pathname: "",
    search: "",
    hash: "",
  };

  let path = url;
  const protocolIndex = url.indexOf("//");
  if (protocolIndex !== -1) {
    const pathIndex = url.indexOf("/", protocolIndex + 2);
    path = url.slice(pathIndex);
  }

  const hashIndex = path.indexOf("#");
  if (hashIndex >= 0) {
    partialPath.hash = path.substring(hashIndex);
    path = path.substring(0, hashIndex);
  }

  const searchIndex = path.indexOf("?");
  if (searchIndex >= 0) {
    partialPath.search = path.substring(searchIndex);
    path = path.substring(0, searchIndex);
  }

  if (path) {
    partialPath.pathname = path;
  }

  return partialPath;
}

export function getNextLocation(
  to: string | RouterLocation,
  state: any = null
): RouterLocation {
  return {
    ...(typeof to === "string" ? parseUrl(to) : to),
    state,
    key: createKey(),
  };
}

export function allowTx(
  blockers: TransitionHandlers,
  action: RouterAction,
  location: RouterLocation,
  retry: RetryFunction
) {
  return (
    !blockers.length || (blockers.call({ action, location, retry }), false)
  );
}
