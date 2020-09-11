# @nano-router/react - [API](./API.md)

This package provides [React hooks](https://reactjs.org/docs/hooks-intro.html)
for the [nano-router](../router).

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
  - [Setup your routes](#setup-your-routes)
  - [Add the router to your application](#add-the-router-to-your-application)
  - [Switch on the route name](#switch-on-the-route-name)
  - [Use routing information in your views](#use-routing-information-in-your-views)

<!-- tocstop -->

## Instalation

```sh
npm install @nano-router/react history
```

## Usage

### Setup your routes

```js
import { Routes, Route } from "@nano-router/react";

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
import React, { useMemo } from "react";
import { Router } from "@nano-router/react";
const browserHistory = createBrowserHistory();

import { routes } from "./routes";
import { RootView } from "./RootView";

const App = () => {
  const history = useMemo(() => createBrowserHistory());

  return (
    <Router history={history} routes={routes}>
      <RootRoute />
    </Router>
  );
};

render(<App />, document.getElementById("app"));
```

### Switch on the route name

```js
import React from "react";
import { router, useRouteName } from "@nano-router/react";
import { PostNew } from "./PostNew";
import { PostEdit } from "./PostEdit";
import { PostList } from "./PostList";

const RootView = () => {
  const router = useRouter();
  const routeName = useRouteName();

  switch (routeName) {
    case "posts/new":
      return <PostNew />;
    case "posts/edit":
      return <PostEdit />;
    case "posts":
      return <PostList />;
    default:
      router.navigate({ route: "posts", replace: true });
  }
};
```

### Use routing information in your views

```js
import React, { useState } from "react";
import { router, useParams } from "@nano-router/react"
import { savePost } from './postService'

const PostEdit = () => {
  const { id } = useParam()
  const router = useRouter()
  const [body, setBody] = useState('')

  const onSave = () => {
    await savePost({ id, body })

    router.navigate({
      route: 'posts',
      state: { type: 'notification', message: 'POST_CREATED_SUCCESS' }
    })
  }

  return (
    <form>
      <label>Post</label>
      <textarea value={body} onChange={e => setBody(e.target.value)}/>
      <button onClick={onSave}>Save</button>
    </form>
  )
}
```
