import { createSlice } from "@reduxjs/toolkit";

type initialState = {
	io: string | undefined;
	connected: boolean;
};

const initialState: initialState = {
	io: undefined,
	connected: false,
};

export const socketSlice = createSlice({
	name: "socker",
	initialState,
	reducers: {
		connect: (state, payload) => {
			state.io = JSON.stringify(payload.payload);
			state.connected = true;
		},
	},
});

export const { connect } = socketSlice.actions;

export default socketSlice.reducer;
