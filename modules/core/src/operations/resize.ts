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

  console.log(
    `Resizing split ${splitIndex}: newResizerPosition=${newResizerPosition}, resizerSize=${resizerSize}, currentSizeA=${currentSizeA}, currentSizeB=${currentSizeB}`,
  );

  const newSizeA = newResizerPosition - resizerSize / 2;
  const newSizeB = currentSizeA + currentSizeB - newSizeA;

  console.log(
    `Calculated new sizes: newSizeA=${newSizeA}, newSizeB=${newSizeB}`,
  );

  const minSizeA = resolveSize(paneA.minSize, state);
  const minSizeB = resolveSize(paneB.minSize, state);
  const maxSizeA = resolveSize(paneA.maxSize, state);
  const maxSizeB = resolveSize(paneB.maxSize, state);

  let finalSizeA = newSizeA;
  let finalSizeB = newSizeB;

  // Collapsing logic: if pane is collapsible and dragged below half min size, collapse it
  const shouldCollapseA =
    paneA.collapsible && !paneA.collapsed && finalSizeA <= minSizeA / 2;
  const shouldCollapseB =
    paneB.collapsible && !paneB.collapsed && finalSizeB <= minSizeB / 2;
  if (shouldCollapseA) {
    return collapsePane(state, split.paneIndices[0]);
  } else if (shouldCollapseB) {
    return collapsePane(state, split.paneIndices[1]);
  }

  // Expanding logic: if collapsed pane is resized for more than half its min size, expand it
  const shouldExpandA =
    paneA.collapsible && paneA.collapsed && finalSizeA > minSizeA / 2;
  const shouldExpandB =
    paneB.collapsible && paneB.collapsed && finalSizeB > minSizeB / 2;
  if (shouldExpandA) {
    return expandPane(state, split.paneIndices[0]);
  } else if (shouldExpandB) {
    return expandPane(state, split.paneIndices[1]);
  }

  const snapOffset = state.configuration.snapOffset;
  if (snapOffset > 0) {
    // Check if pane A should snap to min/max
    if (Math.abs(finalSizeA - minSizeA) <= snapOffset) {
      const snapOffsetA = finalSizeA - minSizeA;
      finalSizeA = minSizeA;
      finalSizeB = finalSizeB + snapOffsetA;

      console.log(
        `Pane A snapped to min size: finalSizeA=${finalSizeA}, finalSizeB=${finalSizeB}`,
      );
    } else if (Math.abs(finalSizeA - maxSizeA) <= snapOffset) {
      const snapOffsetA = finalSizeA - maxSizeA;
      finalSizeA = maxSizeA;
      finalSizeB = finalSizeB + snapOffsetA;

      console.log(
        `Pane A snapped to max size: finalSizeA=${finalSizeA}, finalSizeB=${finalSizeB}`,
      );
    }

    // Check if pane B should snap to min/max
    if (Math.abs(finalSizeB - minSizeB) <= snapOffset) {
      const snapOffsetB = finalSizeB - minSizeB;
      finalSizeB = minSizeB;
      finalSizeA = finalSizeA + snapOffsetB;

      console.log(
        `Pane B snapped to min size: finalSizeA=${finalSizeA}, finalSizeB=${finalSizeB}`,
      );
    } else if (Math.abs(finalSizeB - maxSizeB) <= snapOffset) {
      const snapOffsetB = finalSizeB - maxSizeB;
      finalSizeB = maxSizeB;
      finalSizeA = finalSizeA + snapOffsetB;

      console.log(
        `Pane B snapped to max size: finalSizeA=${finalSizeA}, finalSizeB=${finalSizeB}`,
      );
    }
  }

  if (
    finalSizeA < minSizeA ||
    finalSizeB < minSizeB ||
    finalSizeA > maxSizeA ||
    finalSizeB > maxSizeB
  ) {
    console.warn(
      `Invalid sizes after resizing: finalSizeA=${finalSizeA}, finalSizeB=${finalSizeB}, minSizeA=${minSizeA}, minSizeB=${minSizeB}, maxSizeA=${maxSizeA}, maxSizeB=${maxSizeB}`,
    );
    return state;
  }

  const factorA = finalSizeA / currentSizeA;
  const factorB = finalSizeB / currentSizeB;

  console.log(
    `Resize factors: factorA=${factorA}, factorB=${factorB}, currentSizeA=${currentSizeA}, currentSizeB=${currentSizeB}`,
  );

  const newPaneSizeA = mapSizeDefinition(
    paneA.currentSize,
    (value) => value * factorA,
  );
  const newPaneSizeB = mapSizeDefinition(
    paneB.currentSize,
    (value) => value * factorB,
  );

  console.log(
    `Final sizes after mapping: newPaneSizeA=${newPaneSizeA}, newPaneSizeB=${newPaneSizeB}`,
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
