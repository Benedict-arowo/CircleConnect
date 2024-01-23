import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContextProvider = createContext({});

export const UseSocketContext = () => useContext(SocketContextProvider);

const SocketContext = ({ children }) => {
	// TODO: change url to a variable
	const socket = io("http://localhost:8000", {
		reconnectionDelay: 1000,
		reconnection: true,
		reconnectionAttempts: 10,
	});
	const User = useSelector((state) => state.user);

	if (User.isLoggedIn)
		socket.on("connect", () => {
			socket.emit("joinRoom", User.info.id);
			console.log("Joined room");
		});

	return (
		<SocketContextProvider.Provider value={socket}>
			{children}
		</SocketContextProvider.Provider>
	);
};

export default SocketContext;
