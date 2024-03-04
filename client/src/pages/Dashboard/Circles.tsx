import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UseFetch from "../../Components/Fetch";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";

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

export default function CirclesDashboard() {
	const [data, setData] = useState<CircleData[]>([]);
	const [selectedItem, setSelectedItem] = useState<CircleData | null>(null);
	const [visible, setVisible] = useState(false);
	const SelectItem = (item: CircleData) => {
		setSelectedItem(item);
		handleOpen();
	};

	const toast = useRef<Toast | null>(null);

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
		(async () => await fetchCircles())();
	}, []);

	//Delete circle
	const DeleteCircle = async () => {
		if (!selectedItem) return;

		toast.current?.show({
			severity: "info",
			summary: "Loading...",
			detail: "Deleting circle...",
			life: 3000,
		});

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

		console.log("circle deleted successfully");
		// Removes the deleted item from the list of items stored locally
		setData((prevData) =>
			prevData.filter((item) => item.id !== selectedItem.id)
		);
		setSelectedItem(null);
	};

	const addCircle = async () => {
		const { data, response } = await UseFetch({
			url: "circle",
			options: {
				method: "POST",
				// TODO: body information needs to be set properly, this setup is just a demo.
				body: {
					name: "New circle",
					id: Number,
					description: "Description",
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
		setData((prevData) => [...prevData, data.data]);
	};

	// Update circle
	const editCircle = async () => {
		if (!selectedItem) return;

		const updatedData: CircleData = {
			id: selectedItem.id,
			description: "New Description",
			rating: selectedItem.rating,
			members: selectedItem.members,
			lead: selectedItem.lead,
			colead: selectedItem.colead,
			projects: selectedItem.projects,
			createdAt: selectedItem.createdAt,
			_count: selectedItem._count,
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

	const [query, setQuery] = useState("");

	const handleSearch = () => {
		const searchData: CircleData = {
			id: selectedItem?.id ?? 0, // Use optional chaining and nullish coalescing
			description: selectedItem?.description ?? "",
			rating: selectedItem?.rating ?? 0,
			members: selectedItem?.members ?? [],
			lead: selectedItem?.lead ?? null,
			colead: selectedItem?.colead ?? null,
			projects: selectedItem?.projects ?? [],
			createdAt: selectedItem?.createdAt ?? new Date(),
			_count: selectedItem?._count ?? {
				members: 0,
				projects: 0,
				requests: 0,
			},
		};

		if (!query.trim()) {
			setData(data);
			return;
		}

		const lowerCaseQuery = query.toLowerCase();
		const filtered = data.filter(
			(item) =>
				item.id.toString().includes(lowerCaseQuery) ||
				item.members.toString().toLowerCase().includes(lowerCaseQuery)
		);

		if (filtered.length === 0) {
			setData(data);
			return toast.current?.show({
				severity: "error",
				summary: "Circle not found!",
				detail: "",
				life: 3000,
			});
		} else {
			setData(filtered);
		}
	};

	//

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
				<button onClick={handleSearch} className="border-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</button>
			</div>

			<div className="flex flex-row text-center mt-10 gap-8 w-full justify-between">
				<section className="flex flex-row items-center gap-8">
					<h1 className="text-4xl font-bold">Circles</h1>
					<Button
						colorScheme="yellow"
						color="white"
						className="shadow-sm"
						onClick={addCircle}
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
								<TableCell>ID</TableCell>
								<TableCell>Member(s)</TableCell>
								<TableCell>Project(s)</TableCell>
								<TableCell>Rating</TableCell>
								<TableCell>Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => {
								let memberLength = row._count.members;

								if (row.lead) memberLength += 1;
								if (row.colead) memberLength += 1;

								return (
									<TableRow key={row.id}>
										<TableCell>{row.id}</TableCell>
										<TableCell>{memberLength}</TableCell>
										<TableCell>
											{row._count.projects}
										</TableCell>
										<TableCell>{row.rating}</TableCell>
										<TableCell>
											<Button
												className=" ml-5"
												onClick={() => SelectItem(row)}
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
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>

				{selectedItem && (
					<Dialog
						header="Editing Circle"
						visible={visible}
						style={{ width: "50vw" }}
						onHide={() => setVisible(false)}
					>
						<div className="flex flex-col gap-5 m-10">
							<div className="flex   justify-between">
								<p>ID</p>
								<p>{selectedItem.id}</p>
							</div>
							<div className="flex   justify-between">
								<p>Member </p>
								<p>{selectedItem.members.length}</p>
							</div>

							<div className="flex   justify-between">
								<p>Project</p>
								<p> {selectedItem.projects.length}</p>
							</div>
							<div className="flex   justify-between">
								<p>Rating </p>
								<p>{selectedItem.rating}</p>
							</div>
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
		</div>
	);
}
