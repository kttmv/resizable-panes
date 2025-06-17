import { GridConfiguration, TrackOptions } from "./public";

export type TrackState = Required<TrackOptions> & {
  collapsed: boolean;
  size: number;
};

export type SplitState = {
  trackIndices: [number, number];
  resizerElement: HTMLElement;
};

export interface GridState {
  configuration: Required<GridConfiguration>;
  active: boolean;
  tracks: TrackState[];
  splits: SplitState[];
}
export type StateUpdater = (state: GridState) => GridState;
export type UpdateStateFunction = (updater: StateUpdater) => void;
