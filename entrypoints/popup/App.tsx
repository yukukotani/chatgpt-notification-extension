import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";

function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [count, setCount] = useState(0);

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
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => handleNotificationToggle(e.target.checked)}
            />
            通知を有効にする
          </label>
        </div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
