import { LayoutState } from "./types/layout";
import { SizeDefinition } from "./types/size";

export const mapSizeDefinition = (
  size: SizeDefinition,
  fn: (value: number) => number,
): SizeDefinition => {
  const unit = size.endsWith("px") ? "px" : "fr";
  const num = Number(size.slice(0, -unit.length));
  const newValue = fn(num);
  return `${newValue}${unit}` as SizeDefinition;
};

const parseWithSuffix = (value: string, suffix: string): number | undefined => {
  if (!value.endsWith(suffix)) return undefined;
  const num = value.slice(0, -suffix.length);
  const n = Number(num);
  return Number.isFinite(n) ? n : undefined;
};

const parsePx = (value: string): number | undefined => {
  return parseWithSuffix(value, "px");
};

const parseFr = (value: string): number | undefined => {
  return parseWithSuffix(value, "fr");
};

export const resolveSize = (
  size: SizeDefinition,
  state: LayoutState,
): number => {
  const px = parsePx(size);
  if (px !== undefined) {
    return px;
  }

  const fr = parseFr(size);
  if (fr !== undefined) {
    let totalPx = state.panes.reduce((sum, pane) => {
      const panePx = parsePx(pane.size);
      return panePx !== undefined ? sum + panePx : sum;
    }, 0);

    totalPx += state.splits.reduce((sum, split) => {
      const resizerPx = getElementSize(split.resizerElement, state);
      return sum + resizerPx;
    }, 0);

    const totalFr = state.panes.reduce((sum, pane) => {
      const paneFr = parseFr(pane.size);
      return paneFr !== undefined ? sum + paneFr : sum;
    }, 0);

    const containerSizePx = getElementSize(state.options.container, state);

    return (fr / totalFr) * (containerSizePx - totalPx);
  }

  throw new Error(`Invalid size definition: ${size}`);
};

export function getElementSize(
  element: HTMLElement,
  state: LayoutState,
): number {
  const rect = element.getBoundingClientRect();
  return state.options.direction === "horizontal" ? rect.width : rect.height;
}
