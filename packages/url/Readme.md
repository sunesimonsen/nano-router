# @nano-router/url - [API](./API.md)

This package provides utilities for working with URLs.

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
  - [Creating a URL](#creating-a-url)
  - [Creating a path](#creating-a-path)
  - [Parsing query parameters](#parsing-query-parameters)
  - [Stringifing query parameters](#stringifing-query-parameters)

<!-- tocstop -->

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
