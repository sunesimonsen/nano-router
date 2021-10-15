import { Routes, Route, ExternalRoute } from "@nano-router/react";

export const routes = new Routes(
  new Route("posts/edit", "/posts/:postId"),
  new Route("users/view", "/users/:userId"),
  new Route("users/posts", "/users/:userId/posts"),
  new Route("users/photos", "/users/:userId/photos"),
  new Route("users/photos/view", "/users/:userId/photos/:photoId"),
  new Route("users/todos", "/users/:userId/todos"),
  new Route("users", "/"),
  new ExternalRoute(
    "github",
    "https://github.com/sunesimonsen/nano-router/tree/master"
  ),
  new ExternalRoute(
    "github/example",
    "https://github.com/sunesimonsen/nano-router/tree/master/example"
  )
);
