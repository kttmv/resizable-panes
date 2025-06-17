import { UpdateStateFunction } from "../types/internal";
import { GridConfiguration, OrigamiGridInstance } from "../types/public";
import { attachEventListeners, detachEventListeners } from "../ui/events";
import { renderLayout } from "../ui/renderer";
import { removeResizers } from "../ui/resizers";
import { activateLayout, createInitialState, deactivateLayout } from "./state";

export function createResizableLayout(
  config: GridConfiguration,
): OrigamiGridInstance {
  let state = createInitialState(config);

  const updateState: UpdateStateFunction = (updater) => {
    const newState = updater(state);
    if (newState !== state) {
      state = newState;
      renderLayout(state);
    }
  };

  attachEventListeners(state, updateState);

  return {
    activate() {
      updateState(activateLayout);
    },

    deactivate() {
      updateState(deactivateLayout);
    },

    destroy() {
      detachEventListeners(state);
      removeResizers(state);
    },

    resize(axis, index, newSize) {
      // updateState((currentState) =>
      //   resizePane(currentState, paneIndex, newSize),
      // );
    },

    collapse(axis, index) {
      // updateState((currentState) => collapsePane(currentState, paneIndex));
    },

    expand(axis, index) {
      // updateState((currentState) => expandPane(currentState, paneIndex));
    },

    setMinSize(axis, index, minSize) {
      // updateState((currentState) =>
      //   updateConstraints(currentState, paneIndex, { minSize }),
      // );
    },

    setMaxSize(axis, index, maxSize) {
      // updateState((currentState) =>
      //   updateConstraints(currentState, paneIndex, { maxSize }),
      // );
    },
  };
}
