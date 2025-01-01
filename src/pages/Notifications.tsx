import {Card, Flex, Heading, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {NotificationsInfo} from "../types/NotificationInfo.ts";
import {useAuth} from "../services/auth/AuthContext.tsx";
import client from "../services/axios.ts";
import NotificationCard from "../components/NotificationCard.tsx";

const Notifications = () => {

    const [notificationInfo, setNotificationInfo] = useState<NotificationsInfo | null>(null);

    const {user} = useAuth();

    useEffect(() => {
        client.get(`/api/v1/notifications/info?id=${user?.id}`)
            .then((info) => setNotificationInfo(info.data as NotificationsInfo));
    }, [user]);

    return (
        <Flex direction="column" padding={5}>
            {
                notificationInfo?.numberOfMessages &&
                <Flex direction="column" alignItems="center" justifyContent="center">
                    <Flex direction="column" alignItems="center" justifyContent="center" gap={5}>
                        <Heading alignSelf="flex-start">Notifications</Heading>
                        {
                            notificationInfo?.recentNotifications?.length === 0 &&
                            <Text>You don't have any notifications yet.</Text>
                        }
                        {
                            notificationInfo?.recentNotifications.length > 0 &&
                            <Card.Root padding={0} width="600px" rounded="md" overflow="hidden">
                                {
                                    notificationInfo.recentNotifications.map((notification, idx) =>
                                        <NotificationCard notification={notification}
                                                          isLast={idx === notificationInfo.recentNotifications.length - 1}/>
                                    )
                                }
                            </Card.Root>
                        }
                    </Flex>
                </Flex>
            }
        </Flex>
    );
}

export default Notifications;