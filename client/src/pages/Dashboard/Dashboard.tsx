import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { UseUser } from "../../contexts/UserContext";

const Dashboard = () => {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});
	const [chartTrackData, setTrackChartData] = useState({});
	const [chartTrackOptions, setTrackChartOptions] = useState({});

	useEffect(() => {
		const documentStyle = getComputedStyle(document.documentElement);
		const data = {
			labels: ["ENGINEERING", "PRODUCT", "DATA"],
			datasets: [
				{
					data: [300, 50, 100],
					backgroundColor: [
						documentStyle.getPropertyValue("--blue-600"),
						documentStyle.getPropertyValue("--yellow-500"),
						documentStyle.getPropertyValue("--red-500"),
					],
					hoverBackgroundColor: [
						documentStyle.getPropertyValue("--blue-400"),
						documentStyle.getPropertyValue("--yellow-400"),
						documentStyle.getPropertyValue("--green-400"),
					],
				},
			],
		};
		const options = {
			cutout: "0%",
		};

		setChartData(data);
		setChartOptions(options);

		const track_data = {
			labels: ["Frontend", "Backend", "Cloud"],
			datasets: [
				{
					label: "Tracks",
					data: [540, 325, 702],
					backgroundColor: [
						"rgba(255, 159, 64, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(153, 102, 255, 0.2)",
					],
					borderColor: [
						"rgb(255, 159, 64)",
						"rgb(75, 192, 192)",
						"rgb(54, 162, 235)",
						"rgb(153, 102, 255)",
					],
					borderWidth: 1,
				},
			],
		};
		const track_options = {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		};

		setTrackChartData(track_data);
		setTrackChartOptions(track_options);
	}, []);

	return (
		<div className="flex-1 w-full px-6 bg-gray-100">
			<header className="flex flex-row gap-4 w-full justify-center">
				<section className="bg-blue-600 cursor-pointer hover:scale-105 duration-300 active:bg-blue-800 text-white rounded-sm shadow-lg flex-1 h-[110px] max-w-[280px] p-4 m-4 flex flex-row gap-2 justify-between">
					<div>
						<h4 className="text-xl uppercase font-bold">Users</h4>
						<p className="text-lg">300</p>
					</div>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
						/>
					</svg>
				</section>
				<section className="bg-blue-600 cursor-pointer hover:scale-105 duration-300 active:bg-blue-800 text-white rounded-sm shadow-lg flex-1 h-[110px] max-w-[280px] p-4 m-4 flex flex-row gap-2 justify-between">
					<div>
						<h4 className="text-xl uppercase font-bold">Circles</h4>
						<p className="text-lg">300</p>
					</div>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
						/>
					</svg>
				</section>
				<section className="bg-blue-600 cursor-pointer hover:scale-105 duration-300 active:bg-blue-800 text-white rounded-sm shadow-lg flex-1 h-[110px] max-w-[280px] p-4 m-4 flex flex-row gap-2 justify-between">
					<div>
						<h4 className="text-xl uppercase font-bold">
							Projects
						</h4>
						<p className="text-lg">300</p>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
						/>
					</svg>
				</section>
			</header>

			<section className="flex flex-row gap-4 mt-8">
				<section className="flex-2 w-full">
					<Chart
						type="bar"
						data={chartTrackData}
						options={chartTrackOptions}
					/>
				</section>
				<aside className="w-fit drop-shadow-xl p-4">
					<h3 className="font-bold uppercase text-xl text-center mb-2">
						Schools
					</h3>
					<Chart
						type="doughnut"
						data={chartData}
						options={chartOptions}
						className="w-[300px] md:w-30rem"
					/>
				</aside>
			</section>
		</div>
	);
};

export default Dashboard;
