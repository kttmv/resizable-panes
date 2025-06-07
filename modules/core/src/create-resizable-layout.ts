import { createInitialState } from "./create-initial-state";
import { updateLayout as renderLayout } from "./render-layout";
import {
  attachResizerEventListeners,
  insertResizers,
  removeResizers,
} from "./resizers";
import { ResizableLayoutInstance } from "./types/instance";
import { LayoutOptions } from "./types/layout";
import { UpdateStateFunction } from "./types/state";

export const createResizableLayout = (
  options: LayoutOptions,
): ResizableLayoutInstance => {
  let state = createInitialState(options);

  const updateState: UpdateStateFunction = (updater) => {
    const newState = updater(state);
    if (newState !== state) {
      state = newState;
      renderLayout(state);
    }
  };

  attachResizerEventListeners(state, updateState);

  return {
    activate: () => {
      insertResizers(state);
      updateState((state) => ({ ...state, active: true }));
    },
    deactivate: () => {
      removeResizers(state);
      updateState((state) => ({ ...state, active: false }));
    },
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
