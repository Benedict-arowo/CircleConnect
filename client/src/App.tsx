import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Auth/Success";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Test from "./pages/Test";
import Circle from "./pages/Circle";
import Discover from "./pages/Discover";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

socket.on("connect", () => {
	console.log(socket.id);
});

// TODO: Implement Lazy loading
const App = () => {
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
