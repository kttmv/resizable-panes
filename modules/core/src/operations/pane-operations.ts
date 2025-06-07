import type { LayoutState, SizeDefinition } from "../core/types";

export function resizePane(
  state: LayoutState,
  paneIndex: number,
  newSize: SizeDefinition,
): LayoutState {
  const updatedPanes = [...state.panes];
  updatedPanes[paneIndex] = {
    ...updatedPanes[paneIndex],
    currentSize: newSize,
  };

  return {
    ...state,
    panes: updatedPanes,
  };
}

export function collapsePane(
  state: LayoutState,
  paneIndex: number,
): LayoutState {
  const pane = state.panes[paneIndex];

  if (!pane.collapsible) {
    return state;
  }

  const updatedPanes = [...state.panes];
  updatedPanes[paneIndex] = {
    ...pane,
    collapsed: true,
  };

  return {
    ...state,
    panes: updatedPanes,
  };
}

export function expandPane(state: LayoutState, paneIndex: number): LayoutState {
  const pane = state.panes[paneIndex];

  const updatedPanes = [...state.panes];
  updatedPanes[paneIndex] = {
    ...pane,
    collapsed: false,
  };

  return {
    ...state,
    panes: updatedPanes,
  };
}
