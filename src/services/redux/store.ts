import {configureStore} from '@reduxjs/toolkit';
import notificationsReducer from "./slices/notificationsSlice.ts";
import confettiReducer from "./slices/confettiSlice.ts";
import {useDispatch} from "react-redux";

const store = configureStore({
    reducer: {
        notifications: notificationsReducer,
        confetti: confettiReducer,

    },
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;