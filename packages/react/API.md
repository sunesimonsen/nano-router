# API @nano-router/react

<!-- toc -->

- [Route](#route)
- [Routes](#routes)
- [Router](#router)
- [useLink](#uselink)
- [useLocation](#uselocation)
- [useParams](#useparams)
- [usePrompt](#useprompt)
- [useQueryParams](#usequeryparams)
- [useRouteName](#useroutename)
- [useRouter](#userouter)

<!-- tocstop -->

## Route

See [@nano-router/routes](../routes/API.md#Route).

## Routes

See [@nano-router/routes](../routes/API.md#Routes).

## Router

A router provider that takes a [history](https://www.npmjs.com/package/history) instance.

Creating a router for the browser history:

```js
import React, { useMemo } from "react";
import { Router } from "@nano-router/react";
import { createBrowserHistory } from "history";

const App = () => {
  const history = useMemo(() => createBrowserHistory());

  return (
    <Router history={history} routes={routes}>
      ...
    </Router>
  );
};
```

Creating a router for a memory history useful for testing:

```js
import React, { useMemo } from "react";
import { Router } from "@nano-router/react";

const App = () => {
  const history = useMemo(() =>
    createMemoryHistory({
      initialEntries: ["/posts"],
    })
  );

  return (
    <Router history={history} routes={routes}>
      ...
    </Router>
  );
};
```

## useLink

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

## useLocation

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

## useParams

A hook for getting the current route parameters:

```js
const RouteParams = () => {
  const { id } = useParams();

  return <span>{id}</span>;
};
```

## usePrompt

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
    router.navigate({
      route: "posts",
      state: { skipPrompt: true }, // Skipping all prompts
    });
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

Notice that you can also remove a confirmation the following way:

```js
confirmation.remove();
```

But usually you just skip prompts when navigating after a save:

```js
router.navigate({
  route: "posts",
  state: { skipPrompt: true }, // Skipping all prompts
});
```

## useQueryParams

A hook for getting the current query parameters:

```js
const RouteQueryParams = () => {
  const { message } = useQueryParams();

  return <span>{message}</span>;
};
```

## useRouteName

A hook for getting the current route name:

```js
const RouteName = () => {
  const routeName = useRouteName();

  return <span>{routeName}</span>;
};
```

## useRouter

A hook for getting the [router](../router) instance:

```js
const Location = () => {
  const router = useRouter();

  return <span>{router.location.pathname}</span>;
};
```

Notice getting the router doesn't subscribe to changes to the router, so your
view wont get re-rendered when the route changes. You usually use the router to navigate from an event handler.
