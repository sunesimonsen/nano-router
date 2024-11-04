import React, { ReactNode, useMemo } from "react";
import { RouterContext } from "./RouterContext";
import { Router as NanoRouter, Routes } from "@nano-router/router";
import { type RouterHistory } from "@nano-router/history";
import { RouterSubscription } from "./RouterSubscription";

type RouterProps = {
  routes: Routes;
  history: RouterHistory;
  children: ReactNode;
};

export const Router: React.FC<RouterProps> = ({
  routes,
  history,
  children,
}) => {
  const router = useMemo(
    () => new NanoRouter({ routes, history }),
    [routes, history]
  );

  return (
    <RouterContext.Provider value={router}>
      <RouterSubscription>{children}</RouterSubscription>
    </RouterContext.Provider>
  );
};
