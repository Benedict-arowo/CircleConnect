import { useEffect, useRef, useState } from "react";
import UseFetch from "../../Components/Fetch";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { CircleData } from "./Circles";

interface projectData {
	id: string;
	name: string;
	description: string;
	circle: {
		id: number;
		description?: string;
		rating?: number;
		createdAt?: Date;
	};
	createdAt: Date;
	createdBy: {
		email: string;
		id: string;
		profile_picture?: string;
		first_name: string;
		last_name: string;
		role: {
			id: string;
			name: string;
			canCreateCircle: boolean;
			canModifyOwnCircle: boolean;
			canModifyOtherCircle: boolean;
			canDeleteOwnCircle: boolean;
			canDeleteOtherCircles: boolean;
			canLeaveCircle: boolean;
			canJoinCircle: boolean;
			canCreateProject: boolean;
			canModifyOwnProject: boolean;
			canModifyOtherProject: boolean;
			canDeleteOwnProject: boolean;
			canDeleteOtherProject: boolean;
			canAddProjectToCircle: boolean;
			canRemoveProjectFromCircle: boolean;
			canManageRoles: boolean;
			canManageUsers: boolean;
			isAdmin: boolean;
		};
	};
	rating: { rating: number }[];
	liveLink?: string;
	github?: string;
	tags: string[];
}

interface editProjectData extends projectData {
	circle: {
		id: number;
		description?: string;
		rating?: number;
		createdAt?: Date;
		code?: number;
	};
}

