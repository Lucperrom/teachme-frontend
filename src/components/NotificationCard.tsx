import {Card, Circle, Flex, Text} from "@chakra-ui/react";
import {FC} from "react";
import {Notification} from "../types/NotificationInfo.ts";

type NotificationCardProps = {
    notification: Notification;
    isLast: boolean;
    onClick?: (notificationId: string) => void;
}

const NotificationCard: FC<NotificationCardProps> = ({notification, isLast, onClick}) => {

    const truncateMessage = (message: string, maxLength: number) => {
        if (!message) return;
        return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
    };

    const getFormattedDateTime = (dateTime: number) => {
        return new Date(dateTime * 1000).toLocaleString();
    }

    return (
        <Flex key={notification.id}
              onClick={() => onClick ? onClick(notification.id) : null}
              style={{borderBottom: isLast ? '' : '1px solid #C9D6E4'}}
              padding={4}
              gap={5} alignItems="center" cursor="pointer"
              _hover={{ bg: notification.read ? "gray.50" : "#C5DEF9" }}
              bg={notification.read ? "#F4F2EE" : "#D9E8FB"}>
            <Circle bg={notification.read ? "transparent" : "#0B65C2"} size={2}></Circle>
            <Flex direction="column" justifyContent="center">
                <Card.Title color="black" fontSize="lg"
                            fontWeight="bold">{notification.title}</Card.Title>
                <Card.Body padding={0}>
                    <Text fontSize="sm"
                          color="gray.600">{truncateMessage(notification.previewText, 100)}</Text>
                    <Text fontSize="xs"
                          color="gray.500">{getFormattedDateTime(notification.timestamp)}</Text>
                </Card.Body>
            </Flex>
        </Flex>
    );
}

export default NotificationCard;
