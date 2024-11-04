import { useRouterSubscription } from "./useRouterSubscription";

export const useParams = () => useRouterSubscription().params;
