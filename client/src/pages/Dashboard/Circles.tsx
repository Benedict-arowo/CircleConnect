import * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Modal,
	Box,
} from "@mui/material";
import { Button } from "@chakra-ui/react";
import ChildModal from "../../Components/ChildModal";
import { useEffect, useState } from "react";

type UserType = {
	id: string;
	email: string;
	profile_picture: string;
	first_name: string;
	projects: [];
};

type CircleData = {
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

export default function Dashboard() {
	const [data, setData] = useState<CircleData[]>([]);
	const [selectedItem, setSelectedItem] = useState<CircleData | null>(null);
	const [open, setOpen] = React.useState(false);
	const SelectItem = (item: CircleData) => {
		setSelectedItem(item);
		handleOpen();
	};

	// Get Cirlce
	useEffect(() => {
		const Data = async () => {
			try {
				const response = await fetch("http://localhost:8000/circle", {
					method: "GET",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch data");
				}
				const apiData = await response.json();
				console.log(apiData);
				setData(apiData.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		Data();
	}, []);

	//Delete circle
	const DeleteCircle = async () => {
		if (!selectedItem) return;

		try {
			const res = await fetch(
				`http://localhost:8000/circle/${selectedItem.id}`,
				{
					method: "DELETE",
				}
			);

			if (res.ok) {
				console.log("circle deletd successfully");
				setData((prevData) =>
					prevData.filter((item) => item.id !== selectedItem.id)
				);
				setSelectedItem(null);
			} else {
				console.error("Failed to delete item");
			}
		} catch (error) {
			console.error(error);
		}
	};

	//Add cirlce

	const addCircle = async () => {
		try {
			const response = await fetch("http://localhost:8000/circle", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "New circle",
					id: Number,
					description: "Description",
				}),
			});

			if (response.ok) {
				const newCircle = await response.json();
				setData((prevData) => [...prevData, newCircle]);
				console.log("New circle added successfully");
			} else {
				console.error("Failed to add new circle");
			}
		} catch (error) {
			console.error("Error adding new circle:", error);
		}
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

		try {
			const res = await fetch(
				`http://localhost:8000/circle/${selectedItem.id}`,
				{
					method: "PATCH", // or "PATCH" depending on your backend API
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedData), // Send the updated data in the body
				}
			);

			if (res.ok) {
				console.log("Circle updated successfully");
				// Update the data state with the updated item
				setData((prevData) =>
					prevData.map((item) =>
						item.id === selectedItem.id ? updatedData : item
					)
				);
				setSelectedItem(null);
			} else {
				console.error("Failed to update item");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className="flex-1 w-full px-6 bg-gray-100">
			<div className="w-full grid place-content-center mt-5">
				<input
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
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="parent-modal-title"
						aria-describedby="parent-modal-description"
					>
						<Box className="bg-white w-96 absolute right-0 top-40">
							<div className="flex justify-center mt-5 items-center ">
								<button
									onClick={handleClose}
									title="close"
									className="group cursor-pointer outline-none hover:rotate-90 duration-300"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										className="w-6 h-6 fill-slate-100"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M6 18 18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="flex flex-col gap-5 m-10">
								<div className="flex   justify-between">
									<p>ID:</p>
									<p>{selectedItem.id}</p>
								</div>
								<div className="flex   justify-between">
									<p>Member: </p>
									<p>{selectedItem.members.length}</p>
								</div>

								<div className="flex   justify-between">
									<p>Project:</p>
									<p> {selectedItem.projects.length}</p>
								</div>
								<div className="flex   justify-between">
									<p>Rating: </p>
									<p>{selectedItem.rating}</p>
								</div>
							</div>

							<div className="flex  justify-evenly mb-5">
								{
									<ChildModal
										text="Delete"
										onClick={DeleteCircle}
										text2="Delete"
										text3="Are you sure you want to delete this cirlce?"
										textp="This cirlce will be deleted permanently. You can't undo this action."
									/>
								}

								<button
									onClick={editCircle}
									className=" bg-transparent text-blue-700 font-light font-serif"
								>
									{" "}
									EDIT
								</button>
							</div>
						</Box>
					</Modal>
				)}
			</div>
		</div>
	);
}
