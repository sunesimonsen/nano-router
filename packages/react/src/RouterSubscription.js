import React, { useEffect, useState } from "react";
import { RouterLocationContext } from "./RouterContext";
import { useRouter } from "./useRouter";

export const RouterSubscription = ({ children }) => {
  const router = useRouter();
  const [match, setMatch] = useState({
    route: router.route,
    location: router.location,
    params: router.params,
    queryParams: router.queryParams,
  });

  useEffect(() => {
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
