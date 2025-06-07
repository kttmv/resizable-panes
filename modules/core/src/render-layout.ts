import { LayoutState } from "./types/layout";
import { PaneState } from "./types/pane";

export const insertResizers = (state: LayoutState): void => {
  for (const split of state.splits) {
    split.panes[0].options.element.after(split.resizerElement);
  }
};

export const updateLayout = (state: LayoutState): void => {
  const containerStyle = state.options.container.style;

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

      const result = [getSize(split.panes[0]), "auto"];
      if (isLast) {
        result.push(getSize(split.panes[1]));
      }

      return result;
    })
    .join(" ");
};
