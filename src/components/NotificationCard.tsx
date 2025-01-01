import {Card, Circle, Flex, Text} from "@chakra-ui/react";
import {FC} from "react";
import {Notification} from "../types/NotificationInfo.ts";

type NotificationCardProps = {
    notification: Notification;
    isLast: boolean;
}

const NotificationCard: FC<NotificationCardProps> = ({notification, isLast}) => {

    const truncateMessage = (message: string, maxLength: number) => {
        return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
    };

    return (
        <Flex key={notification.id}
              style={{borderBottom: isLast ? '' : '1px solid #C9D6E4'}}
              padding={4}
              gap={5} alignItems="center" cursor="pointer"
              _hover={{ bg: notification.read ? "gray.50" : "#C5DEF9" }}
              bg={notification.read ? "transparent" : "#D9E8FB"}>
            <Circle bg={notification.read ? "transparent" : "#0B65C2"} size={2}></Circle>
            <Flex direction="column" justifyContent="center">
                <Card.Title fontSize="lg"
                            fontWeight="bold">{notification.title}</Card.Title>
                <Card.Body padding={0}>
                    <Text fontSize="sm"
                          color="gray.600">{truncateMessage(notification.message, 100)}</Text>
                    <Text fontSize="xs"
                          color="gray.500">{new Date(notification.timestamp).toLocaleString()}</Text>
                </Card.Body>
            </Flex>
        </Flex>
    );
}

export default NotificationCard;
