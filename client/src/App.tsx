import { Route, Routes } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Index = () => {
	return <div>Index</div>;
};

const Auth = () => {
	return (
		<div>
			<GoogleLogin
				onSuccess={(credentialResponse) => {
					console.log(credentialResponse);
				}}
				onError={() => {
					console.log("Login Failed");
				}}
			/>
		</div>
	);
};

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
