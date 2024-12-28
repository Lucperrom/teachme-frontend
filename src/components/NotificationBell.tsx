import {Flex} from "@chakra-ui/react";
import {IoNotifications} from "react-icons/io5";
import {Button} from "./ui/button.tsx";
import {useEffect} from "react";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {notificationService} from "../services/websocket.ts";

const NotificationBell = () => {

    const {user} = useAuth();

    useEffect(() => {
        if (!user) {
            return
        }

        const onMessageReceive = (message: any) => {
            console.log(message);
        }

        notificationService.connect(user.id, onMessageReceive);

        return () => {
            notificationService.disconnect();
        }
    }, [user]);

    return (
        <Flex alignItems="center" justifyContent="center">
            <Button unstyled cursor="pointer" >
                <IoNotifications size={22}/>
            </Button>
        </Flex>
    );
}

export default NotificationBell;