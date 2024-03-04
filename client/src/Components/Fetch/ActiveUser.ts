import UseFetch from "../Fetch";

export const GetActiveUser = async () => {
	const { data, response } = await UseFetch({
		url: "activeUser",
		options: {
			method: "GET",
			returnResponse: true,
			useServerUrl: true,
		},
	});

	if (!response.ok)
		throw new Error(
			data ? data.message : "Error trying to communicate with server."
		);

	return data;
};
