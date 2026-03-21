import { ComponentChildren } from "preact";
import { RouterContext } from "./RouterContext.js";
import { Router } from "@nano-router/router";
import { RouterSubscription } from "./RouterSubscription.js";

type RouterProviderProps = {
  router: Router;
  children: ComponentChildren;
};

export const RouterProvider = ({ router, children }: RouterProviderProps) => {
  return (
    <RouterContext.Provider value={router}>
      <RouterSubscription>{children}</RouterSubscription>
    </RouterContext.Provider>
  );
};
