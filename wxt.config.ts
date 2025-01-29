import { defineConfig } from "wxt";
import { resolve } from "node:path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    name: "ChatGPT Notification",
    permissions: ["notifications", "tabs"],
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
