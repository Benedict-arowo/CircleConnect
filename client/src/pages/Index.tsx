import { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import CirclesComponent from "../Components/circle_component";
import ListProjects from "../Components/Circle Page/ListProjects";
import { Spinner } from "@chakra-ui/react";
import { CircleType, ProjectsType } from "../Components/types";
import Hero from "../assets/Hero.png";
import UserDisplay from "../Components/UserDisplay";

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

	// const [search, setSearch] = useState("");

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

	// const searchHandler = () => {
	// 	if (!search) return;
	// };

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
		<main className="mb-20 relative">
			<Nav type="light" useBackground={false} className="" />
			<div className="relative px-4 md:px-12 mt-6 mb-16">
				<img className="w-screen h-[350px] object-cover" src={Hero} />
				<div className="absolute inset-0 grid place-content-center overflow-hidden">
					<p className="text-white text-4xl max-w-[85%] md:max-w-[80%] mx-auto font-bold md:text-7xl">
						"Every project is an adventure, Enjoy the ride."
					</p>
				</div>
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

			<section className="flex flex-col gap-10">
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
					<section className="sm:px-4 md:px-16 md:pr-0">
						<a
							className="font-bold text-3xl px-2 sm:px-0 md:text-5xl text-blue-700"
							href="#recent_projects"
							id="recent_projects"
						>
							Recent Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
							<ListProjects
								displayStars={false}
								projects={state.projects}
								showManageMenu={false}
							/>
						</section>
					</section>
				)}

				{!state.loading && state.top_projects.length > 0 && (
					<section className="sm:px-4 md:px-16 md:pr-0">
						<a
							className="font-bold text-3xl px-2 sm:px-0 md:text-5xl text-blue-700"
							href="#featured_projects"
							id="featured_projects"
						>
							Top Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
							<ListProjects
								displayStars={true}
								projects={state.top_projects}
								showManageMenu={false}
							/>
						</section>
					</section>
				)}

				{!state.loading && state.top_circles.length > 0 && (
					<section className="sm:px-4 md:px-16 md:pr-0">
						<a
							className="font-bold text-3xl px-2 sm:px-0 md:text-5xl text-blue-700"
							href="#featured_projects"
							id="featured_projects"
						>
							Top Users
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
							<UserDisplay
								users={[
									{ first_name: "John Doe" },
									{ first_name: "John Doe" },
									{ first_name: "John Doe" },
									{ first_name: "John Doe" },
									{ first_name: "John Doe" },
								]}
							/>
						</section>
					</section>
				)}

				{/* TODO: Use actual top circle data */}
				{!state.loading && state.top_projects.length > 0 && (
					<section className="sm:px-4 md:px-16 md:pr-0">
						<a
							className="font-bold text-3xl px-2 sm:px-0 md:text-5xl text-blue-700"
							href="#featured_projects"
							id="featured_projects"
						>
							Top Circle Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
							<ListProjects
								displayStars={true}
								projects={state.top_projects}
								showManageMenu={false}
							/>
						</section>
					</section>
				)}

				{!state.loading && state.top_circles.length > 0 && (
					<section className="sm:px-4 md:px-16 md:pr-0">
						<a
							className="font-bold text-3xl px-2 sm:px-0 md:text-5xl text-blue-700"
							href="#featured_projects"
							id="featured_projects"
						>
							Top Circles
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
							<CirclesComponent circles={state.top_circles} />
						</section>
					</section>
				)}
			</section>
		</main>
	);
};

export default Index;
