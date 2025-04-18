import {writable} from "svelte/store";

export type Notification = {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timeout?: number; // in milliseconds
};

function createNotificationStore() {
  const notificationStore = writable<Notification[]>([]);
  const {subscribe, update} = notificationStore;

  function removeNotification(id: string) {
    update((notifications) => notifications.filter((n) => n.id !== id));
  }

  return {
    subscribe,
    add: (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const fullNotification = {...notification, id};

      update((notifications) => [fullNotification, ...notifications]);

      if (notification.timeout) {
        setTimeout(() => {
          removeNotification(id);
        }, notification.timeout);
      }

      return id;
    },
    remove: (id: string) => {
      removeNotification(id);
    },
  };
}

export const notifications = createNotificationStore();
