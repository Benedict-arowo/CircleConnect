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
import { pinProject } from "../../types";

type Props = {
	displayStars?: boolean;
	projects: ProjectsType[];
	circle: CircleType;
	showManageMenu?: boolean;
	removeFromCircle: (projectId: string) => Promise<void>;
	pinProject: ({ id, status }: pinProject) => Promise<void>;
	deleteProject: (id: string) => Promise<void>;
	setAlertState: React.Dispatch<
		React.SetStateAction<{
			header: string;
			body: string;
			doneFunc: () => void;
			doneText: string;
		}>
	>;
	onOpen: () => void;
};

const ListProjects = ({
	displayStars = false,
	projects,
	circle,
	showManageMenu = false,
	removeFromCircle,
	pinProject,
	deleteProject,
	setAlertState,
	onOpen,
}: Props) => {
	const User = useSelector((state) => state.user);

	return projects.map(({ name, description, id, createdBy, pinned }) => {
		console.log(circle.lead.id === User.info.id);
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
											(circle.lead.id === User.info.id ||
												(circle.colead &&
													circle.colead.id ===
														User.info.id)) && (
												<li
													className="cursor-pointer"
													onClick={() =>
														pinProject({
															id,
															status: false,
														})
													}>
													Unpin
												</li>
											)}
										{!pinned &&
											(circle.lead.id === User.info.id ||
												(circle.colead &&
													circle.colead.id ===
														User.info.id)) && (
												<li
													className="cursor-pointer"
													onClick={() =>
														pinProject({
															id,
															status: true,
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
															removeFromCircle(
																id
															),
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
																deleteProject(
																	id
																),
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

				<div className="flex flex-row flex-wrap w-full gap-2 justify-center">
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						HTML
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						CSS
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						SCSS
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						JAVASCRIPT
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						REACTJS
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						TAILWIND
					</span>
				</div>

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
	});
};

export default ListProjects;
