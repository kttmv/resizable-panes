import { createResizableLayout } from "@resizable-panes/core";
import "./style.css";

createResizableLayout({
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

createResizableLayout({
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

createResizableLayout({
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
