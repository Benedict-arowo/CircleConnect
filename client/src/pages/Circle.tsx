import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import { Button, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import ProjectsComponent from "../Components/project_component";
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

type useToastPromise = {
	fetch: Promise<any>;
	successMsg: string;
	successFunc?: () => void;
	loadingMsg: string;
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
	const [alertState, setAlertState] = useState({
		header: "",
		body: "",
		doneFunc: () => {},
		doneText: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [memberContentLoading, setMemberContentLoading] = useState(false);
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
	const cancelRef = React.useRef();
	const User = useSelector((state) => state.user);
	const [showRequests, setShowRequests] = useState(false);
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

	const displayMembers = (members: CircleMemberType[]) => {
		return members.map((circleMember) => {
			if (circleMember) {
				const { profile_picture } = circleMember;
				return (
					<a
						key={circleMember.id}
						title={circleMember.first_name}
						className="hover:outline-red-600 outline-none rounded-full outline transition-all duration-300"
						href={`../user/${circleMember.id}`}>
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

	const acceptRequest = async (circleId: number, userId: string) => {
		UseToastPromise({
			fetch: UseFetch({
				url: `circle/${circleId}`,
				options: {
					method: "PATCH",
					useServerUrl: true,
					returnResponse: true,
					body: {
						request: {
							type: "ACCEPT",
							userId,
						},
					},
				},
			}),
			loadingMsg: "Accepting join request...",
			successMsg: "Successfully accepted user's join request.",
			successFunc: fetchCircle,
		});
	};

	const declineRequest = async (circleId: number, userId: string) => {
		UseToastPromise({
			fetch: UseFetch({
				url: `circle/${circleId}`,
				options: {
					method: "PATCH",
					useServerUrl: true,
					returnResponse: true,
					body: {
						request: {
							type: "DECLINE",
							userId,
						},
					},
				},
			}),
			loadingMsg: "Declining join request...",
			successMsg: "Successfully declined user's join request.",
			successFunc: fetchCircle,
		});
	};

	const removeUser = async (circleId: number, userId: string) => {
		UseToastPromise({
			fetch: UseFetch({
				url: `circle/${circleId}`,
				options: {
					method: "PATCH",
					useServerUrl: true,
					returnResponse: true,
					body: {
						removeUser: {
							userId,
						},
					},
				},
			}),
			loadingMsg: "Removing user...",
			successMsg: "Successfully removed user from circle.",
			successFunc: fetchCircle,
		});
	};

	const fetchCircle = async () => {
		const { data, response } = await UseFetch({
			url: `circle/${id}`,
			options: {
				method: "GET",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		// TODO: Better error handling
		if (!response.ok) {
			setErr(() => data.message);
		} else {
			// console.log(data.data);
			setCircle(() => data.data);
			setErr(() => null);
		}

		// If user is a visitor
		// If user is lead
		// If user is colead
		// If user is requesting to join
		// If user is a member
		if (data.data.lead && data.data.lead.id === User.info.id) {
			console.log(5);
			setState(() => {
				return {
					isMember: true,
					isOwner: true,
					isColead: false,
					isRequesting: false,
					isVisitor: false,
				};
			});
		} else if (data.data.colead && data.data.colead.id === User.info.id) {
			console.log(4);
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
			data.data.members.some(
				(members: CircleMemberType) => members.id === User.info.id
			)
		) {
			console.log(3);
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
			data.data.requests.some(
				(members: CircleMemberType) => members.id === User.info.id
			)
		) {
			console.log(2);
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
	};

	const joinCircle = async () => {
		if (!circle) return;

		const joinCircleFetch = UseFetch({
			url: `circle/request/join/${circle.id}`,
			options: {
				method: "POST",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		UseToastPromise({
			fetch: joinCircleFetch,
			loadingMsg: "Please wait while we try to join the circle.",
			successMsg: "Successfully requested to join the circle.",
			successFunc: fetchCircle,
		});
	};

	const canceljoinCircle = async () => {
		if (!circle) return;

		const leaveCircleRequestFetch = UseFetch({
			url: `circle/request/leave/${circle.id}`,
			options: {
				method: "POST",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		UseToastPromise({
			fetch: leaveCircleRequestFetch,
			loadingMsg: "Please wait while we try to leave the circle request.",
			successMsg: "Successfully left circle request.",
			successFunc: fetchCircle,
		});
	};

	const leaveCircle = async () => {
		if (!circle) return;

		const leaveCircleFetch = UseFetch({
			url: `circle/${circle.id}?leaveCircle=true`,
			options: {
				method: "PATCH",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		UseToastPromise({
			fetch: leaveCircleFetch,
			loadingMsg: "Please wait while we try to leave the circle.",
			successMsg: "Successfully left circle.",
			successFunc: fetchCircle,
		});
	};

	const submitDescription = () => {
		if (!circle) return;

		const submitDescriptionFetch = UseFetch({
			url: `circle/${circle.id}`,
			options: {
				method: "PATCH",
				body: {
					description,
				},
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		UseToastPromise({
			fetch: submitDescriptionFetch,
			loadingMsg: "Saving new circle description.",
			successMsg: "Successfully saved new circle description.",
			successFunc: () => {
				settingsDrawerOnClose();
				fetchCircle();
				setDescription(() => "");
			},
		});
	};

	const deleteCircle = async () => {
		if (!circle) return;

		const deleteCircleFetch = UseFetch({
			url: `circle/${circle.id}`,
			options: {
				method: "DELETE",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		UseToastPromise({
			fetch: deleteCircleFetch,
			loadingMsg: "Please wait while we try to delete the circle.",
			successMsg: "Successfully deleted the circle.",
			successFunc: () => {
				onClose();
				Navigate("/");
			},
		});
	};

	useEffect(() => {
		setIsLoading(() => true);
		fetchCircle();
		setIsLoading(() => false);
	}, [id]);

	// console.log(circle);
	return (
		<main>
			<Nav className="mb-8" useBackground={false} />
			{isLoading && <Spinner />}
			{err && <div>{err}</div>}
			{!isLoading &&
				err === null &&
				circle !== null &&
				circle !== undefined && (
					<div className="px-4 py-8 md:px-16">
						<header className="flex flex-col gap-4">
							<section className="flex flex-row justify-between items-center">
								<h1 className="font-semibold text-3xl text-gray-800">
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
															doneFunc:
																leaveCircle,
														};
													});
													onOpen();
												}}
												className="text-red-500 bg-red-500 text-base rounded-sm hover:bg-red-700 hover:text-white bg-transparent border border-red-800 duration-300 px-8 py-1">
												LEAVE CIRCLE
											</button>
										)}
										{!state.isMember &&
											!state.isRequesting && (
												<button
													onClick={joinCircle}
													className="text-green-500 bg-green-500 text-base rounded-sm hover:bg-green-700 hover:text-white bg-transparent border border-green-800 duration-300 px-8 py-1">
													REQUEST TO JOIN
												</button>
											)}
										{state.isRequesting && (
											<button
												onClick={canceljoinCircle}
												className="text-red-500 bg-red-500 text-base rounded-sm hover:bg-red-700 hover:text-white bg-transparent border border-red-800 duration-300 px-8 py-1">
												CANCEL JOIN REQUEST
											</button>
										)}
									</div>
								)}
							</section>
							<p className="min-h-[100px]">
								{circle.description}
							</p>
							{User.isLoggedIn && (
								<div
									className={`flex flex-row ${
										state.isOwner || state.isMember
											? "justify-between"
											: "justify-end"
									}`}>
									<div className="flex flex-row gap-3">
										{state.isMember && (
											<button className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1">
												Add Project
											</button>
										)}
										{state.isOwner && (
											<div className="flex flex-row gap-3">
												<button
													onClick={
														settingsDrawerOnOpen
													}
													className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1">
													Settings
												</button>
												<button
													onClick={drawerOnOpen}
													className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1">
													Manage Members
												</button>
											</div>
										)}
									</div>

									<div className="flex flex-row gap-4">
										{/* REPORT ICON */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 cursor-pointer text-gray-800 hover:text-gray-950 transition-all duration-300">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
											/>
										</svg>

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
															doneFunc:
																deleteCircle,
														};
													});
													onOpen();
												}}
												className="w-6 h-6 cursor-pointer text-gray-800 hover:text-red-600 transition-all duration-300">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
												/>
											</svg>
										)}
									</div>
								</div>
							)}
						</header>
						<section className="mt-16">
							<div className="flex flex-row gap-2 items-center">
								<a
									className="font-light mb-2 text-3xl text-gray-800"
									href="#members"
									id="members">
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
							{memberContentLoading && <Spinner />}
							{!memberContentLoading && (
								<AvatarGroup
									max={5}
									className="flex flex-row justify-center gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-[180px] py-4 px-12 ">
									{displayMembers([
										circle.lead,
										circle.colead,
										...circle.members,
									])}
								</AvatarGroup>
							)}
						</section>

						<section className="mt-16">
							<a
								className="font-light mb-2 text-3xl text-gray-800"
								href="#pinned_projects"
								id="pinned_projects">
								Pinned Projects
							</a>
							<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-2 pb-7 pr-8">
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
							</section>
						</section>

						<section className="mt-16">
							<a
								className="font-light mb-2 text-3xl text-gray-800"
								href="#projects"
								id="projects">
								Projects
							</a>
							<section className="flex flex-row gap-8 flex-wrap justify-center pt-2">
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
								<ProjectsComponent />
							</section>
						</section>
						{/* Members Drawer */}
						<Drawer
							onClose={drawerOnClose}
							size={"md"}
							isOpen={drawerIsOpen}>
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
											}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-8 h-8 cursor-pointer">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
												/>
											</svg>
											<div className="bg-red-500 text-white rounded-full text-xs text-center absolute -bottom-1 cursor-pointer -right-1 w-fit px-2 py-1">
												<p>1</p>
											</div>
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
														acceptRequest={
															acceptRequest
														}
														declineRequest={
															declineRequest
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
											<div>
												{circle.colead.first_name}
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
														removeUser={removeUser}
														setAlertState={
															setAlertState
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
							isOpen={settingsDrawerIsOpen}>
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
											onClick={submitDescription}
											className="bg-red-500 text-white px-4 py-1 w-fit mt-2">
											Save Description
										</button>
									</div>
								</DrawerBody>
							</DrawerContent>
						</Drawer>

						{/* Alert Dialog */}
						{alertState.header && (
							<AlertDialog
								isOpen={isOpen}
								leastDestructiveRef={cancelRef}
								onClose={onClose}>
								<AlertDialogOverlay>
									<AlertDialogContent>
										<AlertDialogHeader
											fontSize="lg"
											fontWeight="bold">
											{alertState.header}
										</AlertDialogHeader>

										<AlertDialogBody>
											{alertState.body}
										</AlertDialogBody>

										<AlertDialogFooter>
											<Button
												ref={cancelRef}
												onClick={onClose}>
												Cancel
											</Button>
											<Button
												colorScheme="red"
												onClick={() => {
													alertState.doneFunc();
													onClose();
												}}
												ml={3}>
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
