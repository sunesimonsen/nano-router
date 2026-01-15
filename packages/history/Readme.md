# @nano-router/history

Fork of the [history](https://www.npmjs.com/package/history) package to support external navigation. Right now the two implementations is very close to each other, so [documentation](https://github.com/ReactTraining/history/tree/master/docs) is still valid except for the additions.

This fork adds the following two methods:

## pushLocation

This method will use `window.location.assign` to update the browser location.

```js
history.pushLocation("https://www.example.com");
```

It support blocking the navigation like you would expect.

You can optionally provide a target, to open the location in another frame.

```js
history.pushLocation("https://www.example.com", "_blank");
```

## replaceLocation

This method will use `window.location.replace` to update the browser location.

```js
history.replaceLocation("https://www.example.com");
```

It support blocking the navigation like you would expect.
