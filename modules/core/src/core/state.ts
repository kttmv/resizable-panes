import { createResizerElement } from "../ui/resizers";
import {
  normalizeLayoutConfiguration,
  normalizePaneConfiguration,
} from "./config";
import type {
  LayoutConfiguration,
  LayoutState,
  PaneState,
  SizeDefinition,
  SplitState,
} from "./types";

// State creation
export function createInitialState(config: LayoutConfiguration): LayoutState {
  const normalizedConfig = normalizeLayoutConfiguration(config);

  const panes: PaneState[] = normalizedConfig.panes.map((paneConfig) => {
    const normalizedPane = normalizePaneConfiguration(paneConfig);

    return {
      ...normalizedPane,
      currentSize: normalizedPane.size,
    };
  });

  const splits: SplitState[] = [];
  for (let i = 0; i < panes.length - 1; i++) {
    splits.push({
      paneIndices: [i, i + 1],
      resizerElement: createResizerElement(normalizedConfig),
    });
  }

  return {
    configuration: normalizedConfig,
    active: false,
    panes,
    splits,
  };
}

// State updates
export function updatePaneSize(
  state: LayoutState,
  paneIndex: number,
  newSize: SizeDefinition,
): LayoutState {
  const newPanes = [...state.panes];
  newPanes[paneIndex] = {
    ...newPanes[paneIndex],
    currentSize: newSize,
  };

  return {
    ...state,
    panes: newPanes,
  };
}

export function updatePaneCollapsed(
  state: LayoutState,
  paneIndex: number,
  collapsed: boolean,
): LayoutState {
  const newPanes = [...state.panes];
  newPanes[paneIndex] = {
    ...newPanes[paneIndex],
    collapsed,
  };

  return {
    ...state,
    panes: newPanes,
  };
}

export function updatePaneConstraints(
  state: LayoutState,
  paneIndex: number,
  constraints: { minSize?: SizeDefinition; maxSize?: SizeDefinition },
): LayoutState {
  const newPanes = [...state.panes];
  newPanes[paneIndex] = {
    ...newPanes[paneIndex],
    ...constraints,
  };

  return {
    ...state,
    panes: newPanes,
  };
}

export function activateLayout(state: LayoutState): LayoutState {
  return {
    ...state,
    active: true,
  };
}

export function deactivateLayout(state: LayoutState): LayoutState {
  return {
    ...state,
    active: false,
  };
}

// State queries
export function getSplitPanes(
  state: LayoutState,
  splitIndex: number,
): [PaneState, PaneState] {
  const split = state.splits[splitIndex];
  return [state.panes[split.paneIndices[0]], state.panes[split.paneIndices[1]]];
}

export function findSplitByPane(
  state: LayoutState,
  paneIndex: number,
): { leftSplit?: number; rightSplit?: number } {
  const leftSplit = state.splits.findIndex(
    (split) => split.paneIndices[1] === paneIndex,
  );

  const rightSplit = state.splits.findIndex(
    (split) => split.paneIndices[0] === paneIndex,
  );

  return {
    leftSplit: leftSplit >= 0 ? leftSplit : undefined,
    rightSplit: rightSplit >= 0 ? rightSplit : undefined,
  };
}
