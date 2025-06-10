export const CSS_CLASSES = {
  RESIZER_COLUMN: "origami-grids-resizer-column",
  RESIZER_ROW: "origami-grids-resizer-row",
  CONTAINER: "origami-grids-container",
} as const;

export const DEFAULTS = {
  DRAG_INTERVAL: 1,
  DRAG_AREA_SIZE: 10,
  SNAP_THRESHOLD: 30,
  SIZE: "1fr" as const,
  MIN_SIZE: "0px" as const,
  MAX_SIZE: "100fr" as const, // todo: replace with 'infinity' or something
  COLLAPSED_SIZE: "0px" as const,
} as const;

export const LIMITS = {
  MIN_PANES: 2,
} as const;
