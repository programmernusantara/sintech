import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "🏠 Overview",
    },

    {
      type: "category",
      label: "Mobile Developer",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "🎯 Dart",
          collapsed: true,
          items: [
            { type: "doc", id: "dart/basic", label: "Intro" },
            { type: "doc", id: "dart/variable", label: "Data Types" },
            { type: "doc", id: "dart/collection", label: "List & Maps" },
            { type: "doc", id: "dart/control-flow", label: "Logic Flow" },
            { type: "doc", id: "dart/function", label: "Function" },
            { type: "doc", id: "dart/oop", label: "Class & Objects" },
            { type: "doc", id: "dart/asynchronous", label: "Async Program" },
          ],
        },
        {
          type: "category",
          label: "🚀 Frontend",
          collapsed: true,
          items: [
            { type: "doc", id: "dart/flutter", label: "Basic Widget" },
            { type: "doc", id: "dart/layout", label: "Adaptive Layout" },
            { type: "doc", id: "dart/navigation", label: "Routing" },
            { type: "doc", id: "dart/input", label: "Form Handling" },
            { type: "doc", id: "dart/state", label: "State Logic" },
            { type: "doc", id: "dart/local_storage", label: "Local Storage" },
          ],
        },
        {
          type: "category",
          label: "☁️ Backend",
          collapsed: true,
          items: [
            { type: "doc", id: "dart/pocketbase", label: "Server Setup" },
            { type: "doc", id: "dart/crud", label: "Rest Api" },
            { type: "doc", id: "dart/storage", label: "File Upload" },
            { type: "doc", id: "dart/realtime", label: "Realtime" },
            { type: "doc", id: "dart/authentication", label: "Auth Google" },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Computer Science",
      collapsed: true,
      items: [{ type: "doc", id: "zig/lang", label: "⚡ Zig Lang" }],
    },
  ],
};

export default sidebars;
