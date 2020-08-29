import React from "react";
import { LG } from "@zendeskgarden/react-typography";
import { Well } from "@zendeskgarden/react-notifications";

import { useParams } from "@nano-router/react";

import { UsersTable } from "./UsersTable";
import { UserDetails } from "./UserDetails";

import styled from "styled-components";

const Container = styled.div`
  padding: 20px 20px;
  display: grid;
  grid-template-columns: 2fr 3fr;
`;

const UsersTablePanel = styled.div`
  display: flex;
`;

const UserDetailsPanel = styled.div`
  display: flex;
`;

const MessageContainer = styled.div`
  padding: 20px;
  flex: 1;
`;

const Message = styled.div`
  flex: 1;
  padding: 40px;
  text-align: center;
`;

const NothingSelected = () => (
  <MessageContainer>
    <Well isRecessed>
      <Message>
        <LG>Select a user</LG>
      </Message>
    </Well>
  </MessageContainer>
);

export const UsersView = () => {
  const { userId } = useParams();

  return (
    <Container>
      <UsersTablePanel>
        <UsersTable />
      </UsersTablePanel>
      <UserDetailsPanel>
        {userId ? <UserDetails userId={userId} /> : <NothingSelected />}
      </UserDetailsPanel>
    </Container>
  );
};
