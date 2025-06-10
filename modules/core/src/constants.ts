export const CSS_CLASSES = {
  RESIZER_HORIZONTAL: "origami-grids-resizer-horizontal",
  RESIZER_VERTICAL: "origami-grids-resizer-vertical",
  CONTAINER: "origami-grids-container",
  PANE: "origami-grids-pane",
} as const;

export const DEFAULTS = {
  DIRECTION: "horizontal" as const,
  DRAG_INTERVAL: 1,
  DRAG_AREA_SIZE: 10,
  SNAP_THRESHOLD: 30,
  SIZE: "1fr" as const,
  MIN_SIZE: "0px" as const,
  MAX_SIZE: "100fr" as const, // todo
  COLLAPSED_SIZE: "0px" as const,
} as const;

export const LIMITS = {
  MIN_PANES: 2,
} as const;
