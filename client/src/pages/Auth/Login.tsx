import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import registerBackground from "../../assets/Register.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

const Login = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const Navigate = useNavigate();

	const handleGoogleAuth = async () => {
		setIsLoading(() => true);
		let timer: NodeJS.Timeout | null = null;
		const googleAuthURL = "http://localhost:8000/auth/google";
		const loginWindow = window.open(
			googleAuthURL,
			"_blank",
			"width=500,height=600"
		);
		timer = setInterval(() => {
			if (loginWindow && loginWindow.closed) {
				setIsLoading(() => false);
				console.log("You are authenticated.");
				Navigate("/");

				if (timer) {
					clearInterval(timer);
				}
			}
		}, 500);
	};

	const handleGithubAuth = async () => {
		setIsLoading(() => true);
		let timer: NodeJS.Timeout | null = null;
		const githubAuthURL = "http://localhost:8000/auth/github";
		const loginWindow = window.open(
			githubAuthURL,
			"_blank",
			"width=500,height=600"
		);
		timer = setInterval(() => {
			if (loginWindow && loginWindow.closed) {
				setIsLoading(() => false);
				// TODO: Check if user is actually authenticated before redirecting
				console.log("You are authenticated.");
				Navigate("/");
				// const user = fetchUser();
				if (timer) {
					clearInterval(timer);
				}
			}
		}, 500);
	};
	return (
		<div className="flex flex-row overflow-hidden">
			<aside className="w-3/6 bg-red-300 h-screen">
				<img
					src={registerBackground}
					className="w-full h-full object-cover"
					draggable="false"
					alt=""
				/>
			</aside>
			<main className="flex-1 h-screen px-12 overflow-y-auto">
				<header className="mt-20 mb-8">
					<h1 className="font-bold text-4xl font-['Jua']">Login</h1>
					<p className="text-gray-600 font-light max-w-[20rem]">
						Fill in your details.
					</p>
				</header>

				<form action="" method="post" className="flex flex-col gap-4">
					<fieldset className="flex flex-col gap-1">
						<label
							className="text-gray-600 font-light"
							htmlFor="email_address">
							Email <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							name="email_address"
							id="email_address"
							placeholder="user@sample.com"
							className="placeholder-gray-300 outline-none border px-2 py-1 font-light"
						/>
					</fieldset>

					<fieldset className="flex flex-col gap-1">
						<label
							className="text-gray-600 font-light"
							htmlFor="password">
							Password <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							name="password"
							id="password"
							placeholder="***********"
							className="placeholder-gray-300 outline-none border px-2 py-1 font-light"
						/>
					</fieldset>

					<div className="flex flex-col items-center gap-2">
						<button
							type="submit"
							className="bg-red-500 w-fit text-white px-12 rounded-md py-2 font-light hover:bg-red-400 active:bg-red-700 duration-300">
							Login
						</button>
						<p className="text-gray-500 font-light">
							Don't have an account?{" "}
							<a
								href="./register"
								className="text-red-500 hover:text-red-300 active:text-red-700 duration-300">
								Register here!
							</a>
						</p>
					</div>
				</form>

				<section
					aria-label="Register with other services"
					className="flex flex-col gap-4 my-8 items-center">
					<GoogleButton onClick={handleGoogleAuth} type="light" />
					<GithubButton onClick={handleGithubAuth} type="light" />
					{isLoading && <Spinner />}
				</section>
			</main>
		</div>
	);
};

export default Login;
