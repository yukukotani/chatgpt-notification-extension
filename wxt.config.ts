import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  runner: {
    startUrls: ["https://chatgpt.com/"],
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
    keepProfileChanges: true,
  },
});
