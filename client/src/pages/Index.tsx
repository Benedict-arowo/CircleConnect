import { useEffect, useState } from "react";

type User = {
	id: string;
	first_name: string;
};

const Index = () => {
	const [user, setUser] = useState<null | User>(null);

	const fetchUser = () => {
		fetch("http://localhost:8000/user", {
			credentials: "include",
			headers: {
				Accept: "application/json",
			},
		})
			.then((response) => {
				console.log(response);
				if (!response.ok) throw new Error(response.statusText);
				return response.json();
			})
			.then((data) => {
				setUser(data);
			})
			.catch((error) => {
				setUser(null);
				console.log(error);
			});
	};

	useEffect(() => {
		fetchUser();
	}, []);

	console.log(user);
	return (
		<div>
			{user && (
				<div>
					<h1>
						Welcome {user.first_name}, your user id is {user.id}
					</h1>
					<a href="http://localhost:8000/logout">Logout</a>
				</div>
			)}
			{!user && (
				<div className="my-2">
					<p>You are currently not logged in.</p>
					<a href="/login">Login here</a>
				</div>
			)}
			<h1 className="text-2xl font-bold w-full text-center">
				Circle Connect
			</h1>
		</div>
	);
};

export default Index;
