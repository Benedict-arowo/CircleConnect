import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import authBackground from "../../assets/authBackground.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription, AlertIcon, Spinner } from "@chakra-ui/react";
import Logo_Black from "../../Components/Logo_Black";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "../../../config";
import { Alert as AlertType } from "../../types";
import UseFetch from "../../Components/Fetch";

const Register = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
	});
	const [alert, setAlert] = useState<AlertType>({
		status: null,
		description: null,
	});
	const Navigate = useNavigate();

	const handleGoogleAuth = async () => {
		setIsLoading(() => true);

		let timer: NodeJS.Timeout | null = null;
		const loginWindow = window.open(
			GOOGLE_AUTH_URL,
			"_blank",
			"width=500,height=600"
		);
		timer = setInterval(() => {
			if (loginWindow && loginWindow.closed) {
				setIsLoading(() => false);
				// TODO: Check if user is actually authenticated before redirecting
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
		const loginWindow = window.open(
			GITHUB_AUTH_URL,
			"_blank",
			"width=500,height=600"
		);
		timer = setInterval(() => {
			if (loginWindow && loginWindow.closed) {
				// TODO: Check if user is actually authenticated before redirecting
				setIsLoading(() => false);
				console.log("You are authenticated.");
				Navigate("/");
				// const user = fetchUser();
				if (timer) {
					clearInterval(timer);
				}
			}
		}, 500);
	};

	const SubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(() => true);

		setAlert(() => {
			return {
				status: null,
				description: null,
			};
		});

		try {
			// Sends data to backend to be verified.
			// If not successful, an error will be thrown by the UseFetch function, which will fall in the catch block below.
			await UseFetch({
				url: "auth/jwt/register",
				options: {
					body: formData,
					method: "POST",
					useServerUrl: true,
				},
			});
			// No error is found, hence it's successful.
			setAlert(() => {
				return {
					status: "success",
					description: "Successfully registered.",
				};
			});
			Navigate("/");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setAlert(() => {
				return {
					status: "error",
					description: error.message,
				};
			});
		} finally {
			setIsLoading(() => false);
		}
	};

	return (
		<div className="flex flex-row overflow-hidden">
			<aside className="w-3/6 bg-red-300 h-screen hidden lg:block">
				<img
					src={authBackground}
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
					<h1 className="font-bold text-4xl font-['Jua']">
						Register
					</h1>
					<p className="text-gray-600 font-light max-w-[20rem]">
						Enter your email address and password to login to
						CircleConnect.
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
							htmlFor="first_name">
							First Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="first_name"
							id="first_name"
							placeholder="Joe"
							value={formData.first_name}
							onChange={(e) =>
								setFormData((prev) => {
									return {
										...prev,
										first_name: e.target.value,
									};
								})
							}
							className="placeholder-gray-300 outline-none border px-2 py-1 font-light"
						/>
					</fieldset>

					<fieldset className="flex flex-col gap-1">
						<label
							className="text-gray-600 font-light"
							htmlFor="last_name">
							Last Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="last_name"
							id="last_name"
							placeholder="Mama"
							value={formData.last_name}
							onChange={(e) =>
								setFormData((prev) => {
									return {
										...prev,
										last_name: e.target.value,
									};
								})
							}
							className="placeholder-gray-300 outline-none border px-2 py-1 font-light"
						/>
					</fieldset>

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
							value={formData.email}
							placeholder="user@sample.com"
							onChange={(e) =>
								setFormData((prev) => {
									return {
										...prev,
										email: e.target.value,
									};
								})
							}
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
							placeholder="***********"
							value={formData.password}
							onChange={(e) =>
								setFormData((prev) => {
									return {
										...prev,
										password: e.target.value,
									};
								})
							}
							className="placeholder-gray-300 outline-none border px-2 py-1 font-light"
						/>
					</fieldset>

					<div className="flex flex-col items-center gap-2">
						<button
							type="submit"
							className="bg-red-500 w-fit text-white px-12 rounded-md py-2 font-light hover:bg-red-400 active:bg-red-700 duration-300">
							Register
						</button>
						<p className="text-gray-500 font-light">
							Already have an account?{" "}
							<a
								href="./login"
								className="text-red-500 hover:text-red-300 active:text-red-700 duration-300">
								Login here!
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

export default Register;
