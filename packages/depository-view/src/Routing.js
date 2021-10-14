import { html } from "@depository/view";

const equals = (a, b) => {
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
      if (!equals(a[key], b[key])) return false;
    }

    return true;
  } else {
    return false;
  }
};

export class Routing {
  constructor({ router }) {
    this.updateRouting = () => {
      const routing = {
        route: router.route,
        location: router.location,
        params: router.params,
        queryParams: router.queryParams,
      };

      if (equals(this.props.routing, routing)) return null;

      this.dispatch({
        name: "Routing",
        payload: { routing },
      });
    };
  }

  data() {
    return { routing: "routing" };
  }

  willMount() {
    this.updateRouting();
  }

  didMount() {
    this.subscription = this.props.router.listen(this.updateRouting);
  }

  willUnmount() {
    this.subscription();
  }

  render({ router, children, ...other }) {
    return html`<Context router=${router}>${children}</Context>`;
  }
}
