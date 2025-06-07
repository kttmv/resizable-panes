import { SizeDefinition } from "./size";

export type PaneOptions = {
  element: HTMLElement;

  resizable?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;

  size?: SizeDefinition;
  minSize?: SizeDefinition;
  maxSize?: SizeDefinition;
  collapsedSize?: SizeDefinition;
};

export type PaneState = {
  options: PaneOptions;
  collapsed: boolean;
  size: SizeDefinition;
};
