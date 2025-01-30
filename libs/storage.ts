import { storage } from "wxt/storage";

export const notificationSettings = {
  notifications: storage.defineItem<boolean>("sync:notificationsEnabled", {
    fallback: true,
  }),
  sound: storage.defineItem<boolean>("sync:soundEnabled", {
    fallback: true,
  }),
};
