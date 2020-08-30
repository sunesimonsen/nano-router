import { useRef, useState, useEffect } from "react";
import { useRouter } from "./useRouter";

export const usePrompt = (isActive) => {
  const router = useRouter();
  const isRemovedRef = useRef(false);

  const [confirmation, setConfirmation] = useState({
    isVisible: false,
    remove: () => {},
  });

  useEffect(() => {
    if (isActive && !isRemovedRef.current) {
      const unblock = router.block((tx) => {
        if (isRemovedRef.current) {
          unblock();
          tx.retry();
        } else {
          setConfirmation({
            isVisible: true,
            reject: () => {
              setConfirmation(null);
            },
            approve: () => {
              unblock();
              tx.retry();
              setConfirmation(null);
            },
          });
        }
      });

      setConfirmation({
        isVisible: false,
        remove: () => {
          unblock();
        },
      });

      return () => {
        unblock();
      };
    } else {
      setConfirmation({
        isVisible: false,
        remove: () => {
          isRemovedRef.current = true;
        },
      });
    }
  }, [router, isActive]);

  return confirmation;
};
