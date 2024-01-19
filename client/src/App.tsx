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
import { connect } from "./Components/socketSlice";

const socket = io("http://localhost:8000");

// TODO: Implement Lazy loading
const App = () => {
	const dispatch = useDispatch();

	const User = useSelector((state) => state.user);
	if (User.isLoggedIn)
		socket.on("connect", () => {
			socket.emit("joinRoom", User.info.id);
			dispatch(connect(socket));
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
