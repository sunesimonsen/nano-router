import { useState } from "react";
import { useRouter } from "./useRouter";
import { useRouterSubscription } from "./useRouterSubscription";

export const useParams = () => {
  const router = useRouter();
  const [params, setParams] = useState(router.params);

  useRouterSubscription(() => {
    setParams(router.params);
  });

  return params;
};
