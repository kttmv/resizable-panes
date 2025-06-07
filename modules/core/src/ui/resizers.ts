import { CSS_CLASSES } from "../constants";
import type { LayoutConfiguration, LayoutState } from "../core/types";

export function createResizerElement(config: LayoutConfiguration): HTMLElement {
  const resizerElement = document.createElement("div");

  const className =
    config.direction === "horizontal"
      ? CSS_CLASSES.RESIZER_HORIZONTAL
      : CSS_CLASSES.RESIZER_VERTICAL;

  resizerElement.className = className;

  return resizerElement;
}

export function insertResizers(state: LayoutState): void {
  for (const split of state.splits) {
    const firstPaneElement = state.panes[split.paneIndices[0]].element;
    firstPaneElement.after(split.resizerElement);
  }
}

export function removeResizers(state: LayoutState): void {
  for (const split of state.splits) {
    split.resizerElement.remove();
  }
}
