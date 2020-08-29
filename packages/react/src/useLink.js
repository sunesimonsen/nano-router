import { useCallback, useMemo } from "react";
import { useRouter } from "./useRouter";

const shouldNavigate = (e) =>
  !e.defaultPrevented &&
  !e.button &&
  !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

export const useLink = (routeNameOrOptions) => {
  const router = useRouter();

  const href = useMemo(() => router.createUrl(routeNameOrOptions), [
    router,
    routeNameOrOptions,
  ]);

  const onClick = useCallback(
    (e) => {
      if (shouldNavigate(e)) {
        e.preventDefault();
        router.navigate(routeNameOrOptions);
      }
    },
    [router, routeNameOrOptions]
  );

  return { href, onClick };
};
