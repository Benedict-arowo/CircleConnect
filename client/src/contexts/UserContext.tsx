import { ReactNode, createContext, useContext, useState } from "react";
import { UserType } from "../types";

const defaultValue = {
	isLoggedIn: false,
	connected: false,
	info: {
		id: undefined,
		first_name: undefined,
		last_name: undefined,
		profile_picture: undefined,
		email: undefined,
		role: undefined,
		circle: {
			circleId: undefined,
			role: undefined,
			userId: undefined,
		},
	},
};

type defaultValueType = {
	isLoggedIn: boolean;
	connected: boolean;
	info?: {
		id?: string;
		first_name?: string;
		last_name?: string;
		profile_picture?: string;
		email?: string;
		role?: UserType["role"];
		circle?: { circleId: number; role: string; userId: string };
	};
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
		role: UserType["role"];
		circle?: {
			circleId: number;
			role: string;
			userId: string;
		};
	};
};

const UserContext = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<defaultValueType>(defaultValue);

	const updateUser = (props: updateUserProps) => {
		if (props.mode === "LOGOUT") {
			setUser(() => defaultValue);
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
						circle: props.data?.circle,
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
