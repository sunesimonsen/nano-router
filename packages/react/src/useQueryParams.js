import { useRouterSubscription } from "./useRouterSubscription.js";

export const useQueryParams = () => useRouterSubscription().queryParams;
