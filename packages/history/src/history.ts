export type RouterLocation = {
  href: string;
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key: string;
};

export type RouterAction = "POP" | "PUSH" | "REPLACE";

export type RetryFunction = () => void;

export type TransitionArgs = {
  action: RouterAction;
  location: RouterLocation;
  retry?: RetryFunction;
};

export type TransitionHandler = (args: TransitionArgs) => void;

export type Unsubscriber = () => void;

export type TransitionHandlers = {
  length: number;
  push: (handler: TransitionHandler) => Unsubscriber;
  call: (arg: TransitionArgs) => void;
};

export type RouterHistory = {
  readonly action: RouterAction;
  readonly location: RouterLocation;
  push(to: string, state?: any): void;
  replace(to: string, state?: any): void;
  pushLocation(url: string, target?: string): void;
  replaceLocation(url: string): void;
  go(delta: number): void;
  back(): void;
  forward(): void;
  listen(listener: TransitionHandler): Unsubscriber;
  block(blocker: TransitionHandler): Unsubscriber;
};
