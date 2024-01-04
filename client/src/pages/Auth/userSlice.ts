import { createSlice } from "@reduxjs/toolkit";

type userState = {
	id: string | null;
	first_name: string | null;
	last_name: string | null;
	profile_picture: string | null;
	email: string | null;
};

type initialState = {
	info: userState;
	isLoggedIn: boolean;
	status: "pending" | "active" | null;
};

const initialState: initialState = {
	info: {
		id: null,
		first_name: null,
		last_name: null,
		profile_picture: null,
		email: null,
	},
	isLoggedIn: false,
	status: "pending",
};

export const userSlice = createSlice({
	name: "User",
	initialState,
	reducers: {
		loginUser: (state, payload) => {
			console.log(payload);
			state.isLoggedIn = true;
			state.status = "active";
			state.info = {
				id: payload.payload.id,
				first_name: payload.payload.first_name,
				last_name: payload.payload.last_name,
				profile_picture: payload.payload.profile_picture,
				email: payload.payload.email,
			};
		},
		logoutUser: (state) => {
			state.info = {
				id: null,
				first_name: null,
				last_name: null,
				profile_picture: null,
				email: null,
			};
			state.isLoggedIn = false;
			state.status = null;
		},
	},
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
