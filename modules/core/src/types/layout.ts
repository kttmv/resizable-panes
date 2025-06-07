import { PaneOptions } from "./pane";
import { SplitState } from "./split";

export type LayoutOptions = {
  direction?: "horizontal" | "vertical";
  container: HTMLElement;

  panes: PaneOptions[];

  dragInterval?: number;
  snapOffset?: number;
};

export type LayoutState = {
  options: LayoutOptions;
  active: boolean;
  splits: SplitState[];
};
