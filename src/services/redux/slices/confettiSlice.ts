import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    confetti: false,
}

export const confettiSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        toggleConfetti: (state) => {
            state.confetti = !state.confetti;
        },
    },
});

export const {toggleConfetti} = confettiSlice.actions;

export default confettiSlice.reducer;