import { useState, useEffect } from "react";
import { useRouter } from "./useRouter";

export const usePrompt = (isActive) => {
  const router = useRouter();
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (isActive) {
      const unblock = router.block((tx) => {
        console.log("blocked");
        setConfirm(() => () => {
          console.log("confirm");
          unblock();
          tx.retry();
        });
      });

      return () => {
        unblock();
      };
    } else {
      setConfirm(null);
    }
  }, [router, isActive]);

  return confirm;
};
