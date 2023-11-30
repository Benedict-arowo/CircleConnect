import { Button } from "@chakra-ui/react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SERVER_URL } from "../../config";

type Props = {
	className?: string;
	type?: "dark" | "light";
	useBackground?: boolean;
};

type User = {
	id: string;
	first_name: string;
};

const Nav = (props: Props) => {
	const { className, type = "dark", useBackground = true } = props;
	const [user, setUser] = useState<null | User>(null);

	useEffect(() => {
		const fetchUser = () => {
			fetch("http://localhost:8000/user", {
				credentials: "include",
				headers: {
					Accept: "application/json",
				},
			})
				.then((response) => {
					console.log(response);
					if (!response.ok) throw new Error(response.statusText);
					return response.json();
				})
				.then((data) => {
					setUser(data);
				})
				.catch((error) => {
					setUser(null);
					console.log(error);
				});
		};
		fetchUser();
	}, []);

	return (
		<>
			<header
				className={`flex flex-row justify-between py-4 px-8 md:px-16 items-center ${className} ${
					useBackground && "nav_background"
				}`}>
				<div className="flex-1 sm:flex hidden justify-between mx-auto items-center">
					<Logo type={type} />
					<ul
						className={`flex flex-row gap-6 font-light text-xl ${
							type === "dark" ? "text-black" : "text-white"
						}`}>
						<li className="text-red-500 font-normal cursor-default">
							Home
						</li>
						<li className="cursor-pointer">Circle</li>
					</ul>

					<div>
						{user && (
							<a href={`${SERVER_URL}/logout`}>
								<Button colorScheme="red" variant="ghost">
									Logout
								</Button>
							</a>
						)}
						{!user && (
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
