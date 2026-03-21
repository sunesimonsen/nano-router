import { ComponentChildren } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { RouterLocationContext } from "./RouterContext.js";
import { useRouter } from "./useRouter.js";

type RouterSubscriptionProps = {
  children: ComponentChildren;
};

export const RouterSubscription = ({ children }: RouterSubscriptionProps) => {
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
