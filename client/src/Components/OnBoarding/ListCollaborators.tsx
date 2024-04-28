import { COLLABORATORS } from "../../../config";
import Github from "../Icons/Github";
import LinkedIn from "../Icons/LinkedIn";
import X from "../Icons/X";

const ListCollaborators = () => {
	return COLLABORATORS.map((collaborator) => (
		<div className="max-w-[300px] min-w-[300px] rounded-md overflow-hidden h-[480px] pb-2 w-full border relative border-gray-500">
			<img
				src={collaborator.image}
				alt=""
				className="h-[250px] w-full object-cover mb-2"
			/>
			<h3 className="text-center font-bold text-xl">
				{collaborator.name}
			</h3>
			<span className="text-center block font-medium text-lg">
				{collaborator.role}
			</span>

			<p className="text-center text-sm ">{collaborator.description}</p>
			<div className="flex flex-row gap-2 mt-2 justify-center absolute bottom-0 left-0 right-0">
				{collaborator.linkedin && (
					<a href={collaborator.linkedin}>
						<LinkedIn className="cursor-pointer w-[20px] h-[20px] lg:w-[32px] lg:h-[32px]" />
					</a>
				)}
				{collaborator.github && (
					<a href={collaborator.github}>
						<Github
							color="#fff"
							className="cursor-pointer w-[24px] h-[24px] lg:w-[40px] lg:h-[40px]"
						/>
					</a>
				)}
				{collaborator.twitter && (
					<a href={collaborator.twitter}>
						<X className="cursor-pointer w-[20px] h-[20px] lg:w-[32px] lg:h-[32px]" />
					</a>
				)}
			</div>
		</div>
	));
};

export default ListCollaborators;
