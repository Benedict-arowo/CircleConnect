import GithubButton from "react-github-login-button";
import GoogleButton from "react-google-button";
import registerBackground from "../../assets/Register.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

const Register = () => {
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
		const githubAuthURL = "http://localhost:8000/auth/github";
		const loginWindow = window.open(
			githubAuthURL,
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
					<svg
						width="84"
						height="49"
						viewBox="0 0 84 49"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0.75 13.1016C0.75 11.0234 1.29688 9.23438 2.39062 7.73438C3.65625 6.01562 5.36719 5.15625 7.52344 5.15625C8.88281 5.15625 10.4531 5.71094 12.2344 6.82031L11.2266 8.69531C10.2109 8.10156 9.69531 7.78906 9.67969 7.75781C9.10156 7.49219 8.50781 7.35156 7.89844 7.33594C6.61719 7.33594 5.60938 8.0625 4.875 9.51562C4.28125 10.6719 3.98438 11.9531 3.98438 13.3594C3.98438 14.875 4.375 16.1562 5.15625 17.2031C5.89062 18.1875 6.78125 18.6875 7.82812 18.7031C8.39062 18.7031 8.92188 18.6016 9.42188 18.3984C9.8125 18.2578 10.4297 17.9453 11.2734 17.4609L12.3984 19.3359C11.3359 20.0234 10.5078 20.4922 9.91406 20.7422C9.14844 21.0391 8.30469 21.1875 7.38281 21.1875C5.21094 21.1875 3.52344 20.3438 2.32031 18.6562C1.27344 17.1562 0.75 15.3047 0.75 13.1016ZM14.3906 5.22656C14.3906 4.71094 14.5625 4.28906 14.9062 3.96094C15.2656 3.61719 15.6875 3.44531 16.1719 3.44531C16.6406 3.44531 17.0469 3.61719 17.3906 3.96094C17.75 4.28906 17.9297 4.71094 17.9297 5.22656C17.9297 5.74219 17.7578 6.17188 17.4141 6.51562C17.0703 6.85937 16.6562 7.03125 16.1719 7.03125C15.6875 7.03125 15.2656 6.85937 14.9062 6.51562C14.5625 6.17188 14.3906 5.74219 14.3906 5.22656ZM14.8828 9.11719H17.4375V21H14.8828V9.11719ZM24.9375 11.7891C24.4688 11.8047 24.0234 12.0547 23.6016 12.5391C23.2109 12.9609 23.0156 13.2891 23.0156 13.5234V21H20.4609V9.09375H23.0156V11.0391C23.2188 10.5391 23.5078 10.0703 23.8828 9.63281C24.3203 9.11719 24.7188 8.85938 25.0781 8.85938C25.6875 8.85938 26.1875 8.9375 26.5781 9.09375L26.2734 12.0703C26.0078 11.9141 25.8047 11.8203 25.6641 11.7891C25.5859 11.7734 25.3438 11.7734 24.9375 11.7891ZM27.9844 15.1875C27.9844 13.0469 28.6094 11.3906 29.8594 10.2188C30.9062 9.20312 32.1719 8.71094 33.6562 8.74219C34.5625 8.74219 35.7734 9.25 37.2891 10.2656L36.4922 11.9297C35.4453 11.0859 34.4219 10.6641 33.4219 10.6641C32.5625 10.6641 31.8906 11.1719 31.4062 12.1875C30.9844 13.0469 30.7812 14.0703 30.7969 15.2578C30.7969 16.4922 31.0547 17.4922 31.5703 18.2578C32.0859 19.0078 32.7656 19.3828 33.6094 19.3828C34.5469 19.3828 35.5859 18.875 36.7266 17.8594L37.8047 19.2656C37.1797 19.9844 36.5469 20.5 35.9062 20.8125C35.2656 21.125 34.5 21.2812 33.6094 21.2812C31.5156 21.2812 29.9766 20.4609 28.9922 18.8203C28.3203 17.7109 27.9844 16.5 27.9844 15.1875ZM40.0781 4.24219H42.6094V21H40.0781V4.24219ZM50.7422 19.3594C51.7891 19.375 52.8281 18.875 53.8594 17.8594L54.9375 19.3125C54.1094 20.1094 53.3828 20.6484 52.7578 20.9297C52.1953 21.1641 51.4609 21.2812 50.5547 21.2812C48.4609 21.2812 46.9375 20.4219 45.9844 18.7031C45.375 17.5781 45.0703 16.3672 45.0703 15.0703C45.0703 13.2578 45.5469 11.7734 46.5 10.6172C47.5312 9.38281 48.9219 8.76562 50.6719 8.76562C51.875 8.76562 52.8828 9.16406 53.6953 9.96094C54.5859 10.8359 55.0312 12.0078 55.0312 13.4766V15.2812H47.9297C47.9609 17.9844 48.8984 19.3438 50.7422 19.3594ZM52.4062 13.2422C52.4844 11.4922 51.8438 10.625 50.4844 10.6406C49.9375 10.6406 49.4609 10.8438 49.0547 11.25C48.5547 11.7344 48.2344 12.3984 48.0938 13.2422H52.4062Z"
							fill="black"
						/>
						<path
							d="M59 21L82 21"
							stroke="black"
							stroke-width="3"
							stroke-linecap="square"
						/>
						<path
							d="M0.75 35.1016C0.75 33.0234 1.29688 31.2344 2.39062 29.7344C3.65625 28.0156 5.36719 27.1562 7.52344 27.1562C8.88281 27.1562 10.4531 27.7109 12.2344 28.8203L11.2266 30.6953C10.2109 30.1016 9.69531 29.7891 9.67969 29.7578C9.10156 29.4922 8.50781 29.3516 7.89844 29.3359C6.61719 29.3359 5.60938 30.0625 4.875 31.5156C4.28125 32.6719 3.98438 33.9531 3.98438 35.3594C3.98438 36.875 4.375 38.1562 5.15625 39.2031C5.89062 40.1875 6.78125 40.6875 7.82812 40.7031C8.39062 40.7031 8.92188 40.6016 9.42188 40.3984C9.8125 40.2578 10.4297 39.9453 11.2734 39.4609L12.3984 41.3359C11.3359 42.0234 10.5078 42.4922 9.91406 42.7422C9.14844 43.0391 8.30469 43.1875 7.38281 43.1875C5.21094 43.1875 3.52344 42.3438 2.32031 40.6562C1.27344 39.1562 0.75 37.3047 0.75 35.1016ZM14.2969 36.9531C14.2969 34.9062 14.9453 33.3047 16.2422 32.1484C17.3203 31.1953 18.5703 30.7188 19.9922 30.7188C21.3984 30.7188 22.6172 31.1953 23.6484 32.1484C24.8984 33.2891 25.5234 34.8906 25.5234 36.9531C25.5234 38.3594 25.1641 39.6484 24.4453 40.8203C23.4297 42.4453 21.9375 43.2578 19.9688 43.2578C17.8125 43.2578 16.2422 42.4375 15.2578 40.7969C14.6172 39.7031 14.2969 38.4219 14.2969 36.9531ZM17.0859 37.0938C17.0859 38.25 17.3125 39.2266 17.7656 40.0234C18.2812 40.9297 18.9844 41.3828 19.875 41.3828C20.7812 41.3828 21.5 40.9219 22.0312 40C22.5156 39.1875 22.75 38.1797 22.7344 36.9766C22.7344 35.8047 22.5234 34.8125 22.1016 34C21.6016 33.0781 20.9297 32.6172 20.0859 32.6172C19.1172 32.6172 18.3516 33.0859 17.7891 34.0234C17.3203 34.8516 17.0859 35.875 17.0859 37.0938ZM34.6641 35.3125C34.6641 34.5156 34.5234 33.8984 34.2422 33.4609C34.0078 33.0703 33.6953 32.8828 33.3047 32.8984C32.7109 32.8984 32.1016 33.2422 31.4766 33.9297C30.8516 34.6016 30.5391 35.2031 30.5391 35.7344V43H27.9844V31.0938H30.5391V33.2266C31.5078 31.5703 32.4922 30.7422 33.4922 30.7422C34.5078 30.7422 35.375 31.1328 36.0938 31.9141C36.8594 32.7422 37.2422 33.7812 37.2422 35.0312V43H34.6641V35.3125ZM46.9453 35.3125C46.9453 34.5156 46.8047 33.8984 46.5234 33.4609C46.2891 33.0703 45.9766 32.8828 45.5859 32.8984C44.9922 32.8984 44.3828 33.2422 43.7578 33.9297C43.1328 34.6016 42.8203 35.2031 42.8203 35.7344V43H40.2656V31.0938H42.8203V33.2266C43.7891 31.5703 44.7734 30.7422 45.7734 30.7422C46.7891 30.7422 47.6562 31.1328 48.375 31.9141C49.1406 32.7422 49.5234 33.7812 49.5234 35.0312V43H46.9453V35.3125ZM57.6328 41.3594C58.6797 41.375 59.7188 40.875 60.75 39.8594L61.8281 41.3125C61 42.1094 60.2734 42.6484 59.6484 42.9297C59.0859 43.1641 58.3516 43.2812 57.4453 43.2812C55.3516 43.2812 53.8281 42.4219 52.875 40.7031C52.2656 39.5781 51.9609 38.3672 51.9609 37.0703C51.9609 35.2578 52.4375 33.7734 53.3906 32.6172C54.4219 31.3828 55.8125 30.7656 57.5625 30.7656C58.7656 30.7656 59.7734 31.1641 60.5859 31.9609C61.4766 32.8359 61.9219 34.0078 61.9219 35.4766V37.2812H54.8203C54.8516 39.9844 55.7891 41.3438 57.6328 41.3594ZM59.2969 35.2422C59.375 33.4922 58.7344 32.625 57.375 32.6406C56.8281 32.6406 56.3516 32.8438 55.9453 33.25C55.4453 33.7344 55.125 34.3984 54.9844 35.2422H59.2969ZM63.7266 37.1875C63.7266 35.0469 64.3516 33.3906 65.6016 32.2188C66.6484 31.2031 67.9141 30.7109 69.3984 30.7422C70.3047 30.7422 71.5156 31.25 73.0312 32.2656L72.2344 33.9297C71.1875 33.0859 70.1641 32.6641 69.1641 32.6641C68.3047 32.6641 67.6328 33.1719 67.1484 34.1875C66.7266 35.0469 66.5234 36.0703 66.5391 37.2578C66.5391 38.4922 66.7969 39.4922 67.3125 40.2578C67.8281 41.0078 68.5078 41.3828 69.3516 41.3828C70.2891 41.3828 71.3281 40.875 72.4688 39.8594L73.5469 41.2656C72.9219 41.9844 72.2891 42.5 71.6484 42.8125C71.0078 43.125 70.2422 43.2812 69.3516 43.2812C67.2578 43.2812 65.7188 42.4609 64.7344 40.8203C64.0625 39.7109 63.7266 38.5 63.7266 37.1875ZM76.4531 39.2969V33.1562H74.7891V31.1875H76.4531V28.6797H79.1719V31.1875H81.5625V33.1797L79.1719 33.1562V39.5781C79.1719 40.6094 79.4688 41.1172 80.0625 41.1016C80.5469 41.1016 80.8672 41.0703 81.0234 41.0078C81.0391 41.0078 81.3125 40.8594 81.8438 40.5625L82.4062 42.2031C81.5938 42.6562 81.0391 42.9297 80.7422 43.0234C80.3359 43.1328 79.7109 43.1875 78.8672 43.1875C77.2578 43.1875 76.4531 41.8906 76.4531 39.2969Z"
							fill="black"
						/>
					</svg>
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

				<form action="" method="post" className="flex flex-col gap-4">
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
