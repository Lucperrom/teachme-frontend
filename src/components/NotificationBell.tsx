import {Flex} from "@chakra-ui/react";
import {IoNotifications} from "react-icons/io5";
import {Button} from "./ui/button.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {notificationService} from "../services/websocket.ts";
import {Notification, NotificationsInfo} from "../types/NotificationInfo.ts";
import client from "../services/axios.ts";

const NotificationBell = () => {

    const [notificationInfo, setNotificationInfo] = useState<NotificationsInfo | null>(null);

    const {user} = useAuth();

    useEffect(() => {
        client.get(`/api/v1/notifications/info?id=${user?.id}`)
            .then((info) => console.log(info));
    }, [user]);

    useEffect(() => {
        if (!user) {
            return
        }

        const onNotificationReceived = (notification: Notification) => {
            console.log(notification);
        }

        notificationService.connect(user.id, onNotificationReceived);

        return () => {
            notificationService.disconnect();
        }
    }, [user]);

    return (
        <Flex alignItems="center" justifyContent="center">
            <Button unstyled cursor="pointer">
                <IoNotifications size={22}/>
            </Button>
        </Flex>
    );
}

export default NotificationBell;