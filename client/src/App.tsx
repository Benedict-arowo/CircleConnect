import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import CheckAuth from "./Middlewears/CheckAuth";
import Loading from "./Components/Loading";
import Footer from "./Components/Footer";
import Profile from "./pages/Profile";

const Index = lazy(() => import("./pages/Index"));
const Success = lazy(() => import("./pages/Auth/Success"));
const Register = lazy(() => import("./pages/Auth/Register"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Test = lazy(() => import("./pages/Test"));
const Circle = lazy(() => import("./pages/Circle"));
const Discover = lazy(() => import("./pages/Discover"));
const CirclesDashboard = lazy(() => import("./pages/Dashboard/Circles"));
const Users = lazy(() => import("./pages/Dashboard/Users"));
const Project = lazy(() => import("./pages/Project"));
const Roles = lazy(() => import("./pages/Dashboard/Roles"));
const DashboardSidebar = lazy(() => import("./Components/dashboard_sidebar"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Projects = lazy(() => import("./pages/Dashboard/Projects"));
const AdminOnly = lazy(() => import("./Middlewears/AdminOnly"));
const NoAuth = lazy(() => import("./Middlewears/NoAuth"));
const Error = lazy(() => import("./pages/Error"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

const App = () => {
	return (
		<div className="max-w-screen-2xl mx-auto main--gradient min-h-screen overflow-hidden">
			<CheckAuth>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path="onboarding" element={<Onboarding />} />
						<Route path="" element={<Index />} />
						<Route path="/discover" element={<Discover />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/project/:id" element={<Project />} />
						<Route path="/circle/:id" element={<Circle />} />
						<Route path="/test" element={<Test />} />
						<Route path="/error" element={<Error />} />
						<Route path="/auth/success" element={<Success />} />
						<Route
							path="/login"
							element={
								<NoAuth>
									<Login />
								</NoAuth>
							}
						/>
						<Route
							path="/register"
							element={
								<NoAuth>
									<Register />
								</NoAuth>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<AdminOnly>
									<DashboardSidebar />
								</AdminOnly>
							}
						>
							<Route path="" element={<Dashboard />} />
							<Route
								path="circles"
								element={<CirclesDashboard />}
							/>
							<Route path="users" element={<Users />} />
							<Route path="roles" element={<Roles />} />
							<Route path="projects" element={<Projects />} />
						</Route>
					</Routes>
					<Footer />
				</Suspense>
			</CheckAuth>
		</div>
	);
};

export default App;
