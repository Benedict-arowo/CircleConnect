import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import banner from "../assets/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg";
import Nav from "../Components/Nav";

type User = {
	id: string;
	first_name: string;
};

const Index = () => {
	const [user, setUser] = useState<null | User>(null);
	const count = useSelector((state) => state.user.count);

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

	return (
		<main className="mb-4">
			<div className="w-full h-[450px] relative">
				<Nav type="light" className="absolute z-20 left-0 right-0" />
				<img
					className="w-full h-full object-cover"
					src={banner}
					alt="Banner"
				/>
				<div className="top-0 left-0 right-0 bottom-0 absolute z-10 bg-opacity-70 bg-black">
					{" "}
				</div>
				<section className="absolute left-8 right-8 bottom-0 mb-28 z-10 flex flex-col items-center text-white">
					<input
						type="text"
						name="q"
						id="q"
						placeholder="google clone"
						className="px-2 py-2 md:w-[700px] w-full mx-auto border outline-none bg-transparent border-white rounded-md font-light"
					/>
					<div className="md:flex flex-row gap-3 hidden">
						<h4 className="font-medium">Popular</h4>
						<div className="font-light underline flex flex-row flex-wrap gap-2">
							<span className="">google clone</span>
							<span className="">slack clone</span>
							<span className="">facebook clone</span>
							<span className="">tiktok clone</span>
						</div>
					</div>
				</section>
			</div>
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
			{count}

			<section className="flex flex-col gap-20">
				<section className="px-16">
					<h3 className="font-light mb-2 text-3xl text-gray-800">
						Recent Projects
					</h3>
					<div className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll pb-1">
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
						<div className="min-w-[500px] h-[400px] bg-black snap-center"></div>
					</div>
				</section>

				<section className="px-16">
					<h3 className="font-light mb-2 text-3xl text-gray-800">
						Featured Projects
					</h3>
					<div className="relative w-full flex gap-6 snap-x overflow-x-auto pb-14 scroll-p-8">
						<div className="snap-normal snap-start min-w-[500px]">
							<img src="https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
						</div>
						<div className="snap-normal snap-center min-w-[500px]">
							<img src="https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
						</div>
						<div className="snap-normal snap-center min-w-[500px]">
							<img src="https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
						</div>
						<div className="snap-normal snap-center min-w-[500px]">
							<img src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
						</div>
						<div className="snap-normal snap-center min-w-[500px]">
							<img src="https://images.unsplash.com/photo-1575424909138-46b05e5919ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
						</div>
						<div className="snap-normal snap-center min-w-[500px]">
							<img src="https://images.unsplash.com/photo-1559333086-b0a56225a93c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80" />
						</div>
					</div>
				</section>

				<section className="px-16">
					<h3 className="font-light mb-2 text-3xl text-gray-800">
						Featured Circles
					</h3>
					<div className="flex flex-row gap-6 overflow-x-scroll snap-mandatory custom-scroll pb-1">
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
						<div className="min-w-[350px] h-[400px] bg-black scroll-snap-align-start"></div>
					</div>
				</section>

				<section className="px-16">
					<h3 className="font-light mb-2 text-3xl text-gray-800">
						Circles
					</h3>
					<div className="flex flex-row gap-6 flex-wrap justify-center">
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
						<div className="min-w-[350px] h-[400px]"></div>
					</div>
				</section>
			</section>
		</main>
	);
};

export default Index;
