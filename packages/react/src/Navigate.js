import { useEffect } from "react";
import { useRouter } from "./useRouter.js";

export const Navigate = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.navigate(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
