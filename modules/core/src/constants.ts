// CSS class names
export const CSS_CLASSES = {
  RESIZER_HORIZONTAL: "resizable-panes-resizer-horizontal",
  RESIZER_VERTICAL: "resizable-panes-resizer-vertical",
  CONTAINER: "resizable-panes-container",
  PANE: "resizable-panes-pane",
} as const;

// Default values
export const DEFAULTS = {
  DIRECTION: "horizontal" as const,
  DRAG_INTERVAL: 1,
  DRAG_AREA_SIZE: 10,
  SNAP_OFFSET: 30,
  SIZE: "1fr" as const,
  MIN_SIZE: "0px" as const,
  MAX_SIZE: "100fr" as const, // todo
  COLLAPSED_SIZE: "0px" as const,
} as const;

// Thresholds and limits
export const LIMITS = {
  MIN_PANES: 2,
  DECIMAL_PRECISION: 1,
} as const;
