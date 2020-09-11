# @nano-router/routes - [API](./API.md)

This package provides routing configuration for the [@nano-router/router](../router).

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
  - [Configure your routes](#configure-your-routes)
  - [Match a path against the routes](#match-a-path-against-the-routes)
  - [Find a route by name and stringify it](#find-a-route-by-name-and-stringify-it)

<!-- tocstop -->

## Instalation

```sh
npm install @nano-router/routes
```

## Usage

### Configure your routes

```js
import { Routes, Route } from "@nano-router/routes";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts")
);
```

### Match a path against the routes

```js
const match = routes.match("/posts/42");

expect(match, "to equal", {
  name: "posts/edit",
  params: { id: "42" },
});
```

### Find a route by name and stringify it

```js
const route = routes.byName("posts/edit");

expect(route.stringify({ id: "666" }), "to equal", "/posts/666");
```
