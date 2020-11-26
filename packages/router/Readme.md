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
- [MIT License](#mit-license)

<!-- tocstop -->

## Instalation

```sh
npm install @nano-router/history @nano-router/router
```

## Usage

### Setup the history

```js
import {
  createBrowserHistory,
  createMemoryHistory,
} from "@nano-router/history";

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

## MIT License

Copyright (c) 2020 Sune Simonsen <mailto:sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
