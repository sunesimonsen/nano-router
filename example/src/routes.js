import { Routes, Route } from "@nano-router/react";

export const routes = new Routes(
  new Route("posts/edit", "/nano-router/posts/:postId"),
  new Route("users/view", "/nano-router/users/:userId"),
  new Route("users/posts", "/nano-router/users/:userId/posts"),
  new Route("users/photos", "/nano-router/users/:userId/photos"),
  new Route("users/photos/view", "/nano-router/users/:userId/photos/:photoId"),
  new Route("users/todos", "/nano-router/users/:userId/todos"),
  new Route("users", "/nano-router")
);
