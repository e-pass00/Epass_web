// notificationStore.js
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  unreadCount: 0,
  notifications: [],
  setUnreadCount: (count) => set({ unreadCount: count }),
  setNotifications: (notifications) => set({ notifications }),
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  resetUnreadCount: () => set({ unreadCount: 0 }),
}));

export default useNotificationStore;
