export type SizeDefinition = `${number}px` | `${number}fr`;
export type Axis = "row" | "column";

export type FoldConfiguration = {
  size?: SizeDefinition;
  minSize?: SizeDefinition;
  maxSize?: SizeDefinition;
  resizable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  collapsedSize?: SizeDefinition;
};

export type ResizerConfiguration = {
  track: number;
  element: HTMLElement;
};

export type GridConfiguration = {
  container: HTMLElement;
  rows: number;
  columns: number;
  resizers:
    | {
        horizontal: ResizerConfiguration[];
        vertical?: ResizerConfiguration[];
      }
    | {
        horizontal?: ResizerConfiguration[];
        vertical: ResizerConfiguration[];
      };
  foldsConfiguration?:
    | { rows: FoldConfiguration[]; columns?: FoldConfiguration[] }
    | {
        rows?: FoldConfiguration[];
        columns: FoldConfiguration[];
      };
  dragInterval?: number;
  dragAreaSize?: number;
  snapThreshold?: number;
};

export interface OrigamiGridInstance {
  activate(): void;
  deactivate(): void;

  destroy(): void;

  resize(axis: Axis, index: number, newSize: SizeDefinition): void;

  collapse(axis: Axis, index: number): void;

  expand(axis: Axis, rowIndex: number): void;

  setMinSize(axis: Axis, index: number, minSize: SizeDefinition): void;
  setMaxSize(axis: Axis, index: number, maxSize: SizeDefinition): void;
}
