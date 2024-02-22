import { SERVER_URL } from "../../config";

interface FetchParams {
	url: string;
	options: {
		useServerUrl?: boolean;
		method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
		body?: object | undefined;
		returnResponse?: boolean;
		handleError?: boolean;
	};
}

const UseFetch = async ({ url, options }: FetchParams) => {
	try {
		const response = await fetch(
			options.useServerUrl ? `${SERVER_URL}/${url}` : url,
			{
				method: options?.method || "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: options?.body ? JSON.stringify(options.body) : null,
			}
		);

		if (response.status === 204) {
			if (options.returnResponse) return { data: {}, response };
			else return {};
		}
		// If the response is not 204, parse the response body as JSON
		const data = await response.json();

		if (!response.ok && options.handleError) {
			if (data.message) throw new Error(data.message);
			else
				throw new Error(
					"Internal Server Error.... Try contacting an administrator."
				);
		}

		if (options.returnResponse) return { data, response };
		else return data;
	} catch (error) {
		// Handle any errors that occurred during the fetch
		console.error("Fetch error:", error);
		throw error; // Propagate the error to the calling component
	}
};

export default UseFetch;
