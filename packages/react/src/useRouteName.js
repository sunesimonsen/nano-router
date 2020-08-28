import { useState } from "react";
import { useRouter } from "./useRouter";
import { useRouterSubscription } from "./useRouterSubscription";

export const useRouteName = () => {
  const router = useRouter();
  const [routeName, setRouteName] = useState(router.route);

  useRouterSubscription(() => {
    setRouteName(router.route);
  });

  return routeName;
};
