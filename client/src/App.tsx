import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Auth/Success";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Test from "./pages/Test";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Index />} />
			<Route path="/test" element={<Test />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/auth/success" element={<Success />} />
		</Routes>
	);
};

export default App;
