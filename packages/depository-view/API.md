# API @nano-router/depository-view

<!-- toc -->

- [Route](#route)
- [Routes](#routes)
- [Router](#router)
- [Routing](#routing)
- [Link](#link)
- [Prompt](#prompt)

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
import { view } from "@depository/view";
import { Router, Routing } from "@nano-router/depository-view";
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
import { view } from "@depository/view";
import { Router, Routing } from "@nano-router/depository-view";
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
import { view } from "@depository/view";
import { Link } from "@nano-router/depository-view";

class CreatePostLink {
  render() {
    return html` <${Link} route="posts/new">Create<//> `;
  }
}
```

You can provide anything that is accepted by the [router.navigate](https://github.com/sunesimonsen/nano-router/blob/master/packages/router/API.md#navigate)

```js
import { view } from "@depository/view";
import { Link } from "@nano-router/depository-view";

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

## Prompt

A component that will block navigation when its `active` is true. When the navigation is blocked, it will render its children which will allow the user to approve or reject the navigation blocking.

This is useful to block navigation if you have dirty state that you would otherwise just loose.

Here we block navigation if the form has dirty state.

```js
import { html } from "@depository/view";

class Confirm {
  constructor() {
    this.onApprove = (e) => {
      e.target.dispatchEvent(
        new CustomEvent("Approve", { bubbles: true, cancelable: true }),
      );
    };

    this.onReject = (e) => {
      e.target.dispatchEvent(
        new CustomEvent("Reject", { bubbles: true, cancelable: true }),
      );
    };
  }

  render() {
    return html`
      <div class="modal">
        You have unsaved changes, do you want continue?
        <button onClick=${this.onReject}>Cancel</button>
        <button onClick=${this.onApprove}>Continue</button>
      </div>
    `;
  }
}

const updateName = (name) => ({
  name: "Update name",
  payload: { "global.editing.name": name },
});

class Form {
  data() {
    return { name: "global.editing.name" };
  }

  constructor() {
    this.onSave = () => {
      // Save
      // Success
      this.router.navigate({
        route: "posts",
        state: { skipPrompt: true },
      });
    };

    this.onChange = (e) => {
      this.dispatch(updateName(e.target.value));
    };
  }

  render({ name }) {
    const onSave = () => {
      router.navigate({
        route: "posts",
        state: { skipPrompt: true }, // Skipping all prompts
      });
    };

    return html`
      <form>
        <input value=${name} onChange=${this.onChange} />
        <button onClick=${this.onSave}>Save</button>
        <${Prompt} active=${name}><${Confirm} /><//>
      </form>
    `;
  }
}
```
