import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import authBackground from "../../assets/banner.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "../../../config";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { Alert as AlertType } from "../../types";
import UseFetch from "../../Components/Fetch";
import { useDispatch } from "react-redux";
import { loginUser } from "../../slices/userSlice";
import { UseSetUser } from "../../contexts/UserContext";
import githubicon from "../../assets/github-mark 1.png";
import linkedinicon from "../../assets/Group.png";
import Twitter from "../../assets/akar-icons_x-fill.png";
import googlelogo from "../../assets/Logo-google-icon-PNG.png";
import LoginIllustration from "../../assets/Login Illustration 2.png";
// import { UseSetUser } from "../../contexts/UserContext";
// import { useDispatch } from "react-redux";
// import { saveUser } from "./userSlice";

const Login = () => {
	const dispatch = useDispatch();
	const SetUser = UseSetUser();
	// const setUser = UseSetUser();
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
			url: "activeUser",
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
					// dispatch(loginUser(User.data));
					SetUser({ mode: "LOGIN", data: User.data });
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
					// dispatch(loginUser(User.data));
					SetUser({ mode: "LOGIN", data: User.data });
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
			// dispatch(loginUser(data.data));
			SetUser({ mode: "LOGIN", data: data.data });
			// setUser({
			// 	mode: "LOGIN",
			// 	data: data.data,
			// });
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
		<main className="h-screen flex justify-center items-center item">
			<div className="bg-blue-600 rounded-t-[40px] rounded-b-[50px] w-[360px] drop-shadow-sm">
				<section className="flex items-center justify-center p-5 gap-12">
					<button className="text-white text-2xl text-opacity-40 hover:text-opacity-60 active:text-opacity-90">
						<a
							href="./register"
							className="font-medium duration-300"
						>
							Sign Up
						</a>
					</button>
					<button className="text-white text-2xl">
						<a
							href="./login"
							className="cursor-default font-medium duration-300"
						>
							Sign In
						</a>
					</button>
				</section>

				<div className="rounded-[48px] bg-[#B9D6F0] w-full shadow-t-3xl">
					<form
						onSubmit={SubmitForm}
						className="flex flex-col gap-4 items-center pt-6 px-8"
					>
						{alert.status !== null && (
							<Alert status={alert.status}>
								<AlertIcon />
								<AlertDescription>
									{alert.description}
								</AlertDescription>
							</Alert>
						)}

						<fieldset className="flex flex-col w-full">
							<label
								className="font-medium text-md"
								htmlFor="email_address"
							>
								Email Address
								<span className="text-red-500">*</span>
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
								className="h-full w-full border-b  border-neutral-800 bg-slate-900 pt-3 pb-1.5 text-sm outline-none transition-all px-2"
							/>
						</fieldset>

						<fieldset className="flex flex-col w-full">
							<label
								className="font-medium text-md"
								htmlFor="password"
							>
								Password<span className="text-red-500">*</span>
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
								className="h-full w-full border-b  border-neutral-800 bg-black pt-3 pb-1.5 text-sm outline-none transition-all px-2"
							/>
						</fieldset>

						<div className="flex flex-col items-center gap-2">
							<button
								type="submit"
								className="bg-blue-700 w-fit text-white px-12 rounded-md py-2 font-light hover:bg-sky-400 active:bg-sky-100 duration-300"
							>
								Login
							</button>
							<p className="text-neutral-800 font-light text-xs">
								Forgot Password?{" "}
								<a href="/" className="text-blue-700">
									Click here
								</a>
							</p>
						</div>
					</form>
					<section className="flex items-center justify-center text-neutral-950 font-light mt-3">
						<p>Or Sign In with</p>
					</section>
					<section
						aria-label="Register with other services"
						className="flex flex-row gap-1  items-center justify-center"
					>
						<button onClick={handleGoogleAuth}>
							<img
								src={googlelogo}
								alt="google"
								className="w-5 mb-8 bg-transparent"
							/>
						</button>

						{/* <button onClick={handleGithubAuth}>
							<img
								src={Twitter}
								alt="github"
								className="w-5 mb-8"
							/>
						</button> */}
						<button onClick={handleGithubAuth}>
							<img
								src={githubicon}
								alt="github"
								className="w-6 mb-8"
							/>
						</button>
						{/* <button onClick={handleGithubAuth}>
							<img
								src={linkedinicon}
								alt="github"
								className="w-5 mb-8"
							/>
						</button> */}
						{isLoading && <Spinner />}
					</section>
				</div>
			</div>
		</main>
	);
};

export default Login;
