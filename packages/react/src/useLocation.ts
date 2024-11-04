import { useRouterSubscription } from "./useRouterSubscription";

export const useLocation = () => useRouterSubscription().location;
