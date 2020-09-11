# @nano-router/routes - [API](./API.md)

<!-- toc -->

- [Usage](#usage)

<!-- tocstop -->

## Usage

```js
import { Routes, Route } from "@nano-router/routes";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts")
);
```
