import { type ContentScriptContext } from "wxt/client";

const watchPattern = new MatchPattern("https://chatgpt.com/c/*");

export default defineContentScript({
  matches: ["*://*.chatgpt.com/*"],
  main(ctx) {
    console.log("Running content script");

    if (watchPattern.includes(window.location.toString())) {
      register(ctx);
    }

    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
      if (watchPattern.includes(newUrl)) {
        register(ctx);
      }
    });
  },
});

function register(ctx: ContentScriptContext) {
  console.log("register");

  const [container] = document.getElementsByClassName("@container/thread");
  if (container == null) {
    throw new Error("Container element is not found");
  }

  console.log("Hello content.", container);
}
