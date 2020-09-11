# API @nano-router/path

<!-- toc -->

- [PathPattern](#pathpattern)
  - [Methods](#methods)
    - [Constructor](#constructor)
    - [match](#match)
    - [stringify](#stringify)

<!-- tocstop -->

## PathPattern

### Methods

#### Constructor

Creates a new path pattern object from the given string:

```js
import { PathPattern } from "@nano-router/path";

const pattern = new PathPattern("/admin/:locale/posts/:id");
```

The path pattern is as simple as you can imagine. You have a normal path where you can have named variables in the path with the this syntax: `:variable`, nothing else is possible.

#### match

Matches the given path against the pattern:

```js
expect(pattern.match("/admin/da/posts/42"), "to equal", {
  locale: "da",
  id: "42",
});
```

If the pattern doesn't match `null` is returned.

#### stringify

Stringify the pattern with the given parameters:

```js
expect(pattern.stringify({
  locale: "da",
  id: "42",
), "to equal", "/admin/da/posts/42"});
```

Notice that it fails if you don't provide all of the variables. Extra variables
will be ignored.
