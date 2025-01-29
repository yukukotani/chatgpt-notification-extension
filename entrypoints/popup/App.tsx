import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import "./App.css";

function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // 初期設定を読み込む
    browser.storage.sync
      .get("notificationsEnabled")
      .then((result: { notificationsEnabled?: boolean }) => {
        setNotificationsEnabled(result.notificationsEnabled ?? true);
      });
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    await browser.storage.sync.set({ notificationsEnabled: enabled });
  };

  return (
    <div className="container">
      <label className="toggle-label">
        <input
          type="checkbox"
          className="toggle-input"
          checked={notificationsEnabled}
          onChange={(e) => handleNotificationToggle(e.target.checked)}
        />
        <span className="toggle-text">通知を有効にする</span>
      </label>
    </div>
  );
}

export default App;
