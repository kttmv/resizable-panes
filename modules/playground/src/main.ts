import { createResizableLayout } from "@resizable-panes/core";
import "./style.css";

const mainLayout = createResizableLayout({
  container: document.getElementById("test-container")!,
  panes: [
    {
      element: document.getElementById("test-container-horizontal")!,
      size: "3fr",
    },
    {
      element: document.getElementById("test-container-vertical")!,
    },
  ],
});

const horizontalLayout = createResizableLayout({
  container: document.getElementById("test-container-horizontal")!,
  direction: "horizontal",
  panes: [
    {
      element: document.getElementById("horizontal_1")!,
      size: "1fr",
    },
    {
      element: document.getElementById("horizontal_2")!,
      size: "2fr",
    },
    {
      element: document.getElementById("horizontal_3")!,
      size: "3fr",
    },
    {
      element: document.getElementById("horizontal_4")!,
      size: "4fr",
    },
  ],
});

const verticalLayout = createResizableLayout({
  container: document.getElementById("test-container-vertical")!,
  direction: "vertical",
  panes: [
    {
      element: document.getElementById("vertical_1")!,
      size: "1fr",
    },
    {
      element: document.getElementById("vertical_2")!,
      size: "2fr",
    },
    {
      element: document.getElementById("vertical_3")!,
      size: "3fr",
    },
    {
      element: document.getElementById("vertical_4")!,
      size: "4fr",
    },
  ],
});

mainLayout.activate();
horizontalLayout.activate();
verticalLayout.activate();

let active = true;

document.getElementById("toggle-button")!.addEventListener("click", () => {
  active = !active;

  if (active) {
    mainLayout.activate();
    horizontalLayout.activate();
    verticalLayout.activate();
  } else {
    mainLayout.deactivate();
    horizontalLayout.deactivate();
    verticalLayout.deactivate();
  }
});
