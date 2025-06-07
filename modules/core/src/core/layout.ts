import {
  collapsePane,
  expandPane,
  resizePane,
  updateConstraints,
} from "../operations/index";
import { attachEventListeners, detachEventListeners } from "../ui/events";
import { renderLayout } from "../ui/renderer";
import { insertResizers, removeResizers } from "../ui/resizers";
import { validateLayoutConfiguration } from "./config";
import { activateLayout, createInitialState, deactivateLayout } from "./state";
import type {
  LayoutConfiguration,
  ResizableLayoutInstance,
  UpdateStateFunction,
} from "./types";

export function createResizableLayout(
  config: LayoutConfiguration,
): ResizableLayoutInstance {
  validateLayoutConfiguration(config);

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
      insertResizers(state);
      updateState(activateLayout);
    },

    deactivate() {
      removeResizers(state);
      updateState(deactivateLayout);
    },

    resize(paneIndex: number, newSize) {
      updateState((currentState) =>
        resizePane(currentState, paneIndex, newSize),
      );
    },

    collapse(paneIndex: number) {
      updateState((currentState) => collapsePane(currentState, paneIndex));
    },

    expand(paneIndex: number) {
      updateState((currentState) => expandPane(currentState, paneIndex));
    },

    setMinSize(paneIndex: number, minSize) {
      updateState((currentState) =>
        updateConstraints(currentState, paneIndex, { minSize }),
      );
    },

    setMaxSize(paneIndex: number, maxSize) {
      updateState((currentState) =>
        updateConstraints(currentState, paneIndex, { maxSize }),
      );
    },

    getState() {
      return { ...state };
    },

    refresh() {
      renderLayout(state);
    },

    destroy() {
      detachEventListeners(state);
      removeResizers(state);
    },
  };
}
