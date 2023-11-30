import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UseFetch from "../Components/Fetch";
import { Spinner } from "@chakra-ui/react";
import Projects from "../Components/Project";
import default_profile_picture from "../assets/Image-32.png";

const Circle = () => {
	const { id } = useParams();
	const [circle, setCircle] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [err, setErr] = useState(null);

	const fetchCircle = async () => {
		setIsLoading(() => true);

		const { data, response } = await UseFetch({
			url: `circle/${id}`,
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
	}, [id]);

	// const Members = () =>

	return (
		<main>
			<Nav className="mb-8 sticky top-0" useBackground={true} />
			{isLoading && <Spinner />}
			{err && <div>{err}</div>}
			{!isLoading && err === null && (
				<div className="px-16 py-8">
					<header>
						<section>
							<h1 className="font-semibold text-3xl text-gray-800">
								Circle #{circle.num}
							</h1>
							<p>{circle.description}</p>
						</section>
						<div className="flex flex-row justify-end gap-3 mt-4">
							<button className="text-green-500 bg-green-500 text-base rounded-sm hover:bg-green-700 hover:text-white bg-transparent border border-green-700 duration-300 px-8 py-1">
								JOIN
							</button>

							<button className="text-gray-800 text-base rounded-sm hover:bg-gray-700 hover:text-white bg-transparent border border-gray-800 duration-300 px-8 py-1">
								REPORT
							</button>
						</div>
					</header>
					<section className="mt-16">
						<a
							className="font-light mb-2 text-3xl text-gray-800"
							href="#members"
							id="members">
							Members
						</a>
						<section className="flex flex-row justify-center gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-2 pb-7 px-8">
							{circle.member.map((circleMember) => {
								const {
									user: { profile_picture },
								} = circleMember;
								console.log(circleMember);
								return (
									<img
										src={
											profile_picture === null
												? default_profile_picture
												: profile_picture
										}
										alt=""
										className="w-[128px] h-[128px] rounded-full"
									/>
								);
							})}
						</section>
					</section>

					<section className="mt-16">
						<a
							className="font-light mb-2 text-3xl text-gray-800"
							href="#pinned_projects"
							id="pinned_projects">
							Pinned Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-2 pb-7 px-8">
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
						</section>
					</section>

					<section className="mt-16">
						<a
							className="font-light mb-2 text-3xl text-gray-800"
							href="#projects"
							id="projects">
							Projects
						</a>
						<section className="flex flex-row gap-8 flex-wrap justify-center pt-2">
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
							<Projects />
						</section>
					</section>
				</div>
			)}
		</main>
	);
};

export default Circle;
