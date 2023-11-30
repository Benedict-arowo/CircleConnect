import StarRatings from "react-star-ratings";

type Props = {
	displayStars?: boolean;
};

const Projects = (props: Props) => {
	const { displayStars } = props;
	const Component = () => {
		return (
			<div className="w-[430px] h-fit border flex-shrink-0 border-gray-300 pt-4 pb-2 flex flex-col gap-4 px-4 snap-normal snap-center">
				<h3 className="text-2xl text-center font-semibold cursor-pointer">
					<a href="">Google clone</a>
				</h3>
				<p className="text-center font-light cursor-default">
					Lorem ipsum dolor, sit amet consectetur adipisicing elit.
					Nostrum explicabo quis in delectus perspiciatis velit
					consectetur expedita nihil neque! In, vero inventore?
					Mollitia temporibus aperiam adipisci quidem, nihil doloribus
					dicta doloremque optio fuga animi sed suscipit aliquam. Vel,
					non sunt.
				</p>
				<div className="flex flex-row flex-wrap w-full gap-2 justify-center">
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						HTML
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						CSS
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						SCSS
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						JAVASCRIPT
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						REACTJS
					</span>
					<span className="bg-red-500 text-white px-2 py-1 text-sm font-light cursor-pointer rounded-sm">
						TAILWIND
					</span>
				</div>

				{displayStars && (
					<div className="mx-auto">
						<StarRatings
							rating={3.75}
							starRatedColor="red"
							numberOfStars={5}
							name="rating"
							starDimension="16px"
							starSpacing="15px"
						/>
					</div>
				)}

				<footer className="flex flex-row justify-between">
					<span className="font-light text-sm text-gray-500 cursor-default">
						Created 10 days ago.
					</span>
					<a href="" className="text-red-500 hover:underline">
						@username
					</a>
				</footer>
			</div>
		);
	};
	return <Component />;
};

export default Projects;
