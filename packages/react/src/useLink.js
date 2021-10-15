import { useCallback, useMemo } from "react";
import { useRouter } from "./useRouter.js";

const shouldNavigate = (e) =>
  !e.defaultPrevented &&
  !e.button &&
  !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

export const useLink = (routeNameOrOptions) => {
  const router = useRouter();

  const href = useMemo(
    () => router.createUrl(routeNameOrOptions),
    [router, routeNameOrOptions]
  );

  const onClick = useCallback(
    (e) => {
      if (shouldNavigate(e)) {
        e.preventDefault();
        router.navigate(routeNameOrOptions);
      }
    },
    [router, routeNameOrOptions]
  );

  const target = routeNameOrOptions.target;

  if (typeof target === "string") {
    return { href, rel: "noopener", target };
  } else {
    return { href, onClick };
  }
};
