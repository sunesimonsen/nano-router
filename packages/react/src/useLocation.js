import { useRouterSubscription } from "./useRouterSubscription.js";

export const useLocation = () => useRouterSubscription().location;
