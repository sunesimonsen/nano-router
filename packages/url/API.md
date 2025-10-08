# API @nano-router/url

## createUrl

Creates a URL from the given parameters:

- origin: (default "") the URL origin.
- pathname: (default "/") the URL path name. The `pathname` can also contain variables that will be substituted with the `params`.
- params: the parameters the will be substituted into the `pathname`.
- hash: (default: "") the URL hash.
- queryParams: a query parameter object.

You can create a URL this way:

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

If you just want to create a path, you can just leave out the origin:

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

## objectToSearch

Converts an object into a query string:

```js
import { objectToSearch } from "@nano-router/url";

const search = objectToSearch({ id: "42", name: "Sune" });

expect(search, "to equal", "?id=42&name=Sune");
```

Notice if you give it an empty object, it will return `""`.

## searchToObject

Parses a URL query string:

```js
import { searchToObject } from "@nano-router/url";

const queryParams = searchToObject("?id=42&name=Sune");

expect(queryParams, "to equal", {
  id: "42",
  name: "Sune",
});
```

Notice that if you give it the empty string it will return `{}`.
