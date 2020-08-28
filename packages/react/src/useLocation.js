import { useState } from "react";
import { useRouter } from "./useRouter";
import { useRouterSubscription } from "./useRouterSubscription";

export const useLocation = () => {
  const router = useRouter();
  const [location, setLocation] = useState(router.location);

  useRouterSubscription(() => {
    setLocation(router.location);
  });

  return location;
};
