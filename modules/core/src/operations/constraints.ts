import type { LayoutState, SizeDefinition } from "../core/types";

export function updateConstraints(
  state: LayoutState,
  paneIndex: number,
  constraints: { minSize?: SizeDefinition; maxSize?: SizeDefinition },
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
