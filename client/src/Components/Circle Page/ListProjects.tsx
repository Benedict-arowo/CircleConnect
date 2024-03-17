import { CircleType, ProjectsType } from "../types";
import { makeReq } from "../../pages/Circle";
import RightArrow from "../Icons/RightArrow";
import { UserTypeClean } from "../../types";

type Props = {
	displayStars?: boolean;
	projects: ProjectsType[];
	circle?: CircleType;
	user?: UserTypeClean;
	isOwner?: boolean;
	showManageMenu?: boolean;
	setAlertState?: React.Dispatch<
		React.SetStateAction<{
			header: string;
			body: string;
			doneFunc: () => void;
			doneText: string;
		}>
	>;
	fetchCircle?: () => Promise<void>;
	makeReq?: ({
		url,
		method,
		body,
		loadingMsg,
		successMsg,
		successFunc,
	}: makeReq) => Promise<void>;
	onOpen?: () => void;
};

const ListProjects = ({
	// displayStars = false,
	projects,
	circle,
	isOwner,
	user,
	showManageMenu = false,
	setAlertState,
	onOpen,
	fetchCircle,
	makeReq,
}: Props) => {
	// const User = useSelector((state) => state.user);

	// Makes sure the user gives all needed parameters when showManageMenu is set to true.

	// TODO: Create a seperate component for project list with showManageMenu set to true.
	if (
		showManageMenu &&
		(!circle ||
			!projects ||
			!makeReq ||
			!fetchCircle ||
			!setAlertState ||
			!onOpen ||
			!circle)
	)
		throw new Error("Invalid arguments passed to ListProjects.");

	return projects.map((project) => {
		const {
			name,
			tags,
			description,
			id,
			github,
			liveLink,
			circle,
			createdBy,
		} = project;

		return (
			<article
				key={id}
				className="w-[350px] max-h-[520px] min-h-[500px] flex flex-col border flex-shrink-0 border-gray-300 pt-4 pb-2 px-4 snap-normal snap-center bg-[#B9D6F0] gap-3 rounded-md drop-shadow-sm relative"
			>
				<a className="w-full h-[250px]" href={`/project/${id}`}>
					<img
						src="https://images.unsplash.com/photo-1561210596-383464a42be3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
						alt="Project Banner Picture"
						className="object-cover h-full w-full rounded-md"
					/>
				</a>
				<div className="flex-1 flex flex-col justify-between">
					<div>
						<h3 className="text-2xl font-bold cursor-pointer">
							<a
								className="text-blue-700 font-semibold"
								href={`/project/${id}`}
							>
								{name}
							</a>
						</h3>

						{/* {showManageMenu &&
							User.isLoggedIn &&
							(User.info.id === createdBy.id ||
								circle.lead.id === User.info.id ||
								(circle.colead &&
									circle.colead.id === User.info.id)) && (
								<Popover placement="top-start">
									<PopoverTrigger>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 absolute top-4 right-2 cursor-pointer"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
											/>
										</svg>
									</PopoverTrigger>
									<PopoverContent>
										<PopoverHeader fontWeight="semibold">
											Manage Project
										</PopoverHeader>
										<PopoverArrow />
										<PopoverCloseButton />
										<PopoverBody>
											<ul className="flex flex-col gap-2">
												{createdBy.id ===
													User.info.id && (
													<li className="cursor-pointer">
														Edit
													</li>
												)}
												{pinned &&
													(circle.lead.id ===
														User.info.id ||
														(circle.colead &&
															circle.colead.id ===
																User.info
																	.id)) && (
														<li
															className="cursor-pointer"
															onClick={() =>
																// pinProject({
																// 	id,
																// 	status: false,
																// })
																makeReq({
																	url: `project/${id}`,
																	body: {
																		pinned: false,
																	},
																	method: "PATCH",
																	successMsg:
																		"Successfully pinned project.",
																	successFunc:
																		fetchCircle,
																})
															}
														>
															Unpin
														</li>
													)}
												{!pinned &&
													(circle.lead.id ===
														User.info.id ||
														(circle.colead &&
															circle.colead.id ===
																User.info
																	.id)) && (
														<li
															className="cursor-pointer"
															onClick={() =>
																// pinProject({
																// 	id,
																// 	status: true,
																// })
																makeReq({
																	url: `project/${id}`,
																	body: {
																		pinned: true,
																	},
																	method: "PATCH",
																	successMsg:
																		"Successfully pinned project.",
																	successFunc:
																		fetchCircle,
																})
															}
														>
															Pin
														</li>
													)}
												<li
													onClick={() => {
														setAlertState(() => {
															return {
																body: "Are you sure you want to remove this project? You can't undo this action afterwards.",
																doneText:
																	"Remove Project",
																header: "Remove Project",
																doneFunc: () =>
																	// removeFromCircle(
																	// 	id
																	// ),

																	makeReq({
																		url: `project/${id}/removeFromCircle`,
																		body: {
																			circleId:
																				circle.id,
																		},
																		method: "DELETE",
																		loadingMsg:
																			"Please wait while we try to remove this project.",
																		successMsg:
																			"Successfully removed the project.",
																		successFunc:
																			fetchCircle,
																	}),
															};
														});
														onOpen();
													}}
													className="cursor-pointer"
												>
													Remove
												</li>
												{createdBy.id ===
													User.info.id && (
													<li
														onClick={() => {
															setAlertState(
																() => {
																	return {
																		body: "Are you sure you want to delete this project? You can't undo this action afterwards.",
																		doneText:
																			"Delete Project",
																		header: "Delete Project",
																		doneFunc:
																			() =>
																				// deleteProject(
																				// 	id
																				// ),
																				makeReq(
																					{
																						url: `project/${id}`,
																						method: "DELETE",
																						loadingMsg:
																							"Deleting project...",
																						successMsg:
																							"Successfully deleted the project.",
																						successFunc:
																							fetchCircle,
																					}
																				),
																	};
																}
															);
															onOpen();
														}}
														className="cursor-pointer"
													>
														Delete
													</li>
												)}
											</ul>
										</PopoverBody>
									</PopoverContent>
								</Popover>
							)} */}

						<p className="text-left font-normal cursor-pointer mt-1 line-clamp-3 text-neutral-800 text-sm">
							{description}
						</p>

						<section className="mt-1">
							<div className="flex flex-row gap-1">
								<h4 className="font-medium">Owner (s):</h4>
								{circle && (
									<a href={`/circle/${circle.id}`}>
										Circle {circle.id}
									</a>
								)}
								{!circle && (
									<a href={`/user/${id}`}>
										{isOwner && user
											? user.first_name
											: createdBy.first_name}{" "}
										{isOwner && user
											? user.last_name
											: createdBy.last_name}
									</a>
								)}
							</div>
							<div className="flex flex-row gap-1">
								<h4 className="font-medium">Track:</h4>
								<p>Frontend (Fall Session)</p>
							</div>
						</section>

						{tags.length > 0 && (
							<div className="flex flex-row flex-wrap w-full gap-2 justify-center mt-1">
								{tags.slice(0, 3).map((tag: string) => {
									return (
										<span
											key={tag}
											className="bg-white uppercase text-neutral-700 px-2 py-1 text-sm font-light cursor-pointer rounded-md"
										>
											{tag}
										</span>
									);
								})}
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-row gap-2">
					{liveLink && (
						<button className="bg-blue-700 text-white px-4 py-1 rounded-md hover:scale-95 transition-all duration-300">
							<a
								className="flex flex-row h-fit gap-1"
								href={liveLink}
							>
								Live Link
								<RightArrow />
							</a>
						</button>
					)}
					{github && (
						<button className="text-blue-700 border border-blue-500 px-2 py-1 h-fit rounded-md text-md  hover:scale-95 transition-all duration-300">
							<a
								className="flex flex-row items-center gap-1"
								href={github}
							>
								Github Repo
								<RightArrow />
							</a>
						</button>
					)}
				</div>
			</article>
		);
	});
};

export default ListProjects;
