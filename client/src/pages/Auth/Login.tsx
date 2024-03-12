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
import googlelogo from "../../assets/Logo-google-icon-PNG.png"
import LoginIllustration from "../../assets/Login Illustration 2.png"
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
		<div className="flex flex-row overflow-hidden">
			<aside className="w-3/6  h-screen hidden lg:block  opacity-40">
				<img
					src={authBackground}
					className="w-full h-full object-cover"
					draggable="false"
					alt=""
				/>
			</aside>
			<aside className=" w-96 absolute hidden lg:block left-32 top-10">
			<img
					src={LoginIllustration}
					className="w-full h-full object-cover"
					draggable="false"
					alt=""
				/>
			</aside>
			<main className="flex-1 h-screen px-16 overflow-y-aut   flex flex-col lg:ml-10 ">
				<div  className="mt-20  bg-blue-600  rounded-3xl h-32 w-80 lg:w-96">
				<section className="flex items-center justify-between m-5 gap-3">
					<button className="text-white text-2xl text-opacity-50">
					<a
								href="./register"
								className="  hover:text-white active:text-white duration-300"
							>
								Sign Up
							</a>
					</button>
					<button className="text-white text-2xl">
					<a
								href="./login"
								className="  hover:text-white active:text-white duration-300"
							>
								Sign In
							</a>
					</button>
					{/* <p className="text-gray-600 font-light max-w-[20rem]">
						Fill in your details.
					</p> */}
				</section>

				<div className=" rounded-3xl   bg-[#B9D6F0] mb-10 w-80 lg:w-96 shadow-t-3xl">
				<form onSubmit={SubmitForm} className="flex flex-col gap-4 items-center ">
					{alert.status !== null && (
						<Alert status={alert.status}>
							<AlertIcon />
							<AlertDescription>
								{alert.description}
							</AlertDescription>
						</Alert>
					)}

					<fieldset className="flex flex-col gap-1 m-6">
						<label
							  className="after:content[''] pointer-events-none flex h-full w-full select-none !overflow-visible truncate text-[20px] font-normal leading-tight  text-neutral-950 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
							htmlFor="email_address"
						>
							Email Address<span className="text-red-500">*</span>
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
							className="peer h-full  w-64 lg:w-80  border-b  border-neutral-900 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-100 "
						/>
					</fieldset>

					<fieldset className="flex flex-col gap-1">
						<label
							  className="after:content[''] pointer-events-none flex h-full w-full select-none !overflow-visible truncate text-[20px] font-normal leading-tight  text-neutral-950 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
							htmlFor="password"
						>
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
							className="peer h-full  w-64 lg:w-80 border-b  border-neutral-900 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-100"
						/>
					</fieldset>

					<div className="flex flex-col items-center gap-2">
						<button
							type="submit"
							className="bg-blue-700 w-fit text-white px-12 rounded-md py-2 font-light hover:bg-sky-400 active:bg-sky-100 duration-300"
						>
							Login
						</button>
						<p className="text-neutral-900 font-light">
							Forgot Password?{" "}
							{/* <a
								href="./register"
								className="text-red-500 hover:text-red-300 active:text-red-700 duration-300"
							>
								Register here!
							</a> */}
						</p>
					</div>
				</form>
				<section className="flex items-center justify-center text-neutral-950 font-light mt-3">
				<p>Or Sign In with</p>
				</section>
				<section
					aria-label="Register with other services"
					className="flex flex-row gap-1  items-center justify-center "
				>
					
					<button onClick={handleGoogleAuth} >
							<img src={googlelogo} alt="google"  className="w-5 mb-8 bg-transparent"/>
					</button>
					
					<button onClick={handleGithubAuth} >
						<img src={Twitter} alt="github" className="w-5 mb-8" />
					</button>
					<button onClick={handleGithubAuth} >
						<img src={githubicon} alt="github"  className="w-5 mb-8"/>
					</button>
					<button onClick={handleGithubAuth} >
						<img src={linkedinicon} alt="github"  className="w-5 mb-8"/>
					</button>
					{isLoading && <Spinner />}
				</section>
				</div>
				</div>
			</main>
		</div>
	);
};

export default Login;
