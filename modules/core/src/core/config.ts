import { GridConfiguration, TrackOptions } from "../types/public";

export const DEFAULT_GRID_CONFIG: Required<
  Pick<GridConfiguration, "dragInterval" | "dragAreaSize">
> = {
  dragInterval: 10,
  dragAreaSize: 10,
};

export const DEFAULT_TRACK_CONFIG: Required<
  Pick<
    TrackOptions,
    | "units"
    | "size"
    | "minSize"
    | "maxSize"
    | "collapsible"
    | "collapsed"
    | "collapsedSize"
    | "snapThreshold"
  >
> = {
  units: "fr",
  collapsible: false,
  collapsed: false,
  collapsedSize: 0,
  size: 1,
  minSize: 0,
  maxSize: Infinity,
  snapThreshold: 25,
};

// Configuration normalization
export function normalizeGridConfiguration(
  config: GridConfiguration,
): Required<GridConfiguration> {
  return {
    ...DEFAULT_GRID_CONFIG,
    ...config,
    resizers: !config.resizers
      ? { horizontal: [], vertical: [] }
      : config.resizers,
    tracks: !config.tracks ? { rows: [], columns: [] } : config.tracks,
  };
}

export function normalizeFoldConfiguration(
  config: FoldConfiguration,
): Required<FoldConfiguration> {
  return {
    ...DEFAULT_FOLD_CONFIG,
    ...config,
  };
}
