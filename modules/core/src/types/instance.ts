export type ResizableLayoutInstance = {
  // // Manual control methods
  // resize(paneIndex: number, newSize: SizeDefinition): void;
  // collapse(paneIndex: number): void;
  // expand(paneIndex: number): void;
  // setMinSize(paneIndex: number, minSize: SizeDefinition): void;
  // setMaxSize(paneIndex: number, maxSize: SizeDefinition): void;
  // // State access
  // getState(): LayoutState;
  // // Lifecycle
  // refresh(): void; // recalculate after DOM changes
  activate: () => void;
  deactivate: () => void;
};
