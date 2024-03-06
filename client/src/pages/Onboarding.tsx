import React from "react";

import banner from "../assets/banner.png";
import logo from "../assets/Logo.png";
import heroImg from "../assets/Login Illustration 2.png";

const Onboarding = () => {
	return (
		<div className="bg-gradient-to-bl from-orange-50 to-cyan-50 h-screen w-full">
			<header className="w-full h-[1000px] relative overflow-hidden">
				<div className="h-[inherit] relative z-0 rounded-[80px] overflow-hidden">
					<img
						className="h-full w-full aspect-square object-cover"
						src={banner}
						alt="Hero Background"
					/>
					<div className="bg-black opacity-10 w-full inset-0 h-full absolute"></div>
				</div>
				<div className="absolute inset-0 px-8 py-6">
					<div className="flex flex-row justify-between items-center pr-10 pl-2 py-3">
						<img
							src={logo}
							alt=""
							className="w-[250px] cursor-pointer"
						/>
						<section>
							<ul className="flex flex-row gap-12">
								<li className="cursor-pointer text-xl">
									About
								</li>
								<li className="cursor-pointer text-xl">
									Top Projects
								</li>
								<li className="cursor-pointer text-xl">
									Collaborators
								</li>
							</ul>
						</section>
						<button className="flex flex-row gap-2 bg-blue-700 text-white px-4 py-2 rounded-md text-lg items-center">
							Get Started
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
								/>
							</svg>
						</button>
					</div>
					<div className="w-full px-12 flex flex-row items-center justify-between">
						<h1 className="text-blue-700 font-bold text-7xl max-w-[900px]">
							Show Off Learning Circle programs and Personal
							Projects
						</h1>
						<img src={heroImg} alt="" />
					</div>
				</div>
			</header>
		</div>
	);
};

export default Onboarding;
