# @nano-router/path - [API](./API.md)

This package provides a path pattern, that can either parse a given path, or construct a path from given parameters.

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
  - [Create the path pattern](#create-the-path-pattern)
  - [Match a path against the pattern](#match-a-path-against-the-pattern)
  - [Stringify the pattern](#stringify-the-pattern)
- [MIT License](#mit-license)

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
