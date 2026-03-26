# @nano-router/preact - [API](./API.md)

This package provides [Preact hooks](https://preactjs.com/guide/v10/hooks/)
for the [nano-router](../router).

## Installation

```sh
npm install @nano-router/history @nano-router/preact
```

## Usage

### Setup your routes

```js
import { Routes, Route } from "@nano-router/preact";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts"),
);
```

See [@nano-router/routes](../routes/) for more information about the route
configuration.

### Add the router to your application

```js
import { useMemo } from "preact/hooks";
import { Router } from "@nano-router/preact";
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
import { useRouter, useRouteName } from "@nano-router/preact";
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
import { useState } from "preact/hooks";
import { useParams, useRouter } from "@nano-router/preact";
import { savePost } from "./postService";

const PostEdit = () => {
  const { id } = useParams();
  const router = useRouter();
  const [body, setBody] = useState("");

  const onSave = async () => {
    await savePost({ id, body });

    router.navigate({
      route: "posts",
      state: { type: "notification", message: "POST_CREATED_SUCCESS" },
    });
  };

  return (
    <form>
      <label>Post</label>
      <textarea value={body} onInput={(e) => setBody(e.target.value)} />
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
