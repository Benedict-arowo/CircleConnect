import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseFetch from "../Components/Fetch";
import { UserType } from "../types";
import Nav from "../Components/Nav";

const CircleHome = () => {
	const UserState = useSelector((state) => state.user);
	const [user, setUser] = useState<null | UserType>(null);

	useEffect(() => {
		if (!UserState.isLoggedIn) return;

		(async () => {
			const user = await UseFetch({
				url: "user",
				options: { method: "GET", useServerUrl: true },
			});

			setUser(() => user);
		})();
	}, []);

	return (
		<main>
			<Nav />
			{user && user.circles.length === 0 && (
				<div className="p-4">
					<label htmlFor="circle_num"></label>
					<input
						type="number"
						min={0}
						max={200}
						placeholder="Circle Number"
						name="circle_num"
						className="border px-2 py-1"
					/>
					<button className="bg-red-300 text-white px-2 py-1">
						Join
					</button>
				</div>
			)}
		</main>
	);
};

export default CircleHome;
