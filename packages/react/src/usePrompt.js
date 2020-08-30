import { useState, useEffect } from "react";
import { useRouter } from "./useRouter";

export const usePrompt = (isActive) => {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (isActive) {
      const unblock = router.block((tx) => {
        setConfirmation({
          reject: () => {
            setConfirmation(null);
          },
          approve: () => {
            unblock();
            tx.retry();
            setConfirmation(null);
          },
        });
      });

      return () => {
        unblock();
      };
    } else {
      setConfirmation(null);
    }
  }, [router, isActive]);

  return confirmation;
};
