import { DEFAULTS, LIMITS } from "../constants";
import type {
  LayoutConfiguration,
  PaneConfiguration,
  SizeDefinition,
} from "./types";

export const DEFAULT_LAYOUT_CONFIG: Required<
  Pick<
    LayoutConfiguration,
    "direction" | "dragInterval" | "dragAreaSize" | "snapThreshold"
  >
> = {
  direction: DEFAULTS.DIRECTION,
  dragInterval: DEFAULTS.DRAG_INTERVAL,
  dragAreaSize: DEFAULTS.DRAG_AREA_SIZE,
  snapThreshold: DEFAULTS.SNAP_THRESHOLD,
};

export const DEFAULT_PANE_CONFIG: Required<
  Pick<
    PaneConfiguration,
    | "resizable"
    | "collapsible"
    | "collapsed"
    | "collapsedSize"
    | "size"
    | "minSize"
    | "maxSize"
  >
> = {
  resizable: true,
  collapsible: false,
  collapsed: false,
  collapsedSize: DEFAULTS.COLLAPSED_SIZE,
  size: DEFAULTS.SIZE,
  minSize: DEFAULTS.MIN_SIZE,
  maxSize: DEFAULTS.MAX_SIZE,
};

// Configuration normalization
export function normalizeLayoutConfiguration(
  config: LayoutConfiguration,
): Required<LayoutConfiguration> {
  return {
    ...DEFAULT_LAYOUT_CONFIG,
    ...config,
  };
}

export function normalizePaneConfiguration(
  config: PaneConfiguration,
): Required<PaneConfiguration> {
  return {
    ...DEFAULT_PANE_CONFIG,
    ...config,
  };
}

// Validation functions
export function validateLayoutConfiguration(config: LayoutConfiguration): void {
  if (!config.container) {
    throw new Error("Container element is required");
  }
  if (!config.panes || config.panes.length < LIMITS.MIN_PANES) {
    throw new Error(`At least ${LIMITS.MIN_PANES} panes must be provided`);
  }

  if (
    config.direction &&
    !["horizontal", "vertical"].includes(config.direction)
  ) {
    throw new Error(
      `Invalid direction "${config.direction}". Must be "horizontal" or "vertical"`,
    );
  }

  // Validate that all pane elements have the same parent
  const parent = config.panes[0].element.parentElement;
  if (!parent) {
    throw new Error("Pane elements must have a parent element");
  }

  for (const pane of config.panes) {
    if (pane.element.parentElement !== parent) {
      throw new Error("All pane elements must have the same parent");
    }
    validatePaneConfiguration(pane);
  }
}

export function validatePaneConfiguration(config: PaneConfiguration): void {
  if (!config.element) {
    throw new Error("Pane element is required");
  }

  if (config.size && !isValidSizeDefinition(config.size)) {
    throw new Error(`Invalid size definition: ${config.size}`);
  }

  if (config.minSize && !isValidSizeDefinition(config.minSize)) {
    throw new Error(`Invalid minSize definition: ${config.minSize}`);
  }

  if (config.maxSize && !isValidSizeDefinition(config.maxSize)) {
    throw new Error(`Invalid maxSize definition: ${config.maxSize}`);
  }

  if (config.collapsedSize && !isValidSizeDefinition(config.collapsedSize)) {
    throw new Error(
      `Invalid collapsedSize definition: ${config.collapsedSize}`,
    );
  }
}

function isValidSizeDefinition(size: string): size is SizeDefinition {
  return size.endsWith("px") || size.endsWith("fr");
}
