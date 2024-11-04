import { useContext } from "react";
import { RouterContext } from "./RouterContext";
import { Router } from "@nano-router/router";

export const useRouter = (): Router => {
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error("No router has been provided");
  }

  return router;
};
