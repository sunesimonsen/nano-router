import { MouseEvent, useCallback, useMemo } from "react";
import { useRouter } from "./useRouter";
import { NavigateOptions } from "@nano-router/router";

const shouldNavigate = (e: MouseEvent) =>
  !e.defaultPrevented &&
  !e.button &&
  !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

export const useLink = (routeNameOrOptions: string | NavigateOptions) => {
  const router = useRouter();

  const href = useMemo(
    () => router.createUrl(routeNameOrOptions),
    [router, routeNameOrOptions],
  );

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (shouldNavigate(e)) {
        e.preventDefault();
        router.navigate(routeNameOrOptions);
      }
    },
    [router, routeNameOrOptions],
  );

  const target =
    typeof routeNameOrOptions === "object" && routeNameOrOptions.target;

  if (typeof target === "string") {
    return { href, rel: "noopener", target };
  } else {
    return { href, onClick };
  }
};
