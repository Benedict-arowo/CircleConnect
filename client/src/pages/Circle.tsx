import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import { Button, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import banner from "../assets/Hero.png";
// import ProjectsComponent from "../Components/project_component";
import { CircleMemberType, CircleType } from "../Components/types";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from "@chakra-ui/react";

// import { Avatar } from "@chakra-ui/react";
import { useSelector } from "react-redux";
// import ListMembers from "../Components/Circle Page/ListMembers";
// import ListRequests from "../Components/Circle Page/ListRequests";
import ListProjects from "../Components/Circle Page/ListProjects";
import { Avatar } from "primereact/avatar";

type useToastPromise = {
	fetch: Promise<any>;
	successMsg: string;
	successFunc?: () => void;
	loadingMsg: string;
};

type alertType = {
	doneFunc: () => void;
	header: string;
	body: string;
	doneText: string;
};

export type makeReq = {
	url: string;
	method: "GET" | "POST" | "PATCH" | "DELETE";
	body?: object;
	loadingMsg?: string;
	successMsg: string;
	successFunc?: () => void;
};

const Circle = () => {
	const { id } = useParams();
	// const Navigate = useNavigate();
	const [circle, setCircle] = useState<null | CircleType>(null);
	const [state, setState] = useState({
		isMember: false,
		isOwner: false,
		isColead: false,
		isVisitor: true,
		isRequesting: false,
	});
	const [alertState, setAlertState] = useState<alertType>({
		header: "",
		body: "",
		doneFunc: function () {},
		doneText: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [err, setErr] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const cancelRef = React.useRef();
	const User = useSelector((state) => state.user);
	const toast = useToast();

	const UseToastPromise = ({
		fetch,
		successMsg,
		successFunc,
		loadingMsg,
	}: useToastPromise) => {
		toast.promise(fetch, {
			success: function ({ data, response }) {
				console.log(data, response);
				if (!response.ok) throw new Error(data.message);
				if (successFunc) {
					successFunc();
				}
				return {
					title: "Success.",
					duration: 1000,
					description: successMsg,
				};
			},
			loading: {
				title: "Loading...",
				description: loadingMsg,
			},
			error: function (err) {
				return {
					title: "Error",
					description:
						err.message === "Failed to fetch"
							? "Error trying to communicate with the server."
							: err.message,
				};
			},
		});
	};

	const makeReq = async ({
		url,
		method,
		body,
		loadingMsg,
		successMsg,
		successFunc,
	}: makeReq) => {
		UseToastPromise({
			fetch: UseFetch({
				url,
				options: {
					method,
					useServerUrl: true,
					returnResponse: true,
					body,
				},
			}),
			loadingMsg: loadingMsg ? loadingMsg : "Loading...",
			successMsg,
			successFunc,
		});
	};

	const DisplayMembers = ({ members }: { members: CircleMemberType[] }) => {
		return members.map((circleMember) => {
			if (circleMember) {
				const { profile_picture } = circleMember;
				return (
					<a
						key={circleMember.id}
						title={circleMember.first_name}
						className=""
						href={`/profile/${circleMember.id}`}
					>
						{/* <Avatar
							size={"2xl"}
							name={`${circleMember.first_name}`}
							src={profile_picture}
							
						/> */}
						<Avatar
							label={`${circleMember.first_name[0]}`}
							image={profile_picture}
							style={{
								backgroundColor: "#9c27b0",
								color: "#ffffff",
								fontSize: "32px",
							}}
							className="w-[128px] h-[128px] rounded-full cursor-pointer hover:outline-red-600 outline-none outline transition-all duration-300 object-cover overflow-hidden"
						/>
					</a>
				);
			}
		});
	};

	const fetchCircle = async () => {
		await UseFetch({
			url: `circle/${id}`,
			options: {
				method: "GET",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		})
			.then(({ data, response }) => {
				if (!response.ok) throw new Error(data.message);
				data = data.data;
				setCircle(() => data);
				setErr(() => null);

				// Conditions covered
				// If user is a visitor
				// If user is lead
				// If user is colead
				// If user is requesting to join
				// If user is a member
				console.log(data);
				if (data.lead && data.lead.id === User.info.id) {
					setState(() => {
						return {
							isMember: true,
							isOwner: true,
							isColead: false,
							isRequesting: false,
							isVisitor: false,
						};
					});
				} else if (data.colead && data.colead.id === User.info.id) {
					setState(() => {
						return {
							isMember: true,
							isOwner: false,
							isColead: true,
							isRequesting: false,
							isVisitor: false,
						};
					});
				} else if (
					data.members.some(
						(members: CircleMemberType) =>
							members.id === User.info.id
					)
				) {
					setState(() => {
						return {
							isMember: true,
							isOwner: false,
							isColead: false,
							isRequesting: false,
							isVisitor: false,
						};
					});
				} else if (
					data.requests.some(
						(member: CircleMemberType) => member.id === User.info.id
					)
				) {
					setState(() => {
						return {
							isMember: false,
							isOwner: false,
							isColead: false,
							isRequesting: true,
							isVisitor: false,
						};
					});
				} else {
					setState(() => {
						return {
							isMember: false,
							isOwner: false,
							isColead: false,
							isRequesting: false,
							isVisitor: true,
						};
					});
				}
			})
			.catch((err) => {
				setErr(() =>
					err.message === "Failed to fetch"
						? "Error trying to communicate with the server."
						: err.message
				);
			});
	};

	// const joinCircle = async () => {
	// 	if (!circle) return;

	// 	const joinCircleFetch = UseFetch({
	// 		url: `circle/request/join/${circle.id}`,
	// 		options: {
	// 			method: "POST",
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	UseToastPromise({
	// 		fetch: joinCircleFetch,
	// 		loadingMsg: "Please wait while we try to join the circle.",
	// 		successMsg: "Successfully requested to join the circle.",
	// 		successFunc: fetchCircle,
	// 	});
	// };

	// const canceljoinCircle = async () => {
	// 	if (!circle) return;

	// 	const leaveCircleRequestFetch = UseFetch({
	// 		url: `circle/request/leave/${circle.id}`,
	// 		options: {
	// 			method: "POST",
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	UseToastPromise({
	// 		fetch: leaveCircleRequestFetch,
	// 		loadingMsg: "Please wait while we try to leave the circle request.",
	// 		successMsg: "Successfully left circle request.",
	// 		successFunc: fetchCircle,
	// 	});
	// };

	// const leaveCircle = async () => {
	// 	if (!circle) return;

	// 	const leaveCircleFetch = UseFetch({
	// 		url: `circle/${circle.id}/leave`,
	// 		options: {
	// 			method: "PATCH",
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	UseToastPromise({
	// 		fetch: leaveCircleFetch,
	// 		loadingMsg: "Please wait while we try to leave the circle.",
	// 		successMsg: "Successfully left circle.",
	// 		successFunc: fetchCircle,
	// 	});
	// };

	// const submitDescription = () => {
	// 	if (!circle) return;

	// 	const submitDescriptionFetch = UseFetch({
	// 		url: `circle/${circle.id}`,
	// 		options: {
	// 			method: "PATCH",
	// 			body: {
	// 				description,
	// 			},
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	UseToastPromise({
	// 		fetch: submitDescriptionFetch,
	// 		loadingMsg: "Saving new circle description.",
	// 		successMsg: "Successfully saved new circle description.",
	// 		successFunc: () => {
	// 			settingsDrawerOnClose();
	// 			fetchCircle();
	// 			setDescription(() => "");
	// 		},
	// 	});
	// };

	// const deleteCircle = async () => {
	// 	if (!circle) return;

	// 	const deleteCircleFetch = UseFetch({
	// 		url: `circle/${circle.id}`,
	// 		options: {
	// 			method: "DELETE",
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	UseToastPromise({
	// 		fetch: deleteCircleFetch,
	// 		loadingMsg: "Please wait while we try to delete the circle.",
	// 		successMsg: "Successfully deleted the circle.",
	// 		successFunc: () => {
	// 			onClose();
	// 			Navigate("/");
	// 		},
	// 	});
	// };

	// const addToCircle = async (projectId: string) => {
	// 	const data = await UseFetch({
	// 		url: `project/${projectId}/addToCircle`,
	// 		options: {
	// 			body: {
	// 				circleId: id,
	// 			},
	// 			method: "PATCH",
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	fetchCircle();
	// };

	// const removeFromCircle = async (projectId: string) => {
	// 	UseToastPromise({
	// 		fetch: UseFetch({
	// 			url: `project/${projectId}/removeFromCircle`,
	// 			options: {
	// 				body: {
	// 					circleId: id,
	// 				},
	// 				method: "DELETE",
	// 				returnResponse: true,
	// 				useServerUrl: true,
	// 				handleError: false,
	// 			},
	// 		}),
	// 		loadingMsg: "Please wait while we try to remove this project.",
	// 		successMsg: "Successfully removed the project.",
	// 		successFunc: fetchCircle,
	// 	});
	// };

	// const UserProjects = async () => {
	// 	const {
	// 		data: { data: projects },
	// 	} = await UseFetch({
	// 		url: `project/?userId=${User.info.id}`,
	// 		options: {
	// 			method: "GET",
	// 			returnResponse: true,
	// 			useServerUrl: true,
	// 			handleError: false,
	// 		},
	// 	});

	// 	setUserProjects(() => projects);
	// };

	useEffect(() => {
		setIsLoading(() => true);
		fetchCircle();
		// UserProjects();
		setIsLoading(() => false);
	}, [id]);

	// console.log(circle);
	return (
		<main>
			<Nav className="" useBackground={false} />
			{isLoading && <Spinner />}
			{err && <div>{err}</div>}
			{!isLoading &&
				err === null &&
				circle !== null &&
				circle !== undefined && (
					<div className="py-8">
						<header className="flex flex-col gap-4 px-4 md:px-16">
							<div className="relative z-0 h-[300px]">
								<img
									className="w-full h-full object-cover aspect-auto"
									src={banner}
									alt="Hero Background"
								/>
								<div className="bg-black opacity-30 w-full inset-0 h-full absolute"></div>
								<div className="absolute inset-0 flex justify-center items-center text-white">
									<h1 className="text-2xl text-center md:text-5xl lg:text-6xl font-extrabold max-w-[100%] sm:max-w-[95%] lg:max-w-[80%]">
										"Alone we can do so little; together we
										can do so much."
									</h1>
								</div>
							</div>
							{User.isLoggedIn && (
								<button className="bg-blue-700 text-white font-light px-6 py-2 rounded-md w-fit self-end">
									Join Circle
								</button>
							)}
							<section className="flex flex-row justify-between items-center pt-4">
								<h1 className="font-bold text-6xl text-blue-700">
									Circle #{circle.id}
								</h1>

								{User.isLoggedIn && (
									<div className="flex flex-row justify-end gap-3">
										{state.isMember && !state.isOwner && (
											<button
												onClick={() => {
													setAlertState(() => {
														return {
															body: "Are you sure you want to leave this circle? You can't undo this action afterwards.",
															doneText:
																"Leave Circle",
															header: "Leave Circle",
															doneFunc: () =>
																makeReq({
																	url: `circle/${circle.id}/leave`,
																	method: "PATCH",
																	loadingMsg:
																		"Please wait while we try to leave the circle.",
																	successMsg:
																		"Successfully left circle.",
																	successFunc:
																		fetchCircle,
																}),
														};
													});
													onOpen();
												}}
												className="text-red-500 bg-red-500 text-base rounded-sm hover:bg-red-700 hover:text-white bg-transparent border border-red-800 duration-300 px-8 py-1"
											>
												LEAVE CIRCLE
											</button>
										)}
										{!state.isMember &&
											!state.isRequesting && (
												<button
													onClick={() =>
														makeReq({
															url: `circle/request/join/${circle.id}`,
															method: "POST",
															loadingMsg:
																"Please wait while we try to join the circle.",
															successMsg:
																"Successfully requested to join the circle.",
															successFunc:
																fetchCircle,
														})
													}
													className="text-green-500 bg-green-500 text-base rounded-sm hover:bg-green-700 hover:text-white bg-transparent border border-green-800 duration-300 px-8 py-1"
												>
													REQUEST TO JOIN
												</button>
											)}
										{state.isRequesting && (
											<button
												onClick={() =>
													makeReq({
														url: `circle/request/leave/${circle.id}`,
														method: "POST",
														loadingMsg:
															"Please wait while we try to leave the circle request.",
														successMsg:
															"Successfully left circle request.",
														successFunc:
															fetchCircle,
													})
												}
												className="text-red-500 bg-red-500 text-base rounded-sm hover:bg-red-700 hover:text-white bg-transparent border border-red-800 duration-300 px-8 py-1"
											>
												CANCEL JOIN REQUEST
											</button>
										)}
									</div>
								)}
							</section>
							<p className="lg:max-w-[95%]">
								{circle.description}
							</p>
						</header>
						<section className="mt-16 pr-0 px-4 md:px-16">
							<div className="flex flex-row gap-2 items-center">
								<a
									className="font-bold mb-2 text-4xl text-neutral-700"
									href="#members"
									id="members"
								>
									Members
								</a>
							</div>
							<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4 pr:0">
								<DisplayMembers
									members={[
										circle.lead,
										circle.colead,
										...circle.members,
									]}
								/>
							</section>
						</section>

						<section className="mt-16 pr-0 px-4 md:px-16">
							<a
								className="font-bold mb-2 text-4xl text-gray-800"
								href="#projects"
								id="projects"
							>
								Projects
							</a>
							<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
								<ListProjects
									showManageMenu={true}
									projects={circle.projects.filter(
										(project) =>
											!project.pinned ? true : false
									)}
									setAlertState={setAlertState}
									makeReq={makeReq}
									fetchCircle={fetchCircle}
									circle={circle}
									onOpen={onOpen}
								/>
							</section>
						</section>

						{/* Alert Dialog */}
						{alertState.header && (
							<AlertDialog
								isOpen={isOpen}
								leastDestructiveRef={cancelRef}
								onClose={onClose}
							>
								<AlertDialogOverlay>
									<AlertDialogContent>
										<AlertDialogHeader
											fontSize="lg"
											fontWeight="bold"
										>
											{alertState.header}
										</AlertDialogHeader>

										<AlertDialogBody>
											{alertState.body}
										</AlertDialogBody>

										<AlertDialogFooter>
											<Button
												ref={cancelRef}
												onClick={onClose}
											>
												Cancel
											</Button>
											<Button
												colorScheme="red"
												onClick={() => {
													alertState.doneFunc();
													onClose();
												}}
												ml={3}
											>
												{alertState.doneText}
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialogOverlay>
							</AlertDialog>
						)}
					</div>
				)}
		</main>
	);
};

export default Circle;
