import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/auth" element={<Auth />} />
			</Routes>
		</>
	);
};

export default App;
