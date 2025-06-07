import { getSplitPanes } from "../core/state";
import type { LayoutState } from "../core/types";

export function renderLayout(state: LayoutState): void {
  const container = state.configuration.container;
  const containerStyle = container.style;

  if (!state.active) {
    resetContainerStyles(containerStyle);
    return;
  }

  applyGridLayout(state, containerStyle);
}

function resetContainerStyles(style: CSSStyleDeclaration): void {
  style.display = "";
  style.gridTemplateColumns = "";
  style.gridTemplateRows = "";
}

function applyGridLayout(state: LayoutState, style: CSSStyleDeclaration): void {
  style.display = "grid";

  const isHorizontal = state.configuration.direction === "horizontal";
  const templateProperty = isHorizontal
    ? "gridTemplateColumns"
    : "gridTemplateRows";

  const template = state.splits
    .map((_split, index) => {
      const [paneA, paneB] = getSplitPanes(state, index);
      const isLast = index === state.splits.length - 1;

      const sizeA = paneA.collapsed ? paneA.collapsedSize : paneA.currentSize;
      const result = [sizeA, "auto"];

      if (isLast) {
        const sizeB = paneB.collapsed ? paneB.collapsedSize : paneB.currentSize;
        result.push(sizeB);
      }

      return result;
    })
    .flat()
    .join(" ");

  style[templateProperty] = template;
}
