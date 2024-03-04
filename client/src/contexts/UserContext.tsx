import { ReactNode, createContext, useContext, useState } from "react";

const defaultValue = {
	isLoggedIn: false,
	connected: false,
	info: {
		id: null,
		first_name: null,
		last_name: null,
		profile_picture: null,
		email: null,
		role: null,
	},
};

const UserContextProvider = createContext(defaultValue);
const UseUserContext = createContext({});

export const UseUser = () => useContext(UserContextProvider);
export const UseSetUser = () => useContext(UseUserContext);

type UserProviderProps = {
	children: ReactNode;
};

type updateUserProps = {
	mode: "LOGIN" | "LOGOUT";
	data?: {
		id: string;
		first_name: string;
		last_name: string;
		profile_picture: string;
		email: string;
		role: null;
	};
};

const UserContext = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState(defaultValue);

	const updateUser = (props: updateUserProps) => {
		if (props.mode === "LOGOUT") {
			setUser(() => {
				return {
					isLoggedIn: false,
					connected: false,
					info: {
						id: null,
						first_name: null,
						last_name: null,
						profile_picture: null,
						email: null,
						role: null,
					},
				};
			});
		} else if (props.mode === "LOGIN") {
			// TODO io_connection....
			setUser(() => {
				return {
					isLoggedIn: true,
					connected: false,
					info: {
						id: props.data?.id,
						first_name: props.data?.first_name,
						last_name: props.data?.last_name,
						profile_picture: props.data?.profile_picture,
						email: props.data?.email,
						role: props.data?.role,
					},
				};
			});
		}
	};

	return (
		<UserContextProvider.Provider value={user}>
			<UseUserContext.Provider value={updateUser}>
				{children}
			</UseUserContext.Provider>
		</UserContextProvider.Provider>
	);
};

export default UserContext;
