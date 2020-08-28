import { useEffect } from "react";
import { useRouter } from "./useRouter";

export const useRouterSubscription = (listener) => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = router.listen(listener);

    return () => {
      unsubscribe();
    };
  }, [router, listener]);
};
