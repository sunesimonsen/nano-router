export const isEqual = (a, b) => {
  if (a === b) return true;
  if ((!a && b) || (a && !b)) return false;

  const aType = typeof a;
  const bType = typeof b;
  if (aType !== bType) return false;

  if (aType === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (let i = 0; i < aKeys.length; i++) {
      const key = aKeys[i];
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  } else {
    return false;
  }
};
