import StarRatings from "react-star-ratings";
import { CircleType, ProjectsType } from "../types";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverArrow,
	PopoverCloseButton,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { makeReq } from "../../pages/Circle";

type Props = {
	displayStars?: boolean;
	projects: ProjectsType[];
	circle: CircleType;
	showManageMenu?: boolean;
	setAlertState: React.Dispatch<
		React.SetStateAction<{
			header: string;
			body: string;
			doneFunc: () => void;
			doneText: string;
		}>
	>;
	fetchCircle: () => Promise<void>;
	makeReq: ({
		url,
		method,
		body,
		loadingMsg,
		successMsg,
		successFunc,
	}: makeReq) => Promise<void>;
	onOpen: () => void;
};

const ListProjects = ({
	displayStars = false,
	projects,
	circle,
	showManageMenu = false,
	setAlertState,
	onOpen,
	fetchCircle,
	makeReq,
}: Props) => {
	const User = useSelector((state) => state.user);

	return projects.map(
		({ name, techUsed, description, id, createdBy, pinned }) => {
			return (
				<article
					key={id}
					className="w-[400px] relative h-fit border flex-shrink-0 border-gray-300 pt-4 pb-2 flex flex-col gap-4 px-4 snap-normal snap-center">
					<h3 className="text-2xl text-center font-semibold cursor-pointer">
						<a href="">{name}</a>
					</h3>

					{showManageMenu &&
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
										className="w-6 h-6 absolute top-4 right-2 cursor-pointer">
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
											{createdBy.id === User.info.id && (
												<li className="cursor-pointer">
													Edit
												</li>
											)}
											{pinned &&
												(circle.lead.id ===
													User.info.id ||
													(circle.colead &&
														circle.colead.id ===
															User.info.id)) && (
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
														}>
														Unpin
													</li>
												)}
											{!pinned &&
												(circle.lead.id ===
													User.info.id ||
													(circle.colead &&
														circle.colead.id ===
															User.info.id)) && (
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
														}>
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
												className="cursor-pointer">
												Remove
											</li>
											{createdBy.id === User.info.id && (
												<li
													onClick={() => {
														setAlertState(() => {
															return {
																body: "Are you sure you want to delete this project? You can't undo this action afterwards.",
																doneText:
																	"Delete Project",
																header: "Delete Project",
																doneFunc: () =>
																	// deleteProject(
																	// 	id
																	// ),
																	makeReq({
																		url: `project/${id}`,
																		method: "DELETE",
																		loadingMsg:
																			"Deleting project...",
																		successMsg:
																			"Successfully deleted the project.",
																		successFunc:
																			fetchCircle,
																	}),
															};
														});
														onOpen();
													}}
													className="cursor-pointer">
													Delete
												</li>
											)}
										</ul>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						)}

					<p className="text-center font-light cursor-default min-h-[160px]">
						{description}
					</p>

					{techUsed.length > 0 && (
						<div className="flex flex-row flex-wrap w-full gap-2 justify-center">
							{techUsed.slice(0, 3).map((tech: string) => {
								return (
									<span className="bg-red-500 uppercase text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
										{tech}
									</span>
								);
							})}
						</div>
					)}

					{displayStars && (
						<div className="mx-auto">
							<StarRatings
								rating={3.75}
								starRatedColor="red"
								numberOfStars={5}
								name="rating"
								starDimension="16px"
								starSpacing="15px"
							/>
						</div>
					)}

					<footer className="flex flex-row justify-between">
						<span className="font-light text-sm text-gray-500 cursor-default">
							Created 10 days ago.
						</span>
						<a href="" className="text-red-500 hover:underline">
							@{createdBy.first_name}
						</a>
					</footer>
				</article>
			);
		}
	);
};

export default ListProjects;
