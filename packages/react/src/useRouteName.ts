import { useRouterSubscription } from "./useRouterSubscription";

export const useRouteName = () => useRouterSubscription().route;
