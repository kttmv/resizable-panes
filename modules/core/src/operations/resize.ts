import { mapSizeDefinition, resolveSize } from "../core/size-utils";
import { getSplitPanes } from "../core/state";
import type { LayoutState } from "../core/types";

export function resizeSplit(
  state: LayoutState,
  splitIndex: number,
  offsetPx: number,
): LayoutState {
  const split = state.splits[splitIndex];
  const [paneA, paneB] = getSplitPanes(state, splitIndex);

  // Calculate current sizes in pixels
  const currentSizeA = resolveSize(paneA.currentSize, state);
  const currentSizeB = resolveSize(paneB.currentSize, state);

  // Calculate new sizes
  const newSizeA = currentSizeA + offsetPx;
  const newSizeB = currentSizeB - offsetPx;

  // Check constraints
  const minSizeA = resolveSize(paneA.minSize, state);
  const minSizeB = resolveSize(paneB.minSize, state);
  const maxSizeA = resolveSize(paneA.maxSize, state);
  const maxSizeB = resolveSize(paneB.maxSize, state);

  if (
    newSizeA < minSizeA ||
    newSizeB < minSizeB ||
    newSizeA > maxSizeA ||
    newSizeB > maxSizeB
  ) {
    return state; // Invalid resize, return unchanged state
  }

  // Calculate scaling factors
  const factorA = newSizeA / currentSizeA;
  const factorB = newSizeB / currentSizeB;

  // Apply scaling to preserve relative sizes
  const newPaneSizeA = mapSizeDefinition(
    paneA.currentSize,
    (value) => value * factorA,
  );
  const newPaneSizeB = mapSizeDefinition(
    paneB.currentSize,
    (value) => value * factorB,
  );

  // Update pane sizes
  const updatedPanes = [...state.panes];
  updatedPanes[split.paneIndices[0]] = {
    ...paneA,
    currentSize: newPaneSizeA,
  };
  updatedPanes[split.paneIndices[1]] = {
    ...paneB,
    currentSize: newPaneSizeB,
  };

  return {
    ...state,
    panes: updatedPanes,
  };
}
