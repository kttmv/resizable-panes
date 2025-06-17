export type Axis = "row" | "column";
export type SizeUnits = "fr" | "px";

export type TrackOptions = {
  units?: SizeUnits;

  size?: number;
  minSize?: number;
  maxSize?: number;

  collapsible?: boolean;
  collapsed?: boolean;
  collapsedSize?: number;

  snapThreshold?: number;
};

export type TrackConfiguration = TrackOptions & {
  a: number;
};

export type ResizerConfiguration = {
  element: HTMLElement;

  track: number;
  axis: Axis;
};

const a = [
  {
    a: 1,
    b: 2,
  },
  {},
  { c: 3 },
];

export type GridConfiguration = {
  container: HTMLElement;

  dragInterval?: number;
  dragAreaSize?: number;

  resizers:
    | {
        horizontal: ResizerConfiguration[];
        vertical?: ResizerConfiguration[];
      }
    | {
        horizontal?: ResizerConfiguration[];
        vertical: ResizerConfiguration[];
      };

  tracks?:
    | {
        default?: TrackOptions;
        rows: TrackOptions[];
        columns?: TrackOptions[];
      }
    | {
        default?: TrackOptions;
        rows?: TrackOptions[];
        columns: TrackOptions[];
      };
};

export interface OrigamiGridInstance {
  activate(): void;
  deactivate(): void;

  destroy(): void;

  resize(axis: Axis, index: number, newSize: number): void;

  collapse(axis: Axis, index: number): void;

  expand(axis: Axis, rowIndex: number): void;

  setMinSize(axis: Axis, index: number, minSize: number): void;
  setMaxSize(axis: Axis, index: number, maxSize: number): void;
}
