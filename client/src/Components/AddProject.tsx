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

const AddProject = () => {
	const [mode, setMode] = useState<"PERSONAL" | "CIRCLE">("PERSONAL");
	const [users, setUsers] = useState<UserType[]>([]);
	const [data, setData] = useState({
		tags: [],
		description: "",
		collaborators: [],
		suggestions: [],
	});

	const activeStyle = "text-white font-medium scale-105";

	const onUpload = () => {
		console.log(1);
	};

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
	}, []);

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
						className={`cursor-pointer ${
							mode == "PERSONAL" ? activeStyle : "text-slate-600"
						}`}
						onClick={() => setMode("PERSONAL")}
					>
						Personal Project
					</h3>
					<h3
						className={`cursor-pointer ${
							mode == "CIRCLE" ? activeStyle : "text-slate-400"
						}`}
						onClick={() => setMode("CIRCLE")}
					>
						Circle Project
					</h3>
				</header>
				<section className="w-full bg-[#B9D6F0] py-2 px-3 rounded-t-[24px]">
					<div className="px-2 flex flex-col gap-2 mt-2 w-full">
						<div className="w-[256px] h-[140px] mx-auto bg-gray-500 rounded-md"></div>
						<FileUpload
							mode="basic"
							name="demo[]"
							url="/api/upload"
							accept="image/*"
							maxFileSize={1000000}
							onUpload={onUpload}
							className="mx-auto"
						/>

						<span className="flex flex-col gap-3 mt-2 items-start">
							<label
								htmlFor="project_name"
								className="font-semibold text-sm text-slate-700"
							>
								Project Name:
							</label>
							<InputText
								id="project_name"
								className="w-full py-1 text-medium px-2 text-slate-600"
							/>
						</span>

						<span className="flex flex-col gap-2 items-start">
							<label
								htmlFor="project_live_link"
								className="font-semibold text-sm text-slate-700"
							>
								Live Link:
							</label>
							<InputText
								id="project_live_link"
								className="w-full py-1 text-medium px-2 text-slate-600"
							/>
						</span>

						{mode == "CIRCLE" && (
							<span className="flex flex-col gap-2 items-start">
								<label
									htmlFor="project_circle"
									className="font-semibold text-sm text-slate-700"
								>
									Circle:
								</label>
								<Dropdown
									// value={selectedCity}
									// onChange={(e) => setSelectedCity(e.value)}
									// options={cities}
									optionLabel="Circle"
									placeholder="Select a Circle"
									className="w-full md:w-14rem"
								/>
							</span>
						)}

						<span className="flex flex-col gap-2 items-start">
							<label
								htmlFor="project_github_link"
								className="font-semibold text-sm text-slate-700"
							>
								Github Link:
							</label>
							<InputText
								id="project_github_link"
								className="w-full py-1 text-medium px-2 text-slate-600"
							/>
						</span>

						<span className="flex flex-col gap-2 items-start">
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

						<span className="flex flex-col gap-2 items-start">
							<label className="font-semibold text-sm text-slate-700">
								Project Collaborators:
							</label>
							<AutoComplete
								field="first_name"
								multiple
								value={data.collaborators}
								suggestions={users}
								completeMethod={searchUser}
								selectionLimit={10}
								onChange={(e) =>
									setData((prev) => {
										return {
											...prev,
											collaborators: e.value,
										};
									})
								}
							/>
						</span>

						<span className="flex flex-col gap-2 items-start">
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

						<button className="bg-blue-800 text-white w-fit font-medium px-6 py-1 rounded-md mx-auto mt-4">
							Upload Project
						</button>
					</div>
				</section>
			</section>
		</div>
	);
};

export default AddProject;
