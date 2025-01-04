import {Flex} from "@chakra-ui/react";
import { Prose } from "../components/ui/prose";
import {useNavigate, useParams} from 'react-router-dom'
import {useEffect, useState} from "react";
import client from "../services/axios.ts";
import { Notification as NotificationDto } from "../types/NotificationInfo.ts";
import './notification.scss';
import {Button} from "../components/ui/button.tsx";
import {IoMdArrowBack} from "react-icons/io";
import {AppRoute} from "../constants/routes.ts";
import {useAppDispatch} from "../services/redux/store.ts";
import {markNotificationAsRead} from "../services/redux/slices/notificationsSlice.ts";

const Notification = () => {

    const [notification, setNotification] = useState<NotificationDto | null>(null);

    const { id } = useParams()

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        client.get(`/api/v1/notifications/${id}`)
            .then(response => setNotification(response.data as NotificationDto))
            .then(() => {
                if (id) {
                    dispatch(markNotificationAsRead(id));
                }
            })
    }, [dispatch, id]);

    return (
        <Flex direction="column" position="relative" padding={5} alignItems="center">
            <Button onClick={() => navigate(AppRoute.NOTIFICATIONS)} position="absolute" left={5} top={5}>
                <IoMdArrowBack />
            </Button>
            {
                notification &&
                <Prose dangerouslySetInnerHTML={{__html: notification.message}}></Prose>
            }
        </Flex>
    );
}

export default Notification;