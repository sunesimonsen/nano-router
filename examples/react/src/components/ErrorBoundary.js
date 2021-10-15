import React, { useCallback } from "react";
import Resilient from "react-resilient";
import { Alert, Title } from "@zendeskgarden/react-notifications";
import styled from "styled-components";

const Container = styled.div`
  padding: 40px 80px;
`;

const FatalErrorScreen = () => (
  <Container>
    <Alert type="error">
      <Title>Something went wrong :-(</Title>
      Check the console for more details.
    </Alert>
  </Container>
);

export const ErrorBoundary = ({
  children,
  FallbackComponent = FatalErrorScreen,
}) => {
  const onError = useCallback((error) => {
    console.error(error);
  }, []);

  return (
    <Resilient FallbackComponent={FallbackComponent} onError={onError}>
      {children}
    </Resilient>
  );
};
