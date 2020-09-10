import React, { useMemo, useRef } from "react";
import { render } from "react-dom";
import { Router } from "@nano-router/react";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@zendeskgarden/react-theming";

import { routes } from "./routes.js";
import { RootView } from "./components/RootView";
import { ErrorBoundary } from "./components/ErrorBoundary";

import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  display: flex;
`;

export const App = () => {
  const rootViewRef = useRef();
  const history = useMemo(() => createBrowserHistory());

  return (
    <Container ref={rootViewRef}>
      <Router history={history} routes={routes}>
        <ThemeProvider focusVisibleRef={rootViewRef}>
          <ErrorBoundary>
            <RootView />
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </Container>
  );
};

render(<App />, document.getElementById("app"));
