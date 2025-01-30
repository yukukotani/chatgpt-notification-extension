import { useState, useEffect } from "react";
import { notificationSettings } from "@/libs/storage";
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
        <span className="toggle-text">Enable desktop notification</span>
      </label>
      <label className="toggle-label">
        <input
          type="checkbox"
          className="toggle-input"
          checked={settings.soundEnabled}
          onChange={(e) => onUpdate("soundEnabled", e.target.checked)}
        />
        <span className="toggle-text">Enable notification sound</span>
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
    Promise.all([
      notificationSettings.notifications.getValue(),
      notificationSettings.sound.getValue(),
    ]).then(([notificationsEnabled, soundEnabled]) => {
      setSettings({
        notificationsEnabled,
        soundEnabled,
      });
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (key: keyof Settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "notificationsEnabled") {
      await notificationSettings.notifications.setValue(value);
    } else {
      await notificationSettings.sound.setValue(value);
    }
  };

  if (loading) {
    return <div className="container">読み込み中...</div>;
  }

  return <SettingsForm settings={settings} onUpdate={handleUpdate} />;
}

export default App;
