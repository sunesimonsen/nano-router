# @nano-router/url - [API](./API.md)

This package provides utilities for working with URLs.

## Instalation

```sh
npm install @nano-router/url
```

## Usage

### Creating a URL

```js
import { createUrl } from '@nano-router/url'

const url = createUrl({
  origin = "https://www.example.com",
  pathname = "/admin/:locale/posts",
  hash = "#here",
  params: { locale: 'da' },
  queryParams: {
    search: 'hello'
  },
})

expect(url, 'to equal', 'https://www.example.com/admin/da/posts?hello#here')
```

### Creating a path

```js
import { createUrl } from '@nano-router/url'

const url = createUrl({
  pathname = "/admin/:locale/posts",
  hash = "#here",
  params: { locale: 'da' },
  queryParams: {
    search: 'hello'
  },
})

expect(url, 'to equal', '/admin/da/posts?hello#here')
```

### Parsing query parameters

```js
import { searchToObject } from "@nano-router/url";

const queryParams = searchToObject("?id=42&name=Sune");

expect(queryParams, "to equal", {
  id: "42",
  name: "Sune",
});
```

### Stringifing query parameters

```js
import { objectToSearch } from "@nano-router/url";

const search = objectToSearch({ id: "42", name: "Sune" });

expect(search, "to equal", "?id=42&name=Sune");
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
