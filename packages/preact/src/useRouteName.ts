import { useRouterSubscription } from "./useRouterSubscription.js";

export const useRouteName = () => useRouterSubscription().route;
