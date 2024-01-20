import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Auth/Success";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Test from "./pages/Test";
import Circle from "./pages/Circle";
import Discover from "./pages/Discover";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
// import { connect } from "./Components/socketSlice";

const socket = io("http://localhost:8000");

// TODO: Implement Lazy loading
const App = () => {
	// const dispatch = useDispatch();

	const User = useSelector((state) => state.user);

	function notifyMe(notificationContent: string) {
		if (!("Notification" in window)) {
			// Check if the browser supports notifications
			alert("This browser does not support desktop notification");
		} else if (Notification.permission === "granted") {
			// Check whether notification permissions have already been granted;
			// if so, create a notification
			const notification = new Notification(notificationContent);
			// …
		} else if (Notification.permission !== "denied") {
			// We need to ask the user for permission
			Notification.requestPermission().then((permission) => {
				// If the user accepts, let's create a notification
				if (permission === "granted") {
					const notification = new Notification(notificationContent);
					// …
				}
			});
		}

		// At last, if the user has denied notifications, and you
		// want to be respectful there is no need to bother them anymore.
	}

	if (User.isLoggedIn)
		socket.on("connect", () => {
			socket.emit("joinRoom", User.info.id);
			// dispatch(connect(socket));
			socket.on("notification", (notification) => {
				console.log("Received notification:", notification);
				// setNotifications((prevNotifications) => {
				// 	return [notification, ...prevNotifications];
				// });
				notifyMe(notification.content);
			});
		});

	return (
		<div className="max-w-screen-2xl mx-auto">
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/discover" element={<Discover />} />
				<Route path="/circle/:id" element={<Circle />} />
				<Route path="/test" element={<Test />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/auth/success" element={<Success />} />
			</Routes>
		</div>
	);
};

export default App;
