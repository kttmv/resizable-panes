import type { LayoutState, SizeDefinition } from "./types";

export function parsePx(value: string): number | undefined {
  if (!value.endsWith("px")) return undefined;
  const num = value.slice(0, -2);
  const n = Number(num);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFr(value: string): number | undefined {
  if (!value.endsWith("fr")) return undefined;
  const num = value.slice(0, -2);
  const n = Number(num);
  return Number.isFinite(n) ? n : undefined;
}

export function isPxSize(value: string): value is `${number}px` {
  return parsePx(value) !== undefined;
}

export function isFrSize(value: string): value is `${number}fr` {
  return parseFr(value) !== undefined;
}

export function mapSizeDefinition(
  size: SizeDefinition,
  mapper: (value: number) => number,
): SizeDefinition {
  const unit = size.endsWith("px") ? "px" : "fr";
  const num = Number(size.slice(0, -unit.length));
  const newValue = mapper(num);
  return `${newValue}${unit}` as SizeDefinition;
}

export function createSizeDefinition(
  value: number,
  unit: "px" | "fr",
): SizeDefinition {
  return `${value}${unit}` as SizeDefinition;
}

export function resolveSize(size: SizeDefinition, state: LayoutState): number {
  const pxValue = parsePx(size);
  if (pxValue !== undefined) {
    return pxValue;
  }

  const frValue = parseFr(size);
  if (frValue !== undefined) {
    return resolveFractionalSize(frValue, state);
  }

  throw new Error(`Invalid size definition: ${size}`);
}

function resolveFractionalSize(frValue: number, state: LayoutState): number {
  const totalPxFromPanes = state.panes.reduce((sum, pane) => {
    const pxValue = parsePx(pane.currentSize);
    return pxValue !== undefined ? sum + pxValue : sum;
  }, 0);

  const totalPxFromResizers = state.splits.reduce((sum, split) => {
    return sum + getElementSize(split.resizerElement, state);
  }, 0);

  const totalFr = state.panes.reduce((sum, pane) => {
    const frValue = parseFr(pane.currentSize);
    return frValue !== undefined ? sum + frValue : sum;
  }, 0);

  if (totalFr === 0) {
    throw new Error(
      "Cannot resolve fractional size when total fractional units is 0",
    );
  }

  const containerSize = getElementSize(state.configuration.container, state);
  const availableSpace = containerSize - totalPxFromPanes - totalPxFromResizers;

  return Math.max(0, (frValue / totalFr) * availableSpace);
}

function getElementSize(element: HTMLElement, state: LayoutState): number {
  const rect = element.getBoundingClientRect();
  return state.configuration.direction === "horizontal"
    ? rect.width
    : rect.height;
}
