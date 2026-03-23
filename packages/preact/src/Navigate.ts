import { useEffect } from "preact/hooks";
import { useRouter } from "./useRouter.js";
import { NavigateOptions } from "@nano-router/router";

export const Navigate = (props: NavigateOptions) => {
  const router = useRouter();

  useEffect(() => {
    router.navigate(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
