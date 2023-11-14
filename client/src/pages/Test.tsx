import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "./Auth/userSlice";
const Test = () => {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.user.count);
	return (
		<div>
			<p>{state}</p>
			<p onClick={() => dispatch(increment())}>+</p>
			<p onClick={() => dispatch(decrement())}>-</p>
			<a href="/">Home</a>
		</div>
	);
};

export default Test;
