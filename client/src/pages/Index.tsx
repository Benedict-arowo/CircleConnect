import { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import CirclesComponent from "../Components/circle_component";
import ListProjects from "../Components/Circle Page/ListProjects";
import { Spinner } from "@chakra-ui/react";
import { CircleType, ProjectsType } from "../Components/types";
import Hero from "../assets/Hero.png";

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
		<main className="mb-4 relative ">
			<Nav type="light" useBackground={false} className="" />
			<div className="relative px-12 mt-6 mb-16">
				<img className="w-screen h-[350px] object-cover" src={Hero} />
				<div className="absolute inset-0 grid place-content-center overflow-hidden">
					<p className="text-white text-5xl max-w-[85%] md:max-w-[80%] mx-auto font-bold md:text-7xl">
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
					<section className="pl-4 md:pl-16">
						<a
							className="font-bold text-5xl text-blue-700"
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
					<section className="pl-4 md:pl-16">
						<a
							className="font-bold text-5xl text-blue-700"
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
					<section className="px-4 md:px-16">
						<a
							className="font-bold text-5xl text-blue-700"
							href="#featured_projects"
							id="featured_projects"
						>
							Top Users
						</a>
						<div className="flex flex-row gap-8 flex-wrap justify-center pt-6">
							<div className="w-[230px] h-fit px-2 pt-4 pb-1 bg-[#B9D6F0] border border-blue-400 rounded-sm shadow-md">
								<img
									src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
									className="w-[128px] h-[128px] object-cover rounded-full mx-auto"
								/>
								<h3 className="font-bold text-center text-3xl text-blue-700">
									John Doe
								</h3>
								<p className="text-neutral-800 font-light text-center">
									SOE (Fall Session "24)
								</p>
								<p className="text-neutral-800 font-light text-center">
									Frontend SE Circle 31
								</p>
								<button className="px-6 py-2 mx-auto bg-blue-700 text-white rounded-md mt-1 flex flex-row gap-2 justify-center">
									View Profile
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-6 h-6"
									>
										<path
											fillRule="evenodd"
											d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
								<div className="flex flex-row gap-2 justify-center mt-2">
									<svg
										width="38"
										height="38"
										viewBox="0 0 38 38"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g
											clip-path="url(#clip0_86_247)"
											filter="url(#filter0_d_86_247)"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M18.9553 0C10.6854 0 4 6.875 4 15.3803C4 22.1791 8.28357 27.9341 14.226 29.9709C14.969 30.1241 15.2411 29.64 15.2411 29.2328C15.2411 28.8762 15.2166 27.6541 15.2166 26.3806C11.0564 27.2975 10.1901 24.5472 10.1901 24.5472C9.52153 22.7647 8.53092 22.3066 8.53092 22.3066C7.16929 21.3644 8.6301 21.3644 8.6301 21.3644C10.1405 21.4662 10.9331 22.9431 10.9331 22.9431C12.2699 25.2856 14.4241 24.6237 15.2907 24.2162C15.4144 23.2231 15.8108 22.5356 16.2317 22.1537C12.9137 21.7972 9.42265 20.4731 9.42265 14.5653C9.42265 12.8847 10.0165 11.5097 10.9576 10.4403C10.8091 10.0584 10.289 8.47937 11.1063 6.36594C11.1063 6.36594 12.3691 5.95844 15.2163 7.94469C16.4353 7.60802 17.6925 7.43675 18.9553 7.43531C20.2181 7.43531 21.5053 7.61375 22.694 7.94469C25.5415 5.95844 26.8043 6.36594 26.8043 6.36594C27.6216 8.47937 27.1012 10.0584 26.9528 10.4403C27.9186 11.5097 28.488 12.8847 28.488 14.5653C28.488 20.4731 24.9969 21.7716 21.6541 22.1537C22.199 22.6375 22.6692 23.5541 22.6692 25.0056C22.6692 27.0681 22.6447 28.7234 22.6447 29.2325C22.6447 29.64 22.9171 30.1241 23.6598 29.9712C29.6022 27.9337 33.8858 22.1791 33.8858 15.3803C33.9103 6.875 27.2004 0 18.9553 0Z"
												fill="#24292F"
											/>
										</g>
										<defs>
											<filter
												id="filter0_d_86_247"
												x="0"
												y="0"
												width="38"
												height="38"
												filterUnits="userSpaceOnUse"
												color-interpolation-filters="sRGB"
											>
												<feFlood
													flood-opacity="0"
													result="BackgroundImageFix"
												/>
												<feColorMatrix
													in="SourceAlpha"
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
													result="hardAlpha"
												/>
												<feOffset dy="4" />
												<feGaussianBlur stdDeviation="2" />
												<feComposite
													in2="hardAlpha"
													operator="out"
												/>
												<feColorMatrix
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
												/>
												<feBlend
													mode="normal"
													in2="BackgroundImageFix"
													result="effect1_dropShadow_86_247"
												/>
												<feBlend
													mode="normal"
													in="SourceGraphic"
													in2="effect1_dropShadow_86_247"
													result="shape"
												/>
											</filter>
											<clipPath id="clip0_86_247">
												<rect
													width="30"
													height="30"
													fill="white"
													transform="translate(4)"
												/>
											</clipPath>
										</defs>
									</svg>
									<svg
										width="30"
										height="30"
										viewBox="0 0 30 30"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g clip-path="url(#clip0_86_249)">
											<path
												d="M22.9688 0H7.03125C3.148 0 0 3.148 0 7.03125V22.9688C0 26.852 3.148 30 7.03125 30H22.9688C26.852 30 30 26.852 30 22.9688V7.03125C30 3.148 26.852 0 22.9688 0Z"
												fill="white"
											/>
											<path
												d="M22.9688 0H7.03125C3.148 0 0 3.148 0 7.03125V22.9688C0 26.852 3.148 30 7.03125 30H22.9688C26.852 30 30 26.852 30 22.9688V7.03125C30 3.148 26.852 0 22.9688 0Z"
												fill="#0A66C2"
											/>
											<path
												d="M21.6463 25.51H25.0764C25.2007 25.51 25.3199 25.4606 25.4078 25.3727C25.4957 25.2848 25.5451 25.1656 25.5451 25.0413L25.5469 17.7942C25.5469 14.0064 24.7307 11.0948 20.3041 11.0948C18.6214 11.0323 17.0346 11.8997 16.1783 13.3481C16.1741 13.3552 16.1678 13.3606 16.1602 13.3637C16.1526 13.3668 16.1442 13.3673 16.1363 13.3651C16.1284 13.363 16.1214 13.3583 16.1164 13.3519C16.1114 13.3454 16.1087 13.3374 16.1086 13.3293V11.9133C16.1086 11.789 16.0592 11.6697 15.9713 11.5818C15.8834 11.4939 15.7642 11.4445 15.6398 11.4445H12.3847C12.2604 11.4445 12.1412 11.4939 12.0533 11.5818C11.9654 11.6697 11.916 11.789 11.916 11.9133V25.0406C11.916 25.1649 11.9654 25.2842 12.0533 25.3721C12.1412 25.46 12.2604 25.5094 12.3847 25.5094H15.8146C15.9389 25.5094 16.0581 25.46 16.146 25.3721C16.2339 25.2842 16.2833 25.1649 16.2833 25.0406V18.5516C16.2833 16.7168 16.6314 14.9399 18.9061 14.9399C21.1485 14.9399 21.1775 17.0394 21.1775 18.6704V25.0412C21.1775 25.1655 21.2269 25.2848 21.3148 25.3727C21.4027 25.4606 21.522 25.51 21.6463 25.51ZM4.45312 6.98766C4.45312 8.37797 5.5977 9.52195 6.98813 9.52195C8.3782 9.52184 9.52207 8.37715 9.52207 6.98707C9.52184 5.59699 8.37785 4.45312 6.98766 4.45312C5.59711 4.45312 4.45312 5.59734 4.45312 6.98766ZM5.26863 25.51H8.70305C8.82737 25.51 8.9466 25.4606 9.0345 25.3727C9.12241 25.2848 9.1718 25.1655 9.1718 25.0412V11.9133C9.1718 11.789 9.12241 11.6697 9.0345 11.5818C8.9466 11.4939 8.82737 11.4445 8.70305 11.4445H5.26863C5.14431 11.4445 5.02508 11.4939 4.93718 11.5818C4.84927 11.6697 4.79988 11.789 4.79988 11.9133V25.0412C4.79988 25.1655 4.84927 25.2848 4.93718 25.3727C5.02508 25.4606 5.14431 25.51 5.26863 25.51Z"
												fill="white"
											/>
										</g>
										<defs>
											<clipPath id="clip0_86_249">
												<rect
													width="30"
													height="30"
													fill="white"
												/>
											</clipPath>
										</defs>
									</svg>
									<svg
										width="30"
										height="30"
										viewBox="0 0 30 30"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											width="30"
											height="30"
											rx="8"
											fill="#2E2E2E"
										/>
										<path
											d="M17.26 13.0863L26.1 2.5H24.005L16.3275 11.6912L10.1975 2.5H3.125L12.3975 16.4L3.125 27.5H5.22L13.3275 17.7937L19.8025 27.5H26.875L17.26 13.0863ZM14.39 16.5212L13.45 15.1375L5.975 4.125H9.19375L15.2262 13.0125L16.165 14.3962L24.0063 25.9488H20.7887L14.39 16.5212Z"
											fill="white"
										/>
									</svg>
								</div>
								{/* Twitter, Github, Linkedin Icons... */}
							</div>
						</div>
					</section>
				)}

				{/* TODO: Use actual top circle data */}
				{!state.loading && state.top_projects.length > 0 && (
					<section className="pl-4 md:pl-16">
						<a
							className="font-bold text-5xl text-blue-700"
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
					<section className="px-4 md:px-16">
						<a
							className="font-light mb-4 text-5xl text-gray-800"
							href="#circles"
							id="circles"
						>
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
