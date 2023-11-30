import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import banner from "../assets/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import Circle from "../Components/Circle";
import Project from "../Components/Project";

type User = {
	id: string;
	first_name: string;
};

const Index = () => {
	const [user, setUser] = useState<null | User>(null);
	const [featuredCircle, setFeaturedCircle] = useState([]);
	const [circles, setCircles] = useState([]);
	const [search, setSearch] = useState("");

	const count = useSelector((state) => state.user.count);

	const fetchFeaturedCircles = async () => {
		// TODO: Sort by their rating.
		const { data, response } = await UseFetch({
			url: "circle?limit=10&sortedBy=rating-desc",
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		// TODO: Error handling
		// TODO: Loading Component
		if (!response.ok) {
			console.log(response);
		}

		setFeaturedCircle(() => data.data);
	};

	const fetchCircle = async () => {
		// TODO: Pagination
		const { data, response } = await UseFetch({
			url: "circle?sortedBy=num-asc",
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) {
			console.log(response);
		}

		setCircles(() => data.data);
	};

	const searchHandler = () => {
		if (!search) return;
	};

	useEffect(() => {
		fetchFeaturedCircles();
		fetchCircle();
	}, []);

	return (
		<main className="mb-4 relative">
			<div className="w-full h-[450px] relative mb-24">
				<Nav
					type="light"
					useBackground={false}
					className="absolute z-20 left-0 right-0"
				/>
				<img
					className="w-full h-full object-cover"
					src={banner}
					alt="Banner"
				/>

				<div className="top-0 left-0 right-0 bottom-0 absolute z-10 bg-opacity-70 bg-black">
					{" "}
				</div>
				<section className="absolute left-8 right-8 bottom-0 mb-28 z-10 flex flex-col items-center text-white">
					<div className="md:w-[700px] border border-white flex flex-row gap-0 items-center px-2 rounded-sm">
						<input
							type="text"
							name="q"
							id="q"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="google clone"
							className="py-2 w-full mx-auto outline-none bg-transparent font-light"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							onClick={searchHandler}
							className="w-6 h-6 cursor-pointer">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
							/>
						</svg>
					</div>
					<div className="md:flex flex-row gap-6 hidden">
						<div className="font-light flex flex-row flex-wrap gap-2">
							<span
								className="cursor-pointer hover:underline"
								onClick={() => setSearch("google clone")}>
								google clone
							</span>
							<span
								className="cursor-pointer hover:underline"
								onClick={() => setSearch("slack clone")}>
								slack clone
							</span>
							<span
								className="cursor-pointer hover:underline"
								onClick={() => setSearch("facebook clone")}>
								facebook clone
							</span>
							<span
								className="cursor-pointer hover:underline"
								onClick={() => setSearch("tiktok clone")}>
								tiktok clone
							</span>
						</div>
					</div>
				</section>
			</div>

			<section className="flex flex-col gap-20">
				<section className="px-16">
					<a
						className="font-light mb-2 text-3xl text-gray-800 "
						href="#recent_projects"
						id="recent_projects">
						Recent Projects
					</a>
					<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-2 pb-7 px-8">
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
					</section>
				</section>

				<section className="px-16">
					<a
						className="font-light mb-2 text-3xl text-gray-800"
						href="#featured_projects"
						id="featured_projects">
						Featured Projects
					</a>
					<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-2 pb-7 px-8">
						<Project displayStars={true} />
						<Project displayStars={true} />
						<Project displayStars={true} />
						<Project displayStars={true} />
						<Project displayStars={true} />
						<Project displayStars={true} />
					</section>
				</section>

				<section className="px-16">
					<a
						className="font-light mb-2 text-3xl text-gray-800"
						href="#featured_circles"
						id="featured_circles">
						Featured Circles
					</a>
					<div className="flex flex-row gap-6 overflow-x-auto snap-x snap-proximity custom-scroll pt-2 pb-7 px-8">
						{featuredCircle.length > 0 && (
							<Circle circles={featuredCircle} />
						)}
					</div>
				</section>

				<section className="px-16">
					<a
						href="#circles"
						id="circles"
						className="font-light mb-2 text-3xl text-gray-800">
						Circles
					</a>
					<div className="flex flex-row gap-8 flex-wrap justify-center pt-2">
						<Circle circles={circles} />
					</div>
				</section>
			</section>

			{count}
		</main>
	);
};

export default Index;
