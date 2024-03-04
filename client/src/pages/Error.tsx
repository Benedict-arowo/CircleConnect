import React from "react";
import { useLocation } from "react-router-dom";

const Error = () => {
	const location = useLocation();
	// const Err = location.state.err || undefined;
	console.log(location.state);
	// console.log(Err);
	return (
		<div>
			{location.state && location.state.code}
			Error{" "}
			{location.state
				? location.state.message
				: "Something went wrong..."}
		</div>
	);
};

export default Error;
