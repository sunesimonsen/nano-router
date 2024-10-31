import unexpected from "unexpected";
import unexpectedDom from "unexpected-dom";
import sinon from "sinon";
import { html, render } from "@depository/view";
import { createMemoryHistory } from "@nano-router/history";
import {
  Routing,
  Link,
  Prompt,
  Router,
  Routes,
  Route,
  ExternalRoute,
} from "./index.js";

import { Store } from "@depository/store";

const expect = unexpected.clone().use(unexpectedDom);

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id")
);

const updateName = (name) => ({
  name: "Update name",
  payload: { "global.editing.name": name },
});

class Confirm {
  constructor() {
    this.onApprove = (e) => {
      e.target.dispatchEvent(
        new window.CustomEvent("Approve", { bubbles: true, cancelable: true })
      );
    };

    this.onReject = (e) => {
      e.target.dispatchEvent(
        new window.CustomEvent("Reject", { bubbles: true, cancelable: true })
      );
    };
  }

  render() {
    return html`
      <div class="modal">
        You have unsaved changes, do you want continue?
        <button data-test-id="reject" onClick=${this.onReject}>Cancel</button>
        <button data-test-id="approve" onClick=${this.onApprove}>
          Continue
        </button>
      </div>
    `;
  }
}

class NewView {
  constructor() {
    this.onSave = () => {
      // Save
      // Success
      this.router.navigate({
        route: "posts",
        state: { skipPrompt: true },
      });
    };

    this.onChange = (e) => {
      this.dispatch(updateName(e.target.value));
    };
  }

  get router() {
    return this.context.router;
  }

  data() {
    return { name: "global.editing.name" };
  }

  render({ name }) {
    return html`
      <div>
        <input data-test-id="name" value=${name} onChange=${this.onChange} />
        <${Prompt} active=${name}><${Confirm} /><//>
        <button data-test-id="save" onClick=${this.onSave}>Save</button>
        <${Link} data-test-id="show-list" route="posts">Show list<//>
        <${Link} data-test-id="external" route="external" params=${{ id: 42 }}>
          External
        <//>
      </div>
    `;
  }
}

class RootView {
  data() {
    return { route: "routing.route" };
  }

  render({ route }) {
    switch (route) {
      case "posts/new":
        return html`<${NewView} />`;
      default:
        return html`<div data-test-id="posts-list" />`;
    }
  }
}

describe("usePrompt", () => {
  let container, store, clock;

  const updateName = (newValue) => {
    const nameInput = container.querySelector("[data-test-id=name]");
    nameInput.value = newValue;
    nameInput.dispatchEvent(new window.CustomEvent("change"));

    return clock.runAllAsync();
  };

  const clickByTestId = (testId) => {
    const selector = `[data-test-id=${testId}]`;
    expect(container, "to contain elements matching", selector);
    const element = container.querySelector(selector);
    element.dispatchEvent(new window.CustomEvent("click"));

    return clock.runAllAsync();
  };

  beforeEach(async () => {
    clock = sinon.useFakeTimers();

    const history = createMemoryHistory({ initialEntries: ["/posts/new"] });
    container = document.createElement("div");
    store = new Store();

    const router = new Router({ routes, history });

    render(
      html`<${Routing} router=${router}><${RootView} /><//>`,
      store,
      container
    );

    await clock.runAllAsync();
  });

  afterEach(() => {
    clock.restore();
  });

  describe("when navigation is blocked", () => {
    beforeEach(async () => {
      await updateName("Sune");
      clickByTestId("show-list");
    });

    it("shows a confirmation", () => {
      expect(container, "to contain test id", "approve");
    });
  });

  describe("when navigation is blocked to an external route", () => {
    beforeEach(async () => {
      await updateName("Sune");
      await clickByTestId("external");
    });

    it("shows a confirmation", () => {
      expect(container, "to contain test id", "approve");
    });
  });

  describe("when block navigation is confirmed", () => {
    beforeEach(async () => {
      await updateName("Sune");
      await clickByTestId("show-list");
      await clickByTestId("approve");
    });

    it("navigates", () => {
      expect(container, "to contain test id", "posts-list");
    });
  });

  describe("when block navigation is rejected", () => {
    beforeEach(async () => {
      await updateName("Sune");
      await clickByTestId("show-list");
      await clickByTestId("reject");
    });

    it("removes the confirmation but it doesn't navigate", () => {
      expect(container, "not to contain test id", "approve").and(
        "not to contain test id",
        "posts-list"
      );
    });
  });

  describe("when block navigation is rejected multiple times", () => {
    beforeEach(async () => {
      await updateName("Sune");
      await clickByTestId("show-list");
      await clickByTestId("reject");
      await clickByTestId("show-list");
      await clickByTestId("reject");
    });

    it("removes the confirmation but it doesn't navigate", () => {
      expect(container, "not to contain test id", "approve").and(
        "not to contain test id",
        "posts-list"
      );
    });
  });

  describe("when removing a confirmation", () => {
    beforeEach(async () => {
      await updateName("Sune");
      await clickByTestId("save");
    });

    it("won't prompt on navigation", () => {
      expect(container, "to contain test id", "posts-list");
    });
  });
});
