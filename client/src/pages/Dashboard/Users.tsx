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
import { useEffect, useState } from "react";
import UseFetch from "../../Components/Fetch";
import { UserTypeClean } from "../../types";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
// import { Link } from "react-router-dom";

interface createData {
	id: string;
	email: string;
	profile_picture: null;
	first_name: string;
	projects: [
		{
			id: string;
			circleId: number;
			name: string;
		}[]
	];
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
export default function Users() {
	const [data, setData] = useState<createData[]>([]);
	const [editUserDialog, setEditUserDialog] = useState(false);
	const [editUserData, setEditUserData] = useState<createData>({});

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

		console.log(data.data);
		setData(data.data);
	};

	useEffect(() => {
		(async () => fetchUsers())();
	}, []);

	const manageUser = (userId: string) => {
		const user = data.find((user) => user.id === userId);
		if (!user) throw new Error("User not found.");

		setEditUserData(user);
		setEditUserDialog(true);
		console.log(userId);
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
					<h1 className="text-4xl font-bold">Members</h1>
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
							"& tr > *:not(:first-child)": {
								textAlign: "center",
							},
						}}
					>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>School</TableCell>
								<TableCell>Track</TableCell>
								<TableCell>Project(s)</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row) => (
								<TableRow key={row.id}>
									<TableCell className="w-[64px]">
										<Avatar
											label={row.first_name[0]}
											size="normal"
											style={{
												backgroundColor: "#2196F3",
												color: "#ffffff",
											}}
											image={
												row.profile_picture
													? row.profile_picture
													: ""
											}
											imageAlt="Profile picture"
											shape="circle"
										/>
									</TableCell>
									<TableCell>{row.first_name}</TableCell>
									<TableCell>{row.role.name}</TableCell>
									<TableCell className="w-[64px]">
										{row.school}
									</TableCell>
									<TableCell>
										<p className="bg-emerald-500 mx-auto px-3 py-1 rounded-sm text-white w-fit">
											{row.track}
										</p>
									</TableCell>
									<TableCell>{row.projects.length}</TableCell>
									<TableCell>
										<button
											className=" ml-5"
											onClick={() => manageUser(row.id)}
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
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>

			<Dialog
				header="Header"
				visible={editUserDialog}
				style={{ width: "50vw" }}
				onHide={() => setEditUserDialog(false)}
				dismissableMask={true}
				draggable={false}
			>
				{editUserData && (
					<div>
						<InputText value={editUserData.id} disabled />
						<InputText
							placeholder="First Name"
							value={editUserData.first_name}
							disabled
						/>
						<InputText
							placeholder="Role"
							value={editUserData.role && editUserData.role.name}
							disabled
						/>
						<InputText
							placeholder="School"
							value={editUserData.school}
							disabled
						/>
						<InputText
							placeholder="Track"
							value={editUserData.track}
							disabled
						/>
						<InputText
							placeholder="Email"
							value={editUserData.email}
							disabled
						/>
						<InputText
							placeholder="Joined"
							value={editUserData.joined}
							disabled
						/>
						<Calendar value={editUserData.joined} />
						<InputText
							placeholder="Profile Picture"
							value={
								editUserData.profile_picture
									? editUserData.profile_picture
									: ""
							}
							disabled
						/>
					</div>
				)}
			</Dialog>
		</div>
	);
}
