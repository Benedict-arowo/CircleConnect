import { makeReq } from "../../pages/Circle";
import { CircleType } from "../types";

type Props = {
	circle: CircleType;
	// acceptRequest: (circleId: number, userId: string) => Promise<void>;
	// declineRequest: (circleId: number, userId: string) => Promise<void>;
	fetchCircle: () => Promise<void>;
	makeReq: ({
		url,
		method,
		body,
		loadingMsg,
		successMsg,
		successFunc,
	}: makeReq) => Promise<void>;
};

const ListRequests = ({
	circle,
	// acceptRequest,
	// declineRequest,
	makeReq,
	fetchCircle,
}: Props) => {
	return circle.requests.map((member) => {
		return (
			<div className="flex justify-between gap-2" key={member.id}>
				<h6>{member.first_name}</h6>
				<div className="flex flex-row gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						onClick={() =>
							makeReq({
								url: `circle/${circle.id}`,
								method: "PATCH",
								body: {
									request: {
										type: "ACCEPT",
										userId: member.id,
									},
								},
								loadingMsg: "Accepting join request...",
								successMsg:
									"Successfully accepted user's join request.",
								successFunc: fetchCircle,
							})
						}
						className="w-6 h-6 cursor-pointer"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						onClick={() =>
							makeReq({
								url: `circle/${circle.id}`,
								method: "PATCH",
								body: {
									request: {
										type: "DECLINE",
										userId: member.id,
									},
								},
								loadingMsg: "Declining join request...",
								successMsg:
									"Successfully declined user's join request.",
								successFunc: fetchCircle,
							})
						}
						className="w-6 h-6 cursor-pointer"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
			</div>
		);
	});
};
export default ListRequests;
