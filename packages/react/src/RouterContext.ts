import { Router } from "@nano-router/router";
import { createContext } from "react";

type RouterLocation = Pick<Router, "route"> &
  Pick<Router, "location"> &
  Pick<Router, "params"> &
  Pick<Router, "queryParams">;

export const RouterContext = createContext<Router | null>(null);
export const RouterLocationContext = createContext<RouterLocation | null>(null);
