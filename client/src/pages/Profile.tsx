import { Avatar } from "primereact/avatar";
import Nav from "../Components/Nav";

import banner from "../assets/Hero.png";
import { UseUser } from "../contexts/UserContext";
import UseFetch from "../Components/Fetch";
import { useEffect, useState } from "react";
import ListProjects from "../Components/Circle Page/ListProjects";
import { useNavigate, useParams } from "react-router-dom";
import { UserType } from "../types";
import { FetchUsers } from "../Components/Fetch/Users";

const Profile = () => {
	const { id } = useParams();
	const user = UseUser();
	const [fectchedUser, setFetchedUser] = useState<UserType | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = useState(true);
	const Navigate = useNavigate();

	const fetchUserDetails = async () => {
		setIsLoading(true);

		if (!id && !user.info.id) {
			Navigate("/404", { replace: true });
		}

		const { response, data } = await UseFetch({
			url: `user/${id ? id : user.info.id}`,
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) throw new Error("Error fetching user.");

		setFetchedUser(data.data);
		setIsLoading(false);
	};

	useEffect(() => {
		(async () => await fetchUserDetails())();
	}, []);

	return (
		<div className="w-full min-h-screen">
			<Nav type="light" useBackground={false} className="" />

			<main className="px-0 xs:px-8 md:px-16 mt-2 mb-16">
				<section className="w-full relative">
					<div className="relative z-0 h-[300px]">
						<img
							className="w-full h-full object-cover aspect-auto"
							src={banner}
							alt="Hero Background"
						/>
						<div className="bg-black opacity-30 w-full inset-0 h-full absolute">
							A
						</div>
						<div className="absolute inset-0 flex justify-center flex-row items-center text-white">
							<h1 className="text-center xs:text-2xl md:text-5xl lg:text-6xl font-extrabold max-w-[100%] xs:max-w-[95%] lg:max-w-[80%]">
								"Every bug conquered builds your skills. Keep
								coding."
							</h1>
						</div>
					</div>
				</section>

				{!isLoading && fectchedUser && (
					<div>
						<section className="pt-16 flex flex-col gap-1 items-center">
							<Avatar
								label={`${fectchedUser.first_name[0]}`}
								image={fectchedUser.profile_picture}
								style={{
									backgroundColor: "#9c27b0",
									color: "#ffffff",
									fontSize: "32px",
								}}
								className="w-[128px] h-[128px] rounded-full cursor-pointer hover:outline-red-600 outline-none outline transition-all duration-300 object-cover overflow-hidden"
							/>

							<h1 className="font-bold text-lg capitalize">
								{fectchedUser.first_name}{" "}
								{fectchedUser.last_name}
							</h1>
							<h3 className="font-semibold uppercase ">
								{fectchedUser.track} - {fectchedUser.school}
							</h3>
							{fectchedUser.leadOf && (
								<div className="flex flex-row gap-2 items-center">
									<h3 className="bg-red-800 text-white px-2 text-sm rounded-sm py-1">
										Lead
									</h3>
									<span>@</span>
									<a
										className="font-medium text-blue-700 hover:underline"
										href={`/circle/${fectchedUser.leadOf.id}`}
									>
										Circle#{fectchedUser.leadOf.id}
									</a>
								</div>
							)}
							{fectchedUser.coleadOf && (
								<div className="flex flex-row gap-2 items-center">
									<h3 className="bg-blue-500 text-white px-2 text-sm rounded-sm py-1">
										Colead
									</h3>
									<span>@</span>
									<a
										className="font-medium text-blue-700 hover:underline"
										href={`/circle/${fectchedUser.coleadOf.id}`}
									>
										Circle#{fectchedUser.coleadOf.id}
									</a>
								</div>
							)}
							{fectchedUser.memberOf && (
								<div className="flex flex-row gap-2 items-center">
									<h3 className="bg-gray-500 text-white px-2 text-sm rounded-sm py-1">
										Member
									</h3>
									<span>@</span>
									<a
										className="font-medium text-blue-700 hover:underline"
										href={`/circle/${fectchedUser.memberOf.id}`}
									>
										Circle#{fectchedUser.memberOf.id}
									</a>
								</div>
							)}

							{user.info.id &&
								user.info.id === fectchedUser.id && (
									<button className="bg-transparent border border-blue-400 text-blue-700 px-6 py-2 rounded-md mt-2">
										Edit
									</button>
								)}
						</section>

						<section className="mt-12 md:pr-0">
							<a
								className="font-bold text-4xl px-2 sm:px-0 md:text-5xl text-blue-700"
								href="#top_projects"
								id="top_projects"
							>
								{user.info.id &&
								user.info.id === fectchedUser.id
									? "My Projects"
									: `${fectchedUser.first_name}'s Projects`}
							</a>
							{fectchedUser.projects && (
								<section className="flex flex-row justify-evenly flex-wrap gap-4 h-fit pt-6 pb-7 px-4">
									<ListProjects
										isOwner={true}
										user={fectchedUser}
										projects={fectchedUser.projects}
									/>
								</section>
							)}
						</section>
					</div>
				)}
			</main>
		</div>
	);
};

export default Profile;
