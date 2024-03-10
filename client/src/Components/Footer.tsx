import Github from "./Icons/Github";
import LinkedIn from "./Icons/LinkedIn";
import Logo from "./Icons/Logo";
import X from "./Icons/X";

const Footer = () => {
	return (
		<div className="flex flex-row items-center px-8 pb-4 gap-8 md:px-16 py-8 text-neutral-700 bg-[#9EB3C7]">
			{/* LOGO */}
			<Logo width={80} />
			<section className="w-full">
				<div className="flex flex-row justify-between w-full items-center gap-3">
					<ul className="flex flex-col md:flex-row gap-2 md:gap-10 text-xs md:text-base">
						<li className="cursor-pointer">About</li>
						<li className="cursor-pointer">Top Projects</li>
						<li className="cursor-pointer">Collaborators</li>
					</ul>
					<div className="flex flex-col sm:gap-3 gap-1 sm:flex-row">
						<X size={24} />
						<Github size={28} />
						<LinkedIn size={24} />
					</div>
				</div>
				<div className="w-full bg-neutral-800 h-[1px]"></div>
				<p className="mt-2 font-light">&copy;2024 Learning Circle</p>
			</section>
		</div>
	);
};

export default Footer;
