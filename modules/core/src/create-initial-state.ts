import { createResizerElement } from "./create-resizer-element";
import { LayoutOptions, LayoutState } from "./types/layout";
import { PaneState } from "./types/pane";
import { SplitState } from "./types/split";

export function createInitialState(layoutOptions: LayoutOptions): LayoutState {
  const panes: PaneState[] = layoutOptions.panes.map((paneOptions) => ({
    options: paneOptions,
    size: paneOptions.size || "1fr",
    collapsed: paneOptions.collapsed || false,
  }));

  const splits: SplitState[] = [];

  for (let i = 0; i < panes.length - 1; i++) {
    const resizerElement = createResizerElement(layoutOptions);
    splits.push({
      panes: [panes[i], panes[i + 1]],
      resizerElement,
    });
  }

  return {
    options: layoutOptions,
    splits,
  };
}
