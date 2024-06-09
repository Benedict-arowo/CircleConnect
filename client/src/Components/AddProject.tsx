import { AutoComplete } from "primereact/autocomplete";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import UseFetch from "./Fetch";
import { UserType } from "../types";
import { useNavigate } from "react-router-dom";
import { UseUser } from "../contexts/UserContext";

const defaultData = {
	circle: "",
	circles: [],
	collaborators: [],
	description: "",
	github_link: "",
	live_link: "",
	pictures: [],
	project_name: "",
	suggestions: [],
	tags: [],
};

const AddProject = () => {
	const [mode, setMode] = useState<"PERSONAL" | "CIRCLE">("PERSONAL");
	const [users, setUsers] = useState<UserType[]>([]);
	const [data, setData] = useState(defaultData);
	const Navigate = useNavigate();
	const user = UseUser();
	const activeStyle = "text-white font-medium scale-105";

	const fetchUsers = async () => {
		const { data, response } = await UseFetch({
			url: "user",
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) throw new Error("Error fetching users");

		setUsers(
			data.data.map((user) => ({
				first_name: user.first_name,
				last_name: user.last_name,
				code: user.id,
			}))
		);
	};

	useEffect(() => {
		(async () => await fetchUsers())();
		(async () => {
			const { data, response } = await UseFetch({
				url: "circle",
				options: {
					method: "GET",
					returnResponse: true,
					useServerUrl: true,
				},
			});

			if (!response.ok) {
				console.log("Error fetching users");
			}

			setData((prev) => ({
				...prev,
				circles: data.data.map((circle) => ({
					name: "Circle " + circle.id,
					code: circle.id,
				})),
			}));
			console.log(data);
		})();
	}, []);

	// TODO: Not needing circle id's, server automatically adds it to the user's circle.

	const uploadProject = async () => {
		const { data: resData, response } = await UseFetch({
			url: "project",
			options: {
				method: "POST",
				body: {
					name: data.project_name,
					description: data.description,
					liveLink: data.live_link,
					github: data.github_link,
					tags: data.tags,
					circleId:
						mode === "CIRCLE"
							? user.info.circle?.circleId ?? undefined
							: undefined,
					collaborators: data.collaborators.map(
						(collaborator) => collaborator.code
					),
				},
				returnResponse: true,
				useServerUrl: true,
			},
		});

		if (!response.ok) {
			console.log("Error trying to upload project");
		}
		// TODO: toast notifications.
		Navigate(`/project/${resData.data.id}`);
		setData(defaultData);
	};

	const searchUser = (event) => {
		// Simulate backend search
		const filteredUsers = users.filter((user) => {
			return (
				(user.first_name &&
					user.first_name
						.toLowerCase()
						.startsWith(event.query.toLowerCase())) ||
				(user.last_name &&
					user.last_name
						.toLowerCase()
						.startsWith(event.query.toLowerCase()))
			);
		});

		setData((prev) => ({ ...prev, suggestions: filteredUsers }));
	};
	return (
		<div className="w-full max-w-[700px]">
			<section className="bg-blue-700">
				<header className="flex flex-row gap-4 justify-center py-6 rounded-t-3xl">
					<h3
						className={`cursor-pointer text-lg ${
							mode == "PERSONAL" ? activeStyle : "text-slate-600"
						}`}
						onClick={() => setMode("PERSONAL")}
					>
						Personal Project
					</h3>
					{user.isLoggedIn && user.info.circle && (
						<h3
							className={`cursor-pointer text-lg ${
								mode == "CIRCLE"
									? activeStyle
									: "text-slate-400"
							}`}
							onClick={() => setMode("CIRCLE")}
						>
							Circle Project
						</h3>
					)}
				</header>
				<section className="w-full bg-[#B9D6F0] py-2 px-3 rounded-t-[24px]">
					<div className="px-2 flex flex-col gap-2 mt-2 w-full">
						<div className="w-[256px] h-[140px] mx-auto bg-gray-500 rounded-md"></div>
						{/* <FileUpload
							mode="basic"
							name="demo[]"
							url="/api/upload"
							accept="image/*"
							maxFileSize={1000000}
							onUpload={onUpload}
							className="mx-auto"
						/> */}

						<span className="flex flex-col gap-1 mt-2 items-start">
							<label
								htmlFor="project_name"
								className="font-semibold text-sm text-slate-700"
							>
								Project Name:
							</label>
							<InputText
								id="project_name"
								value={data.project_name}
								onChange={(e) => {
									setData((prev) => ({
										...prev,
										project_name: e.target.value,
									}));
								}}
								className="w-full py-1 text-medium px-2 text-slate-600"
							/>
						</span>

						<span className="flex flex-col gap-1 items-start">
							<label
								htmlFor="project_live_link"
								className="font-semibold text-sm text-slate-700"
							>
								Live Link:
							</label>
							<InputText
								id="project_live_link"
								value={data.live_link}
								onChange={(e) => {
									setData((prev) => ({
										...prev,
										live_link: e.target.value,
									}));
								}}
								className="w-full py-1 text-medium px-2 text-slate-600"
							/>
						</span>

						<span className="flex flex-col gap-1 items-start">
							<label
								htmlFor="project_github_link"
								className="font-semibold text-sm text-slate-700"
							>
								Github Link:
							</label>
							<InputText
								id="project_github_link"
								value={data.github_link}
								onChange={(e) => {
									setData((prev) => ({
										...prev,
										github_link: e.target.value,
									}));
								}}
								className="w-full py-1 text-medium px-2 text-slate-600"
							/>
						</span>

						<span className="flex flex-col gap-1 items-start">
							<label
								htmlFor="project_description"
								className="font-semibold text-sm text-slate-700"
							>
								Project Description:
							</label>
							<Editor
								value={data.description}
								onTextChange={(e) =>
									setData((prev) => ({
										...prev,
										description: e.htmlValue,
									}))
								}
								style={{ height: "320px" }}
							/>
						</span>

						<span className="flex flex-col gap-1 items-start">
							<label className="font-semibold text-sm text-slate-700">
								Project Collaborators:
							</label>
							<AutoComplete
								field="first_name"
								value={data.collaborators}
								suggestions={data.suggestions}
								completeMethod={searchUser}
								onChange={(e) =>
									setData((prev) => {
										return {
											...prev,
											collaborators: e.value,
										};
									})
								}
								itemTemplate={(item) => {
									return (
										<h1>
											{item.first_name} {item.last_name}
										</h1>
									);
								}}
								dropdown
								multiple
							/>{" "}
						</span>

						<span className="flex flex-col gap-1 items-start">
							<label className="font-semibold text-sm text-slate-700">
								Tags:
							</label>
							<Chips
								value={data.tags}
								onChange={(e) =>
									setData((prev) => ({
										...prev,
										tags: e.value,
									}))
								}
								separator=","
							/>
						</span>

						<button
							className="bg-blue-800 text-white w-fit font-medium px-6 py-1 rounded-md mx-auto mt-4"
							onClick={uploadProject}
						>
							Upload Project
						</button>
					</div>
				</section>
			</section>
		</div>
	);
};

export default AddProject;
