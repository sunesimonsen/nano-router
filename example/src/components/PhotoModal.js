import React from "react";

import { Modal, Header, Body, Close } from "@zendeskgarden/react-modals";

import { useRouter, useParams, useLocation } from "@nano-router/react";
import { useData } from "../hooks/useData";

import { LoadingPanel } from "./LoadingPanel";

export const PhotoModal = () => {
  const { state } = useLocation();
  const { userId, photoId } = useParams();
  const router = useRouter();

  const { data, loading, error } = useData(
    `https://jsonplaceholder.typicode.com/photos/${photoId}`,
    state
  );

  if (error) throw error;

  const onClose = () => {
    router.navigate({
      route: "users/photos",
      params: { userId },
      replace: true,
    });
  };

  const { url, alt } = state || data || {};

  return (
    <Modal onClose={onClose}>
      <Header>Photo</Header>
      <Body>{loading ? <LoadingPanel /> : <img src={url} alt={alt} />}</Body>
      <Close aria-label="Close modal" />
    </Modal>
  );
};
