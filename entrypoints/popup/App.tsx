import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import "./App.css";

type Settings = {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
};

function SettingsForm({
  settings,
  onUpdate,
}: {
  settings: Settings;
  onUpdate: (key: keyof Settings, value: boolean) => Promise<void>;
}) {
  return (
    <div className="container">
      <label className="toggle-label">
        <input
          type="checkbox"
          className="toggle-input"
          checked={settings.notificationsEnabled}
          onChange={(e) => onUpdate("notificationsEnabled", e.target.checked)}
        />
        <span className="toggle-text">デスクトップ通知を表示</span>
      </label>
      <label className="toggle-label">
        <input
          type="checkbox"
          className="toggle-input"
          checked={settings.soundEnabled}
          onChange={(e) => onUpdate("soundEnabled", e.target.checked)}
        />
        <span className="toggle-text">通知音を鳴らす</span>
      </label>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: true,
    soundEnabled: true,
  });

  useEffect(() => {
    browser.storage.sync
      .get(["notificationsEnabled", "soundEnabled"])
      .then(
        (result: {
          notificationsEnabled?: boolean;
          soundEnabled?: boolean;
        }) => {
          setSettings({
            notificationsEnabled: result.notificationsEnabled ?? true,
            soundEnabled: result.soundEnabled ?? true,
          });
          setLoading(false);
        }
      );
  }, []);

  const handleUpdate = async (key: keyof Settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    await browser.storage.sync.set({ [key]: value });
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return <SettingsForm settings={settings} onUpdate={handleUpdate} />;
}

export default App;
