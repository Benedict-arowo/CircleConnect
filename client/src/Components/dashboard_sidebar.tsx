import { Typography } from "@mui/material";
import Logo from "./Logo";
import { FaAngleRight } from "react-icons/fa";
import { GiPlainCircle } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";
import profilePicture from "../assets/Image-32.png";

const DashboardSidebar = () => {
	const baseStyle =
		"flex flex-row gap-4 w-full py-1 px-2 h-fit items-center text-white cursor-pointer";
	const activeStyle = "bg-[#252525] text-[#F1C644]";

	const getStyle = (isActive: boolean) =>
		isActive ? `${baseStyle} ${activeStyle}` : baseStyle;

	return (
		<main className="flex flex-row w-screen h-screen">
			<div className="max-w-[300px] w-full bg-[#2B2B2B] h-screen px-3 relative">
				<div className="w-full flex flex-row justify-between items-center py-2">
					<Logo type="light" />
					<IoIosArrowBack className="fill-stone-600 hover:fill-white cursor-pointer w-5 h-5" />
				</div>

				<div className="flex flex-col gap-2 mt-24 w-full">
					<NavLink
						end
						to="/dashboard"
						className={({ isActive }) => {
							return getStyle(isActive);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8 text-inherit"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
							/>
						</svg>
						<p className="font-light text-xl">Home</p>
					</NavLink>

					<NavLink
						to="/dashboard/circles"
						className={({ isActive }) => {
							return getStyle(isActive);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
							/>
						</svg>

						<p className="font-light text-xl">Circle</p>
					</NavLink>

					<NavLink
						to="/dashboard/users"
						className={({ isActive }) => {
							return getStyle(isActive);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>

						<p className="font-light text-xl">Users</p>
					</NavLink>

					<NavLink
						to="/dashboard/roles"
						className={({ isActive }) => {
							return getStyle(isActive);
						}}
					>
						{" "}
						{/* <TfiLocationArrow className="w-7 h-7" /> */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 6h.008v.008H6V6Z"
							/>
						</svg>
						<p className="font-light text-xl">Roles</p>
					</NavLink>

					<NavLink
						to="/dashboard/projects"
						className={({ isActive }) => {
							return getStyle(isActive);
						}}
					>
						{/* <AiOutlineProject className="w-7 h-7" /> */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
							/>
						</svg>

						<p className="font-light text-xl">Project</p>
					</NavLink>
				</div>

				<div className="absolute bottom-0 left-0 right-0 flex gap-2 justify-between items-center w-full p-3">
					<div className="flex flex-row gap-4 items-center">
						<section className="relative">
							<img
								src={profilePicture}
								alt="User profile picture"
								className="object-cover w-14 h-14"
							/>
							<GiPlainCircle className="fill-green-600 absolute top-10 left-10" />
						</section>

						<div>
							{/* <Typography
								variant="h6"
								component="h2"
								sx={{ color: "white" }}
							>
								John Doe
							</Typography> */}
							<p className="text-gray-400 text-xs">ADMIN</p>
						</div>
					</div>

					{/* <FaAngleRight className="fill-stone-600 relative left-24 top-2 w-9 h-9" /> */}
					<FaAngleRight className="fill-stone-600 hover:fill-white cursor-pointer w-5 h-5" />
				</div>
			</div>
			<Outlet />
		</main>
	);
};

export default DashboardSidebar;
