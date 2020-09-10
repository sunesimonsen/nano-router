# A React integration for nano-router

This package provides [React hooks](https://reactjs.org/docs/hooks-intro.html)
for the [nano-router](../router).

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
}

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

## API

### Router

A router provider that takes a [history](https://www.npmjs.com/package/history) instance.

Creating a router for the browser history:

```js
import React, { useMemo } from 'react'
import { Router } from "@nano-router/react";

const App = () => {
  const history = useMemo(() => createBrowserHistory());

  return (
    <Router history={history} routes={routes}>
    ...
    </Router>
  );
}
```

Creating a router for a memory history useful for testing:

```js
import React, { useMemo } from 'react'
import { Router } from "@nano-router/react";

const App = () => {
  const history = useMemo(() => createMemoryHistory({
    initialEntries: ['/posts']
  }));

  return (
    <Router history={history} routes={routes}>
    ...
    </Router>
  );
}
```

### useLink

A hook for getting link props for a given route.

Parameters:

- route: route name
- params: route parameters
- queryParams: URL query parameters
- hash: URL fragment

If only a string is given, it will be used as the route name.

Notice that all of these parameters are optional and will use the value from the
current route.

```js
import { useLink } from "@nano-router/react";

const PostList = () => {
  const showNewPostView = useLink("posts/new");

  return <a {...showNewPostView}>Create</a>;
};
```

You can get more control over the destination by providing an object:

```js
const PostList = () => {
  const showEditPostView = useLink({
    route: "posts/edit",
    params: { id: 42 },
    queryParams: { showSettings: true },
  });

  return <a {...showEditPostView}>Create</a>;
};
```

### useLocation

A hook for getting the current history location:

```js
const RouteLocation = () => {
  const { pathname, hash, search, state } = useLocation();

  const url = pathname + search + hash;

  return (
    <span>
      {url} - {state || "no state"}
    </span>
  );
};
```

### useParams

A hook for getting the current route parameters:

```js
const RouteParams = () => {
  const { id } = useParams();

  return <span>{id}</span>;
};
```

### usePrompt

A hook that gives you a confirmation prompt when navigation is blocked.

This is useful to block navigation if you have dirty state that you would
otherwise just loose.

The given parameter decides if the prompt is active.

Here we block navigation if the form has dirty state.

```js
const Confirm = ({ confirmation }) => (
  <div class="modal">
    You have unsaved changes, do you want continue?
    <button onClick={confirmation.reject}>Cancel</button>
    <button onClick={confirmation.approve}>Continue</button>
  </div>
);

const Form = () => {
  const [name, setName] = useState("");
  const isDirty = name !== "";
  const confirmation = usePrompt(isDirty);

  const onChange = (e) => {
    setName(e.target.value);
  };

  const onSave = () => {
    confirmation.remove();
    router.navigate({ route: "posts" });
  };

  return (
    <form>
      <input value={name} onChange={onChange} />
      <button onClick={onSave}>Save</button>
      {confirmation.isVisible && <Confirm confirmation={confirmation} />}
    </form>
  );
};
```

### useQueryParams

A hook for getting the current query parameters:

```js
const RouteQueryParams = () => {
  const { message } = useQueryParams();

  return <span>{message}</span>;
};
```

### useRouteName

A hook for getting the current route name:

```js
const RouteName = () => {
  const routeName = useRouteName();

  return <span>{routeName}</span>;
};
```

### useRouter

A hook for getting the [router](../router) instance:

```js
const Location = () => {
  const router = useRouter();

  return <span>{router.location.pathname}</span>;
};
```

Notice getting the router doesn't subscribe to changes to the router, so your
view wont get re-rendered when the route changes. You usually use the router to navigate from an event handler.
