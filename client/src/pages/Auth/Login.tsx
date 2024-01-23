import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import authBackground from "../../assets/authBackground.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "../../../config";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { Alert as AlertType } from "../../types";
import UseFetch from "../../Components/Fetch";
import { useDispatch } from "react-redux";
import { loginUser } from "../../slices/userSlice";
// import { useDispatch } from "react-redux";
// import { saveUser } from "./userSlice";

const Login = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [alert, setAlert] = useState<AlertType>({
		status: null,
		description: null,
	});
	const Navigate = useNavigate();
	// const Dispatch = useDispatch();

	const fetchUser = async () => {
		const { data, response } = await UseFetch({
			url: "user",
			options: {
				useServerUrl: true,
				returnResponse: true,
			},
		});
		return { data, response };
	};

	const handleGoogleAuth = async () => {
		setIsLoading(() => true);
		let timer: NodeJS.Timeout | null = null;
		const loginWindow = window.open(
			GOOGLE_AUTH_URL,
			"_blank",
			"width=500,height=600"
		);

		timer = setInterval(async () => {
			if (loginWindow && loginWindow.closed) {
				setIsLoading(() => false);
				const User = await fetchUser();

				if (!User.response.ok) {
					if (timer) clearInterval(timer);
					setAlert(() => {
						return {
							status: "error",
							description: "Error trying to log in.",
						};
					});
				} else {
					if (timer) clearInterval(timer);
					dispatch(loginUser(User.data));
					Navigate("/");
				}
			}
		}, 500);

		setIsLoading(() => false);
	};

	const handleGithubAuth = async () => {
		setIsLoading(() => true);
		let timer: NodeJS.Timeout | null = null;
		const loginWindow = window.open(
			GITHUB_AUTH_URL,
			"_blank",
			"width=500,height=600"
		);
		timer = setInterval(async () => {
			if (loginWindow && loginWindow.closed) {
				setIsLoading(() => false);
				const User = await fetchUser();

				if (!User.response.ok) {
					if (timer) clearInterval(timer);
					setAlert(() => {
						return {
							status: "error",
							description: "Error trying to log in.",
						};
					});
				} else {
					if (timer) clearInterval(timer);
					dispatch(loginUser(User.data));
					Navigate("/");
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
			const data = await UseFetch({
				url: "auth/jwt/login",
				options: {
					body: formData,
					method: "POST",
					useServerUrl: true,
				},
			});

			if (!data.success) {
				throw new Error(data.message);
			}

			// Save user's credentials to session storage
			dispatch(loginUser(data.data));
			// No error is found, hence it's successful.
			setAlert(() => {
				return {
					status: "success",
					description: "Successfully signed in.",
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
			<main className="flex-1 h-screen px-12 overflow-y-auto auth_background">
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
