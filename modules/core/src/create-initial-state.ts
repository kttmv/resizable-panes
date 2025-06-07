import { defaultLayoutOptions, defaultPaneOptions } from "./defaults";
import { createResizerElement } from "./resizers";
import { LayoutOptions, LayoutState } from "./types/layout";
import { PaneState } from "./types/pane";
import { SplitState } from "./types/split";

export function createInitialState(layoutOptions: LayoutOptions): LayoutState {
  const panes: PaneState[] = layoutOptions.panes.map((paneOptions) => {
    const normalizedPaneOptions = {
      ...defaultPaneOptions,
      ...paneOptions,
    };

    return {
      options: normalizedPaneOptions,
      size: normalizedPaneOptions.size,
      collapsed: normalizedPaneOptions.collapsed,
    };
  });

  const splits: SplitState[] = [];

  for (let i = 0; i < panes.length - 1; i++) {
    const resizerElement = createResizerElement(layoutOptions);
    splits.push({
      paneIndices: [i, i + 1],
      resizerElement,
    });
  }

  return {
    options: {
      ...defaultLayoutOptions,
      ...layoutOptions,
    },
    active: false,
    panes,
    splits,
  };
}
