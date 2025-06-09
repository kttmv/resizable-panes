import { findSplitByPane } from "../core/state";
import type { LayoutState, UpdateStateFunction } from "../core/types";
import { resizeSplit } from "../operations/index";

const eventListenerStore = new WeakMap<HTMLElement, Array<() => void>>();

export function attachEventListeners(
  state: LayoutState,
  updateState: UpdateStateFunction,
): void {
  // Attach resizer listeners
  state.splits.forEach((split, index) => {
    const handler = createDragHandler(state, index, updateState);
    split.resizerElement.addEventListener("mousedown", handler);
  });

  // Attach drag area listeners if enabled
  if (state.configuration.dragAreaSize > 0) {
    state.panes.forEach((pane, index) => {
      const handlers = createDragAreaHandlers(state, index, updateState);
      const element = pane.element;

      element.addEventListener("mousemove", handlers.mousemove);
      element.addEventListener("mouseleave", handlers.mouseleave);
      element.addEventListener("mousedown", handlers.mousedown);

      eventListenerStore.set(element, [
        () => element.removeEventListener("mousemove", handlers.mousemove),
        () => element.removeEventListener("mouseleave", handlers.mouseleave),
        () => element.removeEventListener("mousedown", handlers.mousedown),
      ]);
    });
  }
}

export function detachEventListeners(state: LayoutState): void {
  state.splits.forEach((split) => (split.resizerElement.style.cursor = ""));

  state.panes.forEach((pane) => {
    const element = pane.element;
    const cleanupFunctions = eventListenerStore.get(element);

    if (cleanupFunctions) {
      cleanupFunctions.forEach((cleanup) => cleanup());
      element.style.cursor = "";
      eventListenerStore.delete(element);
    }
  });
}

function createDragHandler(
  state: LayoutState,
  splitIndex: number,
  updateState: UpdateStateFunction,
) {
  return (e: MouseEvent) => {
    const isHorizontal = state.configuration.direction === "horizontal";
    const startPosition = isHorizontal ? e.clientX : e.clientY;

    const split = state.splits[splitIndex];
    const resizerRect = split.resizerElement.getBoundingClientRect();
    const resizerCenter = isHorizontal
      ? resizerRect.left + resizerRect.width / 2
      : resizerRect.top + resizerRect.height / 2;

    const firstPane = state.panes[split.paneIndices[0]];
    const firstPaneRect = firstPane.element.getBoundingClientRect();
    const firstPaneStart = isHorizontal
      ? firstPaneRect.left
      : firstPaneRect.top;
    const startResizerPosition = resizerCenter - firstPaneStart;

    const dragMove = (e: MouseEvent) => {
      const mousePosition = isHorizontal ? e.clientX : e.clientY;
      let offset = mousePosition - startPosition;

      const dragInterval = state.configuration.dragInterval;
      if (dragInterval > 1) {
        offset = Math.round(offset / dragInterval) * dragInterval;
      }

      if (offset !== 0) {
        const newResizerPosition = startResizerPosition + offset;
        updateState((currentState) =>
          resizeSplit(currentState, splitIndex, newResizerPosition),
        );
      }
    };

    const dragEnd = () => {
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);
    document.body.style.userSelect = "none";
  };
}

function createDragAreaHandlers(
  state: LayoutState,
  paneIndex: number,
  updateState: UpdateStateFunction,
) {
  const { leftSplit, rightSplit } = findSplitByPane(state, paneIndex);

  const getSplitInDragArea = (e: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const isHorizontal = state.configuration.direction === "horizontal";
    const mousePos = isHorizontal
      ? e.clientX - rect.left
      : e.clientY - rect.top;
    const size = isHorizontal ? rect.width : rect.height;
    const dragAreaSize = state.configuration.dragAreaSize;

    if (leftSplit !== undefined && mousePos <= dragAreaSize) return leftSplit;
    if (rightSplit !== undefined && mousePos >= size - dragAreaSize)
      return rightSplit;
    return -1;
  };

  return {
    mousemove: (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement;
      const splitIndex = getSplitInDragArea(e, element);
      const cursor =
        splitIndex >= 0
          ? state.configuration.direction === "horizontal"
            ? "col-resize"
            : "row-resize"
          : "";
      element.style.cursor = cursor;
    },

    mouseleave: (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.cursor = "";
    },

    mousedown: (e: MouseEvent) => {
      const element = e.currentTarget as HTMLElement;
      const splitIndex = getSplitInDragArea(e, element);
      if (splitIndex >= 0) {
        createDragHandler(state, splitIndex, updateState)(e);
      }
    },
  };
}
