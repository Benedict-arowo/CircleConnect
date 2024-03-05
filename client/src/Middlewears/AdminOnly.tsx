import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UseUser } from "../contexts/UserContext";
import Loading from "../Components/Loading";

const AdminOnly = ({ children }) => {
	const Navigate = useNavigate();
	// const User = useSelector((state) => state.user);
	const User = UseUser();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// TODO: Navigate to error page instead.
		if (!User || !User.info.role?.isAdmin)
			Navigate("/error", {
				replace: true,
				state: {
					message: "You do not have permission to access this route.",
					code: 401,
				},
			});
		setIsLoading(false);
	}, [User]);

	return (
		<div>
			{isLoading && <Loading />}
			{!isLoading && children}
		</div>
	);
};

export default AdminOnly;
