import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./Auth/userSlice";
// import { increment, decrement } from "./Auth/userSlice";
const Test = () => {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.user);
	console.log(state);
	return (
		<div>
			{/* <p>{state}</p> */}
			<p onClick={() => dispatch(loginUser("123"))}>+</p>
			{/* <p onClick={() => dispatch(decrement())}>-</p> */}
			<a href="/">Home</a>
		</div>
	);
};

export default Test;