const Projects = () => {
	const [data, setData] = useState<projectData[]>([]);
	const [editProjectData, setEditProjectData] = useState<editProjectData>({
		id: "",
		name: "",
		description: "",
		circle: {
			id: 0,
			description: "",
			rating: 0,
			createdAt: new Date(),
			code: undefined,
		},
		createdAt: new Date(),
		createdBy: {
			email: "",
			id: "",
			profile_picture: "",
			first_name: "",
			last_name: "",
			role: {
				id: "",
				name: "",
				canCreateCircle: false,
				canModifyOwnCircle: false,
				canModifyOtherCircle: false,
				canDeleteOwnCircle: false,
				canDeleteOtherCircles: false,
				canLeaveCircle: false,
				canJoinCircle: false,
				canCreateProject: false,
				canModifyOwnProject: false,
				canModifyOtherProject: false,
				canDeleteOwnProject: false,
				canDeleteOtherProject: false,
				canAddProjectToCircle: false,
				canRemoveProjectFromCircle: false,
				canManageRoles: false,
				canManageUsers: false,
				isAdmin: false,
			},
		},
		rating: [],
		liveLink: "",
		github: "",
		tags: [],
	});
	const [search, setSearch] = useState("");
	const [circles, setCircles] = useState<CircleData[]>([]);
	const [editDialogIsVisible, setEditDialogIsVisible] = useState(false);

	const toast = useRef<Toast | null>(null);

	const fetchProjects = async () => {
		const { data, response } = await UseFetch({
			url: "project",
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok)
			throw new Error(
				data ? data.message : "Error trying to communicate with server."
			);

		setData(data.data);
	};

	const fetchCircles = async () => {
		const { data, response } = await UseFetch({
			url: "circle",
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok)
			throw new Error(
				data ? data.message : "Error trying to communicate with server."
			);

		setCircles(data.data);
	};

	useEffect(() => {
		(async () => {
			await fetchProjects();
			await fetchCircles();
		})();
	}, []);

	const manageProject = (id: string) => {
		const project = data.find((project) => project.id === id);
		if (!project) throw new Error("Project not found.");
		// Toast display here for the error.

		setEditProjectData(() => ({
			...project,
			circle: {
				id: project.circle ? project.circle.id : 0,
				code: project.circle ? project.circle.id : undefined,
			},
		}));
		setEditDialogIsVisible(true);
	};

	const SaveProjectChanges = async (projectData: editProjectData) => {
		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Saving changes...",
			life: 3000,
		});

		const { data, response } = await UseFetch({
			url: `project/${projectData.id}`,
			options: {
				method: "PATCH",
				body: {
					name: editProjectData.name,
					description: editProjectData.description,
					circle: editProjectData.circle.id,
					liveLink: editProjectData.liveLink,
					github: editProjectData.github,
					tags: editProjectData.tags?.join("|"),
				},
				returnResponse: true,
				useServerUrl: true,
			},
		});

		if (!response.ok)
			// Displays the error message gotten back from the server, and if there isn't one, it uses a generic message.
			return toast.current?.show({
				severity: "error",
				summary: "Oops..",
				detail: `${
					data && data.message
						? data.message
						: "Error trying to communicate with the server."
				}`,
				life: 3000,
			});

		toast.current?.show({
			severity: "success",
			summary: "Role Saved!",
			detail: "Successfully saved changes...",
			life: 3000,
		});
		await fetchProjects();
	};
	return (
		<div className="flex-1 w-full px-6 bg-gray-100">
			<Toast ref={toast} />
			<ConfirmDialog />

			<div className="w-full flex justify-center gap-2 mt-5">
				<span className="p-input-icon-left max-w-[400px] w-full">
					<i className="pi pi-search" />
					<InputText
						placeholder="Search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full h-full"
					/>
				</span>
				{/* <Dropdown
					value={search.mode}
					style={{ width: "150px" }}
					onChange={(e) =>
						setSearch((prev) => {
							return {
								...prev,
								mode: e.target.value,
							};
						})
					}
					options={ModeList}
					optionLabel="name"
					placeholder="Select a Search Mode"
					className="w-full md:w-14rem"
					id="user-track"
				/> */}
			</div>

			<div className="flex flex-row text-center mt-10 gap-8 w-full justify-between">
				<section className="flex flex-row items-center gap-8">
					<h1 className="text-4xl font-bold">
						Projects ({data.length})
					</h1>
					<i
						// onClick={() => setCreateUserDialog(true)}
						title="Create a new role."
						className="pi pi-plus cursor-pointer shadow-lg hover:scale-105 duration-200 bg-yellow-400 text-white px-2 py-2 rounded-full"
					></i>
				</section>
				{/* <section>
					<CascadeSelect
						value={sortedMethod}
						onChange={(e) => setSortedMethod(e.value)}
						options={SortOptions}
						optionLabel="cname"
						optionGroupLabel="name"
						optionGroupChildren={["options"]}
						className="w-full md:w-14rem"
						breakpoint="767px"
						placeholder="Select a Sort method"
						style={{ width: "fit-content" }}
					/>
					{sortedMethod && (
						<p
							className="text-xs text-neutral-400 text-right mt-1 cursor-pointer"
							onClick={() => setSortedMethod(() => undefined)}
						>
							clear sort filtering
						</p>
					)}
				</section> */}
			</div>

			<div className="mt-4 border-t-2 w-full">
				<DataTable
					value={data}
					tableStyle={{ minWidth: "50rem" }}
					showGridlines
					stripedRows
				>
					<Column
						body={(project: projectData) => {
							return (
								<>
									{project.createdBy && (
										<Avatar
											image={
												project.createdBy
													.profile_picture
											}
											label={
												project.createdBy.first_name[0]
											}
											style={{
												backgroundColor: "#9c27b0",
												color: "#ffffff",
												objectFit: "cover",
											}}
											shape="circle"
										/>
									)}
								</>
							);
						}}
					/>
					<Column field="name" header="Name" />
					<Column
						body={(project: projectData) => {
							let totalRating = 0;
							project.rating.forEach(
								(rating) => (totalRating += rating.rating)
							);

							const averageRating =
								totalRating / project.rating.length;

							return (
								<Rating
									value={averageRating}
									readOnly
									cancel={false}
								/>
							);
						}}
						header="Rating"
					/>
					<Column
						body={(project: projectData) => {
							const projectTags =
								project.tags &&
								project.tags
									.slice(0, 2)
									.map((tag) => (
										<Chip className="text-xs" label={tag} />
									));
							return (
								<div className="flex flex-row gap-1">
									{projectTags}
								</div>
							);
						}}
						header="Tags"
					/>

					<Column
						body={(project: projectData) =>
							project.circle && (
								<Tag
									severity="success"
									value={project.circle.id}
								/>
							)
						}
						header="Circle"
					/>

					<Column
						body={(project: projectData) => (
							<button
								className=" ml-5"
								onClick={() => manageProject(project.id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
									/>
								</svg>
							</button>
						)}
					/>
				</DataTable>
			</div>

			<Dialog
				header={`Editing Project - ${editProjectData.name}`}
				visible={editDialogIsVisible}
				style={{ width: "50vw" }}
				dismissableMask
				onHide={() => setEditDialogIsVisible(false)}
				draggable={false}
			>
				<div>
					<section>
						<h3 className="font-bold text-sm">Info</h3>
						<div className="px-2 flex flex-col gap-2 mt-2">
							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="project_id"
									className="font-bold text-sm text-center"
								>
									ID:
								</label>
								<InputText
									id="project_id"
									placeholder="Project ID"
									value={editProjectData.id}
									disabled
									className="w-full p-2"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="project_name"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Name:
								</label>
								<InputText
									id="project_name"
									placeholder="Project Name"
									value={editProjectData.name}
									className="w-full border p-2"
									onChange={(e) =>
										setEditProjectData((prev) => {
											return {
												...prev,
												name: e.target.value,
											};
										})
									}
								/>
							</span>

							<span className="flex flex-col gap-1 justify-start">
								<label
									htmlFor="project_description"
									className="font-bold text-sm border-1 border-zinc-300"
								>
									Description:
								</label>
								<InputTextarea
									value={editProjectData.description}
									className="w-full border p-2"
									onChange={(e) =>
										setEditProjectData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									rows={5}
									cols={30}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="project_live_link"
									className="font-bold text-sm border-1 border-zinc-300 min-w-fit"
								>
									Live link:
								</label>
								<InputText
									value={editProjectData.liveLink}
									className="p-2 border w-full"
									onChange={(e) =>
										setEditProjectData((prev) => ({
											...prev,
											liveLink: e.target.value,
										}))
									}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="project_github"
									className="font-bold text-sm border-1 border-zinc-300"
								>
									Github:
								</label>
								<InputText
									value={editProjectData.github}
									className="p-2 border w-full"
									onChange={(e) =>
										setEditProjectData((prev) => ({
											...prev,
											github: e.target.value,
										}))
									}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="project_tags"
									className="font-bold text-sm border-1 border-zinc-300"
								>
									Tags:
								</label>
								<Chips
									value={editProjectData.tags}
									className="p-2 border w-full"
									onChange={(e) =>
										setEditProjectData((prev) => ({
											...prev,
											tags: e.value || [],
										}))
									}
									separator=","
								/>
							</span>
						</div>

						<span className="flex flex-row gap-2 items-center">
							<label
								htmlFor="project_circle"
								className="font-bold text-sm border-1 border-zinc-300"
							>
								Circle:
							</label>
							<Dropdown
								value={editProjectData.circle}
								onChange={(e) =>
									setEditProjectData((prev) => ({
										...prev,
										circle: {
											...prev.circle,
											id: e.value.id,
											code: e.value.code,
										},
									}))
								}
								options={circles.map((circle) => ({
									code: circle.id,
									id: circle.id,
								}))}
								optionLabel="id"
								placeholder="Select a Circle"
								className="w-full md:w-14rem mt-2 border"
							/>
						</span>
					</section>
					{/* <section className="mt-3">
						<h3 className="font-bold text-sm">Permissions</h3>
						{
							<DisplayPermissions
								permissions={editData.permissions}
								updateFunc={setEditData}
							/>
						}
					</section> */}

					<footer className="flex flex-row gap-6 justify-center mt-4">
						<button
							onClick={() =>
								confirmDialog({
									message:
										"Are you sure you want to proceed?",
									header: "Confirmation",
									icon: "pi pi-exclamation-triangle",
									defaultFocus: "accept",
									accept: () =>
										SaveProjectChanges(editProjectData),
								})
							}
							className="w-fit h-fit bg-green-600 px-4 py-1 text-white rounded-md font-normal"
						>
							Save Changes
						</button>
						<button
							onClick={() => {
								confirmDialog({
									message: "Do you want to delete this role?",
									header: "Delete Confirmation",
									icon: "pi pi-info-circle",
									defaultFocus: "reject",
									acceptClassName: "p-button-danger",
									// accept: () => DeleteRole(editData.id),
								});
							}}
							className="w-fit h-fit bg-red-500 px-4 py-1 text-white rounded-md font-normal"
						>
							Delete Role
						</button>
					</footer>
				</div>
			</Dialog>
		</div>
	);
};

export default Projects;
