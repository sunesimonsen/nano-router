import { useEffect } from "react";
import { useRouter } from "./useRouter.js";
import { NavigateOptions } from "@nano-router/router";

export const Navigate: React.FC<NavigateOptions> = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.navigate(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
