import { html } from "@dependable/view";

const shouldNavigate = (e) =>
  !e.defaultPrevented &&
  !e.button &&
  !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

export class Link {
  constructor() {
    this.onClick = (e) => {
      if (shouldNavigate(e)) {
        e.preventDefault();
        this.router.navigate(this.props);
      }
    };
  }

  get router() {
    return this.context.router;
  }

  get href() {
    return this.router.createUrl(this.props);
  }

  render({
    route,
    params,
    queryParams,
    hash,
    state,
    replace,
    target,
    children,
    ...other
  }) {
    if (typeof target === "string") {
      return html`
        <a
          href=${this.href}
          rel="noopener"
          target=${target}
          onClick=${this.onClick}
          ...${other}
        >
          ${children}
        </a>
      `;
    } else {
      return html`
        <a href=${this.href} onClick=${this.onClick} ...${other}>${children}</a>
      `;
    }
  }
}
