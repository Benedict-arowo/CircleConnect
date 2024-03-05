import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UseFetch from "../../Components/Fetch";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UserTypeClean } from "../../types";
import { FetchUsers } from "../../Components/Fetch/Users";

type UserType = {
	id: string;
	email: string;
	profile_picture: string;
	first_name: string;
	projects: [];
};

export type CircleData = {
	id: number;
	description: string;
	rating: number;
	members: UserType[];
	lead: UserType | null;
	colead: UserType | null;
	projects: [];
	createdAt: Date;
	_count: {
		members: 0;
		projects: 0;
		requests: 0;
	};
};

export type SelectedItem = {
	id: number;
	description: string;
	rating: number;
	members: UserType[];
	lead: {
		id?: string;
		code?: string;
	};
	colead: {
		id?: string;
		code?: string;
	};
};

export default function CirclesDashboard() {
	const [data, setData] = useState<CircleData[]>([]);
	const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
	const [visible, setVisible] = useState(false);
	const SelectItem = (item: CircleData) => {
		setSelectedItem(item);
		handleOpen();
	};
	const [users, setUsers] = useState<UserTypeClean[]>([]);
	const toast = useRef<Toast | null>(null);
	const [query, setQuery] = useState("");

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

		setData(data.data);
	};

	// Get Cirlce
	useEffect(() => {
		(async () => {
			await fetchCircles();
			await FetchUsers().then((data) => setUsers(data));
		})();
	}, []);

	//Delete circle
	const DeleteCircle = async () => {
		if (!selectedItem) return;
		const { data, response } = await UseFetch({
			url: `circle/${selectedItem.id}`,
			options: {
				method: "DELETE",
				useServerUrl: true,
				returnResponse: true,
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

		// Removes the deleted item from the list of items stored locally
		setData((prevData) =>
			prevData.filter((item) => item.id !== selectedItem.id)
		);
		setSelectedItem(null);
		return toast.current?.show({
			severity: "success",
			summary: "SUCCESS",
			detail: "Successfully deleted circle.",
			life: 3000,
		});
	};

	const CreateCircle = async () => {
		const { data, response } = await UseFetch({
			url: "circle",
			options: {
				method: "POST",
				// TODO: body information needs to be set properly, this setup is just a demo.
				body: {
					name: "New circle",
					circle_num: 4,
					description:
						"Description lorem ipsum dolor sit amet interdum. Cum socis natoque penatibus et magnis dis parturient",
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
			summary: "Circle Created!",
			detail: "Successfully saved changes...",
			life: 3000,
		});
		// Adds the new circle to the list of circles.
		setData((prevData) => [
			...prevData,
			{ ...data.data, members: [], projects: [] },
		]);
	};

	// Update circle
	const editCircle = async () => {
		if (!selectedItem) return;

		const updatedData = {
			id: selectedItem.id,
			description: "New Description",
			rating: selectedItem.rating,
			members: selectedItem.members,
			lead: selectedItem.lead.id,
			colead: selectedItem.colead.id,
			// projects: selectedItem.projects,
		};

		const { data, response } = await UseFetch({
			url: `circle/${selectedItem.id}`,
			options: {
				method: "PATCH",
				body: updatedData,
				useServerUrl: true,
				returnResponse: true,
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
			summary: "Circle Updated!",
			detail: "Successfully saved changes...",
			life: 3000,
		});

		console.log("Circle updated successfully");
		// Update the data state with the updated item
		setData((prevData) =>
			prevData.map((item) =>
				item.id === selectedItem.id ? updatedData : item
			)
		);
	};

	const selectedUserTemplate = (option: { id: string; code: string }) => {
		const currUser = users.find((user) => user.id === option.code);
		return (
			<div className="flex gap-2 items-center">
				<Avatar
					label="P"
					image={currUser?.profile_picture}
					shape="circle"
					size="normal"
				/>
				<p className="font-medium">{option.id}</p>
			</div>
		);
	};

	const userOptionTemplate = (
		option: { id: string; code: string },
		props
	) => {
		if (option) {
			const currUser = users.find((user) => user.id === option.code);
			return (
				<div className="flex gap-2 items-center">
					<Avatar
						label="P"
						image={currUser?.profile_picture}
						shape="circle"
						size="normal"
					/>
					<p className="font-medium">{option.id}</p>
				</div>
			);
		}
		return <span>{props.placeholder}</span>;
	};

	const GetData = () => {
		return data.filter(
			(item) =>
				item.id.toString().includes(query) ||
				item.lead?.first_name
					.toLowerCase()
					.includes(query.toLowerCase()) ||
				item.colead?.first_name
					.toLowerCase()
					.includes(query.toLowerCase()) ||
				item.members.some((member) =>
					member.first_name
						.toLowerCase()
						.includes(query.toLowerCase())
				) ||
				item.projects.some((project) =>
					project.name.toLowerCase().includes(query.toLowerCase())
				)
		);
	};

	const handleOpen = () => {
		setVisible(true);
	};

	return (
		<div className="flex-1 w-full px-6 bg-gray-100">
			<Toast ref={toast} />
			<ConfirmDialog />
			<div className="w-full place-content-center mt-5 flex gap-2">
				<input
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search..."
					className="border-2 lg:w-[500px] w-[400px] px-2 py-2 outline-[#F1C644] font-light"
				></input>
			</div>

			<div className="flex flex-row text-center mt-10 gap-8 w-full justify-between">
				<section className="flex flex-row items-center gap-8">
					<h1 className="text-4xl font-bold">Circles</h1>
					<Button
						colorScheme="yellow"
						color="white"
						className="shadow-sm"
						onClick={CreateCircle}
					>
						Add New
					</Button>
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
				<DataTable
					value={GetData()}
					tableStyle={{ minWidth: "50rem" }}
					showGridlines
					stripedRows
				>
					<Column field="id" header="ID" />
					<Column
						field="rating"
						body={(circleData) => (
							<p className="text-blue-500">
								{circleData.rating}/5
							</p>
						)}
						header="Rating"
					/>
					<Column
						header="Projects"
						body={(circleData) => circleData.projects.length}
					/>
					<Column
						header="Members"
						body={(circleData) => {
							let memberLength = circleData.members.length;

							if (circleData.lead) memberLength += 1;
							if (circleData.colead) memberLength += 1;
							return memberLength;
						}}
					/>
					<Column
						header="Lead"
						body={(circleData) => {
							return (
								<>
									{circleData.lead && (
										<Avatar
											image={
												circleData.lead.profile_picture
											}
											label={
												circleData.lead.first_name[0]
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
					<Column
						body={(circleData) => {
							return (
								<Button
									className=""
									onClick={() => SelectItem(circleData)}
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
								</Button>
							);
						}}
					/>
				</DataTable>
			</div>

			{selectedItem && (
				<Dialog
					header="Editing Circle"
					visible={visible}
					style={{ width: "50vw" }}
					onHide={() => setVisible(false)}
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
										value={selectedItem.id.toString()}
										disabled
										className="w-full p-2"
									/>
								</span>

								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="project_id"
										className="font-bold text-sm text-center"
									>
										RATING:
									</label>
									<InputText
										id="project_rating"
										placeholder="Project Rating"
										value={selectedItem.rating.toString()}
										disabled
										className="w-full p-2"
									/>
								</span>

								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="project_id"
										className="font-bold text-sm text-center"
									>
										Lead:
									</label>
									{/* TODO: Make sure you can't have the same person as lead and colead. */}
									<Dropdown
										value={selectedItem.lead}
										onChange={(e) =>
											setSelectedItem((prev) => {
												return {
													...prev,
													lead: {
														id: e.value.id,
														code: e.value.code,
													},
												};
											})
										}
										options={users.map((user) => ({
											code: user.id,
											id: `${user.first_name} ${
												user.last_name
													? user.last_name
													: ""
											}`,
										}))}
										valueTemplate={userOptionTemplate}
										itemTemplate={selectedUserTemplate}
										optionLabel="id"
										placeholder="Select a User"
										className="w-full md:w-14rem mt-2 border"
									/>
								</span>

								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="project_id"
										className="font-bold text-sm text-center min-w-fit"
									>
										Co-Lead:
									</label>
									<Dropdown
										value={selectedItem.colead}
										onChange={(e) =>
											setSelectedItem((prev) => {
												return {
													...prev,
													colead: {
														id: e.value.id,
														code: e.value.code,
													},
												};
											})
										}
										options={users.map((user) => ({
											code: user.id,
											id: `${user.first_name} ${
												user.last_name
													? user.last_name
													: ""
											}`,
										}))}
										valueTemplate={userOptionTemplate}
										itemTemplate={selectedUserTemplate}
										optionLabel="id"
										placeholder="Select a User"
										className="w-full md:w-14rem mt-2 border"
									/>
								</span>

								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="project_id"
										className="font-bold text-sm text-center"
									>
										Members:
									</label>
									<InputText
										id="project_rating"
										placeholder="Project Rating"
										value={selectedItem.rating.toString()}
										disabled
										className="w-full p-2"
									/>
								</span>

								<span className="flex flex-row gap-2 items-center">
									<label
										htmlFor="project_id"
										className="font-bold text-sm text-center"
									>
										Projects:
									</label>
									<InputText
										id="project_rating"
										placeholder="Project Rating"
										value={selectedItem.rating.toString()}
										disabled
										className="w-full p-2"
									/>
								</span>
							</div>
						</section>
					</div>

					<footer className="flex flex-row gap-6 justify-center mt-4">
						<button
							onClick={() =>
								confirmDialog({
									message:
										"Are you sure you want to proceed?",
									header: "Confirmation",
									icon: "pi pi-exclamation-triangle",
									defaultFocus: "accept",
									accept: editCircle,
								})
							}
							className="w-fit h-fit bg-green-600 px-4 py-1 text-white rounded-md font-normal"
						>
							Edit Circle
						</button>
						<button
							onClick={() =>
								confirmDialog({
									message:
										"Are you sure you want to proceed?",
									header: "Confirmation",
									icon: "pi pi-exclamation-triangle",
									defaultFocus: "accept",
									accept: DeleteCircle,
								})
							}
							className="w-fit h-fit bg-red-500 px-4 py-1 text-white rounded-md font-normal"
						>
							Delete Circle
						</button>
					</footer>
				</Dialog>
			)}
		</div>
	);
}
