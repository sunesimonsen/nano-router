import React from "react";

import {
  Table,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@zendeskgarden/react-tables";

import { useRouter } from "@nano-router/react";

import { LoadingPanel } from "./LoadingPanel";

import { useData } from "../hooks/useData";

import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const UsersTable = () => {
  const router = useRouter();
  const {
    data: users,
    loading,
    error,
  } = useData("https://jsonplaceholder.typicode.com/users");

  if (error) throw error;

  const showUser = (userId) => {
    router.navigate({
      route: "users/view",
      params: { userId },
    });
  };

  return (
    <Container>
      <Table>
        <Head>
          <HeaderRow>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Company</HeaderCell>
          </HeaderRow>
        </Head>
        <Body>
          {(users || []).map(({ id, name, email, phone, company }) => (
            <Row key={id} onClick={() => showUser(id)}>
              <Cell>{name}</Cell>
              <Cell>{company.name}</Cell>
            </Row>
          ))}
        </Body>
      </Table>
      {loading && <LoadingPanel />}
    </Container>
  );
};
