import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseFetch from "../Components/Fetch";
import { UserType } from "../types";
import Nav from "../Components/Nav";

const CircleHome = () => {
	const UserState = useSelector((state) => state.user);
	const [circleNum, setCircleNum] = useState<string | number>(0);
	const [user, setUser] = useState<null | UserType>(null);

	useEffect(() => {
		if (!UserState.isLoggedIn) return;

		(async () => {
			const user = await UseFetch({
				url: "user",
				options: { method: "GET", useServerUrl: true },
			});

			console.log(user);
			setUser(() => user);
		})();
	}, []);

	const joinCircle = async () => {
		const response = await UseFetch({
			url: `circle/${circleNum}?addUser=true`,
			options: {
				method: "PATCH",
				useServerUrl: true,
			},
		});

		console.log(response);
	};

	return (
		<main>
			<Nav />
			{user && (
				<div className="p-4 flex flex-row gap-2">
					<label htmlFor="circle_num"></label>
					<input
						type="number"
						min={0}
						max={200}
						placeholder="Circle Number"
						name="circle_num"
						className="border px-2 py-1 w-[250px]"
						value={circleNum}
						onChange={(e) => setCircleNum(() => e.target.value)}
					/>
					<button
						onClick={joinCircle}
						className="bg-red-300 text-white px-2 py-1">
						Join
					</button>
				</div>
			)}
		</main>
	);
};

export default CircleHome;
