import { createInitialState } from "./create-initial-state";
import { insertResizers, updateLayout } from "./render-layout";
import { ResizableLayoutInstance } from "./types/instance";
import { LayoutOptions, LayoutState } from "./types/layout";

export const createResizableLayout = (
  options: LayoutOptions,
): ResizableLayoutInstance => {
  let state = createInitialState(options);

  insertResizers(state);

  const updateState = (updater: (state: LayoutState) => LayoutState) => {
    const newState = updater(state);
    if (newState !== state) {
      state = newState;
      updateLayout(state);
    }
  };

  updateLayout(state);
  //   attachEventListeners(state, updateState);

  return {
    // resize: (paneIndex: number, newSize: SizeDefinition) => {
    //     updateState((state) => resizePane(state, paneIndex, newSize));
    // },
    // collapse: (paneIndex: number) => {
    //     updateState((state) => toggleCollapse(state, paneIndex, true));
    // },
    // expand: (paneIndex: number) => {
    //     updateState((state) => toggleCollapse(state, paneIndex, false));
    // },
    // setMinSize: (paneIndex: number, minSize: SizeDefinition) => {
    //     updateState((state) =>
    //       updatePaneConstraints(state, paneIndex, { minSize })
    //     );
    // },
    // setMaxSize: (paneIndex: number, maxSize: SizeDefinition) => {
    //     updateState((state) =>
    //       updatePaneConstraints(state, paneIndex, { maxSize })
    //     );
    // },
    // getState: () => ({ ...state }),
    // refresh: () => {
    //     updateState((state) => recalculateLayout(state));
    // },
    // destroy: () => {
    //     cleanupEventListeners(state);
    //     removeResizers(state);
    // },
  };
};
