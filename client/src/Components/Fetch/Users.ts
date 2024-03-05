import UseFetch from "../Fetch";

export const FetchUsers = async () => {
	const { data, response } = await UseFetch({
		url: "user",
		options: {
			method: "GET",
			useServerUrl: true,
			returnResponse: true,
		},
	});

	if (!response.ok)
		throw new Error(
			data ? data.message : "Error trying to communicate with server."
		);

	return data.data;
};
