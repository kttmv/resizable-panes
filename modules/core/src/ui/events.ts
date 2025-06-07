import { findSplitByPane } from "../core/state";
import type { LayoutState, UpdateStateFunction } from "../core/types";
import { resizeSplit } from "../operations/index";

// Store for event listeners to enable cleanup
const eventListenerStore = new WeakMap<
  HTMLElement,
  {
    mousemove: (e: MouseEvent) => void;
    mouseleave: () => void;
    mousedown: (e: MouseEvent) => void;
  }
>();

export function attachEventListeners(
  state: LayoutState,
  updateState: UpdateStateFunction,
): void {
  attachResizerListeners(state, updateState);
  attachDragAreaListeners(state, updateState);
}

export function detachEventListeners(state: LayoutState): void {
  // Clean up resizer listeners
  for (const split of state.splits) {
    const element = split.resizerElement;
    element.removeEventListener("mousedown", () => {});
    element.style.cursor = "";
  }

  // Clean up drag area listeners
  for (const pane of state.panes) {
    const element = pane.element;
    const listeners = eventListenerStore.get(element);

    if (listeners) {
      element.removeEventListener("mousemove", listeners.mousemove);
      element.removeEventListener("mouseleave", listeners.mouseleave);
      element.removeEventListener("mousedown", listeners.mousedown);
      element.style.cursor = "";
      eventListenerStore.delete(element);
    }
  }
}

function attachResizerListeners(
  state: LayoutState,
  updateState: UpdateStateFunction,
): void {
  for (let splitIndex = 0; splitIndex < state.splits.length; splitIndex++) {
    const split = state.splits[splitIndex];
    const dragHandler = createSplitDragHandler(state, splitIndex, updateState);

    split.resizerElement.addEventListener("mousedown", dragHandler);
  }
}

function attachDragAreaListeners(
  state: LayoutState,
  updateState: UpdateStateFunction,
): void {
  if (state.configuration.dragAreaSize <= 0) return;

  for (let paneIndex = 0; paneIndex < state.panes.length; paneIndex++) {
    const pane = state.panes[paneIndex];
    const element = pane.element;

    const dragAreaHandler = createDragAreaHandler(
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
}

function createSplitDragHandler(
  state: LayoutState,
  splitIndex: number,
  updateState: UpdateStateFunction,
) {
  let dragStartPosition: number;

  const dragStart = (e: MouseEvent): void => {
    dragStartPosition =
      state.configuration.direction === "horizontal" ? e.clientX : e.clientY;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
  };

  const dragMove = (e: MouseEvent): void => {
    const mousePosition =
      state.configuration.direction === "horizontal" ? e.clientX : e.clientY;
    const offset = mousePosition - dragStartPosition;

    updateState((currentState) =>
      resizeSplit(currentState, splitIndex, offset),
    );
    dragStartPosition = mousePosition;
  };

  const dragEnd = (): void => {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
  };

  return dragStart;
}

function createDragAreaHandler(
  state: LayoutState,
  paneIndex: number,
  element: HTMLElement,
  updateState: UpdateStateFunction,
) {
  const { leftSplit, rightSplit } = findSplitByPane(state, paneIndex);

  const isInDragArea = (
    e: MouseEvent,
  ): { inArea: boolean; splitIndex: number } => {
    const rect = element.getBoundingClientRect();
    const mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const dragAreaSize = state.configuration.dragAreaSize;
    const size =
      state.configuration.direction === "horizontal" ? rect.width : rect.height;
    const position =
      state.configuration.direction === "horizontal" ? mousePos.x : mousePos.y;

    if (leftSplit !== undefined && position <= dragAreaSize) {
      return { inArea: true, splitIndex: leftSplit };
    }

    if (rightSplit !== undefined && position >= size - dragAreaSize) {
      return { inArea: true, splitIndex: rightSplit };
    }

    return { inArea: false, splitIndex: -1 };
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const { inArea } = isInDragArea(e);
    const cursor = inArea
      ? state.configuration.direction === "horizontal"
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

    const dragHandler = createSplitDragHandler(state, splitIndex, updateState);
    dragHandler(e);
  };

  return {
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
  };
}
