import type { LayoutState, OrigamiSizeDefinition } from "../core/types";

export function updateConstraints(
  state: LayoutState,
  paneIndex: number,
  constraints: {
    minSize?: OrigamiSizeDefinition;
    maxSize?: OrigamiSizeDefinition;
  },
): LayoutState {
  const updatedPanes = [...state.panes];
  updatedPanes[paneIndex] = {
    ...updatedPanes[paneIndex],
    ...constraints,
  };

  return {
    ...state,
    panes: updatedPanes,
  };
}
