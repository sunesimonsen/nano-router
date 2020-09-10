# Nano Router

A framework agnostic minimalistic router with a focus on named routes.

This package is meant as a basis for creating framework specific routers like the [React integration](../react).

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

## API

### Fields

#### history

The [history](../history) instance given in the constructor.

```js
router.history.back();
```

#### location

The current [history](../history) location.

```js
const { pathname, search, hash } = router.location;
```

#### params

The URL parameters for the current route.

If we are on the edit route, we would be able to get the `id` like this:

```js
const { id } = router.params;
```

#### queryParams

The URL query parameters for the current route.

If we are on a route like this `/posts/new?showSettings=true`

```js
const { showSettings } = router.queryParams;

if (showSettings === "true") {
  // Show the settings drawer
}
```

#### route

The current route name.

We can use this for switching on the route:

```js
switch (route.route) {
  case "posts/new":
    // show the new view
    break;
  case "posts/edit":
    // show the new view
    break;
  case "posts":
    // show list view
    break;
  default:
    //redirect to the list view
    router.navigate({ route: "posts", replace: true });
}
```

### Methods

#### constructor

The constructor takes two arguments, the routes and a history.

The routes can be constructed the following way:

```js
import { Routes, Route } from "@nano-router/router";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts")
);
```

Where every route gets a name and a path pattern.

The first route where the path pattern matches the current location gets chosen.
So if the path name is `/posts/42` then the `posts/edit` route will be chosen.

To create the history object, you use the [@nano-router/history](../history) to create either an browser history object or a memory history object used for testing:

```js
import {
  createBrowserHistory,
  createMemoryHistory,
} from "@nano-router/history";

const browserHistory = createBrowserHistory();
// or
const memoryHistory = createMemoryHistory();
```

Now we can create the router:

```js
const router = new Router({ routes, history: browserHistory });
```

#### back

Moves the router one entry backwards in the history:

```js
router.back();
```

#### block

Blocks the navigation away from the current route with a callback.
This is useful to block navigation if you have dirty state that you would
otherwise just loose.

```js
// Block navigation and register a callback that
// fires when a navigation attempt is blocked.
const unblock = router.block((tx) => {
  // Navigation was blocked! Let's show a confirmation dialog
  // so the user can decide if they actually want to navigate
  // away and discard changes they've made in the current page.
  let url = tx.location.pathname;
  if (window.confirm(`Are you sure you want to go to ${url}?`)) {
    // Unblock the navigation.
    unblock();

    // Retry the transition.
    tx.retry();
  }
});
```

See
[history.block(...)](https://github.com/ReactTraining/history/blob/master/docs/blocking-transitions.md)
for more information.

#### createUrl

Create a root relative URL from a named route.

Parameters:

- route: route name
- params: route parameters
- queryParams: URL query parameters
- hash: URL fragment

If only a string is given, it will be used as the route name.

Notice that all of these parameters are optional and will use the value from the
current route.

The following snippet will create the URL `/posts/42?showSettings=true#settings`

```js
const editPostUrl = router.createUrl({
  route: "posts/edit",
  params: { id: 42 },
  queryParams: { showSettings: true },
  hash: "#settings",
});
```

To create an URL to the new route:

```js
const newPostUrl = router.createUrl("posts/new");
```

#### forward

Moves the router one entry forward in the history:

```js
router.forward();
```

#### go

Moves the router `delta` entries forward or backwards in the history:

```js
router.go(-3); // backwards 3 entries
// or
router.go(2); // forward 2 entries
```

If the navigation is not possible it is ignored.

#### listen

Listen for history changes:

```js
const unsubscribe = router.listen(() => {
  // history changed and all values on the router has been updated
});
```

#### navigate

Navigate a named route.

Parameters:

- route: route name
- params: route parameters
- queryParams: URL query parameters
- hash: URL fragment
- state: the history state object
- replace: true if the current location should be replaced

If only a string is given, it will be used as the route name.

Notice `route`, `params`, `queryParams` and `hash` will default to use the value
from the current route and `replace` default to `false`.

The following snippet will navigate to the URL `/posts/42?showSettings=true#settings`:

```js
router.navigate({
  route: "posts/edit",
  params: { id: 42 },
  queryParams: { showSettings: true },
  hash: "#settings",
});
```

To navigate to the new route:

```js
const newPostUrl = router.navigate("posts/new");
```

You can set state for a given location the following way:

```js
router.navigate({
  route: "posts",
  state: {
    type: "flash",
    message: "Post was succesfully created",
  },
});
```

The state default to `null` and can be any kind of value.

The state is available on the route after navigation:

```js
const state = route.history.state;

if (state && state.type === "flash") {
  showFlash(state.message);
}
```
