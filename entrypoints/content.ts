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

  // MutationObserverの設定
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const target = mutation.target as HTMLElement;
        const oldClassList = (mutation.oldValue || "").split(" ");
        if (
          oldClassList.includes("result-streaming") &&
          !target.classList.contains("result-streaming")
        ) {
          console.log("ストリーミングが完了しました");
        }
      }
    });
  });

  // 監視の開始
  observer.observe(container, {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
    attributeOldValue: true, // 変更前の値を取得するために必要
  });

  console.log("Hello content.", container);
}
