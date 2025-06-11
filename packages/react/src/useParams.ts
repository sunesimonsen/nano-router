import { useRouterSubscription } from "./useRouterSubscription.js";

export const useParams = () => useRouterSubscription().params;
