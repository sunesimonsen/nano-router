# @nano-router/router - [API](./API.md)

A framework agnostic minimalistic router with a focus on named routes.

This package is meant as a basis for creating framework specific routers like the [React integration](../react).

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
  - [Setup the history](#setup-the-history)
  - [Setup your routes](#setup-your-routes)
  - [Create the router](#create-the-router)
  - [Listen for updates on the router](#listen-for-updates-on-the-router)
  - [navigate](#navigate)
  - [Get the current route information](#get-the-current-route-information)

<!-- tocstop -->

## Instalation

```sh
npm install @nano-router/router history
```

## Usage

### Setup the history

```js
import { createBrowserHistory, createMemoryHistory } from "history";

const browserHistory = createBrowserHistory();
// or
const memoryHistory = createMemoryHistory();
```

### Setup your routes

```js
import { Routes, Route } from "@nano-router/router";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts")
);
```

See [@nano-router/routes](../routes/) for more information about the route
configuration.

### Create the router

```js
const router = new Router({ routes, history: browserHistory });
```

### Listen for updates on the router

```js
router.listen(() => {
  // routing has been updated
});
```

See
[history.listen(...)](https://github.com/ReactTraining/history/blob/master/docs/api-reference.md#history.listen)
for more information.

### navigate

```js
router.navigate({ route: "posts/edit", params: { id: 42 } });
```

### Get the current route information

```js
const routeName = router.route;
const { pathname, hash, search, state } = router.location;
const { id } = router.params;
```
