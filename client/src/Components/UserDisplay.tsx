import { UserType } from "../types";
import Github from "./Icons/Github";
import LinkedIn from "./Icons/LinkedIn";
import X from "./Icons/X";

const UserDisplay = (props) => {
	const { users } = props;
	return users.map((user: UserType) => {
		const { first_name, last_name, id, school, track, profile_picture } =
			user;
		return (
			<div className="max-w-[300px] min-w-[250px] nap-normal snap-center h-fit px-2 pt-4 pb-1 bg-[#B9D6F0] border border-blue-400 rounded-sm shadow-md">
				<img
					src={
						profile_picture
							? profile_picture
							: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
					}
					className="w-[128px] h-[128px] object-cover rounded-full mx-auto"
				/>
				<h3 className="font-bold text-center text-3xl text-blue-700 truncate max-w-[70%] mx-auto">
					{first_name} {last_name}
				</h3>
				<p className="text-neutral-800 font-light text-center">
					{school[0].toUpperCase() + school.slice(1).toLowerCase()}{" "}
					(Fall Session "24)
				</p>
				<p className="text-neutral-800 font-light text-center">
					{track &&
						track[0].toUpperCase() +
							track.slice(1).toLowerCase()}{" "}
					| Circle 31
				</p>
				<a href={`/profile/${id}`}>
					<button className="px-6 py-2 mx-auto bg-blue-700 text-white rounded-md mt-1 flex flex-row gap-2 justify-center">
						View Profile
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-6 h-6"
						>
							<path
								fillRule="evenodd"
								d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</a>
				<div className="flex flex-row gap-2 justify-center mt-2">
					<X />
					<Github />
					<LinkedIn />
				</div>
			</div>
		);
	});
};

export default UserDisplay;
