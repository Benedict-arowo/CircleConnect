import { useEffect, useRef, useState } from "react";
import UseFetch from "../../Components/Fetch";
import { UserTypeClean } from "../../types";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Role } from "./Roles";
import { CascadeSelect } from "primereact/cascadeselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

interface userData {
	id: string;
	email: string;
	profile_picture: string;
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
	coleadOf: null | UserTypeClean;
	leadOf: null | UserTypeClean;
	memberOf: null | UserTypeClean;
	joined: Date;
	createdAt: Date;
}

interface editUserData {
	id: string;
	email: string;
	profile_picture: string;
	first_name: string;
	last_name: string;
	password?: string;
	projects: {
		id: string;
		circleId: number;
		name: string;
	}[];
	role: {
		id: string;
		name: {
			role?: string;
			code?: string;
		};
	};
	track: {
		name?: string;
		code?: string;
	};
	school: {
		name?: string;
		code?: string;
	};
	coleadOf: null | UserTypeClean;
	leadOf: null | UserTypeClean;
	memberOf: null | UserTypeClean;
	joined?: Date;
	createdAt?: Date;
}

interface createUserData {
	email: string;
	profile_picture: string;
	first_name: string;
	last_name: string;
	password: string;
	confirm_password: string;
	role: { role: string; code: string };
	track: {
		name: string;
		code: string;
	};
	school: {
		name: string;
		code: string;
	};
}

const trackList = [
	{ name: "Frontend", code: "FRONTEND" },
	{ name: "Backend", code: "BACKEND" },
	{ name: "Cloud", code: "CLOUD" },
];

type searchType = {
	content?: string;
	mode?: {
		name: "Role" | "School" | "Track";
		code: "ROLE" | "SCHOOL" | "TRACK";
	};
};

const SchoolList = [{ name: "ENGINEERING", code: "ENGINEERING" }];
const ModeList = [
	{ name: "None", code: undefined },
	{ name: "Role", code: "ROLE" },
	{ name: "School", code: "SCHOOL" },
	{ name: "Track", code: "TRACK" },
];
const SortOptions = [
	{
		name: "Roles",
		code: "ROLE",
		options: [
			{
				cname: "R-Ascending",
				code: "ascending-role",
			},
			{
				cname: "R-Decending",
				code: "decending-role",
			},
		],
	},
	{
		name: "Created at",
		code: "CREATED_AT",
		options: [
			{
				cname: "CT-Ascending",
				code: "ascending-created_at",
			},
			{
				cname: "CT-Decending",
				code: "aecending-created_at",
			},
		],
	},
];

type sortedMethod = {
	cname: string;
	code: string;
};

