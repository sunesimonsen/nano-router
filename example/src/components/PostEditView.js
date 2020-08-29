import React, { useState } from "react";
import { useData } from "../hooks/useData";
import { useParams, useRouter, usePrompt } from "@nano-router/react";

import { Field, Input, Label, Textarea } from "@zendeskgarden/react-forms";
import { Button } from "@zendeskgarden/react-buttons";

import {
  Modal,
  Header,
  Body,
  Footer,
  FooterItem,
} from "@zendeskgarden/react-modals";

import styled from "styled-components";

const Container = styled.div`
  display: block;
  padding: 40px;
  flex: 1;
`;

const Form = styled.div`
  display: grid;
  grid-gap: 20px;
`;

const ActionBar = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  justify-self: end;
}`;

const Confirm = ({ confirmation }) => (
  <Modal>
    <Header isDanger>Are you sure?</Header>
    <Body>Are you sure you want to discard your unsaved changes?</Body>
    <Footer>
      <FooterItem>
        <Button onClick={confirmation.reject} isBasic>
          Cancel
        </Button>
      </FooterItem>
      <FooterItem>
        <Button onClick={confirmation.approve} isPrimary isDanger>
          Confirm
        </Button>
      </FooterItem>
    </Footer>
  </Modal>
);

const PostForm = ({ post }) => {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const isDirty = title !== post.title || body !== post.body;
  const confirmation = usePrompt(isDirty);

  const onCancel = () => {
    router.navigate({
      route: "users/posts",
      params: { userId: post.userId },
    });
  };

  const onUpdate = async () => {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        userId: Number(post.userId),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    confirmation.remove();

    router.navigate({
      route: "users/posts",
      params: { userId: post.userId },
      state: "UPDATE_SUCCESS",
    });
  };

  return (
    <Form>
      <Field>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field>
        <Label>Body</Label>
        <Textarea
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </Field>
      <ActionBar>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onUpdate} isPrimary>
          Update
        </Button>
      </ActionBar>
      {confirmation.isVisible && <Confirm confirmation={confirmation} />}
    </Form>
  );
};

export const PostEditView = () => {
  const { postId } = useParams();

  const { data: post, loading, error } = useData(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );

  if (error) throw error;
  if (loading) return null;

  return (
    <Container>
      <PostForm post={post} />
    </Container>
  );
};
