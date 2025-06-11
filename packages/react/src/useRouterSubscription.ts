import { useContext } from "react";
import { RouterLocationContext } from "./RouterContext.js";

export const useRouterSubscription = () => {
  const routerLocation = useContext(RouterLocationContext);

  if (!routerLocation) {
    throw new Error("No router location available");
  }

  return routerLocation;
};
