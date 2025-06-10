import { createResizableLayout } from "@origami-grids/core";
import "./style.css";

const mainLayout = createResizableLayout({
  container: document.getElementById("test-container")!,
  direction: "vertical",
  panes: [
    {
      element: document.getElementById("test-container-horizontal")!,
      size: "1fr",
    },
    {
      element: document.getElementById("test-container-vertical")!,
      size: "3fr",
      minSize: "12px",
    },
  ],
});

const horizontalLayout = createResizableLayout({
  container: document.getElementById("test-container-horizontal")!,
  direction: "horizontal",
  snapThreshold: 0,
  panes: [
    {
      element: document.getElementById("horizontal_1")!,
      size: "1fr",
      minSize: "100px",
      maxSize: "300px",
      collapsible: true,
      collapsedSize: "25px",
    },
    {
      element: document.getElementById("horizontal_2")!,
      size: "2fr",
      minSize: "150px",
      maxSize: "400px",
    },
    {
      element: document.getElementById("horizontal_3")!,
      size: "3fr",
      minSize: "200px",
      maxSize: "400px",
    },
    {
      element: document.getElementById("horizontal_4")!,
      size: "4fr",
      minSize: "100px",
    },
  ],
});

const verticalLayout = createResizableLayout({
  container: document.getElementById("test-container-vertical")!,
  direction: "vertical",
  dragInterval: 5,
  snapThreshold: 0,
  panes: [
    {
      element: document.getElementById("vertical_1")!,
      size: "150px",
      minSize: "50px",
      maxSize: "250px",
    },
    {
      element: document.getElementById("vertical_2")!,
      size: "2fr",
      minSize: "80px",
      maxSize: "200px",
    },
    {
      element: document.getElementById("vertical_3")!,
      size: "3fr",
      minSize: "100px",
    },
    {
      element: document.getElementById("vertical_4")!,
      size: "4fr",
      minSize: "60px",
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

let collapsed = false;

document.getElementById("collapse-button")!.addEventListener("click", () => {
  if (collapsed) {
    horizontalLayout.expand(0);
    collapsed = false;
  } else {
    horizontalLayout.collapse(0);
    collapsed = true;
  }
});
