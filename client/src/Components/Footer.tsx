import Github from "./Icons/Github";
import LinkedIn from "./Icons/LinkedIn";
import Logo from "./Icons/Logo";
import X from "./Icons/X";

const Footer = () => {
	return (
		<div className="flex flex-row px-8 pb-4 gap-8 md:px-16 py-8 text-neutral-700 bg-[#9EB3C7]">
			{/* LOGO */}
			<Logo />
			<section className="w-full">
				<div className="flex flex-row justify-between w-full items-center">
					<ul className="flex flex-row gap-10">
						<li className="cursor-pointer">About</li>
						<li className="cursor-pointer">Top Projects</li>
						<li className="cursor-pointer">Collaborators</li>
					</ul>
					<div className="flex flex-row gap-3">
						<X />
						<Github />
						<LinkedIn />
					</div>
				</div>
				<div className="w-full bg-neutral-800 h-[1px]"></div>
				<p className="mt-2 font-light">&copy;2024 Learning Circle</p>
			</section>
		</div>
	);
};

export default Footer;
