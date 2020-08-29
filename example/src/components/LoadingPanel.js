import React from "react";
import { Spinner } from "@zendeskgarden/react-loaders";
import { PALETTE } from "@zendeskgarden/react-theming";

import { CenterContent } from "./CenterContent";

export const LoadingPanel = () => (
  <CenterContent>
    <Spinner color={PALETTE.blue[500]} delayMS={0} size="48px" />
  </CenterContent>
);
