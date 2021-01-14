import { useState, useEffect } from "react";
import { useRouter } from "./useRouter.js";

const inactiveConfirmation = { isVisible: false };

export const usePrompt = (isActive) => {
  const router = useRouter();

  const [confirmation, setConfirmation] = useState(inactiveConfirmation);

  useEffect(() => {
    if (isActive) {
      const unblock = router.block((tx) => {
        const state = tx.location.state;
        if (state && state.skipPrompt) {
          unblock();
          tx.retry();
        } else {
          setConfirmation({
            isVisible: true,
            reject: () => {
              setConfirmation(inactiveConfirmation);
            },
            approve: () => {
              unblock();
              tx.retry();
              setConfirmation(inactiveConfirmation);
            },
          });
        }
      });

      setConfirmation(inactiveConfirmation);

      return () => {
        unblock();
      };
    } else {
      setConfirmation(inactiveConfirmation);
    }
  }, [router, isActive]);

  return confirmation;
};
