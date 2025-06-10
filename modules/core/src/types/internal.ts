import { FoldConfiguration, GridConfiguration, SizeDefinition } from "./public";

export type FoldState = Required<FoldConfiguration> & {
  collapsed: boolean;
  size: SizeDefinition;
};

export type SplitState = {
  foldIndices: [number, number];
  resizerElement: HTMLElement;
};

export interface GridState {
  configuration: Required<GridConfiguration>;
  active: boolean;
  folds: FoldState[];
  splits: SplitState[];
}
export type StateUpdater = (state: GridState) => GridState;
export type UpdateStateFunction = (updater: StateUpdater) => void;
