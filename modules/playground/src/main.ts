import { createResizableLayout } from "@resizable-panes/core";
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
      minSize: "100px",
      maxSize: "300px",
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
  dragInterval: 5, // Moves in 5px increments
  snapOffset: 15, // Snaps to min/max when within 15px
  panes: [
    {
      element: document.getElementById("vertical_1")!,
      size: "1fr",
      minSize: "50px",
      maxSize: "150px",
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
