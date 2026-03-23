import { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { Router as NanoRouter, Routes } from "@nano-router/router";
import { type RouterHistory } from "@nano-router/history";
import { RouterProvider } from "./RouterProvider.js";

type RouterProps = {
  routes: Routes;
  history: RouterHistory;
  children: ComponentChildren;
};

export const Router = ({ routes, history, children }: RouterProps) => {
  const router = useMemo(
    () => new NanoRouter({ routes, history }),
    [routes, history],
  );

  return <RouterProvider router={router}>{children}</RouterProvider>;
};
