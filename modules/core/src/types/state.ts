import { LayoutState } from "./layout";

export type UpdateStateFunction = (
  updater: (state: LayoutState) => LayoutState,
) => void;
