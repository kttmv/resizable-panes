import { LayoutOptions } from "./types/layout";

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
