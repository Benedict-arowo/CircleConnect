import { createSlice } from "@reduxjs/toolkit";

type initialState = {
	io: object | undefined;
	connected: boolean;
};

const initialState: initialState = {
	io: undefined,
	connected: false,
};

export const socketSlice = createSlice({
	name: "io",
	initialState,
	reducers: {
		connect: (state, payload) => {
			state.io = payload.payload;
			state.connected = true;
		},
	},
});

export const { connect } = socketSlice.actions;

export default socketSlice.reducer;
