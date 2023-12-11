import React from "react";
import StarRatings from "react-star-ratings";
import { CircleMemberType, CircleType } from "../types";

type Projects = {
	name: string;
	description: string;
	circle: CircleType;
	createdAt: Date;
	createdBy: CircleMemberType;
	liveLink: string;
	github: string;
	id: string;
};

type Props = {
	displayStars?: boolean;
	projects: Projects[];
};
const ListProjects = ({ displayStars = false, projects }: Props) =>
	projects.map(({ name, description, id, createdBy }) => {
		return (
			<article
				key={id}
				className="w-[400px] h-fit border flex-shrink-0 border-gray-300 pt-4 pb-2 flex flex-col gap-4 px-4 snap-normal snap-center">
				<h3 className="text-2xl text-center font-semibold cursor-pointer">
					<a href="">{name}</a>
				</h3>
				<p className="text-center font-light cursor-default min-h-[160px]">
					{description}
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
						@{createdBy.first_name}
					</a>
				</footer>
			</article>
		);
	});

export default ListProjects;
