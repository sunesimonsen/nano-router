import { useEffect } from "react";
import { useRouter } from "./useRouter.js";

export const Navigate = (props) => {
  const { navigate } = useRouter();

  useEffect(() => {
    navigate(props);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
