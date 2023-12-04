import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import { Button, Spinner, useDisclosure } from "@chakra-ui/react";
import default_profile_picture from "../assets/Image-32.png";
import ProjectsComponent from "../Components/project_component";
import { CircleMemberType, CircleType } from "../Components/types";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Circle = () => {
	const { id } = useParams();
	const Navigate = useNavigate();
	const [circle, setCircle] = useState<null | CircleType>(null);
	const [state, setState] = useState({
		isMember: false,
		isOwner: false,
		isVisitor: true,
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
	const cancelRef = React.useRef();
	const User = useSelector((state) => state.user);

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
			console.log(data.data);
			setCircle(() => data.data);
			setErr(() => null);
		}

		let userInfo = data.data.members.find((member: CircleMemberType) => {
			if (User.isLoggedIn) {
				return member.id === User.info.id;
			} else return null;
		});

		// If the current user is not part of the user member list, we try to check if the user is the circle lead or the co-lead using tenary.
		if (!userInfo)
			userInfo =
				data.data.lead.id === User.info.id
					? data.data.lead
					: data.data.colead.id === User.info.id
					? data.data.colead
					: undefined;

		// If it couldn't find the user after checking the lead, and colead then it means the user doesn't exist on the circle.
		if (!userInfo)
			setState(() => {
				return {
					isMember: false,
					isOwner: false,
					isVisitor: true,
				};
			});
		else if (userInfo.leadOf && userInfo.leadOf.id === data.data.id)
			setState(() => {
				return {
					isMember: true,
					isOwner: true,
					isVisitor: false,
				};
			});
		else if (
			(userInfo.memberOf && userInfo.memberOf.id === data.data.id) ||
			(userInfo.coleadOf && userInfo.coleadOf === data.data.id)
		)
			setState(() => {
				return {
					isMember: true,
					isOwner: false,
					isVisitor: false,
				};
			});
	};

	const joinCircle = async () => {
		setMemberContentLoading(() => true);

		// TODO: Properly handle this error.
		if (!circle) throw new Error("Circle not found.");

		const { data, response } = await UseFetch({
			url: `circle/${circle.id}?addUser=true`,
			options: {
				method: "PATCH",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		// TODO: Better error handling
		if (!response.ok) {
			setErr(() => data.message);
		} else {
			setCircle(() => data.data);
			setErr(() => null);
		}
		fetchCircle();
		setMemberContentLoading(() => false);
	};

	const leaveCircle = async () => {
		setMemberContentLoading(() => true);

		// TODO: Properly handle this error.
		if (!circle) throw new Error("Circle not found.");

		const { data, response } = await UseFetch({
			url: `circle/${circle.id}?removeUser=true`,
			options: {
				method: "PATCH",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		fetchCircle();
		setMemberContentLoading(() => false);
	};

	const deleteCircle = async () => {
		setIsLoading(() => true);

		// TODO: Properly handle this error.
		if (!circle) throw new Error("Circle not found.");

		const { data, response } = await UseFetch({
			url: `circle/${circle.id}`,
			options: {
				method: "DELETE",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		fetchCircle();
		setMemberContentLoading(() => false);
		onClose();
		Navigate("/");
	};

	useEffect(() => {
		setIsLoading(() => true);
		fetchCircle();
		setIsLoading(() => false);
	}, [id]);

	console.log(circle);
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
										{!state.isMember && (
											<button
												onClick={joinCircle}
												className="text-green-500 bg-green-500 text-base rounded-sm hover:bg-green-700 hover:text-white bg-transparent border border-green-800 duration-300 px-8 py-1">
												JOIN CIRCLE
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
												<button className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1">
													Settings
												</button>
												<button className="text-gray-500 bg-green-500 text-base rounded-sm hover:bg-gray-500 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1">
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
					</div>
				)}

			{/* Delete Circle Alert Dialog */}
			{alertState.header && (
				<AlertDialog
					isOpen={isOpen}
					leastDestructiveRef={cancelRef}
					onClose={onClose}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader fontSize="lg" fontWeight="bold">
								{alertState.header}
							</AlertDialogHeader>

							<AlertDialogBody>{alertState.body}</AlertDialogBody>

							<AlertDialogFooter>
								<Button ref={cancelRef} onClick={onClose}>
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
		</main>
	);
};

export default Circle;
