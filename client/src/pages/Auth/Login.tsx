import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import registerBackground from "../../assets/Register.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import Logo_Black from "../../Components/Logo_Black";
import { SERVER_URL } from "../../../config";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";

const Login = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [alert, setAlert] = useState({
		status: null,
		description: null,
	});
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

	const SubmitForm = (e) => {
		e.preventDefault();
		setIsLoading(() => true);

		setAlert(() => {
			return {
				status: null,
				message: null,
			};
		});

		fetch(`${SERVER_URL}/auth/jwt/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "Application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (!data.success) throw new Error(data.message);
				setAlert(() => {
					return {
						status: "success",
						description: "Successfully signed in!",
					};
				});
				Navigate("/");
			})
			.catch((err) => {
				setAlert(() => {
					return {
						status: "error",
						description: err.message,
					};
				});
			})
			.finally(() => {
				setTimeout(() => {
					setIsLoading(() => false);
				}, 1000);
			});
	};

	return (
		<div className="flex flex-row overflow-hidden">
			<aside className="w-3/6 bg-red-300 h-screen hidden lg:block">
				<img
					src={registerBackground}
					className="w-full h-full object-cover"
					draggable="false"
					alt=""
				/>
			</aside>
			<main className="flex-1 h-screen px-12 overflow-y-auto">
				<header className="flex flex-row justify-between pt-4 lg:hidden">
					{/* TODO: Turn it into a component */}
					<Logo_Black />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</header>
				<section className="mt-20 mb-8">
					<h1 className="font-bold text-4xl font-['Jua']">Login</h1>
					<p className="text-gray-600 font-light max-w-[20rem]">
						Fill in your details.
					</p>
				</section>

				<form onSubmit={SubmitForm} className="flex flex-col gap-4">
					{alert.status !== null && (
						<Alert status={alert.status}>
							<AlertIcon />
							<AlertDescription>
								{alert.description}
							</AlertDescription>
						</Alert>
					)}

					<fieldset className="flex flex-col gap-1">
						<label
							className="text-gray-600 font-light"
							htmlFor="email_address">
							Email <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={(e) =>
								setFormData((prev) => {
									return {
										...prev,
										email: e.target.value,
									};
								})
							}
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
							type="password"
							name="password"
							id="password"
							value={formData.password}
							onChange={(e) =>
								setFormData((prev) => {
									return {
										...prev,
										password: e.target.value,
									};
								})
							}
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
