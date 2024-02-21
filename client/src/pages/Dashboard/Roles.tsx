import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { UserTypeClean } from "../../types";
import UseFetch from "../../Components/Fetch";
import { DEFAULT_MEMBER_ROLE_ID } from "../../../config";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";

type Role = {
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
	users: UserTypeClean[];
};

type ArrangedRoleData = {
	id: string;
	name: string;
	permissions: {
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
	users: UserTypeClean[];
};

const Roles = () => {
	const [data, setData] = useState<Role[]>([]);
	const [editRoleDialogIsVisible, setEditRoleDialogIsVisible] =
		useState(false);

	const [editData, setEditData] = useState<ArrangedRoleData | null>(null);
	const [displayMemberMenu, setDisplayMemberMenu] = useState(false);
	const toast = useRef<Toast | null>(null);

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

		setData(data.data);
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	const manageRole = (id: string) => {
		const role = data.find((role) => role.id === id);
		if (!role) throw new Error("Role not found.");
		// Toast display here for the error.

		setEditRoleDialogIsVisible(true);
		setEditData((): ArrangedRoleData => {
			return {
				id: role.id,
				name: role.name,
				permissions: {
					canCreateCircle: role.canCreateCircle,
					canModifyOwnCircle: role.canModifyOwnCircle,
					canModifyOtherCircle: role.canModifyOtherCircle,
					canDeleteOwnCircle: role.canDeleteOwnCircle,
					canDeleteOtherCircles: role.canDeleteOtherCircles,
					canLeaveCircle: role.canLeaveCircle,
					canJoinCircle: role.canJoinCircle,
					canCreateProject: role.canCreateProject,
					canModifyOwnProject: role.canModifyOwnProject,
					canModifyOtherProject: role.canModifyOtherProject,
					canDeleteOwnProject: role.canDeleteOwnProject,
					canDeleteOtherProject: role.canDeleteOtherProject,
					canAddProjectToCircle: role.canAddProjectToCircle,
					canRemoveProjectFromCircle: role.canRemoveProjectFromCircle,
					canManageRoles: role.canManageRoles,
					canManageUsers: role.canManageUsers,
					isAdmin: role.isAdmin,
				},
				users: role.users,
			};
		});
	};

	const DisplayPermissions = ({
		permissions,
	}: {
		permissions: ArrangedRoleData["permissions"];
	}) => {
		const permList = [];

		for (const perm in permissions) {
			permList.push(perm);
		}

		return (
			<div className="flex flex-col gap-1">
				{permList.map((perm) => {
					return (
						<div
							key={perm}
							className="flex flex-row justify-between text-sm px-2 py-1"
						>
							<h4>{perm}</h4>

							<InputSwitch
								checked={
									permissions[
										perm as keyof typeof permissions
									]
								}
								onChange={(e) =>
									setEditData(
										(prev: ArrangedRoleData | null) => {
											if (!prev) return null;
											return {
												...prev,
												permissions: {
													...prev.permissions,
													[perm as keyof typeof permissions]:
														e.value,
												},
											};
										}
									)
								}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	const DisplayUsers = ({ users }: { users: ArrangedRoleData["users"] }) => {
		return users.map((user) => {
			return (
				<div className="bg-neutral-100 border border-neutral-300 px-2 py-1">
					{user.profile_picture}
					{user.first_name}
				</div>
			);
		});
	};

	const toggleMemberMenu = () => {
		// If the menu was disabled (false), it'll open it up (true) opposite of false and vise versa.
		setDisplayMemberMenu((prev) => !prev);
	};

	const SaveRoleChanges = async (roleData: ArrangedRoleData) => {
		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Saving changes...",
			life: 3000,
		});

		const { data, response } = await UseFetch({
			url: `role/${roleData.id}`,
			options: {
				method: "PATCH",
				body: {
					name: roleData.name,
					permissions: roleData.permissions,
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

		// If fetch is successfull, we update the data, and show the successfull toast
		// TODO: update data locally perhaps?
		fetchRoles();
		toast.current?.show({
			severity: "success",
			summary: "Role Saved!",
			detail: "Successfully saved changes...",
			life: 3000,
		});
		closeNewRoleDialog();
	};

	const DeleteRole = async (roleId: string) => {
		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Deleting role...",
			life: 3000,
		});

		const { data: fetchData, response } = await UseFetch({
			url: `role/${roleId}`,
			options: {
				method: "DELETE",
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
					fetchData && fetchData.message
						? fetchData.message
						: "Error trying to communicate with the server."
				}`,
				life: 3000,
			});

		// If fetch is successfull, we update the data, and show the successfull toast
		const newData = data.filter((item) => item.id !== roleId);
		setData(newData);

		toast.current?.show({
			severity: "success",
			summary: "Role Deleted!",
			detail: "Successfully deleted role...",
			life: 3000,
		});
		closeNewRoleDialog();
	};

	const closeNewRoleDialog = () => {
		setEditRoleDialogIsVisible(false);
		setTimeout(() => {
			setEditData(null);
		}, 500);
	};

	return (
		<div className="flex-1 w-full px-6 bg-gray-100">
			<Toast ref={toast} />
			<ConfirmDialog />

			<div className="w-full grid place-content-center mt-5">
				<input
					placeholder="Search..."
					className="border-2 lg:w-[500px] w-[400px] px-2 py-2 outline-[#F1C644] font-light"
				></input>
			</div>

			<div className="flex flex-row text-center mt-10 gap-8 w-full justify-between">
				<section className="flex flex-row items-center justify-between w-full gap-8">
					<h1 className="text-4xl font-bold">Roles</h1>
					<i className="pi pi-plus bg-yellow-400 text-white px-2 py-2 rounded-full"></i>
				</section>
				<Button
					colorScheme="yellow"
					color="white"
					className="shadow-sm"
				>
					Filter
				</Button>
			</div>

			<div className="mt-4 border-t-2 w-full">
				<TableContainer component={Paper}>
					<Table
						sx={{
							"& tr > *:not(:first-type-of)": {
								textAlign: "center",
							},
						}}
					>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>User(s)</TableCell>
								<TableCell>Is Admin</TableCell>
								<TableCell>Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => {
								return (
									<TableRow
										key={row.id}
										className={
											row.id === DEFAULT_MEMBER_ROLE_ID
												? "bg-neutral-200"
												: ""
										}
									>
										<TableCell>{row.name}</TableCell>
										<TableCell>
											{row.users.length}
										</TableCell>
										<TableCell>
											{row.isAdmin && (
												<i className="pi pi-check"></i>
											)}
										</TableCell>
										<TableCell>
											<button
												className=" ml-5"
												onClick={() =>
													manageRole(row.id)
												}
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
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>

			<Dialog
				header={`Editing Role - ${editData && editData.name}`}
				visible={editRoleDialogIsVisible}
				style={{ width: "50vw" }}
				dismissableMask
				onHide={closeNewRoleDialog}
				draggable={false}
			>
				{editData && (
					<div>
						<section>
							<h3 className="font-bold text-sm">Info</h3>
							<div className="px-2 flex flex-col gap-2 mt-2">
								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="role_id"
										className="font-bold text-sm text-center"
									>
										ID:
									</label>
									<InputText
										id="role_id"
										placeholder="Role ID"
										value={editData.id}
										disabled
										className=""
									/>
								</span>

								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="role_name"
										className="font-bold text-sm text-center border-1 border-zinc-300"
									>
										Name:
									</label>
									<InputText
										id="role_name"
										placeholder="Role Name"
										value={editData.name}
										className="w-full"
										onChange={(e) =>
											setEditData((prev) => {
												if (!prev) return null;
												return {
													...prev,
													name: e.target.value,
													permissions:
														prev.permissions,
													users: prev.users,
												};
											})
										}
									/>
								</span>
							</div>
						</section>
						<section className="mt-3">
							<h3 className="font-bold text-sm">Permissions</h3>
							{
								<DisplayPermissions
									permissions={editData.permissions}
								/>
							}
						</section>

						{editData.users && (
							<section className="mt-3">
								<div className="flex flex-row justify-between items-center">
									<h3 className="font-bold text-sm">
										Members
									</h3>
									<i
										className={`pi ${
											!displayMemberMenu
												? "pi-chevron-down"
												: "pi-chevron-up"
										} text-xs cursor-pointer`}
										onClick={toggleMemberMenu}
									></i>
								</div>
								<div
									className={`px-2 mt-2 overflow-hidden transition-all duration-300 ${
										displayMemberMenu ? "h-fit" : "h-0"
									}`}
								>
									{<DisplayUsers users={editData.users} />}
									<p className="text-xs text-center hover:underline font-light mt-3">
										View more..
									</p>
								</div>
							</section>
						)}

						<footer className="flex flex-row gap-6 justify-center mt-4">
							<button
								onClick={() =>
									confirmDialog({
										message:
											"Are you sure you want to proceed?",
										header: "Confirmation",
										icon: "pi pi-exclamation-triangle",
										defaultFocus: "accept",
										accept: () => SaveRoleChanges(editData),
									})
								}
								className="w-fit h-fit bg-green-600 px-4 py-1 text-white rounded-md font-normal"
							>
								Save Changes
							</button>
							<button
								onClick={() => {
									confirmDialog({
										message:
											"Do you want to delete this role?",
										header: "Delete Confirmation",
										icon: "pi pi-info-circle",
										defaultFocus: "reject",
										acceptClassName: "p-button-danger",
										accept: () => DeleteRole(editData.id),
									});
								}}
								className="w-fit h-fit bg-red-500 px-4 py-1 text-white rounded-md font-normal"
							>
								Delete Role
							</button>
						</footer>
					</div>
				)}
			</Dialog>
		</div>
	);
};

export default Roles;
