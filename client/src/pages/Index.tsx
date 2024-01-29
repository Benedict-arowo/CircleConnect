import { useEffect, useState } from "react";
import banner from "../assets/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import CirclesComponent from "../Components/circle_component";
import ListProjects from "../Components/Circle Page/ListProjects";
import { Spinner } from "@chakra-ui/react";
import { CircleType, ProjectsType } from "../Components/types";

type StateType = {
	projects: ProjectsType[];
	top_projects: ProjectsType[];
	top_circles: CircleType[];
	top_circles_err: undefined | string;
	top_projects_err: undefined | string;
	projects_err: undefined | string;
	loading: boolean;
};

const Index = () => {
	const [state, setState] = useState<StateType>({
		projects: [],
		top_projects: [],
		top_circles: [],
		top_circles_err: undefined,
		top_projects_err: undefined,
		projects_err: undefined,
		loading: true,
	});

	const [search, setSearch] = useState("");

	const fetchTopCircles = async ({ limit = 5 }) => {
		const { data, response } = await UseFetch({
			url: `circle?limit=${limit}&sortedBy=rating-desc`,
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) {
			setState((prevState) => {
				return {
					...prevState,
					top_circles_err: "Error trying to fetch top circles.",
				};
			});
		}

		setState((prevState) => {
			return {
				...prevState,
				top_circles: data.data,
			};
		});
	};

	const fetchProjects = async ({ limit = 5 }) => {
		const { data, response } = await UseFetch({
			url: `project?limit=${limit}`,
			options: {
				useServerUrl: true,
				returnResponse: true,
				method: "GET",
			},
		});

		if (!response.ok)
			setState((prevState) => {
				return {
					...prevState,
					projects_err: "Error trying to fetch projects.",
				};
			});

		setState((prevState) => {
			return {
				...prevState,
				projects: data.data,
			};
		});
	};

	const fetchTopProjects = async ({ limit = 5 }) => {
		const { data, response } = await UseFetch({
			url: `project?limit=${limit}&sortedBy=rating-asc`,
			options: {
				useServerUrl: true,
				returnResponse: true,
				method: "GET",
			},
		});

		if (!response.ok)
			setState((prevState) => {
				return {
					...prevState,
					top_projects_err: "Error trying to fetch top projects.",
				};
			});

		setState((prevState) => {
			return {
				...prevState,
				top_projects: data.data,
			};
		});
	};

	const searchHandler = () => {
		if (!search) return;
	};

	useEffect(() => {
		// State is initialized to loading by default, and once it makes all the fetch requests, it sents the loading state to false.
		fetchTopCircles({ limit: 5 })
			.then(() => {
				fetchProjects({ limit: 5 });
			})
			.then(() => {
				fetchTopProjects({ limit: 5 });
			})
			.finally(() =>
				setState((prevState) => {
					return {
						...prevState,
						loading: false,
					};
				})
			);
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
				{/* HERO SECTION */}
				<section className="absolute left-8 right-8 bottom-0 mb-28 z-10 flex flex-col items-center text-white">
					<div className="w-full md:w-[700px] border border-white flex flex-row gap-0 items-center px-2 rounded-md">
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
					<div className="flex flex-row gap-6">
						<div className="font-light flex flex-row flex-wrap justify-center gap-2">
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

			{state.top_circles_err && (
				<div className="bg-red-500 text-white rounded-sm w-fit mx-auto px-2 py-1">
					{state.top_circles_err}
				</div>
			)}
			{state.top_projects_err && (
				<div className="bg-red-500 text-white rounded-sm w-fit mx-auto px-2 py-1">
					{state.top_projects_err}
				</div>
			)}
			{state.projects_err && (
				<div className="bg-red-500 text-white rounded-sm w-fit mx-auto px-2 py-1">
					{state.projects_err}
				</div>
			)}
			<section className="flex flex-col gap-20">
				{/* <section className="px-16 hidden">
					<a
						className="font-light mb-2 text-3xl text-gray-800 "
						href="#search_results"
						id="search_results">
						Search Results
					</a>

					<div className="px-4 flex flex-col gap-3 my-4">
						<h3 className="font-light text-3xl text-gray-700">
							Projects
						</h3>
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
					</div>
					<div className="px-4 flex flex-col gap-3 my-4">
						<h3 className="font-light text-3xl text-gray-700">
							Users
						</h3>
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
					</div>
					<div className="px-4 flex flex-col gap-3 my-4">
						<h3 className="font-light text-3xl text-gray-700">
							Circles
						</h3>
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
					</div>
				</section> */}

				{state.loading && (
					<div className="mx-auto">
						<Spinner
							thickness="4px"
							speed="0.65s"
							emptyColor="gray.200"
							color="blue.500"
							size="xl"
						/>
					</div>
				)}

				{!state.loading && state.projects.length > 0 && (
					<section className="pl-4 md:pl-16">
						<a
							className="font-light mb-2 text-3xl text-gray-800"
							href="#recent_projects"
							id="recent_projects">
							Recent Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-4 pb-7 px-8">
							<ListProjects
								displayStars={false}
								projects={state.projects}
								showManageMenu={false}
							/>
						</section>
					</section>
				)}

				{!state.loading && state.top_projects.length > 0 && (
					<section className="pl-4 md:pl-16">
						<a
							className="font-light mb-2 text-3xl text-gray-800"
							href="#featured_projects"
							id="featured_projects">
							Top Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-4 pb-7 px-8">
							<ListProjects
								displayStars={true}
								projects={state.top_projects}
								showManageMenu={false}
							/>
						</section>
					</section>
				)}

				{!state.loading && state.top_circles.length > 0 && (
					<section className="px-4 md:px-16">
						<a
							className="font-light mb-2 text-3xl text-gray-800"
							href="#circles"
							id="circles">
							Top Circles
						</a>
						<div className="flex flex-row gap-8 flex-wrap justify-center pt-4">
							<CirclesComponent circles={state.top_circles} />
						</div>
					</section>
				)}
			</section>
		</main>
	);
};

export default Index;
