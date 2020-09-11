# @nano-router/path - [API](./API.md)

This package provides a path pattern, that can either parse a given path, or construct a path from given parameters.

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
  - [Create the path pattern](#create-the-path-pattern)
  - [Match a path against the pattern](#match-a-path-against-the-pattern)
  - [Stringify the pattern](#stringify-the-pattern)

<!-- tocstop -->

## Instalation

```sh
npm install @nano-router/routes
```

## Usage

### Create the path pattern

```js
import { PathPattern } from "@nano-router/path";

const pattern = new PathPattern("/admin/:locale/posts/:id");
```

### Match a path against the pattern

```js
expect(pattern.match("/admin/da/posts/42"), "to equal", {
  locale: "da",
  id: "42",
});
```

### Stringify the pattern

```js
expect(pattern.stringify({
  locale: "da",
  id: "42",
), "to equal", "/admin/da/posts/42"});
```
