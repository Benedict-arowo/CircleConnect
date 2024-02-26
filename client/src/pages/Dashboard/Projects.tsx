import { useEffect, useRef, useState } from "react";
import UseFetch from "../../Components/Fetch";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";

type projectData = {
	id: string;
	name: string;
	description: string;
	circle: {
		id: number;
		description: string;
		rating: number;
		createdAt: Date;
	};
	createdAt: Date;
	createdBy: {
		email: string;
		id: string;
		profile_picture?: string;
		first_name: string;
		last_name: string;
		projects: {
			id: string;
			circleId: number;
			name: string;
		}[];
		role: {
			id: string;
			name: string;
		};
		track: string;
		school: string;
		coleadOf?: {
			id: number;
			description: string;
			rating: number;
			createdAt: Date;
		};
		leadOf?: {
			id: number;
			description: string;
			rating: number;
			createdAt: Date;
		};
		memberOf?: {
			id: number;
			description: string;
			rating: number;
			createdAt: Date;
		};
		joined: Date;
		createdAt: Date;
	};
	rating: { rating: number }[];
	liveLink?: string;
	github?: string;
	tags: string[];
};
const Projects = () => {
	const [data, setData] = useState<projectData[]>([]);
	const [editProjectData, setEditProjectData] = useState({});
	const [search, setSearch] = useState("");
	const toast = useRef(null);

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

	useEffect(() => {
		(async () => await fetchProjects())();
	}, []);

	const manageProject = (id: string) => {
		const project = data.find((project) => project.id === id);
		if (!project) throw new Error("Project not found.");
		// Toast display here for the error.

		setEditProjectData(() => ({ ...project }));
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
							const projectTags = project.tags
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
		</div>
	);
};

export default Projects;
