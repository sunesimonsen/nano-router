import React, { useEffect } from "react";

import { useRouter, useRouteName } from "@nano-router/react";

import { UsersView } from "./UsersView";
import { PhotosView } from "./PhotosView";
import { PostEditView } from "./PostEditView";

import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  display: flex;
`;

export const RootView = () => {
  const routeName = useRouteName();
  const router = useRouter();

  useEffect(() => {
    if (routeName === "default") {
      router.navigate({ route: "users", replace: true });
    }
  }, [router, routeName]);

  if (routeName === "posts/edit") {
    return <PostEditView />;
  }

  if (routeName.startsWith("users/photos")) {
    return <PhotosView />;
  }

  if (routeName.startsWith("users")) {
    return (
      <Container>
        <UsersView />
      </Container>
    );
  }

  return null; // redirecting to users
};
