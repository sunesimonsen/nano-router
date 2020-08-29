import React, { useEffect } from "react";

import { Modal, Header, Body, Close } from "@zendeskgarden/react-modals";
import { Accordion } from "@zendeskgarden/react-accordions";
import { IconButton } from "@zendeskgarden/react-buttons";
import { Alert } from "@zendeskgarden/react-notifications";

import { useRouter, useParams, useLocation } from "@nano-router/react";
import { useData } from "../hooks/useData";

import { LoadingPanel } from "./LoadingPanel";

import PencilIcon from "@zendeskgarden/svg-icons/src/16/pencil-stroke.svg";

const PostsPanel = () => {
  const { userId } = useParams();
  const router = useRouter();
  const { state } = useLocation();

  const { data: posts, loading, error } = useData(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`
  );

  useEffect(() => {
    if (state === "UPDATE_SUCCESS") {
      const timer = setTimeout(() => {
        // Clear success message
        router.navigate({
          state: null,
          replace: true,
        });
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [router, state]);

  if (error) throw error;
  if (loading) return <LoadingPanel />;

  const editPost = (postId) => {
    router.navigate({
      route: "posts/edit",
      params: { postId },
    });
  };

  return (
    <>
      {state === "UPDATE_SUCCESS" && (
        <Alert type="success">Post succesfully created</Alert>
      )}
      <Accordion isBare level={3}>
        {posts.map(({ id, title, body }) => (
          <Accordion.Section key={id}>
            <Accordion.Header>
              <Accordion.Label>{title}</Accordion.Label>
              <IconButton onClick={() => editPost(id)}>
                <PencilIcon />
              </IconButton>
            </Accordion.Header>
            <Accordion.Panel>{body}</Accordion.Panel>
          </Accordion.Section>
        ))}
      </Accordion>
    </>
  );
};

export const PostsModal = () => {
  const { userId } = useParams();
  const router = useRouter();

  const onClose = () => {
    router.navigate({
      route: "users/view",
      params: { userId },
      replace: true,
    });
  };

  return (
    <Modal isLarge isAnimated={false} onClose={onClose}>
      <Header>Posts</Header>
      <Body>
        <PostsPanel />
      </Body>
      <Close aria-label="Close modal" />
    </Modal>
  );
};
