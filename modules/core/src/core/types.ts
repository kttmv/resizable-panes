// Size-related types
export type SizeDefinition = `${number}px` | `${number}fr`;
export type Direction = "horizontal" | "vertical";

// Pane configuration
export interface PaneConfiguration {
  element: HTMLElement;
  size?: SizeDefinition;
  minSize?: SizeDefinition;
  maxSize?: SizeDefinition;
  resizable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  collapsedSize?: SizeDefinition;
}

// Layout configuration
export interface LayoutConfiguration {
  container: HTMLElement;
  direction?: Direction;
  panes: PaneConfiguration[];
  dragInterval?: number;
  dragAreaSize?: number;
  snapThreshold?: number;
}

// Internal state types
export interface PaneState extends Required<PaneConfiguration> {
  collapsed: boolean;
  currentSize: SizeDefinition;
}

export interface SplitState {
  paneIndices: [number, number];
  resizerElement: HTMLElement;
}

export interface LayoutState {
  configuration: Required<LayoutConfiguration>;
  active: boolean;
  panes: PaneState[];
  splits: SplitState[];
}

// Public API
export interface ResizableLayoutInstance {
  activate(): void;
  deactivate(): void;
  resize(paneIndex: number, newSize: SizeDefinition): void;
  collapse(paneIndex: number): void;
  expand(paneIndex: number): void;
  setMinSize(paneIndex: number, minSize: SizeDefinition): void;
  setMaxSize(paneIndex: number, maxSize: SizeDefinition): void;
  getState(): Readonly<LayoutState>;
  refresh(): void;
  destroy(): void;
}

// Event handling
export type StateUpdater = (state: LayoutState) => LayoutState;
export type UpdateStateFunction = (updater: StateUpdater) => void;
