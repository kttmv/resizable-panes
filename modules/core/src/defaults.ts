import { GetOptional } from "./types/helpers";
import { LayoutOptions } from "./types/layout";
import { PaneOptions } from "./types/pane";

export const defaultLayoutOptions: Required<GetOptional<LayoutOptions>> = {
  direction: "horizontal",
  dragInterval: 1,
  snapOffset: 30,
};

export const defaultPaneOptions: Required<GetOptional<PaneOptions>> = {
  resizable: true,
  collapsible: false,
  collapsed: false,
  collapsedSize: "0px",
  size: "1fr",
  minSize: "0px",
  maxSize: "100fr", // todo
};
