import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Auth/Success";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Test from "./pages/Test";
import Circle from "./pages/Circle";
import Discover from "./pages/Discover";
import CirclesDashboard from "./pages/Dashboard/Circles";
import Users from "./pages/Dashboard/Users";
import Project from "./pages/Project";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import Roles from "./pages/Dashboard/Roles";
import DashboardSidebar from "./Components/dashboard_sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/Dashboard/Projects";

// TODO: Implement Lazy loading

const theme = createTheme({
	palette: {
		primary: {
			main: red[500],
		},
	},
});

const App = () => {
	return (
		<div className="max-w-screen-2xl mx-auto">
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/discover" element={<Discover />} />
					<Route path="/project/:id" element={<Project />} />
					<Route path="/circle/:id" element={<Circle />} />
					<Route path="/test" element={<Test />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/auth/success" element={<Success />} />
					<Route path="/dashboard" element={<DashboardSidebar />}>
						<Route path="" element={<Dashboard />} />
						<Route path="circles" element={<CirclesDashboard />} />
						<Route path="users" element={<Users />} />
						<Route path="roles" element={<Roles />} />
						<Route path="projects" element={<Projects />} />
					</Route>
				</Routes>
			</ThemeProvider>
		</div>
	);
};

export default App;
