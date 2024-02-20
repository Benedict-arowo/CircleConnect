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
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../../config";
import { UserTypeClean } from "../../types";

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

const Roles = () => {
	const [data, setData] = useState<Role[]>([]);

	useEffect(() => {
		fetch(`${SERVER_URL}/role`)
			.then((res) => res.json())
			.then((data) => setData(data.data))
			.catch((err) => console.log(err));
	}, []);

	console.log(data);
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
								<TableCell>Name</TableCell>
								<TableCell>User(s)</TableCell>
								<TableCell>Rating</TableCell>
								<TableCell>Operation</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => {
								return (
									<TableRow key={row.id}>
										<TableCell>{row.name}</TableCell>
										<TableCell>
											{row.users.length}
										</TableCell>
										<TableCell>
											{/* {row.rating} */}
										</TableCell>
										<TableCell>
											<button className=" ml-5">
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

				<div className="flex  justify-evenly mb-5">
					<div>
						<button className="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
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
						<button className="inline-flex items-center px-4 py-2 bg-black transition ease-in-out delay-75 hover:bg-yellow-300 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
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
		</div>
	);
};

export default Roles;
