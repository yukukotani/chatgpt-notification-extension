import { type ContentScriptContext } from "wxt/client";
import { browser } from "wxt/browser";

const watchPattern = new MatchPattern("https://chatgpt.com/c/*");

export default defineContentScript({
  matches: ["*://*.chatgpt.com/*"],
  main(ctx) {
    console.log("Running content script");

    let cleanup: () => void;
    if (watchPattern.includes(window.location.toString())) {
      cleanup = register(ctx);
    }

    ctx.addEventListener(window, "wxt:locationchange", ({ newUrl }) => {
      cleanup?.();

      if (watchPattern.includes(newUrl)) {
        cleanup = register(ctx);
      }
    });
  },
});

function register(ctx: ContentScriptContext) {
  const [container] = document.getElementsByClassName("@container/thread");
  if (container == null) {
    throw new Error("Container element is not found");
  }

  // MutationObserverの設定
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(async (mutation) => {
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
          if (document.hasFocus()) {
            return;
          }
          try {
            await browser.runtime.sendMessage("done-streaming");
            console.log("ストリーミングが完了しました");
          } catch (e) {
            console.error("失敗", e);
          }
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

  return () => {
    console.log("cleanup");
    observer.disconnect();
  };
}
