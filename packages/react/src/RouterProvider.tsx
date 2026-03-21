import React, { ReactNode } from "react";
import { RouterContext } from "./RouterContext.js";
import { Router } from "@nano-router/router";
import { RouterSubscription } from "./RouterSubscription.js";

type RouterProviderProps = {
  router: Router;
  children: ReactNode;
};

export const RouterProvider: React.FC<RouterProviderProps> = ({
  router,
  children,
}) => {
  return (
    <RouterContext.Provider value={router}>
      <RouterSubscription>{children}</RouterSubscription>
    </RouterContext.Provider>
  );
};
