import { PaneState } from "./pane";

export type SplitState = {
  panes: [PaneState, PaneState];
  resizerElement: HTMLElement;
};
