import React from "react";
import { useLink, useRouteName } from "@nano-router/react";

import { LoadingPanel } from "./LoadingPanel";

import { useData } from "../hooks/useData";
import { Well, Title } from "@zendeskgarden/react-notifications";
import { Tiles } from "@zendeskgarden/react-forms";
import { PostsModal } from "./PostsModal";

import ImagesIcon from "@zendeskgarden/svg-icons/src/26/file-image.svg";
import TodosIcon from "@zendeskgarden/svg-icons/src/26/file-pdf.svg";
import PostsIcon from "@zendeskgarden/svg-icons/src/26/file-spreadsheet.svg";

import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  padding: 40px;
`;

const DataList = styled.dl`
  display: grid;
  grid-template-columns: 1fr 3fr;
`;

const UserResources = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  margin-top: 40px;
`;

export const UserDetails = ({ userId }) => {
  const routeName = useRouteName();
  const showPosts = useLink({
    route: "users/posts",
    params: { userId },
    replace: true,
  });
  const showTodos = useLink({ route: "users/todos", params: { userId } });
  const showPhotos = useLink({ route: "users/photos", params: { userId } });

  const { data: user, loading, error } = useData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (error) throw error;
  if (loading) return <LoadingPanel />;

  return (
    <Container>
      <Well>
        <Title>{user.name}</Title>
        <DataList>
          <dt>Email</dt>
          <dd>{user.email}</dd>

          <dt>Phone</dt>
          <dd>{user.phone}</dd>

          <dt>Company</dt>
          <dd>{user.company.name}</dd>

          <dt>City</dt>
          <dd>{user.address.city}</dd>

          <dt>Street</dt>
          <dd>{user.address.street}</dd>

          <dt>Street</dt>
          <dd>{user.address.street}</dd>
        </DataList>

        <Tiles name="user-resources" aria-label="User resources">
          <UserResources>
            <a {...showPhotos}>
              <Tiles.Tile value="photos">
                <Tiles.Icon>
                  <ImagesIcon />
                </Tiles.Icon>
                <Tiles.Label>Photos</Tiles.Label>
              </Tiles.Tile>
            </a>
            <a {...showTodos}>
              <Tiles.Tile value="todos">
                <Tiles.Icon>
                  <TodosIcon />
                </Tiles.Icon>
                <Tiles.Label>Todos</Tiles.Label>
              </Tiles.Tile>
            </a>
            <a {...showPosts}>
              <Tiles.Tile value="posts">
                <Tiles.Icon>
                  <PostsIcon />
                </Tiles.Icon>
                <Tiles.Label>Posts</Tiles.Label>
              </Tiles.Tile>
            </a>
          </UserResources>
        </Tiles>
      </Well>
      {routeName === "users/posts" && <PostsModal />}
    </Container>
  );
};
