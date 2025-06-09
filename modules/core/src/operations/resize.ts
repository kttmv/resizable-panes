import { mapSizeDefinition, resolveSize } from "../core/size-utils";
import { getSplitPanes } from "../core/state";
import type { LayoutState } from "../core/types";
import { collapsePane, expandPane } from "./pane-operations";

export function resizeSplit(
  state: LayoutState,
  splitIndex: number,
  newResizerPosition: number,
): LayoutState {
  const split = state.splits[splitIndex];
  const [paneA, paneB] = getSplitPanes(state, splitIndex);

  const resizerSize =
    state.configuration.direction === "horizontal"
      ? split.resizerElement.offsetWidth
      : split.resizerElement.offsetHeight;

  const currentSizeA = resolveSize(paneA.currentSize, state);
  const currentSizeB = resolveSize(paneB.currentSize, state);

  const minSizeA = resolveSize(paneA.minSize, state);
  const minSizeB = resolveSize(paneB.minSize, state);
  const maxSizeA = resolveSize(paneA.maxSize, state);
  const maxSizeB = resolveSize(paneB.maxSize, state);

  let finalSizeA = newResizerPosition - resizerSize / 2;
  let finalSizeB = currentSizeA + currentSizeB - finalSizeA;

  // Collapse/Expand logic
  const collapseExpand = [
    { pane: paneA, idx: split.paneIndices[0], size: finalSizeA, min: minSizeA },
    { pane: paneB, idx: split.paneIndices[1], size: finalSizeB, min: minSizeB },
  ];
  for (const { pane, idx, size, min } of collapseExpand) {
    if (pane.collapsible && !pane.collapsed && size <= min / 2)
      return collapsePane(state, idx);
    if (pane.collapsible && pane.collapsed && size > min / 2)
      return expandPane(state, idx);
  }

  // Snap logic
  const snapThreshold = state.configuration.snapThreshold;
  if (snapThreshold > 0) {
    const snapToBounds = (size: number, minSize: number, maxSize: number) => {
      return Math.abs(size - minSize) <= snapThreshold
        ? minSize
        : Math.abs(size - maxSize) <= snapThreshold
          ? maxSize
          : size;
    };

    const originalSizeA = finalSizeA;
    const originalSizeB = finalSizeB;

    finalSizeA = snapToBounds(finalSizeA, minSizeA, maxSizeA);
    finalSizeB += originalSizeA - finalSizeA;

    finalSizeB = snapToBounds(finalSizeB, minSizeB, maxSizeB);
    finalSizeA += originalSizeB - finalSizeB;
  }

  const isWithinBounds =
    finalSizeA >= minSizeA &&
    finalSizeB >= minSizeB &&
    finalSizeA <= maxSizeA &&
    finalSizeB <= maxSizeB;

  if (!isWithinBounds) {
    return state;
  }

  // State update
  const scalingFactorA = finalSizeA / currentSizeA;
  const scalingFactorB = finalSizeB / currentSizeB;

  const updatedPanes = [...state.panes];
  updatedPanes[split.paneIndices[0]] = {
    ...paneA,
    currentSize: mapSizeDefinition(
      paneA.currentSize,
      (value) => value * scalingFactorA,
    ),
  };
  updatedPanes[split.paneIndices[1]] = {
    ...paneB,
    currentSize: mapSizeDefinition(
      paneB.currentSize,
      (value) => value * scalingFactorB,
    ),
  };

  return {
    ...state,
    panes: updatedPanes,
  };
}
