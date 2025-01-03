import {Card, Flex, Heading, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {NotificationsInfo} from "../types/NotificationInfo.ts";
import {useAuth} from "../services/auth/AuthContext.tsx";
import client from "../services/axios.ts";
import NotificationCard from "../components/NotificationCard.tsx";
import {useNavigate} from "react-router-dom";
import {AppRoute} from "../constants/routes.ts";

const Notifications = () => {

    const [notificationInfo, setNotificationInfo] = useState<NotificationsInfo | null>(null);

    const {user} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        client.get(`/api/v1/notifications/info`)
            .then((info) => setNotificationInfo(info.data as NotificationsInfo));
    }, [user]);

    const handleOnClick = (id: string) => {
        navigate(`${AppRoute.NOTIFICATIONS}/${id}`)
    };

    return (
        <Flex direction="column" padding={5}>
            <Flex direction="column" alignItems="center" justifyContent="center">
                <Flex direction="column" alignItems="center" justifyContent="center" gap={5}>
                    <Heading alignSelf="flex-start">Notifications</Heading>
                    {
                        notificationInfo?.recentNotifications?.length === 0 &&
                        <Text>You don't have any notifications yet.</Text>
                    }
                    {
                        notificationInfo && notificationInfo?.recentNotifications.length > 0 &&
                        <Card.Root padding={0} width="600px" rounded="md" overflow="hidden">
                            {
                                notificationInfo.recentNotifications.map((notification, idx) =>
                                    <NotificationCard onClick={notificationId => handleOnClick(notificationId)}
                                                      key={idx} notification={notification}
                                                      isLast={idx === notificationInfo.recentNotifications.length - 1}/>
                                )
                            }
                        </Card.Root>
                    }
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Notifications;