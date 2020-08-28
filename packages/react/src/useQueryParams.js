import { useState } from "react";
import { useRouter } from "./useRouter";
import { useRouterSubscription } from "./useRouterSubscription";

export const useQueryParams = () => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState(router.queryParams);

  useRouterSubscription(() => {
    setQueryParams(router.queryParams);
  });

  return queryParams;
};
