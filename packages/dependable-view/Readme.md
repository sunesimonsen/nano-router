# @nano-router/dependable-view - [API](./API.md)

This package provides
[@dependable/view](https://github.com/sunesimonsen/dependable/tree/main/packages/view)
integration for the [nano-router](../router).

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  - [Setup your routes](#setup-your-routes)
  - [Add the router to your application](#add-the-router-to-your-application)
  - [Switch on the route name](#switch-on-the-route-name)
  - [Use routing information in your views](#use-routing-information-in-your-views)
- [MIT License](#mit-license)

<!-- tocstop -->

## Installation

```sh
npm install @nano-router/history @nano-router/dependable-view
```

## Usage

### Setup your routes

```js
import { Routes, Route } from "@nano-router/dependable-view";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts")
);
```

See [@nano-router/routes](../routes/) for more information about the route
configuration.

### Add the router to your application

```js
import { html, render } from "@dependable/view";
import { Store } from "@dependable/store";
import { Router } from "@nano-router/dependable-view";
import { createBrowserHistory } from "@nano-router/history";

import { routes } from "./routes";
import { RootView } from "./RootView";

const store = new Store();
const history = createBrowserHistory();
const router = new Router({ routes, history });

class App {
  render() {
    return html`
      <Routing router=${router}>
        <${RootView} />
      </Routing>
    `;
  }
}

render(html`<${App} />`, store, document.getElementById("app"));
```

### Switch on the route name

```js
import { html } from "@dependable/view";
import { PostNew } from "./PostNew";
import { PostEdit } from "./PostEdit";
import { PostList } from "./PostList";

const views = {
  "posts/new": html`<${PostNew} />`,
  "posts/edit": html`<${PostEdit} />`,
  posts: html`<${PostList} />`,
};

export class RootView {
  data() {
    return { route: "routing.route" };
  }

  didMount() {
    if (!views[this.props.route]) {
      this.context.router.navigate({
        route: "posts",
        replace: true,
      });
    }
  }

  render({ route }, { router }) {
    return views[route] || views.posts;
  }
}
```

### Use routing information in your views

The [@depository](https://github.com/sunesimonsen/depository) actions can read the routing information from the store, so you don't need to provide that to the actions. But you might need to read the routing for some other purpose, you can find the state in the store under `routing`.

```js
import { html } from "@dependable/view";
import { Link } from "@nano-router/dependable-view";
import { savePost, updateBody } from './model.js'

export class PostEdit {
  data() {
    id: 'routing.params.id',
    body: 'global.editing.body'
  }

  constructor() {
    this.onSave = (e) => {
      await dispatch(savePost())

      this.context.router.navigate({
        route: 'posts',
        state: { type: 'notification', message: 'POST_CREATED_SUCCESS' }
      }))
    }

    this.updateBody = e => {
      this.dispatch(updateBody(e.target.value))
    }
  }

  render({ id, body }) {
    return html`
      <form>
        <label>Post ${id}</label>
        <textarea value={body} onChange={this.updateBody}/>
        <button onClick={this.onSave}>Save</button>
      </form>
      <${Link} route="posts">Posts<//>
    `
  }
}
```

## MIT License

Copyright (c) 2022 Sune Simonsen <mailto:sune@we-knowhow.dk>

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
