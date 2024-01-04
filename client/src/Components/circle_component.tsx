import StarRatings from "react-star-ratings";
import { CircleType } from "./types";
import { Avatar, AvatarGroup } from "@chakra-ui/react";

type Props = {
	circles: CircleType[];
};

const CirclesComponent = (props: Props) => {
	const { circles } = props;
	const Component = () =>
		circles.map((circle) => {
			const { id, description, members, rating, lead, colead } = circle;
			// TODO: Only show 5 members maximum
			const MembersList = [lead, colead, ...members].slice(0, 5);
			const Members = () =>
				MembersList.map((member) => {
					if (member) {
						const profile_picture = member.profile_picture;
						const first_name = member.first_name;

						return (
							<Avatar
								key={member.id}
								name={`${first_name}`}
								src={profile_picture}
							/>
						);
					}
				});

			return (
				<a href={`/circle/${id}`} key={id}>
					<div className="snap-normal snap-center w-[400px] h-[300px] rounded-sm border flex-shrink-0 border-gray-300 shadow-md flex flex-col gap-2 items-center text-center px-4 py-4 hover:border-gray-500 duration-500 transition-all hover:bg-slate-50 cursor-pointer">
						<h3 className="font-bold py-4 px-5 bg-red-500 w-fit h-fit rounded-full text-2xl text-white">
							{id < 10 ? `0${id}` : id}
						</h3>
						<p className="font-light text-gray-600 h-[100px] line-clamp-1">
							{description}
						</p>

						<div className="">
							<StarRatings
								rating={rating}
								starRatedColor="red"
								numberOfStars={5}
								name="rating"
								starDimension="16px"
								starSpacing="15px"
							/>
						</div>

						<section className="flex flex-row gap-2 justify-center w-full mt-4">
							<AvatarGroup className="flex flex-row gap-2 justify-center">
								<Members />
							</AvatarGroup>
						</section>
					</div>
				</a>
			);
		});

	return <Component />;
};

export default CirclesComponent;
