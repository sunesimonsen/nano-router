import React, { ReactNode, useLayoutEffect, useState } from "react";
import { RouterLocationContext } from "./RouterContext";
import { useRouter } from "./useRouter";

type RouterSubscriptionProps = {
  children: ReactNode;
};

export const RouterSubscription: React.FC<RouterSubscriptionProps> = ({
  children,
}) => {
  const router = useRouter();
  const [match, setMatch] = useState({
    route: router.route,
    location: router.location,
    params: router.params,
    queryParams: router.queryParams,
  });

  useLayoutEffect(() => {
    const unsubscribe = router.listen(() => {
      setMatch({
        route: router.route,
        location: router.location,
        params: router.params,
        queryParams: router.queryParams,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return (
    <RouterLocationContext.Provider value={match}>
      {children}
    </RouterLocationContext.Provider>
  );
};
