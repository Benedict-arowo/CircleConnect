import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import { UseUser } from "../contexts/UserContext";

/**
 * A middleware component that prevents authenticated users from accessing certain routes.
 * If the user is logged in, it will navigate them to the home page.
 * Eg: Navigates to home page if user is logged in. To prevent logged in user from accessing the login page.
 *
 * @param {ReactNode} children - The child components to render if the user is not logged in.
 * @returns {JSX.Element} - The rendered component.
 */

const NoAuth = ({ children }) => {
	const Navigate = useNavigate();
	const User = UseUser();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (User && User.isLoggedIn)
			Navigate("/error", {
				replace: true,
				state: {
					code: 401,
					message: "You do not have permission to access this page.",
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

export default NoAuth;
