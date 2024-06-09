import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
	return (
		<div className="flex h-screen w-full justify-center items-center">
			<ProgressSpinner
				style={{ width: "50px", height: "50px" }}
				strokeWidth="8"
				fill="var(--surface-ground)"
				animationDuration=".5s"
			/>
		</div>
	);
};

export default Loading;
