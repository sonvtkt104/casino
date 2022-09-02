import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        title: 'tho'
    },
    reducers: {
        update: (state, action) => {
            state.title = action.payload.title
        }
    }
})

export const { update } = appSlice.actions
export default appSlice.reducer