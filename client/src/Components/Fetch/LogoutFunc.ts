import UseFetch from "../Fetch";

export const LogoutFunc = async () => {
	const { response, data } = await UseFetch({
		url: "activeUser",
		options: {
			method: "POST",
			returnResponse: true,
			useServerUrl: true,
		},
	});

	if (!response.ok)
		throw new Error(
			data ? data.message : "Error trying to communicate with server."
		);

	return 0;
};
