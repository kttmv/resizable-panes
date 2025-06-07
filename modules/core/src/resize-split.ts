import { mapSizeDefinition, resolveSize } from "./size";
import { LayoutState } from "./types/layout";
import { PaneState } from "./types/pane";

export const resizeSplit = (
  state: LayoutState,
  splitIndex: number,
  offset_px: number,
): LayoutState => {
  const split = state.splits[splitIndex];
  const [paneA, paneB] = [
    state.panes[split.paneIndices[0]],
    state.panes[split.paneIndices[1]],
  ];

  const sizeA_px = resolveSize(paneA.size, state);
  const sizeB_px = resolveSize(paneB.size, state);

  const newSizeA_px = sizeA_px + offset_px;
  const newSizeB_px = sizeB_px - offset_px;

  const factorA = newSizeA_px / sizeA_px;
  const factorB = newSizeB_px / sizeB_px;

  const newPaneA = {
    ...paneA,
    size: mapSizeDefinition(paneA.size, (value) => value * factorA),
  };
  const newPaneB = {
    ...paneB,
    size: mapSizeDefinition(paneB.size, (value) => value * factorB),
  };

  return {
    ...state,
    panes: state.panes.map((pane, index) => {
      if (index === split.paneIndices[0]) {
        return newPaneA;
      } else if (index === split.paneIndices[1]) {
        return newPaneB;
      }
      return pane;
    }),
  };
};

export const getSplitPanes = (
  state: LayoutState,
  splitIndex: number,
): [PaneState, PaneState] => {
  const split = state.splits[splitIndex];
  return [state.panes[split.paneIndices[0]], state.panes[split.paneIndices[1]]];
};
