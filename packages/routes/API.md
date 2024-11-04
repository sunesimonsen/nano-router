# API @nano-router/routes

<!-- toc -->

- [Route](#route)
  - [Methods](#methods)
    - [Constructor](#constructor)
    - [match](#match)
    - [stringify](#stringify)
- [ExternalRoute](#externalroute)
  - [Methods](#methods-1)
    - [Constructor](#constructor-1)
    - [match](#match-1)
    - [stringify](#stringify-1)
- [Routers](#routers)
  - [Methods](#methods-2)
    - [Constructor](#constructor-2)
    - [match](#match-2)
    - [byName](#byname)

<!-- tocstop -->

## Route

### Methods

#### Constructor

Create a new route with the given name and pattern.

```js
const routeName = "posts/edit";
const pathPattern = "/posts/:id";
const route = new Route(routeName, pathPattern);
```

The path pattern is as simple as you can imagine. You have a normal path where
you can have named variables in the path with the this syntax: `:variable`,
nothing else is possible.

See [@nano-router/path](../path/API.md) for more information about the path
patterns.

#### match

Matches a given path against the route. If it path matches the route it returns
the path parameters:

```js
expect(route.match("/posts/42"), "to equal", { id: "42" });
```

If the given path doesn't match the route `null` is returned.

#### stringify

Create a path from the route path pattern and the given parameters:

```js
expect(route.stringify({ id: 42 }), "to equal", "/posts/42");
```

## ExternalRoute

Exactly like [Route](#route) but marked to be external. External routes results
in full browser reloads.

### Methods

#### Constructor

Create a new external route with the given name and pattern.

```js
const routeName = "blog";
const pathPattern = "https://www.example.com/blog/:id";
const route = new ExternalRoute(routeName, pathPattern);
```

The path pattern is as simple as you can imagine. You have a normal path where
you can have named variables in the path with the this syntax: `:variable`,
nothing else is possible.

See [@nano-router/path](../path/API.md) for more information about the path
patterns.

#### match

Matches a given URL against the route. If it URL matches the route it returns
the path parameters:

```js
expect(route.match("https://www.example.com/posts/42"), "to equal", {
  id: "42",
});
```

If the given URL doesn't match the route `null` is returned.

#### stringify

Create a URL from the route pattern and the given parameters:

```js
expect(
  route.stringify({ id: 42 }),
  "to equal",
  "https://www.example.com/posts/42",
);
```

## Routers

### Methods

#### Constructor

Create a new routes object for the given routes.

```js
const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts/edit", "/posts/:id"),
  new Route("posts", "/posts"),
);
```

Notice that the order of the routes is significant.

#### match

Matches a given path against the routes in the order they were given in the
constructor. If it path matches the route it returns the matching route name and
the path parameters:

```js
const match = routes.match("/posts/42");

expect(match, "to equal", {
  name: "posts/edit",
  params: { id: "42" },
});
```

If the path doesn't match any route `{ name: 'default', params: {} }` is returned.

#### byName

Returns the route with the given name:

```js
const route = routes.byName("posts/edit");

expect(route.stringify({ id: "666" }), "to equal", "/posts/666");
```

If the route doesn't exists `null` is returned.
