import { type ContentScriptContext } from "wxt/client";
import { browser } from "wxt/browser";
import { notificationSettings } from "@/libs/storage";

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

async function notify(notificationSound: HTMLAudioElement) {
  if (document.hasFocus()) {
    // タブがアクティブなら通知しない
    return;
  }

  const [notificationsEnabled, soundEnabled] = await Promise.all([
    notificationSettings.notifications.getValue(),
    notificationSettings.sound.getValue(),
  ]);

  try {
    if (soundEnabled) {
      await notificationSound.play();
    }
    if (notificationsEnabled) {
      await browser.runtime.sendMessage("notification");
    }
    console.log("通知を送信しました");
  } catch (e) {
    console.error("通知の送信に失敗しました", e);
  }
}

function register(ctx: ContentScriptContext) {
  const [container] = document.getElementsByClassName("@container/thread");
  if (container == null) {
    throw new Error("Container element is not found");
  }

  // 通知音の準備
  const notificationSound = new Audio(browser.runtime.getURL("/sound.mp3"));

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
          await notify(notificationSound);
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
