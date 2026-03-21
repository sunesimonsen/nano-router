import React, { ReactNode, useMemo } from "react";
import { Router as NanoRouter, Routes } from "@nano-router/router";
import { type RouterHistory } from "@nano-router/history";
import { RouterProvider } from "./RouterProvider.js";

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
    [routes, history],
  );

  return <RouterProvider router={router}>{children}</RouterProvider>;
};
