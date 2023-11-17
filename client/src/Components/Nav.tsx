import { Button } from "@chakra-ui/react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

type Props = {
	className?: string;
	type?: "dark" | "light";
};

const Nav = (props: Props) => {
	const { className, type = "dark" } = props;
	return (
		<>
			<header
				className={`flex flex-row justify-between pt-4 px-4 items-center ${className}`}>
				<div className="flex-1 sm:flex hidden justify-between mx-auto items-center">
					<Logo type={type} />
					<ul
						className={`flex flex-row gap-6 font-light ${
							type === "dark" ? "text-black" : "text-white"
						}`}>
						<li className="text-red-500 font-normal cursor-default">
							Home
						</li>
						<li className="cursor-pointer">Circle</li>
					</ul>

					<div>
						<Link to={"/login"}>
							<Button colorScheme="red" variant="outline">
								Login
							</Button>
						</Link>
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
