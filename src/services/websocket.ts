import {Client, Message, StompSubscription} from '@stomp/stompjs';
import {Notification} from "../types/NotificationInfo.ts";

class NotificationService {
    private stompClient: Client | null = null;
    private subscription: StompSubscription | null = null;

    connect(userId: string, onNotificationReceived: (notification: Notification) => void): void {
        const socketUrl = '/ws/v1/notifications';

        this.stompClient = new Client({
            webSocketFactory: () => new WebSocket(socketUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket connected");

                const destination = `/queue/${userId}/notifications`;

                this.subscription = this.stompClient!.subscribe(destination, (message: Message) => {
                    const content = JSON.parse(message.body);
                    console.log("Notification received:", content);
                    onNotificationReceived(content);
                });
            },
            onDisconnect: () => {
                console.log("WebSocket disconnected");
            },
            onStompError: (error) => {
                console.error("STOMP error:", error);
            },
        });

        this.stompClient.activate();
    }

    disconnect(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        if (this.stompClient) {
            this.stompClient.deactivate();
            console.log("WebSocket disconnected");
        }
    }
}

export const notificationService = new NotificationService();
