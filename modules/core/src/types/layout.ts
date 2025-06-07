import { PaneOptions, PaneState } from "./pane";
import { SplitState } from "./split";

export type LayoutOptions = {
  direction?: "horizontal" | "vertical";
  container: HTMLElement;

  panes: PaneOptions[];

  dragInterval?: number;
  snapOffset?: number;
};

export type NormalizedLayoutOptions = Required<LayoutOptions>;

export type LayoutState = {
  options: NormalizedLayoutOptions;
  active: boolean;
  panes: PaneState[];
  splits: SplitState[];
};
