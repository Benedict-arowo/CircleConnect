import Github from "../Components/Icons/Github";
import LinkedIn from "../Components/Icons/LinkedIn";
import RightArrow from "../Components/Icons/RightArrow";
import X from "../Components/Icons/X";
import Nav from "../Components/Nav";
import banner from "../assets/circle picture 1.png";
import TalentQL from "../assets/TalentQL.png";
import AltSchool from "../assets/AltSchool.png";
import ListProjects from "../Components/Circle Page/ListProjects";
import { useEffect, useState } from "react";
import UseFetch from "../Components/Fetch";
import ListCollaborators from "../Components/OnBoarding/ListCollaborators";
import Logo from "../Components/Icons/Logo";

const Onboarding = () => {
	const [topProjects, setTopProjects] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const { data, response } = await UseFetch({
				url: `project?limit=5`,
				options: {
					useServerUrl: true,
					returnResponse: true,
					method: "GET",
				},
			});

			if (!response.ok) {
				setIsLoading(false);
				throw new Error("Error fetching projects...");
			}

			setTopProjects(data.data);
			setIsLoading(false);
		})();
	}, []);

	return (
		<div className="w-full min-h-screen">
			{/* <Nav type="light" useBackground={false} className="" /> */}
			<nav className=" px-8 flex-1 sm:flex hidden justify-between items-center mt-4 mb-8">
				<Logo />

				<ul className="flex flex-row gap-6 font-light">
					<li className="cursor-pointer text-lg">
						<a
							href="#about"
							className="text-neutral-700 text-lg font-normal"
						>
							About
						</a>
					</li>
					<li className="cursor-pointer text-lg">
						<a
							href="#top_projects"
							className="text-neutral-700 text-lg font-normal"
						>
							Top Project
						</a>
					</li>
					<li className="cursor-pointer text-lg">
						<a
							href="#collaborators"
							className="text-neutral-700 text-lg font-normal"
						>
							Collaborators
						</a>
					</li>
				</ul>

				<button className="bg-blue-700 px-4 py-2 rounded-md text-white">
					<a className="flex flex-row gap-2" href="/">
						Get Started <RightArrow />
					</a>
				</button>
			</nav>

			<main className="px-0 xs:px-8 md:px-16 mt-2 mb-16">
				<section className="w-full relative">
					<div className="relative z-0 h-fit lg:h-[575px]">
						<img
							className="w-full h-full  object-cover aspect-auto"
							src={banner}
							alt="Hero Background"
						/>
						<div className="bg-black opacity-30 w-full inset-0 h-full absolute"></div>
						<div className="absolute inset-0 p-6 text-white sm:px-12 sm:pt-12 lg:px-20 lg:pt-24">
							<h1 className="text-base xs:text-2xl md:text-5xl lg:text-6xl font-extrabold max-w-[100%] xs:max-w-[95%] lg:max-w-[80%]">
								Show Off Learning Circle programs and Personal
								Projects.
							</h1>
							<div className="flex flex-row justify-between xs:block">
								<button className="bg-blue-700 xs:px-5 xs:py-2 flex flex-row gap-2 text-xs xs:text-sm md:text-base rounded-md mt-4 lg:mt-8 items-center px-2">
									<a
										className="flex flex-row gap-2"
										href="#top_projects"
									>
										View Top Project <RightArrow />
									</a>
								</button>

								<div className="flex flex-row gap-3 mt-5 lg:mt-6">
									<LinkedIn
										// size={22}
										className="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]"
									/>
									<Github
										color="#fff"
										// size={26}
										className="w-[24px] h-[24px] lg:w-[40px] lg:h-[40px]"
									/>
									<X
										// size={20}
										className="w-[24px] h-[24px] lg:w-[32px] lg:h-[32px]"
									/>
								</div>
							</div>
						</div>
						<div className="w-full flex justify-center absolute -bottom-11 sm:-bottom-14">
							<div className="bg-white px-16 py-4 rounded-2xl text-3xl flex flex-row gap-8 items-center shadow">
								<img
									src={AltSchool}
									className="object-cover h-fit sm:w-[130px] aspect-auto w-[64px]"
									alt=""
								/>
								<img
									src={TalentQL}
									className="object-cover h-fit sm:w-[130px] aspect-auto w-[64px]"
									alt=""
								/>
							</div>
						</div>
					</div>
				</section>

				<section className="mt-32">
					<a
						className="font-bold text-4xl px-2 sm:px-0 md:text-5xl text-blue-700"
						href="#about"
						id="about"
					>
						About
					</a>
					<div className="text-neutral-800 text-sm md:text-base mt-2">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Sapiente cum possimus ex velit iusto eligendi
							optio in voluptate praesentium laboriosam facere
							deleniti molestiae repudiandae, dicta neque ducimus
							corrupti omnis quaerat perspiciatis nisi labore.
						</p>
						<p>
							Officiis sequi ex accusantium excepturi minus
							mollitia possimus numquam quae atque culpa aperiam
							recusandae, laboriosam aliquid iusto. Dicta ipsam
							ipsa iure expedita cupiditate alias aliquid soluta
							quia non hic facere molestias eaque eligendi
							blanditiis impedit repudiandae repellendus dolore
							odit distinctio, suscipit optio temporibus quasi
							accusamus? Nobis, architecto minima ipsam vitae
							accusamus nam corporis veniam voluptatibus quasi
							adipisci doloribus assumenda dolorem eum ut
							perspiciatis consequuntur expedita ullam consequatur
							reprehenderit dolorum fugit! Dicta incidunt
							molestias dolorum mollitia omnis numquam, eaque
							possimus ut, expedita consequuntur at veniam
							deserunt labore odit, vero deleniti temporibus
							dignissimos. A, tempora officia dignissimos odit
							aperiam magni totam aliquam illo molestias est!
							Reprehenderit veritatis rem commodi sapiente, quas
							exercitationem beatae ipsa velit provident quam
							quibusdam dignissimos corrupti inventore libero
							saepe temporibus repellendus optio eos labore et
							quisquam adipisci.
						</p>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Sapiente cum possimus ex velit iusto eligendi
							optio in voluptate praesentium laboriosam facere
							deleniti molestiae repudiandae, dicta neque ducimus
							corrupti omnis quaerat perspiciatis nisi labore.
						</p>
					</div>
				</section>

				{!isLoading && topProjects.length != 0 && (
					<section className="mt-12 md:pr-0">
						<a
							className="font-bold text-4xl px-2 sm:px-0 md:text-5xl text-blue-700"
							href="#top_projects"
							id="top_projects"
						>
							Top Projects
						</a>
						<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
							<ListProjects projects={topProjects} />
						</section>
					</section>
				)}

				<section className="mt-12 md:pr-0">
					<a
						className="font-bold text-4xl px-2 sm:px-0 md:text-5xl text-blue-700"
						href="#collaborators"
						id="collaborators"
					>
						Collaborators
					</a>
					<section className="flex flex-row gap-6 overflow-x-scroll snap-x snap-proximity custom-scroll h-fit pt-6 pb-7 px-4">
						<ListCollaborators />
					</section>
				</section>
			</main>
		</div>
	);
};

export default Onboarding;
