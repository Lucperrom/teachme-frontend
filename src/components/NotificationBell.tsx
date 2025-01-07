import {Circle} from "@chakra-ui/react";
import {IoNotifications} from "react-icons/io5";
import {Button} from "./ui/button.tsx";
import {useEffect} from "react";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {notificationService} from "../services/websocket.ts";
import {Link} from "react-router-dom";
import {AppRoute} from "../constants/routes.ts";
import {fetchNotificationsInfo} from "../services/redux/slices/notificationsSlice.ts";
import {RootState, useAppDispatch} from "../services/redux/store.ts";
import {useSelector} from "react-redux";

const NotificationBell = () => {

    const dispatch = useAppDispatch();
    const notificationInfo = useSelector((state: RootState) => state.notifications);

    const {user} = useAuth();


    useEffect(() => {
        dispatch(fetchNotificationsInfo());
    }, [dispatch]);

    useEffect(() => {
        if (!user) {
            return
        }

        const onNotificationReceived = () => {
            dispatch(fetchNotificationsInfo());
        }

        notificationService.connect(user.id, onNotificationReceived);

        return () => {
            notificationService.disconnect();
        }
    }, [user]);

    return (
        <Link style={{display: "flex", alignItems: "center", justifyContent: "center"}} to={AppRoute.NOTIFICATIONS}>
            <Button position="relative" unstyled cursor="pointer">
                <IoNotifications size={22}/>
                {
                    (notificationInfo && notificationInfo?.numberOfUnreadMessages > 0) &&
                    <Circle position="absolute" right={0} top={0} bg="red" size={2}></Circle>
                }
            </Button>
        </Link>
    );
}

export default NotificationBell;