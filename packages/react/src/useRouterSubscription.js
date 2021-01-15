import { useContext } from "react";
import { RouterLocationContext } from "./RouterContext.js";

export const useRouterSubscription = () => useContext(RouterLocationContext);
