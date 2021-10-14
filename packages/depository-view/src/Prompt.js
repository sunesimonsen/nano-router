import { html } from "@depository/view";

const visiblePath = "routing.prompt.visible";

const setPromptVisibility = (visible) => ({
  name: "Prompt visibility",
  payload: { [visiblePath]: visible },
});

export class Prompt {
  constructor() {
    this.show = () => {
      this.dispatch(setPromptVisibility(true));
    };

    this.hide = () => {
      this.dispatch(setPromptVisibility(false));
    };

    this.updateBlock = (prevProps) => {
      if (!prevProps || prevProps.active !== this.props.active) {
        if (this.props.active) {
          this.unblock = this.router.block((tx) => {
            const state = tx.location.state;
            if (state && state.skipPrompt) {
              this.hide();
              this.unblock();
              tx.retry();
            } else {
              this.show();
              this.tx = tx;
            }
          });
        } else if (this.unblock) {
          this.hide();
          this.unblock();
        }
      }
    };

    this.onApprove = (e) => {
      e.stopPropagation();
      this.hide();
      this.unblock && this.unblock();
      this.tx && this.tx.retry();
    };

    this.onReject = (e) => {
      this.hide();
      e.stopPropagation();
    };
  }

  static defaultProps() {
    return { visible: false };
  }

  data() {
    return { visible: visiblePath };
  }

  get router() {
    return this.context.router;
  }

  didMount() {
    this.updateBlock();
  }

  didUpdate(prevProps) {
    this.updateBlock(prevProps);
  }

  render({ children, visible, ...other }) {
    return html`
      <div onApprove=${this.onApprove} onReject=${this.onReject}>
        ${visible && children}
      </div>
    `;
  }
}
