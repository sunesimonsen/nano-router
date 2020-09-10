import React, { useEffect, useMemo } from "react"; import { createMemoryHistory } from 'history';
import { RouterContext } from "./RouterContext";
import { Router as NanoRouter } from "@nano-router/router";

export const Router = ({ routes, history, children }) => {
  const router = useMemo(() => new NanoRouter({ routes, history }), [
    routes,
    history,
  ]);

  useEffect(() => {
    const unsubscribe = router.listen();

    return () => {
      unsubscribe();
    };
  }, [router]);

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
};