export default function Users() {
	const [data, setData] = useState<userData[]>([]);
	const [editUserDialog, setEditUserDialog] = useState(false);
	const [createUserDialog, setCreateUserDialog] = useState(false);
	const [editUserData, setEditUserData] = useState<editUserData>({
		id: "",
		email: "",
		profile_picture: "",
		first_name: "",
		last_name: "",
		password: "",
		projects: [],
		role: {
			id: "",
			name: {
				role: "",
				code: "",
			},
		},
		track: {
			name: "",
			code: "",
		},
		school: {
			name: undefined,
			code: undefined,
		},
		joined: undefined,
		createdAt: undefined,
		coleadOf: null,
		leadOf: null,
		memberOf: null,
	});

	const [createUserData, setCreateUserData] = useState<createUserData>({
		email: "",
		profile_picture: "",
		first_name: "",
		last_name: "",
		password: "",
		confirm_password: "",
		role: {
			role: "",
			code: "",
		},
		track: {
			name: "",
			code: "",
		},
		school: {
			name: "",
			code: "",
		},
	});
	const [userRolesData, setUserRolesData] = useState<Role[]>([]);
	const [search, setSearch] = useState<searchType>({
		content: undefined,
		mode: undefined,
	});
	const toast = useRef<Toast | null>(null);
	const [sortedMethod, setSortedMethod] = useState<sortedMethod | undefined>(
		undefined
	);

	const fetchUsers = async () => {
		const { data, response } = await UseFetch({
			url: "user",
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

	const fetchRoles = async () => {
		const { data, response } = await UseFetch({
			url: "role",
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

		setUserRolesData(data.data);
	};

	const getUserData = () => {
		let newData: userData[] = data;

		if (sortedMethod) {
			const method = sortedMethod.code.split("-")[0];
			const item = sortedMethod.code.split("-")[1];
			// sort method modifies original array, which messes with the sorting (ie: when removing the sorting, the original order is lost.)
			// can replace with .toSorted method, but that's for Node 20+
			newData = [...newData].sort((a, b) => {
				if (method === "ascending") {
					if (item === "role")
						return a.role.name.localeCompare(b.role.name);
					else if (item === "created_at") {
						return (
							new Date(a.createdAt).getTime() -
							new Date(b.createdAt).getTime()
						);
					}
				} else {
					if (item === "role")
						return b.role.name.localeCompare(a.role.name);
					else if (item === "created_at")
						return (
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
						);
				}
				return 0; // Add a default return value
			});
		} else newData = data;

		if (search.content) {
			newData = newData.filter((user) => {
				if (search.mode && search.mode.code === "ROLE")
					return user.role.name
						.toLowerCase()
						.includes((search.content || "").toLowerCase());
				else if (search.mode && search.mode.code === "SCHOOL")
					return user.school
						.toLowerCase()
						.includes((search.content || "").toLowerCase());
				else if (search.mode && search.mode.code === "TRACK")
					return user.track
						.toLowerCase()
						.includes((search.content || "").toLowerCase());
				else
					return (
						user.email
							.toLowerCase()
							.includes((search.content || "").toLowerCase()) ||
						user.first_name
							.toLowerCase()
							.includes((search.content || "").toLowerCase()) ||
						user.id
							.toLowerCase()
							.includes((search.content || "").toLowerCase())
					);
			});
		}

		return newData;
	};

	useEffect(() => {
		(async () => {
			await fetchUsers();
			await fetchRoles();
		})();
	}, []);

	const manageUser = (userId: string) => {
		const user = data.find((user) => user.id === userId);
		if (!user) throw new Error("User not found.");

		setEditUserData(() => ({
			...user,
			track: trackList.find(
				(track) => track.code === user.track.toUpperCase()
			) || { name: "", code: "" }, // Assign a default value if track is not found
			role: {
				...user.role,
				name: {
					role: user.role.name,
					code: user.role.id,
				},
			},
			school: { name: user.school, code: user.school.toUpperCase() },
		}));

		setEditUserDialog(true);
	};

	const EditUser = async (userDetails: editUserData) => {
		// TODO: Client side verification
		if (!userDetails) throw new Error("User not found.");
		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Saving changes...",
			life: 3000,
		});
		// TODO: Only send data that changes, and not everything everytime.
		const { data, response } = await UseFetch({
			url: `user/${userDetails.id}`,
			options: {
				method: "PATCH",
				useServerUrl: true,
				returnResponse: true,
				body: {
					email: userDetails.email && userDetails.email,
					profile_picture:
						userDetails.profile_picture &&
						userDetails.profile_picture,
					first_name:
						userDetails.first_name && userDetails.first_name,
					last_name: userDetails.last_name && userDetails.last_name,
					password: userDetails.password && userDetails.password,
					roleId: userDetails.role.id && userDetails.role.id,
					track: userDetails.track.code && userDetails.track.code,
					school: userDetails.school.code && userDetails.school.code,
				},
			},
		});

		if (!response.ok) {
			return toast.current?.show({
				severity: "error",
				summary: "Oops...",
				detail: data
					? data.message
					: "Error trying to communicate with server.",
				life: 3000,
			});
		}

		toast.current?.show({
			severity: "success",
			summary: "Success!!!",
			detail: "Successfully saved changes...",
			life: 3000,
		});

		setEditUserDialog(false);
		setData((prev) => {
			const currData = prev;
			const userIndex = currData.findIndex(
				(user) => user.id === userDetails.id
			);
			currData[userIndex] = data.data;
			return currData;
		});
	};

	const CreateUser = async (userDetails: createUserData) => {
		// TODO: Client side verification
		if (!userDetails) throw new Error("User not found.");

		if (userDetails.confirm_password !== userDetails.password)
			return toast.current?.show({
				severity: "warn",
				summary: "Error...",
				detail: "Passwords do not match...",
				life: 3000,
			});

		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Creating user...",
			life: 3000,
		});
		const { data, response } = await UseFetch({
			url: `user`,
			options: {
				method: "POST",
				useServerUrl: true,
				returnResponse: true,
				body: {
					...userDetails,
					role: userDetails.role.code,
					school: userDetails.school.code,
					track: userDetails.track.code,
				},
			},
		});

		if (!response.ok) {
			return toast.current?.show({
				severity: "error",
				summary: "Oops...",
				detail: data
					? data.message
					: "Error trying to communicate with server.",
				life: 3000,
			});
		}

		toast.current?.show({
			severity: "success",
			summary: "Success!!!",
			detail: "Successfully created user...",
			life: 3000,
		});

		setCreateUserDialog(false);
		// Add new user to local data list
		setData((prev) => [data.data, ...prev]);
	};

	const DeleteUser = async (userId: string) => {
		if (!userId) throw new Error("User not found.");

		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Saving changes...",
			life: 3000,
		});

		const { data, response } = await UseFetch({
			url: `user/${userId}`,
			options: {
				method: "DELETE",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) {
			return toast.current?.show({
				severity: "error",
				summary: "Oops...",
				detail: data
					? data.message
					: "Error trying to communicate with server.",
				life: 3000,
			});
		}

		toast.current?.show({
			severity: "success",
			summary: "Success!!!",
			detail: "Successfully deleted user...",
			life: 3000,
		});

		setEditUserDialog(false);
		// Removes the user that has been deleted from the local list of users.
		setData((prev) => {
			return [...prev].filter((user) => user.id !== userId);
		});
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
						value={search.content}
						onChange={(e) =>
							setSearch((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
						className="w-full h-full"
					/>
				</span>
				<Dropdown
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
				/>
			</div>

			<div className="flex flex-row text-center mt-10 gap-8 w-full justify-between">
				<section className="flex flex-row items-center gap-8">
					<h1 className="text-4xl font-bold">
						Members ({data.length})
					</h1>
					<i
						onClick={() => setCreateUserDialog(true)}
						title="Create a new role."
						className="pi pi-plus cursor-pointer shadow-lg hover:scale-105 duration-200 bg-yellow-400 text-white px-2 py-2 rounded-full"
					></i>
				</section>
				<section>
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
				</section>
			</div>

			<div className="mt-4 border-t-2 w-full">
				<DataTable
					value={getUserData()}
					tableStyle={{ minWidth: "50rem" }}
					showGridlines
					stripedRows
				>
					<Column
						body={(user: userData) => {
							return (
								<>
									{user.profile_picture && (
										<Avatar
											image={user.profile_picture}
											shape="circle"
											style={{ objectFit: "cover" }}
										/>
									)}
									{!user.profile_picture && (
										<Avatar
											label={user.first_name[0]}
											style={{
												backgroundColor: "#9c27b0",
												color: "#ffffff",
											}}
											shape="circle"
										/>
									)}
								</>
							);
						}}
					/>
					<Column field="first_name" header="Name"></Column>
					<Column
						body={(user: userData) => (
							<Tag value={user.role.name} severity="success" />
						)}
						header="Role"
					></Column>
					<Column
						body={(user: userData) => (
							<Tag value={user.school} severity="info" />
						)}
						header="School"
					></Column>
					<Column
						body={(user: userData) => <p>{user.projects.length}</p>}
						header="Project(s)"
					></Column>
					<Column field="track" header="Track" />
					<Column
						body={(user: userData) => (
							<button
								className=" ml-5"
								onClick={() => manageUser(user.id)}
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
				header={`Creating a new user - ${createUserData.first_name}`}
				visible={createUserDialog}
				style={{ width: "50vw" }}
				onHide={() => setCreateUserDialog(false)}
				dismissableMask={true}
				draggable={false}
			>
				<form>
					<section>
						<h3 className="font-bold text-sm">Info</h3>
						<div className="px-2 flex flex-col gap-2 mt-2">
							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_first_name"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									First Name:
								</label>
								<InputText
									placeholder="First Name"
									value={createUserData.first_name}
									className="border p-2 w-full"
									onChange={(e) => {
										setCreateUserData((prev) => {
											return {
												...prev,
												first_name: e.target.value,
											};
										});
									}}
								/>
							</span>
							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_first_name"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									Last Name:
								</label>
								<InputText
									placeholder="Last Name"
									value={createUserData.last_name}
									className="border p-2 w-full"
									onChange={(e) => {
										setCreateUserData((prev) => {
											return {
												...prev,
												last_name: e.target.value,
											};
										});
									}}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_email"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Email:
								</label>
								<InputText
									placeholder="Email"
									value={createUserData.email}
									className="border p-2 w-full"
									onChange={(e) => {
										setCreateUserData((prev) => {
											return {
												...prev,
												email: e.target.value,
											};
										});
									}}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_password"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Password:
								</label>
								<Password
									placeholder="Password"
									value={createUserData.password}
									toggleMask
									className="w-full"
									inputClassName="w-full border p-2"
									onChange={(e) => {
										setCreateUserData((prev) => {
											return {
												...prev,
												password: e.target.value,
											};
										});
									}}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_confirm_password"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									Confirm Password:
								</label>
								<Password
									placeholder="Verify Password"
									value={createUserData.confirm_password}
									toggleMask
									className="w-full"
									inputClassName="w-full border p-2"
									onChange={(e) => {
										setCreateUserData((prev) => {
											return {
												...prev,
												confirm_password:
													e.target.value,
											};
										});
									}}
								/>
							</span>
						</div>
					</section>

					<section className="mt-3">
						<div className="flex flex-row justify-between items-center">
							<h3 className="font-bold text-sm">User Details</h3>
						</div>
						<div className="px-2 flex flex-col gap-2 mt-2">
							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_role"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Role:
								</label>
								<Dropdown
									value={createUserData.role}
									onChange={(e) =>
										setCreateUserData((prev) => {
											return {
												...prev,
												role: e.target.value,
											};
										})
									}
									options={userRolesData.map((role) => {
										return {
											role: role.name,
											code: role.id,
										};
									})}
									optionLabel="role"
									placeholder="Select a Role"
									className="w-full md:w-14rem border"
									id="user-role"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_track"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Track:
								</label>
								<Dropdown
									value={createUserData.track}
									onChange={(e) =>
										setCreateUserData((prev) => {
											return {
												...prev,
												track: e.target.value,
											};
										})
									}
									options={trackList}
									optionLabel="name"
									placeholder="Select a Track"
									className="w-full md:w-14rem border"
									id="user-track"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_school"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									School:
								</label>
								<Dropdown
									value={createUserData.school}
									onChange={(e) =>
										setCreateUserData((prev) => {
											return {
												...prev,
												school: e.target.value,
											};
										})
									}
									options={SchoolList}
									optionLabel="name"
									placeholder="Select a School"
									className="w-full md:w-14rem border"
									id="user-school"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_profile_picture"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									Profile picture:
								</label>

								<InputText
									placeholder="Profile Picture"
									value={createUserData.profile_picture}
									className="border p-2 w-full"
									onChange={(e) => {
										setCreateUserData((prev) => {
											return {
												...prev,
												profile_picture: e.target.value,
											};
										});
									}}
								/>
							</span>
						</div>
					</section>

					<footer className="flex flex-row gap-6 justify-center mt-4">
						<button
							onClick={(e) => {
								e.preventDefault();
								confirmDialog({
									message:
										"Are you sure you want to proceed?",
									header: "Confirmation",
									icon: "pi pi-exclamation-triangle",
									defaultFocus: "accept",
									accept: () => CreateUser(createUserData),
								});
							}}
							type="submit"
							className="w-fit h-fit bg-green-600 px-4 py-1 text-white rounded-md font-normal"
						>
							Create User
						</button>
					</footer>
				</form>
			</Dialog>

			{/* EDIT USER DIALOG */}
			<Dialog
				header={`Editing User - ${
					editUserData && editUserData.first_name
				}`}
				visible={editUserDialog}
				style={{ width: "50vw" }}
				onHide={() => setEditUserDialog(false)}
				dismissableMask={true}
				draggable={false}
			>
				<form>
					<section>
						<h3 className="font-bold text-sm">Info</h3>
						<div className="px-2 flex flex-col gap-2 mt-2">
							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_id"
									className="font-bold text-sm text-center"
								>
									ID:
								</label>

								<InputText
									value={editUserData.id}
									className="w-full"
									disabled
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_first_name"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									First Name:
								</label>
								<InputText
									placeholder="First Name"
									value={editUserData.first_name}
									className="border p-2 w-full"
									onChange={(e) => {
										setEditUserData((prev) => {
											return {
												...prev,
												first_name: e.target.value,
											};
										});
									}}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_last_name"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									Last Name:
								</label>
								<InputText
									placeholder="Last Name"
									value={editUserData.last_name}
									className="border p-2 w-full"
									onChange={(e) => {
										setEditUserData((prev) => {
											return {
												...prev,
												last_name: e.target.value,
											};
										});
									}}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_email"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Email:
								</label>
								<InputText
									placeholder="Email"
									value={editUserData.email}
									className="border p-2 w-full"
									onChange={(e) => {
										setEditUserData((prev) => {
											return {
												...prev,
												email: e.target.value,
											};
										});
									}}
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_password"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Password:
								</label>

								<Password
									placeholder="Password"
									value={editUserData.password}
									toggleMask
									className="w-full"
									inputClassName="w-full border p-2"
									onChange={(e) => {
										setEditUserData((prev) => {
											return {
												...prev,
												password: e.target.value,
											};
										});
									}}
								/>
							</span>
						</div>
					</section>

					<section className="mt-3">
						<div className="flex flex-row justify-between items-center">
							<h3 className="font-bold text-sm">User Details</h3>
						</div>
						<div className="px-2 flex flex-col gap-2 mt-2">
							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_role"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Role:
								</label>
								<Dropdown
									value={editUserData.role.name}
									onChange={(e) =>
										setEditUserData((prev) => {
											return {
												...prev,
												role: {
													...prev.role,
													// Changes the ID to the id of the role, to be used when sending the request.
													id: e.target.value["code"],
													name: e.target.value,
												},
											};
										})
									}
									options={userRolesData.map((role) => {
										return {
											role: role.name,
											code: role.id,
										};
									})}
									optionLabel="role"
									placeholder="Select a Role"
									className="w-full md:w-14rem border"
									id="user-role"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_track"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									Track:
								</label>
								<Dropdown
									value={editUserData.track}
									onChange={(e) =>
										setEditUserData((prev) => {
											return {
												...prev,
												track: e.target.value,
											};
										})
									}
									options={trackList}
									optionLabel="name"
									placeholder="Select a Track"
									className="w-full md:w-14rem border"
									id="user-track"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_school"
									className="font-bold text-sm text-center border-1 border-zinc-300"
								>
									School:
								</label>
								<Dropdown
									value={
										editUserData.school &&
										editUserData.school
									}
									onChange={(e) =>
										setEditUserData((prev) => {
											return {
												...prev,
												school: e.target.value,
											};
										})
									}
									options={SchoolList}
									optionLabel="name"
									placeholder="Select a School"
									className="w-full md:w-14rem border"
									id="user-school"
								/>
							</span>

							<span className="flex flex-row gap-2 items-center">
								<label
									htmlFor="user_profile_picture"
									className="font-bold text-sm text-center border-1 border-zinc-300 min-w-fit"
								>
									Profile picture:
								</label>

								<InputText
									placeholder="Profile Picture"
									value={
										editUserData &&
										editUserData.profile_picture
									}
									onChange={(e) => {
										setEditUserData((prev) => {
											return {
												...prev,
												profile_picture: e.target.value,
											};
										});
									}}
									className="w-full border p-2"
								/>
							</span>
						</div>
					</section>

					<footer className="flex flex-row gap-6 justify-center mt-4">
						<button
							onClick={(e) => {
								e.preventDefault();
								confirmDialog({
									message:
										"Are you sure you want to proceed?",
									header: "Confirmation",
									icon: "pi pi-exclamation-triangle",
									defaultFocus: "accept",
									accept: () => EditUser(editUserData),
								});
							}}
							className="w-fit h-fit bg-green-600 px-4 py-1 text-white rounded-md font-normal"
						>
							Save Changes
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								confirmDialog({
									message: "Do you want to delete this user?",
									header: "Delete Confirmation",
									icon: "pi pi-info-circle",
									defaultFocus: "reject",
									acceptClassName: "p-button-danger",
									accept: () => DeleteUser(editUserData.id),
								});
							}}
							className="w-fit h-fit bg-red-500 px-4 py-1 text-white rounded-md font-normal"
						>
							Delete User
						</button>

						<button
							onClick={(e) => {
								// TODO ability to disable and enable a user.
								e.preventDefault();
								confirmDialog({
									message: "Do you want to delete this user?",
									header: "Delete Confirmation",
									icon: "pi pi-info-circle",
									defaultFocus: "reject",
									acceptClassName: "p-button-danger",
									// accept: () =>
									// DeleteUser(editUserData.id),
								});
							}}
							disabled
							className="w-fit h-fit bg-gray-500 px-4 py-1 text-white rounded-md font-normal"
						>
							Disable User
						</button>
					</footer>
				</form>
			</Dialog>
		</div>
	);
}
