import { useState, useEffect } from "react";
import { useRouter } from "./useRouter.js";

const inactiveConfirmation = {
  isVisible: false,
  reject: () => {},
  approve: () => {},
};

export const usePrompt = (isActive: boolean) => {
  const router = useRouter();

  const [confirmation, setConfirmation] = useState(inactiveConfirmation);

  useEffect(() => {
    if (isActive) {
      const unblock = router.block((tx) => {
        const state = tx.location.state;
        if (state && state.skipPrompt) {
          unblock();
          tx.retry?.();
        } else {
          setConfirmation({
            isVisible: true,
            reject: () => {
              setConfirmation(inactiveConfirmation);
            },
            approve: () => {
              unblock();
              tx.retry?.();
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
      return () => {};
    }
  }, [router, isActive]);

  return confirmation;
};
