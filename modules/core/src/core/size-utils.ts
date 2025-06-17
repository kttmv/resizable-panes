import { GridState } from "../types/internal";
import { SizeUnits } from "../types/public";

export function resolveSize(
  value: number,
  units: SizeUnits,
  state: GridState,
): number {
  if (units === "px") {
    return value;
  }

  if (units === "fr") {
    return resolveFractionalSize(value, state);
  }

  throw new Error(`Unsupported size units: ${units}`);
}

function resolveFractionalSize(value: number, state: GridState): number {
  const totalFoldsPx = state.folds.reduce(
    (sum, fold) => (fold.units === "px" ? sum + fold.size : sum),
    0,
  );

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

  return Math.max(0, (value / totalFr) * availableSpace);
}

function getElementSize(element: HTMLElement, state: LayoutState): number {
  const rect = element.getBoundingClientRect();
  return state.configuration.direction === "horizontal"
    ? rect.width
    : rect.height;
}
