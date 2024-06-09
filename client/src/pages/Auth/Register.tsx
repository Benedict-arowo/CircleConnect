import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import authBackground from "../../assets/banner.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription, AlertIcon, Spinner } from "@chakra-ui/react";
import { GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from "../../../config";
import { Alert as AlertType } from "../../types";
import UseFetch from "../../Components/Fetch";
import githubicon from "../../assets/github-mark 1.png";
import linkedinicon from "../../assets/Group.png";
import Twitter from "../../assets/akar-icons_x-fill.png";
import googlelogo from "../../assets/Logo-google-icon-PNG.png";
import LoginIllustration from "../../assets/Login Illustration 2.png";

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
		<main className="h-screen flex justify-center items-center item">
			<div className="bg-blue-600 rounded-t-[40px] rounded-b-[50px] w-[360px] drop-shadow-sm">
				<section className="flex items-center justify-center p-5 gap-12">
					<button className="text-white text-2xl  hover:text-opacity-60 active:text-opacity-90">
						<a
							href="./register"
							className="font-medium duration-300"
						>
							Sign Up
						</a>
					</button>
					<button className="text-white text-2xl text-opacity-40">
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
								htmlFor="first_name"
							>
								First Name
								<span className="text-red-500">*</span>
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
								className="h-full w-full border-b border-neutral-800 pt-3 pb-1.5 text-sm outline-none transition-all px-2"
							/>
						</fieldset>

						<fieldset className="flex flex-col w-full">
							<label
								className="font-medium text-md"
								htmlFor="last_name"
							>
								Last Name
								<span className="text-red-500">*</span>
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
								className="h-full w-full border-b border-neutral-800 pt-3 pb-1.5 text-sm outline-none transition-all px-2"
							/>
						</fieldset>

						<fieldset className="flex flex-col w-full">
							<label
								className="font-medium text-md"
								htmlFor="email_address"
							>
								Email<span className="text-red-500">*</span>
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
								className="h-full w-full border-b border-neutral-800 pt-3 pb-1.5 text-sm outline-none transition-all px-2"
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
								className="h-full w-full border-b border-neutral-800 pt-3 pb-1.5 text-sm outline-none transition-all px-2"
							/>
						</fieldset>

						<div className="flex flex-col items-center gap-2">
							<button
								type="submit"
								className="bg-blue-700 w-fit text-white px-12 rounded-md py-2 font-light hover:bg-sky-400 active:bg-sky-100 duration-300"
							>
								Sign Up
							</button>
							<p className="text-neutral-900 font-light">
								Already have an account?{" "}
								<a
									href="./login"
									className="text-red-500 hover:text-red-300 active:text-red-700 duration-300"
								>
									Login here!
								</a>
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
						<button onClick={handleGoogleAuth}>
							<img
								src={googlelogo}
								alt="google"
								className="w-5 mb-8 bg-transparent"
							/>
						</button>

						<button onClick={handleGithubAuth}>
							<img
								src={Twitter}
								alt="github"
								className="w-5 mb-8"
							/>
						</button>
						<button onClick={handleGithubAuth}>
							<img
								src={githubicon}
								alt="github"
								className="w-5 mb-8"
							/>
						</button>
						<button onClick={handleGithubAuth}>
							<img
								src={linkedinicon}
								alt="github"
								className="w-5 mb-8"
							/>
						</button>
						{isLoading && <Spinner />}
					</section>
				</div>
			</div>
		</main>
	);
};

export default Register;
