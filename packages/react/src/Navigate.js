import { useEffect } from "react";
import { useRouter } from "./useRouter.js";

export const Navigate = (props) => {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(props);
  }, [navigate, props]);

  return null;
};
