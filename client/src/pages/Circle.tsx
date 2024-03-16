import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import { Button, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
// import ProjectsComponent from "../Components/project_component";
import { CircleMemberType, CircleType } from "../Components/types";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	Textarea,
} from "@chakra-ui/react";

import { Avatar, AvatarGroup } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ListMembers from "../Components/Circle Page/ListMembers";
import ListRequests from "../Components/Circle Page/ListRequests";
import ListProjects from "../Components/Circle Page/ListProjects";

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
	const Navigate = useNavigate();
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
	const {
		isOpen: drawerIsOpen,
		onOpen: drawerOnOpen,
		onClose: drawerOnClose,
	} = useDisclosure();
	const {
		isOpen: settingsDrawerIsOpen,
		onOpen: settingsDrawerOnOpen,
		onClose: settingsDrawerOnClose,
	} = useDisclosure();

	const {
		isOpen: projectDrawerIsOpen,
		onOpen: projectDrawerOnOpen,
		onClose: projectDrawerOnClose,
	} = useDisclosure();
	const cancelRef = React.useRef();
	const User = useSelector((state) => state.user);
	const [showRequests, setShowRequests] = useState(false);
	const [userProjects, setUserProjects] = useState([]);
	const [description, setDescription] = useState("");
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

	const displayMembers = (members: CircleMemberType[]) => {
		return members.map((circleMember) => {
			if (circleMember) {
				const { profile_picture } = circleMember;
				return (
					<a
						key={circleMember.id}
						title={circleMember.first_name}
						className="hover:outline-red-600 outline-none rounded-full outline transition-all duration-300"
						href={`../user/${circleMember.id}`}
					>
						<Avatar
							size={"2xl"}
							name={`${circleMember.first_name}`}
							src={profile_picture}
							className="w-[128px] h-[128px] rounded-full cursor-pointer  object-cover"
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

	const UserProjects = async () => {
		const {
			data: { data: projects },
		} = await UseFetch({
			url: `project/?userId=${User.info.id}`,
			options: {
				method: "GET",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		setUserProjects(() => projects);
	};

	useEffect(() => {
		setIsLoading(() => true);
		fetchCircle();
		UserProjects();
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
					<div className="px-4 py-8 md:px-16">
						<header className="flex flex-col gap-4">
							<section className="flex flex-row justify-between items-center">
								<h1 className="font-bold text-3xl text-blue-700">
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
							<p className="">{circle.description}</p>
							<div className={`flex flex-row justify-between`}>
								<div className="flex flex-row gap-3">
									{state.isOwner && (
										<div className="flex flex-row gap-3">
											<button
												onClick={settingsDrawerOnOpen}
												className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1"
											>
												Settings
											</button>
										</div>
									)}
									<button
										onClick={drawerOnOpen}
										className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1"
									>
										Members
									</button>
									{state.isMember && (
										<button
											onClick={projectDrawerOnOpen}
											className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1"
										>
											Add Project
										</button>
									)}
								</div>

								<div className="flex flex-row gap-4">
									{/* REPORT ICON */}
									{!state.isOwner && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 cursor-pointer text-gray-800 hover:text-gray-950 transition-all duration-300"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
											/>
										</svg>
									)}
									{/* DELETE ICON */}
									{state.isOwner && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											onClick={() => {
												setAlertState(() => {
													return {
														body: "Are you sure you want to delete this circle? You can't undo this action afterwards.",
														doneText:
															"Delete Circle",
														header: "Delete Circle",
														doneFunc: () =>
															makeReq({
																url: `circle/${circle.id}`,
																method: "DELETE",
																loadingMsg:
																	"Please wait while we try to delete the circle.",
																successMsg:
																	"Successfully deleted the circle.",
																successFunc:
																	() => {
																		onClose();
																		Navigate(
																			"/"
																		);
																	},
															}),
													};
												});
												onOpen();
											}}
											className="w-6 h-6 cursor-pointer text-gray-800 hover:text-red-600 transition-all duration-300"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
											/>
										</svg>
									)}
								</div>
							</div>
						</header>
						<section className="mt-16">
							<div className="flex flex-row gap-2 items-center">
								<a
									className="font-semibold mb-2 text-3xl text-neutral-800"
									href="#members"
									id="members"
								>
									Members
								</a>

								<span>
									(
									{`${
										circle.members.length +
										(circle.lead ? 1 : 0) +
										(circle.colead ? 1 : 0)
									}`}
									)
								</span>
							</div>
							<AvatarGroup
								max={5}
								className="flex flex-row justify-center gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-[180px] py-4 px-12 "
							>
								{displayMembers([
									circle.lead,
									circle.colead,
									...circle.members,
								])}
							</AvatarGroup>
						</section>

						<section className="mt-16">
							<a
								className="font-light mb-2 text-3xl text-gray-800"
								href="#pinned_projects"
								id="pinned_projects"
							>
								Pinned Projects
							</a>
							<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-2 pb-7 pr-8">
								<ListProjects
									showManageMenu={true}
									projects={circle.projects.filter(
										(project) =>
											project.pinned ? true : false
									)}
									circle={circle}
									makeReq={makeReq}
									fetchCircle={fetchCircle}
									setAlertState={setAlertState}
									onOpen={onOpen}
								/>
							</section>
						</section>

						<section className="mt-16">
							<a
								className="font-light mb-2 text-3xl text-gray-800"
								href="#projects"
								id="projects"
							>
								Projects
							</a>
							<section className="flex flex-row gap-8 flex-wrap justify-center pt-2">
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
						{/* Members Drawer */}
						<Drawer
							onClose={drawerOnClose}
							size={"md"}
							isOpen={drawerIsOpen}
						>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerHeader borderBottomWidth="1px">
									<div className="flex flex-row gap-4 justify-between">
										<h4>Manage Members</h4>
										<div
											className="relative"
											onClick={() =>
												setShowRequests(
													(prevState) => !prevState
												)
											}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-8 h-8 cursor-pointer"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
												/>
											</svg>
											{circle.requests.length > 0 && (
												<div className="bg-red-500 text-white rounded-full text-xs text-center absolute -bottom-1 cursor-pointer -right-1 w-fit px-2 py-1">
													<p>
														{circle.requests.length}
													</p>
												</div>
											)}
										</div>
									</div>
								</DrawerHeader>
								<DrawerBody>
									{/* Requests List */}
									{showRequests && (
										<div className="mb-3">
											<h4 className="font-medium text-xl text-gray-700">
												Circle Requests
											</h4>
											{circle.requests.length > 0 && (
												<div className="flex flex-col gap-2 mt-1">
													<ListRequests
														// acceptRequest={
														// 	acceptRequest
														// }
														// declineRequest={
														// 	declineRequest
														// }
														makeReq={makeReq}
														fetchCircle={
															fetchCircle
														}
														circle={circle}
													/>
												</div>
											)}
											{circle.requests.length === 0 && (
												<div>
													There are currently no join
													requests.
												</div>
											)}
										</div>
									)}

									{circle.colead && (
										<div>
											<h4 className="font-medium text-xl text-gray-700">
												Circle Colead
											</h4>
											<div className="flex flex-row justify-between">
												{circle.colead.first_name}
												{circle.lead &&
													circle.lead.id ===
														User.info.id && (
														<div className="flex flex-row items-center gap-2">
															<p
																className="bg-red-500 text-white px-2 py-1"
																onClick={() => {
																	setAlertState(
																		() => {
																			return {
																				body: "Are you sure you want to promote this user? You may not be able to undo this action afterwards.",
																				doneText:
																					"Promote user",
																				doneFunc:
																					() =>
																						makeReq(
																							{
																								url: `circle/${circle.id}`,
																								method: "PATCH",
																								body: {
																									manageUser:
																										{
																											action: "PROMOTE",
																											userId: circle
																												.colead
																												.id,
																										},
																								},
																								loadingMsg:
																									"Promoting user...",
																								successMsg:
																									"Successfully promoted user.",
																								successFunc:
																									fetchCircle,
																							}
																						),
																				header: "Promote user",
																			};
																		}
																	);
																	onOpen();
																}}
															>
																Promote
															</p>
															<p
																className="bg-red-500 text-white px-2 py-1"
																onClick={() => {
																	setAlertState(
																		() => {
																			return {
																				body: "Are you sure you want to demote this user?",
																				doneText:
																					"Demote user",
																				doneFunc:
																					() =>
																						// demoteUser(
																						// 	circle.id,
																						// 	circle
																						// 		.colead
																						// 		.id
																						// ),
																						makeReq(
																							{
																								url: `circle/${circle.id}`,
																								method: "PATCH",
																								body: {
																									manageUser:
																										{
																											action: "DEMOTE",
																											userId: circle
																												.colead
																												.id,
																										},
																								},
																								loadingMsg:
																									"Demoting user...",
																								successMsg:
																									"Successfully demoted user.",
																								successFunc:
																									fetchCircle,
																							}
																						),
																				header: "Demote user",
																			};
																		}
																	);
																	onOpen();
																}}
															>
																Demote
															</p>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={
																	1.5
																}
																stroke="currentColor"
																onClick={() => {
																	setAlertState(
																		() => {
																			return {
																				body: "Are you sure you want to remove this user? You can't undo this action afterwards.",
																				doneText:
																					"Remove user",
																				doneFunc:
																					() =>
																						// removeUser(
																						// 	circle.id,
																						// 	circle
																						// 		.colead
																						// 		.id
																						// ),

																						makeReq(
																							{
																								url: `circle/${id}`,
																								method: "PATCH",
																								body: {
																									removeUser:
																										{
																											userId: circle
																												.colead
																												.id,
																										},
																								},
																								loadingMsg:
																									"Removing user...",
																								successMsg:
																									"Successfully removed user from circle.",
																								successFunc:
																									fetchCircle,
																							}
																						),
																				header: "Remove user",
																			};
																		}
																	);
																	onOpen();
																}}
																className="w-4 h-4 hover:text-red-500 duration-300 transition-all"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M6 18L18 6M6 6l12 12"
																/>
															</svg>
														</div>
													)}
											</div>
										</div>
									)}

									{circle.members &&
										circle.members.length > 0 && (
											<div>
												<h4 className="font-medium text-xl text-gray-700">
													Circle Members
												</h4>
												<div className="flex flex-col gap-2 mt-2">
													<ListMembers
														circle={circle}
														onOpen={onOpen}
														User={User}
														// removeUser={removeUser}
														// promoteUser={
														// 	promoteUser
														// }
														// demoteUser={demoteUser}
														setAlertState={
															setAlertState
														}
														makeReq={makeReq}
														fetchCircle={
															fetchCircle
														}
													/>
												</div>
											</div>
										)}
									{circle.members.length === 0 && (
										<div>
											{" "}
											You currently have no circle
											members.
										</div>
									)}
								</DrawerBody>
							</DrawerContent>
						</Drawer>

						<Drawer
							onClose={settingsDrawerOnClose}
							size={"md"}
							isOpen={settingsDrawerIsOpen}
						>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerHeader borderBottomWidth="1px">
									<h4>Circle Settings</h4>
								</DrawerHeader>
								<DrawerBody>
									<div>
										<h6 className="font-medium text-lg mb-2">
											Description
										</h6>
										<Textarea
											resize="vertical"
											size="md"
											placeholder={circle.description}
											height={"200px"}
											value={description}
											onChange={(e) =>
												setDescription(
													() => e.target.value
												)
											}
										/>
										<button
											onClick={() => {
												makeReq({
													url: `circle/${circle.id}`,
													method: "PATCH",
													body: {
														description,
													},
													loadingMsg:
														"Saving new circle description.",
													successMsg:
														"Successfully saved new circle description.",
													successFunc: () => {
														settingsDrawerOnClose();
														fetchCircle();
														setDescription(
															() => ""
														);
													},
												});
											}}
											className="bg-red-500 text-white px-4 py-1 w-fit mt-2"
										>
											Save Description
										</button>
									</div>
								</DrawerBody>
							</DrawerContent>
						</Drawer>

						<Drawer
							onClose={projectDrawerOnClose}
							size={"md"}
							isOpen={projectDrawerIsOpen}
						>
							<DrawerOverlay />
							<DrawerContent>
								<DrawerHeader borderBottomWidth="1px">
									<h4>Add Project</h4>
								</DrawerHeader>
								<DrawerBody>
									<div>
										{userProjects.length === 0 && (
											<div>
												<p>
													You currently do not have
													any project you can add to
													this circle.
												</p>
											</div>
										)}
										{userProjects.length > 0 &&
											userProjects.map(
												({ name, id: projectId }) => {
													const inCircle =
														circle.projects.find(
															(project) =>
																project.id ===
																projectId
														);
													return (
														<div
															className="flex flex-row justify-between gap-4"
															key={id}
														>
															<p>{name}</p>
															{!inCircle && (
																<button
																	onClick={() =>
																		// addToCircle(
																		// 	projectId
																		// )
																		makeReq(
																			{
																				url: `project/${projectId}/addToCircle`,

																				body: {
																					circleId:
																						id,
																				},
																				method: "PATCH",
																				loadingMsg:
																					"Adding project to circle projects.",
																				successMsg:
																					"Successfully added the project.",
																				successFunc:
																					fetchCircle,
																			}
																		)
																	}
																>
																	Add
																</button>
															)}
															{inCircle && (
																<button
																	onClick={() =>
																		// removeFromCircle(
																		// 	id
																		// )
																		makeReq(
																			{
																				url: `project/${projectId}/removeFromCircle`,
																				body: {
																					circleId:
																						id,
																				},
																				method: "DELETE",
																				loadingMsg:
																					"Please wait while we try to remove this project.",
																				successMsg:
																					"Successfully removed the project.",
																				successFunc:
																					fetchCircle,
																			}
																		)
																	}
																>
																	Remove
																</button>
															)}
														</div>
													);
												}
											)}
									</div>
								</DrawerBody>
							</DrawerContent>
						</Drawer>

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
