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
// import { AiOutlineHome } from "react-icons/ai";
// import { TbCircleRectangle } from "react-icons/tb";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { TfiLocationArrow } from "react-icons/tfi";
// import { AiOutlineProject } from "react-icons/ai";
import image from "../assets/Image-32.png";
import { useEffect, useState } from "react";
import DashboardBlackBg from "../Components/dashboard-black-bg";
// import { Link } from "react-router-dom";

// interface createData {
// 	id: number;
// 	members: string;
// 	projects: number;
// 	rating: number;
// 	operation: string;
// }

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

	const SelectItem = (item: CircleData) => {
		setSelectedItem(item);
	};

	const DeleteCircle = async () => {
		if (!selectedItem) return;

		try {
			const res = await fetch(
				`http://localhost:8000/circle/${selectedItem.id}`,
				{
					method: "DELETE",
				},
			);

			if (res.ok) {
				console.log("circle deletd successfully");
				setData((prevData) =>
					prevData.filter((item) => item.id !== selectedItem.id),
				);
				setSelectedItem(null);
			} else {
				console.error("Failed to delete item");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleEdit = () => {
		console.log(selectedItem);
	};

	const handleClose = () => {
		setSelectedItem(null);
	};

	return (
		<div className="flex flex-row bg-gray-100">
			<div className=" w-80">
				<DashboardBlackBg image={image} />
			</div>
			{/* table */}
			<div className="flex-1 w-full px-6">
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
											<TableCell>
												{memberLength}
											</TableCell>
											<TableCell>
												{row._count.projects}
											</TableCell>
											<TableCell>{row.rating}</TableCell>
											<TableCell>
												<button
													className=" ml-5"
													onClick={() =>
														SelectItem(row)
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

					{selectedItem && (
						<div className=" bg-white border-2 w-80 h-auto absolute right-0 bottom-48">
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
								<div>
									<button
										onClick={DeleteCircle}
										className="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
									>
										<svg
											stroke="currentColor"
											viewBox="0 0 24 24"
											fill="none"
											className="h-5 w-5 mr-2"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												stroke-width="2"
												stroke-linejoin="round"
												stroke-linecap="round"
											></path>
										</svg>
										Delete
									</button>
								</div>

								<div>
									<button
										onClick={handleEdit}
										className="inline-flex items-center px-4 py-2 bg-black transition ease-in-out delay-75 hover:bg-yellow-300 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
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
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
											/>
										</svg>
										Edit
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
