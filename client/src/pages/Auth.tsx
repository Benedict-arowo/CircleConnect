import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import GoogleButton from "react-google-button";
import GithubButton from "react-github-login-button";
import { useNavigate } from "react-router-dom";

const Auth = () => {
	const Navigate = useNavigate();

	const handleGoogleAuth = async () => {
	};
	const handleGithubAuth = async () => {
	};
	return (
		<div>
			<div>
				<Tabs size="md" variant="enclosed">
					<TabList>
						<Tab>Login</Tab>
						<Tab>Register</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<div>
								<form
									action=""
									className="flex flex-col gap-4 mb-4">
									<input
										className="border border-gray-600 outline-none px-2 py-1"
										placeholder="Email"
										type="email"
										name="email"
										id="email"
									/>
									<input
										className="border border-gray-600 outline-none px-2 py-1"
										placeholder="Password"
										type="password"
										name="password"
										id="password"
									/>
									<button
										className="bg-gray-800 text-white px-4 py-1"
										type="submit">
										Login
									</button>
								</form>
								<div className="flex flex-col gap-2 items-center">
									<GoogleButton onClick={handleGoogleAuth} />
									<GithubButton onClick={handleGithubAuth} />
								</div>
							</div>
						</TabPanel>
						<TabPanel>
							<p>Register</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</div>
	);
};

export default Auth;
