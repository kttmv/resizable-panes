import { resizeSplit } from "./resize-split";
import { LayoutOptions, LayoutState } from "./types/layout";
import { UpdateStateFunction } from "./types/state";

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
    state.panes[split.paneIndices[0]].options.element.after(
      split.resizerElement,
    );
  }
};

export const removeResizers = (state: LayoutState): void => {
  for (const split of state.splits) {
    split.resizerElement.remove();
  }
};

export const attachResizerEventListeners = (
  state: LayoutState,
  updateState: UpdateStateFunction,
): void => {
  for (let i = 0; i < state.splits.length; i++) {
    const split = state.splits[i];

    let dragStartPosition: number;

    const dragStart = (e: MouseEvent): void => {
      dragStartPosition =
        state.options.direction === "horizontal" ? e.clientX : e.clientY;

      console.log("test");

      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);
    };

    const dragMove = (e: MouseEvent): void => {
      const mousePosition =
        state.options.direction === "horizontal" ? e.clientX : e.clientY;
      const offset = mousePosition - dragStartPosition;

      console.log(
        `Resizing split ${i}: offset = ${offset}px, mousePosition = ${mousePosition}px, dragStartPosition = ${dragStartPosition}px`,
      );

      updateState((state) => resizeSplit(state, i, offset));

      dragStartPosition = mousePosition;
    };

    const dragEnd = (): void => {
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
    };

    split.resizerElement.addEventListener("mousedown", dragStart);
  }
};
