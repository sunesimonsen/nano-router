# @nano-router/react - [API](./API.md)

This package provides [React hooks](https://reactjs.org/docs/hooks-intro.html)
for the [nano-router](../router).

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
npm install @nano-router/history @nano-router/react
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
import { createBrowserHistory } from "@nano-router/history";

import { routes } from "./routes";
import { RootView } from "./RootView";

const App = () => {
  const history = useMemo(() => createBrowserHistory(), []);

  return (
    <Router history={history} routes={routes}>
      <RootView />
    </Router>
  );
};

render(<App />, document.getElementById("app"));
```

### Switch on the route name

```js
import React, { useEffect } from "react";
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
      return <Navigate route="posts" replace={true} />;
  }
};
```

### Use routing information in your views

```js
import React, { useState } from "react";
import { router, useParams } from "@nano-router/react";
import { savePost } from "./postService";

const PostEdit = () => {
  const { id } = useParam();
  const router = useRouter();
  const [body, setBody] = useState("");

  const onSave = () => {
    await savePost({ id, body });

    router.navigate({
      route: "posts",
      state: { type: "notification", message: "POST_CREATED_SUCCESS" },
    });
  };

  return (
    <form>
      <label>Post</label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      <button onClick={onSave}>Save</button>
    </form>
  );
};
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
