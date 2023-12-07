import { Button } from "@chakra-ui/react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import UseFetch from "./Fetch";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../pages/Auth/userSlice";
import defaultProfilePicture from "../assets/Image-32.png";

type Props = {
	className?: string;
	type?: "dark" | "light";
	useBackground?: boolean;
};

const activeStyles = {
	color: "#E53E3E",
	fontWeight: "normal",
};

const Nav = (props: Props) => {
	const dispatch = useDispatch();
	const { className, type = "dark", useBackground = true } = props;
	const user = useSelector((state) => state.user);

	const logoutHandler = async () => {
		dispatch(logoutUser());
		await UseFetch({
			url: "logout",
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		})
			.then(({ response }) => {
				if (!response.ok) throw new Error();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<header
				className={`flex flex-row justify-between py-4 px-8 md:px-8 items-center ${className} ${
					useBackground && "nav_background"
				}`}>
				<div className="flex-1 sm:flex hidden justify-between mx-auto items-center">
					<Logo type={type} />
					<ul
						className={`flex flex-row gap-6 font-light ${
							type === "dark" ? "text-black" : "text-white"
						}`}>
						<li className="cursor-pointer text-lg">
							<NavLink
								to="/"
								style={({ isActive }) => {
									return isActive ? activeStyles : {};
								}}>
								Home
							</NavLink>
						</li>
						<li className="cursor-pointer text-lg">
							<NavLink
								to="/discover"
								style={({ isActive }) => {
									return isActive ? activeStyles : {};
								}}>
								Discover
							</NavLink>
						</li>
					</ul>

					<div>
						{user.isLoggedIn && (
							<a
								onClick={logoutHandler}
								className="cursor-pointer">
								<img
									src={
										user.info.profile_picture ||
										defaultProfilePicture
									}
									alt="My profile picture"
									width="48px"
									height="48px"
									className="rounded-full"
								/>
							</a>
						)}
						{!user.isLoggedIn && (
							<Link to={"/login"}>
								<Button colorScheme="red" variant="outline">
									Login
								</Button>
							</Link>
						)}
					</div>
				</div>

				{/* Mobile Screens */}
				<div className="flex flex-row justify-between items-center w-full sm:hidden">
					<Logo type={type} />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`w-6 h-6 ${
							type === "dark" ? "text-black" : "text-white"
						}`}>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</div>
			</header>
		</>
	);
};

export default Nav;
