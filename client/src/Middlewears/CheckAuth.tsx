import { useEffect, useState } from "react";
import { GetActiveUser } from "../Components/Fetch/ActiveUser";
import { UseSetUser } from "../contexts/UserContext";
import Loading from "../Components/Loading";

import { ReactNode } from "react";

const CheckAuth = ({ children }: { children: ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const setUser = UseSetUser();

	useEffect(() => {
		(async () => {
			await GetActiveUser()
				.then((user) => {
					const userDetails = {
						id: user.id,
						first_name: user.first_name,
						last_name: user.last_name,
						profile_picture: user.profile_picture,
						email: user.email,
						role: user.role,
						circle: user.circle,
					};

					if (user) {
						setUser({
							mode: "LOGIN",
							data: userDetails,
						});
					} else {
						setUser({ mode: "LOGOUT" });
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		})();
	}, []);

	return (
		<div>
			{isLoading && <Loading />}
			{!isLoading && children}
		</div>
	);
};

export default CheckAuth;
