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

const eventListenerStore = new WeakMap<
  HTMLElement,
  {
    mousemove: (e: MouseEvent) => void;
    mouseleave: () => void;
    mousedown: (e: MouseEvent) => void;
  }
>();

export const attachResizerEventListeners = (
  state: LayoutState,
  updateState: UpdateStateFunction,
): void => {
  attachResizerElementListeners(state, updateState);
  attachPaneDragAreaListeners(state, updateState);
};

const createDragStartHandler = (
  state: LayoutState,
  splitIndex: number,
  updateState: UpdateStateFunction,
) => {
  let dragStartPosition: number;

  const dragStart = (e: MouseEvent): void => {
    dragStartPosition =
      state.options.direction === "horizontal" ? e.clientX : e.clientY;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
  };

  const dragMove = (e: MouseEvent): void => {
    const mousePosition =
      state.options.direction === "horizontal" ? e.clientX : e.clientY;
    const offset = mousePosition - dragStartPosition;

    updateState((state) => resizeSplit(state, splitIndex, offset));
    dragStartPosition = mousePosition;
  };

  const dragEnd = (): void => {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
  };

  return dragStart;
};

const attachResizerElementListeners = (
  state: LayoutState,
  updateState: UpdateStateFunction,
): void => {
  for (let i = 0; i < state.splits.length; i++) {
    const split = state.splits[i];
    const dragStart = createDragStartHandler(state, i, updateState);

    split.resizerElement.addEventListener("mousedown", dragStart);
  }
};

const attachPaneDragAreaListeners = (
  state: LayoutState,
  updateState: UpdateStateFunction,
): void => {
  for (let paneIndex = 0; paneIndex < state.panes.length; paneIndex++) {
    if (state.options.dragAreaSize <= 0) continue;

    const pane = state.panes[paneIndex];
    const element = pane.options.element;

    const dragAreaHandler = createPaneDragAreaHandler(
      state,
      paneIndex,
      element,
      updateState,
    );

    eventListenerStore.set(element, {
      mousemove: dragAreaHandler.handleMouseMove,
      mouseleave: dragAreaHandler.handleMouseLeave,
      mousedown: dragAreaHandler.handleMouseDown,
    });

    element.addEventListener("mousemove", dragAreaHandler.handleMouseMove);
    element.addEventListener("mouseleave", dragAreaHandler.handleMouseLeave);
    element.addEventListener("mousedown", dragAreaHandler.handleMouseDown);
  }
};

const createPaneDragAreaHandler = (
  state: LayoutState,
  paneIndex: number,
  element: HTMLElement,
  updateState: UpdateStateFunction,
) => {
  const leftSplitIndex = state.splits.findIndex(
    (split) => split.paneIndices[1] === paneIndex,
  );
  const rightSplitIndex = state.splits.findIndex(
    (split) => split.paneIndices[0] === paneIndex,
  );

  const isInDragArea = (
    e: MouseEvent,
  ): { inArea: boolean; splitIndex: number } => {
    const rect = element.getBoundingClientRect();
    const mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const dragAreaSize = state.options.dragAreaSize;
    const size =
      state.options.direction === "horizontal" ? rect.width : rect.height;
    const position =
      state.options.direction === "horizontal" ? mousePos.x : mousePos.y;

    if (leftSplitIndex >= 0 && position <= dragAreaSize) {
      return { inArea: true, splitIndex: leftSplitIndex };
    }
    if (rightSplitIndex >= 0 && position >= size - dragAreaSize) {
      return { inArea: true, splitIndex: rightSplitIndex };
    }
    return { inArea: false, splitIndex: -1 };
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const { inArea } = isInDragArea(e);
    const cursor = inArea
      ? state.options.direction === "horizontal"
        ? "col-resize"
        : "row-resize"
      : "";
    element.style.cursor = cursor;
  };

  const handleMouseLeave = (): void => {
    element.style.cursor = "";
  };

  const handleMouseDown = (e: MouseEvent): void => {
    const { inArea, splitIndex } = isInDragArea(e);
    if (!inArea) return;

    const dragStart = createDragStartHandler(state, splitIndex, updateState);
    dragStart(e);
  };

  return {
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
  };
};

export const detachResizerEventListeners = (state: LayoutState): void => {
  for (const pane of state.panes) {
    const element = pane.options.element;
    const listeners = eventListenerStore.get(element);

    if (listeners) {
      element.removeEventListener("mousemove", listeners.mousemove);
      element.removeEventListener("mouseleave", listeners.mouseleave);
      element.removeEventListener("mousedown", listeners.mousedown);

      element.style.cursor = "";

      eventListenerStore.delete(element);
    }
  }
};
