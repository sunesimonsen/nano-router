import { useContext } from "react";
import { RouterLocationContext } from "./RouterContext";

export const useRouterSubscription = () => useContext(RouterLocationContext);
