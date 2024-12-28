import {Client, Message, StompSubscription} from '@stomp/stompjs';

class NotificationService {
    private stompClient: Client | null = null;
    private subscription: StompSubscription | null = null;

    connect(userId: string, onMessageReceived: (message: any) => void): void {
        const socketUrl = "ws://localhost:8080/notifications";

        this.stompClient = new Client({
            webSocketFactory: () => new WebSocket(socketUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket connected");

                const destination = `/queue/${userId}/notifications`;

                this.subscription = this.stompClient!.subscribe(destination, (message: Message) => {
                    const content = JSON.parse(message.body);
                    console.log("Notification received:", content);
                    onMessageReceived(content);
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
