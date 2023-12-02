import { useState, useEffect } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import { Spinner } from "@chakra-ui/react";
import CirclesComponent from "../Components/circle_component";
import { CircleType } from "../Components/types";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const Circles = () => {
	const [circle, setCircle] = useState<null | CircleType[]>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [err, setErr] = useState(null);
	const [search, setSearch] = useState("");

	const fetchCircle = async () => {
		setIsLoading(() => true);

		const { data, response } = await UseFetch({
			url: `circle?limit=10`,
			options: {
				method: "GET",
				returnResponse: true,
				useServerUrl: true,
				handleError: false,
			},
		});

		// TODO: Better error handling
		if (!response.ok) {
			setErr(() => data.message);
		} else {
			setCircle(() => data.data);
			setErr(() => null);
		}
		setIsLoading(() => false);
	};

	console.log(circle);

	useEffect(() => {
		fetchCircle();
	}, []);

	return (
		<main className="mb-8">
			<Nav className="mb-8" useBackground={false} />
			{isLoading && <Spinner />}
			{err && <div>{err}</div>}
			{!isLoading && err === null && (
				<div>
					<div className="w-full md:w-[700px] border border-gray-800 my-4 flex flex-row gap-0 mx-auto items-center px-2 rounded-sm">
						<input
							type="text"
							name="q"
							id="q"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Google clone"
							className="py-2 w-full mx-auto outline-none bg-transparent font-light"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							// onClick={searchHandler}
							className="w-6 h-6 cursor-pointer">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
							/>
						</svg>
					</div>
					<Tabs isFitted variant="enclosed">
						<TabList mb="1em">
							<Tab _selected={{ color: "red.500" }}>Circles</Tab>
							<Tab _selected={{ color: "red.500" }}>Projects</Tab>
							<Tab _selected={{ color: "red.500" }}>Users</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<section className="px-16 flex flex-col gap-4">
									<h1>
										<a
											className="font-semibold mb-2 text-3xl text-gray-800 "
											href="#circles"
											id="circles">
											Circles
										</a>
									</h1>
									<div className="flex flex-row gap-8 flex-wrap justify-center pt-2">
										{circle && circle.length > 0 && (
											<CirclesComponent
												circles={circle}
											/>
										)}
									</div>
								</section>
							</TabPanel>
							<TabPanel>
								<p>Projects!</p>
							</TabPanel>
							<TabPanel>
								<p>Users!</p>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</div>
			)}
		</main>
	);
};

export default Circles;
