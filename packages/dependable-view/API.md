# API @nano-router/dependable-view

<!-- toc -->

- [Route](#route)
- [Routes](#routes)
- [Router](#router)
- [Routing](#routing)
- [Link](#link)

<!-- tocstop -->

## Route

See [@nano-router/routes](../routes/API.md#Route).

## Routes

See [@nano-router/routes](../routes/API.md#Routes).

## Router

See [@nano-router/router](../router/API.md#router).

## Routing

The main routing container that is listening for navigation events.

It takes a [router](../router/Readme.md) instance.

Creating a router for the browser history:

```js
import { view } from "@dependable/view";
import { Router, Routing } from "@nano-router/dependable-view";
import { createBrowserHistory } from "@nano-router/history";

const history = createBrowserHistory();
const router = new Router({ history, routes });

class App {
  render() {
    return html` <${Routing} router=${router}> ... <//> `;
  }
}
```

Creating a router for a memory history useful for testing:

```js
import { view } from "@dependable/view";
import { Router, Routing } from "@nano-router/dependable-view";
import { createMemoryHistory } from "@nano-router/history";

const history = createMemoryHistory();
const router = new Router({ history, routes });

class App {
  render() {
    return html` <${Routing} router=${router}> ... <//> `;
  }
}
```

## Link

A link component that uses the routes to set the `href`.

```js
import { view } from "@dependable/view";
import { Link } from "@nano-router/dependable-view";

class CreatePostLink {
  render() {
    return html` <${Link} route="posts/new">Create<//> `;
  }
}
```

You can provide anything that is accepted by the [router.navigate](https://github.com/sunesimonsen/nano-router/blob/master/packages/router/API.md#navigate)

```js
import { view } from "@dependable/view";
import { Link } from "@nano-router/dependable-view";

class EditPostLink {
  render() {
    return html`
      <${Link}
        route="posts/edit"
        params=${{ id: 42 }}
        queryParams=${{ showSettings: true }}
      >
        Edit
      <//>
    `;
  }
}
```
