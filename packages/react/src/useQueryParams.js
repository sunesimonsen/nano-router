import { useRouterSubscription } from "./useRouterSubscription";

export const useQueryParams = () => useRouterSubscription().queryParams;
