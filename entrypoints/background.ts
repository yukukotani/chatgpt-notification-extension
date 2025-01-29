import { browser } from "wxt/browser";

export default defineBackground(() => {
  const NotificationTabMap: Record<string, number> = {};

  browser.runtime.onMessage.addListener((msg, sender) => {
    if (msg != "result-streaming") {
      return;
    }

    const notificationId = crypto.randomUUID();
    if (sender?.tab?.id) {
      NotificationTabMap[notificationId] = sender.tab.id;
    }

    browser.notifications.create(notificationId, {
      title: "ChatGPT",
      message: "メッセージが届きました",
      type: "basic",
      iconUrl: browser.runtime.getURL("/icon/128.png"),
    });

    return true;
  });

  browser.notifications.onClicked.addListener((id) => {
    const tabId = NotificationTabMap[id];
    if (tabId) {
      browser.tabs.update(tabId, { active: true });
    }
  });
});
