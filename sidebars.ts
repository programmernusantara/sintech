import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "🏠 Overview",
    },

    // --- SECTION: MOBILE DEVELOPMENT ---
    {
      type: "category",
      label: "📱 Mobile Development",
      collapsed: false,
      items: [
        // SEPARATOR: DART
        {
          type: "html",
          value:
            '<div style="margin: 12px 0 6px 0; height: 1px; background: linear-gradient(90deg, rgba(128,128,128,0.3) 0%, transparent 100%);"></div><b style="font-size: 10px; color: #888; letter-spacing: 1px; margin-left: 8px;">DART CORE</b>',
        },
        { type: "doc", id: "dart/basic", label: "🎯 Getting Started" },
        { type: "doc", id: "dart/variable", label: "📦 Variables" },
        { type: "doc", id: "dart/collection", label: "📚 Collections" },
        { type: "doc", id: "dart/control-flow", label: "🔄 Control Flow" },
        { type: "doc", id: "dart/function", label: "⚙️ Functions" },
        { type: "doc", id: "dart/oop", label: "💎 OOP Principles" },
        { type: "doc", id: "dart/asynchronous", label: "⏳ Asynchronous" },

        // SEPARATOR: FLUTTER
        {
          type: "html",
          value:
            '<div style="margin: 24px 0 6px 0; height: 1px; background: linear-gradient(90deg, rgba(2, 86, 155, 0.3) 0%, transparent 100%);"></div><b style="font-size: 10px; color: #888; letter-spacing: 1px; margin-left: 8px;">FLUTTER UI</b>',
        },
        { type: "doc", id: "dart/flutter", label: "🚀 Framework Intro" },
        { type: "doc", id: "dart/layout", label: "📐 Layouting" },
        { type: "doc", id: "dart/navigation", label: "🗺️ Navigation" },
        { type: "doc", id: "dart/input", label: "⌨️ User Input" },
        { type: "doc", id: "dart/state", label: "🧪 State Management" },
        { type: "doc", id: "dart/local_storage", label: "💾 Local Database" },

        // SEPARATOR: BACKEND
        {
          type: "html",
          value:
            '<div style="margin: 24px 0 6px 0; height: 1px; background: linear-gradient(90deg, rgba(64, 209, 245, 0.3) 0%, transparent 100%);"></div><b style="font-size: 10px; color: #888; letter-spacing: 1px; margin-left: 8px;">BACKEND</b>',
        },
        { type: "doc", id: "dart/pocketbase", label: "☁️ PocketBase" },
        { type: "doc", id: "dart/crud", label: "🔄 CRUD Operations" },
        { type: "doc", id: "dart/storage", label: "📁 File Storage" },
        { type: "doc", id: "dart/realtime", label: "🔔 Realtime Data" },
        { type: "doc", id: "dart/authentication", label: "🔐 Auth System" },
      ],
    },

    // --- SECTION: COMPUTER SCIENCE ---
    {
      type: "category",
      label: "⚙️ Computer Sciences",
      collapsed: true,
      items: [{ type: "doc", id: "zig/lang", label: "⚡ Zig Programming" }],
    },
  ],
};

export default sidebars;
