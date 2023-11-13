import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	count: 0,
};

export const userSlice = createSlice({
	name: "User",
	initialState,
	reducers: {
		increment: (state) => {
			state.count += 1;
		},
		decrement: (state) => {
			state.count -= 1;
		},
	},
});

export const { increment, decrement } = userSlice.actions;

export default userSlice.reducer;
