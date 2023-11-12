import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	id: null,
	email: null,
	first_name: null,
	last_name: null,
	profile_picture: null,
};

export const userSlice = createSlice({
	name: "User",
	initialState,
	reducers: {
		saveUser: (state, action) => {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.first_name = action.payload.first_name;
			state.last_name = action.payload.last_name;
			state.profile_picture = action.payload.profile_picture;
		},
		logoutUser: (state) => {
			state.id = null;
			state.email = null;
			state.first_name = null;
			state.last_name = null;
			state.profile_picture = null;
		},
	},
});

export const { saveUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
