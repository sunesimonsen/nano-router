import { useRef, useMemo, useState, useEffect } from "react";
import { useRouter } from "./useRouter";

export const usePrompt = (isActive) => {
  const router = useRouter();
  const isRemovedRef = useRef(false);

  const inVisibleConfirmation = useMemo(
    () => ({
      isVisible: false,
      remove: () => {
        isRemovedRef.current = true;
      },
    }),
    []
  );

  const [confirmation, setConfirmation] = useState(inVisibleConfirmation);

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
              setConfirmation(inVisibleConfirmation);
            },
            approve: () => {
              unblock();
              tx.retry();
              isRemovedRef.current = true;
              setConfirmation(inVisibleConfirmation);
            },
          });
        }
      });

      return () => {
        unblock();
      };
    } else {
      setConfirmation(inVisibleConfirmation);
    }
  }, [router, isActive, inVisibleConfirmation]);

  return confirmation;
};
