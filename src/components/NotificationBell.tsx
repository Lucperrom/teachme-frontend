import {Circle, Flex} from "@chakra-ui/react";
import {IoNotifications} from "react-icons/io5";
import {Button} from "./ui/button.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {notificationService} from "../services/websocket.ts";
import {Notification, NotificationsInfo} from "../types/NotificationInfo.ts";
import client from "../services/axios.ts";
import { Link } from "react-router-dom";
import {AppRoute} from "../constants/routes.ts";

const NotificationBell = () => {

    const [notificationInfo, setNotificationInfo] = useState<NotificationsInfo | null>(null);

    const {user} = useAuth();

    useEffect(() => {
        client.get(`/api/v1/notifications/info`)
            .then((info) => setNotificationInfo(info.data as NotificationsInfo));
    }, []);

    useEffect(() => {
        if (!user) {
            return
        }

        const onNotificationReceived = (notification: Notification) => {
            console.log(notification);
            client.get(`/api/v1/notifications/info`)
                .then((info) => setNotificationInfo(info.data as NotificationsInfo));
        }

        notificationService.connect(user.id, onNotificationReceived);

        return () => {
            notificationService.disconnect();
        }
    }, [user]);

    return (
        <Flex alignItems="center" justifyContent="center">
            <Link to={AppRoute.NOTIFICATIONS}>
                <Button position="relative" unstyled cursor="pointer">
                    <IoNotifications size={22}/>
                    {
                        (notificationInfo && notificationInfo?.numberOfUnreadMessages > 0) &&
                        <Circle position="absolute" right={0} top={0} bg="red" size={2}></Circle>
                    }
                </Button>
            </Link>
        </Flex>
    );
}

export default NotificationBell;