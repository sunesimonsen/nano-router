import React, { useRef } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "@nano-router/react";
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

  return (
    <Container ref={rootViewRef}>
      <BrowserRouter routes={routes}>
        <ThemeProvider focusVisibleRef={rootViewRef}>
          <ErrorBoundary>
            <RootView />
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </Container>
  );
};

render(<App />, document.getElementById("app"));
