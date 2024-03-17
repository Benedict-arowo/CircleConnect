// import StarRatings from "react-star-ratings";
import { CircleType } from "./types";
import { Avatar } from "primereact/avatar";
import RightArrow from "./Icons/RightArrow";

type Props = {
	circles: CircleType[];
};

const CirclesComponent = (props: Props) => {
	const { circles } = props;
	const Component = () =>
		circles.map((circle) => {
			const { id, description, members, lead, colead } = circle;
			// TODO: Only show 5 members maximum
			const MembersList = [lead, colead, ...members].slice(0, 5);
			const Members = () =>
				MembersList.map((member) => {
					if (member) {
						const profile_picture = member.profile_picture;
						const first_name = member.first_name;
						const last_name = member.last_name;

						return (
							<Avatar
								key={member.id}
								image={profile_picture}
								label={`${first_name[0]}${
									last_name ? last_name[0] : ""
								}`}
								className="text-white bg-blue-900"
								size="normal"
								shape="circle"
								title={`${first_name} ${
									last_name ? last_name : ""
								}`}
							/>
						);
					}
				});

			return (
				<a href={`/circle/${id}`}>
					<div
						key={id}
						className="snap-normal snap-center w-[300px] h-full min-h-[310px] max-h-[313px] rounded-sm border flex-shrink-0 border-gray-300 drop-shadow-sm flex flex-col gap-2 items-center text-center px-4 py-4 hover:border-gray-500 duration-500 transition-all  cursor-pointer bg-[#B9D6F0]"
					>
						<h3 className="font-extrabold py-2 px-3 bg-blue-700 w-fit h-fit rounded-full text-2xl text-white">
							{id < 10 ? `0${id}` : id}
						</h3>
						<div className="font-bold text-neutral-700">
							<p>SOE '24 FALL SESSION</p>
							<span>Frontend SE</span>
						</div>
						<div className="w-full">
							<p className="text-neutral-600 line-clamp-3 mx-auto max-w-[90%]">
								{description}
							</p>
						</div>

						<button className="bg-blue-700 px-6 py-3 rounded-md font-normal text-white flex flex-row gap-2">
							Get Started
							<RightArrow />
						</button>

						<section className="flex flex-row gap-1 justify-center w-full">
							{/* <AvatarGroup className="flex flex-row gap-2 justify-center">
						<Members />
					</AvatarGroup> */}
							{/* <AvatarGroup> */}
							<Members />
							{/* </AvatarGroup> */}
						</section>
					</div>
				</a>
			);
		});

	return <Component />;
};

export default CirclesComponent;
