import { defineConfig } from "wxt";
import { resolve } from "node:path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    name: "ChatGPT Notification",
    description:
      "Web extension to show browser notification or play sound on incoming streaming message is completed on ChatGPT.",
    permissions: ["notifications", "tabs", "storage"],
    web_accessible_resources: [
      {
        resources: ["sound.mp3"],
        matches: ["<all_urls>"],
      },
    ],
  },
  autoIcons: {
    baseIconPath: "./public/icon.png",
  },
  runner: {
    startUrls: ["https://chatgpt.com/"],
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
    keepProfileChanges: true,
  },
});
