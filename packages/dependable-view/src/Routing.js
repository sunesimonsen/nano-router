import { html } from "@dependable/view";
import { route, location, params, queryParams } from "./state.js";

export class Routing {
  constructor({ router }) {
    this.updateRouting = () => {
      route(router.route);
      location(router.location);
      params(router.params);
      queryParams(router.queryParams);
    };
  }

  willMount() {
    this.updateRouting();
    this.unsubscribe = this.props.router.listen(this.updateRouting);
  }

  willUnmount() {
    this.unsubscribe();
  }

  render({ router, children }) {
    return html`<Context router=${router}>${children}</Context>`;
  }
}
