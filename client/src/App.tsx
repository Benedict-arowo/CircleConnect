import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Success from "./pages/Auth/Success";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/auth/google/success" element={<Success />} />
				<Route path="/auth/github/success" element={<Success />} />
			</Routes>
		</>
	);
};

export default App;
