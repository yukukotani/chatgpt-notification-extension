import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import "./App.css";

function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // 初期設定を読み込む
    browser.storage.sync
      .get(["notificationsEnabled", "soundEnabled"])
      .then(
        (result: {
          notificationsEnabled?: boolean;
          soundEnabled?: boolean;
        }) => {
          setNotificationsEnabled(result.notificationsEnabled ?? true);
          setSoundEnabled(result.soundEnabled ?? true);
        }
      );
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    await browser.storage.sync.set({ notificationsEnabled: enabled });
  };

  const handleSoundToggle = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    await browser.storage.sync.set({ soundEnabled: enabled });
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
      <label className="toggle-label">
        <input
          type="checkbox"
          className="toggle-input"
          checked={soundEnabled}
          onChange={(e) => handleSoundToggle(e.target.checked)}
        />
        <span className="toggle-text">通知音を有効にする</span>
      </label>
    </div>
  );
}

export default App;
