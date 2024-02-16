import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Auth/Success";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Test from "./pages/Test";
import Circle from "./pages/Circle";
import Discover from "./pages/Discover";
<<<<<<< HEAD
import Project from "./pages/Project";

// TODO: Implement Lazy loading
const App = () => {
	return (
		<div className="max-w-screen-2xl mx-auto">
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/discover" element={<Discover />} />
				<Route path="/project/:id" element={<Project />} />
				<Route path="/circle/:id" element={<Circle />} />
				<Route path="/test" element={<Test />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/auth/success" element={<Success />} />
			</Routes>
		</div>
	);
=======
import Dashboard from "./pages/Dashboard-Circles";
import Users from "./pages/Users";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
>>>>>>> circle-Dashboard
};

export default App;
