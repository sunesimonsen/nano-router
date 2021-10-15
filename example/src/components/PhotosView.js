import React from "react";
import { useData } from "../hooks/useData";
import { useParams, useLink } from "@nano-router/react";
import { Anchor } from "@zendeskgarden/react-buttons";
import { PhotoModal } from "./PhotoModal";

import styled from "styled-components";

const Container = styled.div`
  display: block;
  padding: 40px;
`;

const ActionBar = styled.div`
  margin-bottom: 20px;
`;

const Photos = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
`;

const Image = ({ id, thumbnailUrl, url, alt }) => {
  const { userId } = useParams();

  const showPhoto = useLink({
    route: "users/photos/view",
    params: { userId, photoId: id },
    state: { id, url, alt },
    replace: true,
  });

  return (
    <a {...showPhoto}>
      <img src={thumbnailUrl} alt={alt} />
    </a>
  );
};

export const PhotosView = () => {
  const { userId, photoId } = useParams();
  const showUser = useLink({
    route: "users/view",
    params: { userId },
  });

  const {
    data: photos,
    loading,
    error,
  } = useData(`https://jsonplaceholder.typicode.com/users/${userId}/photos`);

  if (error) throw error;
  if (loading) return null;

  return (
    <Container>
      <ActionBar>
        <Anchor {...showUser}>Back</Anchor>
      </ActionBar>
      <Photos>
        {photos.slice(0, 20).map(({ id, thumbnailUrl, url, title }) => (
          <Image
            key={id}
            id={id}
            thumbnailUrl={thumbnailUrl}
            url={url}
            alt={title}
          />
        ))}
      </Photos>
      {photoId && <PhotoModal />}
    </Container>
  );
};
