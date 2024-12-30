export interface NotificationsInfo {
    numberOfUnreadMessages: number;
    numberOfMessages: number;
    recentNotifications: Notification[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    timestamp: string;
    read: boolean;
}
