import React, { useMemo, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "@nano-router/history";
import "@testing-library/jest-dom";

import {
  Routes,
  Route,
  ExternalRoute,
  Router,
  useRouteName,
  useRouter,
  usePrompt,
  useLink,
} from "./index";

const routes = new Routes(
  new Route("posts/new", "/posts/new"),
  new Route("posts", "/posts"),
  new ExternalRoute("external", "https://www.example.com/blog/:id")
);

const NewView = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const isDirty = Boolean(name);
  const confirmation = usePrompt(isDirty);

  const showPosts = useLink("posts");
  const showExternal = useLink({ route: "external", params: { id: 42 } });

  const onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const onSave = () => {
    // Save
    // Success
    router.navigate({
      route: "posts",
      state: { skipPrompt: true },
    });
  };

  return (
    <div>
      <input data-test-id="name" value={name} onChange={onChange} />
      {confirmation.isVisible && (
        <div>
          <button data-test-id="reject" onClick={confirmation.reject}>
            Reject
          </button>
          <button data-test-id="approve" onClick={confirmation.approve}>
            Approve
          </button>
        </div>
      )}
      <button data-test-id="save" onClick={onSave}>
        Save
      </button>
      <a data-test-id="show-list" {...showPosts}>
        Show list
      </a>
      <a data-test-id="external" {...showExternal}>
        External
      </a>
    </div>
  );
};

const RootView = () => {
  const routeName = useRouteName();

  switch (routeName) {
    case "posts/new":
      return <NewView />;
    default:
      return <div data-test-id="posts-list" />;
  }
};

const App = () => {
  const history = useMemo(
    () => createMemoryHistory({ initialEntries: ["/posts/new"] }),
    []
  );

  return (
    <div>
      <Router history={history} routes={routes}>
        <RootView />
      </Router>
    </div>
  );
};

describe("usePrompt", () => {
  beforeEach(() => {
    render(<App />);
  });

  describe("when navigation is blocked", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByTestId("name"), "Sune");
      await userEvent.click(screen.getByTestId("show-list"));
    });

    it("shows a confirmation", () => {
      expect(screen.getByTestId("approve")).toBeInTheDocument();
    });
  });

  describe("when navigation is blocked to an external route", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByTestId("name"), "Sune");
      await userEvent.click(screen.getByTestId("external"));
    });

    it("shows a confirmation", () => {
      expect(screen.getByTestId("approve")).toBeInTheDocument();
    });
  });

  describe("when block navigation is confirmed", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByTestId("name"), "Sune");
      await userEvent.click(screen.getByTestId("show-list"));
      await userEvent.click(screen.getByTestId("approve"));
    });

    it("navigates", () => {
      expect(screen.getByTestId("posts-list")).toBeInTheDocument();
    });
  });

  describe("when block navigation is rejected", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByTestId("name"), "Sune");
      await userEvent.click(screen.getByTestId("show-list"));
      await userEvent.click(screen.getByTestId("reject"));
    });

    it("removes the confirmation but it doesn't navigate", () => {
      expect(screen.queryByTestId("approve")).toBe(null);
      expect(screen.getByTestId("show-list")).toBeInTheDocument();
      expect(screen.queryByTestId("posts-list")).toBe(null);
    });
  });

  describe("when block navigation is rejected multiple times", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByTestId("name"), "Sune");
      await userEvent.click(screen.getByTestId("show-list"));
      await userEvent.click(screen.getByTestId("reject"));
      await userEvent.click(screen.getByTestId("show-list"));
      await userEvent.click(screen.getByTestId("reject"));
    });

    it("removes the confirmation but it doesn't navigate", () => {
      expect(screen.queryByTestId("approve")).toBe(null);
      expect(screen.getByTestId("show-list")).toBeInTheDocument();
      expect(screen.queryByTestId("posts-list")).toBe(null);
    });
  });

  describe("when removing a confirmation", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByTestId("name"), "Sune");
      await userEvent.click(screen.getByTestId("save"));
    });

    it("won't prompt on navigation", () => {
      expect(screen.queryByTestId("posts-list")).toBeInTheDocument();
    });
  });
});
