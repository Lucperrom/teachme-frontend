import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import {Notification, NotificationsInfo} from "../../../types/NotificationInfo.ts";
import client from '../../axios.ts';

const initialState = {
    numberOfUnreadMessages: 0,
    numberOfMessages: 0,
    recentNotifications: [] as Notification[],
}

export const fetchNotificationsInfo = createAsyncThunk(
    'notification/fetchNotificationsInfo',
    async () => {
        const response = await client.get<NotificationsInfo>(`/api/v1/notifications/info`);
        return response.data;
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notification/markNotificationAsRead',
    async (notificationId: string) => {
        await client.put(`/api/v1/notifications/read?id=${notificationId}`);
        return notificationId;
    }
);

export const notificationsSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificationsInfo.fulfilled, (state, action: PayloadAction<NotificationsInfo>) => {
                state.numberOfUnreadMessages = action.payload.numberOfUnreadMessages;
                state.numberOfMessages = action.payload.numberOfMessages;
                state.recentNotifications = action.payload.recentNotifications;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
                state.recentNotifications = state.recentNotifications.map(notification =>
                    notification.id === action.payload
                        ? {...notification, read: true}
                        : notification
                );
                state.numberOfUnreadMessages = state.recentNotifications.filter(notification => !notification.read).length;
            });
    },
});

export default notificationsSlice.reducer;