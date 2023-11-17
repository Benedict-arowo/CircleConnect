import Star from "./Star";
import userImage from "../assets/Image-32.png";

type Props = {
	circles: circle[];
};

type circle = {
	id: string;
	description: string;
	num: number;
	member: Member[];
	projects: [];
	createdAt: Date;
};

type Member = {
	id: string;
	role: "LEAD" | "MEMBER" | "COLEAD";
	user: {
		email: string;
		id: string;
		profile_picture: string;
		first_name: string;
	};
};

const Circle = (props: Props) => {
	const { circles } = props;
	const Component = () =>
		circles.map((circle) => {
			const { id, num, description, member: members } = circle;
			// TODO: Only show 5 members maximum
			const Members = () =>
				members.map((member) => {
					const profile_picture = member.user.profile_picture;
					const first_name = member.user.first_name;

					return (
						<div key={member.id} className="cursor-pointer">
							<img
								title={`${first_name}`}
								src={
									profile_picture
										? profile_picture
										: userImage
								}
								alt={`${first_name}'s profile picture`}
								className="w-[32px] h-[32px] object-cover rounded-full"
							/>
						</div>
					);
				});

			return (
				<div
					key={id}
					className="snap-normal snap-center w-[400px] h-[300px] rounded-sm border flex-shrink-0 border-gray-300 shadow-md flex flex-col gap-2 items-center text-center px-4 py-4 hover:scale-105 duration-500 transition-all hover:bg-slate-50 cursor-pointer">
					<h3 className="font-bold py-4 px-5 bg-red-500 w-fit h-fit rounded-full text-2xl text-white">
						{num < 10 ? `0${num}` : num}
					</h3>
					<p className="font-light text-gray-600 h-[100px]">
						{description}
					</p>

					<div className="flex flex-row gap-2">
						<Star />
						<Star />
						<Star />
						<Star />
						<Star />
					</div>

					<section className="flex flex-row gap-2 justify-center w-full mt-4">
						<Members />
					</section>
				</div>
			);
		});

	return <Component />;
};

export default Circle;
