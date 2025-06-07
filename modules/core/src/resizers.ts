import { LayoutOptions, LayoutState } from "./types/layout";

export const createResizerElement = (
  layoutOptions: LayoutOptions,
): HTMLElement => {
  const resizerElement = document.createElement("div");

  if (layoutOptions.direction === "horizontal") {
    resizerElement.className = "resizer-horizontal";
  } else {
    resizerElement.className = "resizer-vertical";
  }

  return resizerElement;
};

export const insertResizers = (state: LayoutState): void => {
  for (const split of state.splits) {
    split.panes[0].options.element.after(split.resizerElement);
  }
};

export const removeResizers = (state: LayoutState): void => {
  for (const split of state.splits) {
    split.resizerElement.remove();
  }
};
