import { getSplitPanes } from "./resize-split";
import { LayoutState } from "./types/layout";
import { PaneState } from "./types/pane";

export const updateLayout = (state: LayoutState): void => {
  const containerStyle = state.options.container.style;

  if (!state.active) {
    containerStyle.display = "";
    containerStyle.gridTemplateColumns = "";
    containerStyle.gridTemplateRows = "";

    return;
  }

  containerStyle.display = "grid";
  containerStyle[
    state.options.direction === "horizontal"
      ? "gridTemplateColumns"
      : "gridTemplateRows"
  ] = state.splits
    .flatMap((split, index) => {
      const isLast = index === state.splits.length - 1;
      const getSize = (pane: PaneState) =>
        pane.collapsed ? pane.options.collapsedSize : pane.size;

      const [paneA, paneB] = getSplitPanes(state, index);

      const result = [getSize(paneA), "auto"];
      if (isLast) {
        result.push(getSize(paneB));
      }

      return result;
    })
    .join(" ");
};
