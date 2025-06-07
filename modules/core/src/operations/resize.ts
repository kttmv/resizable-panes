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

  const currentSizeA = resolveSize(paneA.currentSize, state);
  const currentSizeB = resolveSize(paneB.currentSize, state);

  const minSizeA = resolveSize(paneA.minSize, state);
  const minSizeB = resolveSize(paneB.minSize, state);
  const maxSizeA = resolveSize(paneA.maxSize, state);
  const maxSizeB = resolveSize(paneB.maxSize, state);

  let newSizeA = currentSizeA + offsetPx;
  let newSizeB = currentSizeB - offsetPx;

  const snapOffset = state.configuration.snapOffset;
  if (snapOffset > 0) {
    // Check if pane A should snap to min/max
    if (Math.abs(newSizeA - minSizeA) <= snapOffset) {
      const snapOffsetA = newSizeA - minSizeA;
      newSizeA = minSizeA;
      newSizeB = newSizeB + snapOffsetA;
    } else if (Math.abs(newSizeA - maxSizeA) <= snapOffset) {
      const snapOffsetA = newSizeA - maxSizeA;
      newSizeA = maxSizeA;
      newSizeB = newSizeB + snapOffsetA;
    }

    // Check if pane B should snap to min/max
    if (Math.abs(newSizeB - minSizeB) <= snapOffset) {
      const snapOffsetB = newSizeB - minSizeB;
      newSizeB = minSizeB;
      newSizeA = newSizeA + snapOffsetB;
    } else if (Math.abs(newSizeB - maxSizeB) <= snapOffset) {
      const snapOffsetB = newSizeB - maxSizeB;
      newSizeB = maxSizeB;
      newSizeA = newSizeA + snapOffsetB;
    }
  }

  if (
    newSizeA < minSizeA ||
    newSizeB < minSizeB ||
    newSizeA > maxSizeA ||
    newSizeB > maxSizeB
  ) {
    return state;
  }

  const factorA = newSizeA / currentSizeA;
  const factorB = newSizeB / currentSizeB;

  const newPaneSizeA = mapSizeDefinition(
    paneA.currentSize,
    (value) => value * factorA,
  );
  const newPaneSizeB = mapSizeDefinition(
    paneB.currentSize,
    (value) => value * factorB,
  );

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
