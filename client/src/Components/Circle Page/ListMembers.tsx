import { makeReq } from "../../pages/Circle";
import { CircleType } from "../types";

type Props = {
	circle: CircleType;
	User: {};
	// removeUser: (circleId: number, userId: string) => Promise<void>;
	setAlertState: React.Dispatch<
		React.SetStateAction<{
			header: string;
			body: string;
			doneFunc: () => void;
			doneText: string;
		}>
	>;
	onOpen: () => void;
	// promoteUser: (circleId: number, memberId: string) => Promise<void>;
	// demoteUser: (circleId: number, memberId: string) => Promise<void>;
	makeReq: ({
		url,
		method,
		body,
		loadingMsg,
		successMsg,
		successFunc,
	}: makeReq) => Promise<void>;
	fetchCircle: () => void;
};

const ListMembers = ({
	circle,
	// removeUser,
	// promoteUser,
	// demoteUser,
	User,
	onOpen,
	setAlertState,
	fetchCircle,
	makeReq,
}: Props) => {
	return circle.members.map((member) => {
		console.log(member);
		return (
			<div
				className="flex flex-row justify-between border px-2 py-1 cursor-pointer"
				key={member.id}>
				<h6 className="font-light text-xl">{member.first_name}</h6>

				{circle.lead.id === User.info.id && (
					<div className="flex flex-row items-center gap-2">
						<p
							className="bg-red-500 text-white px-2 py-1"
							onClick={() => {
								setAlertState(() => {
									return {
										body: "Are you sure you want to promote this user? You can't undo this action afterwards.",
										doneText: "Promote User",
										header: "Promote User",
										doneFunc: () =>
											makeReq({
												url: `circle/${circle.id}`,
												body: {
													manageUser: {
														action: "PROMOTE",
														userId: member.id,
													},
												},
												method: "PATCH",
												loadingMsg: "Promoting user.",
												successMsg:
													"Successfully promoted user.",
												successFunc: fetchCircle,
											}),
									};
								});
								onOpen();
							}}>
							Promote
						</p>
						<p
							className="bg-red-500 text-white px-2 py-1"
							onClick={() => {
								setAlertState(() => {
									return {
										body: "Are you sure you want to demote this user?",
										doneText: "Demote user",
										doneFunc: () =>
											// () =>
											// 	demoteUser(circle.id, member.id),
											makeReq({
												url: `circle/${circle.id}`,
												method: "PATCH",
												body: {
													manageUser: {
														action: "DEMOTE",
														userId: member.id,
													},
												},
												loadingMsg: "Demoting user...",
												successMsg:
													"Successfully demoted user.",
												successFunc: fetchCircle,
											}),
										header: "Demote user",
									};
								});
								onOpen();
							}}>
							Demote
						</p>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							onClick={() => {
								setAlertState(() => {
									return {
										body: "Are you sure you want to remove this user? You can't undo this action afterwards.",
										doneText: "Remove user",
										doneFunc: () =>
											makeReq({
												url: `circle/${circle.id}`,
												method: "PATCH",
												body: {
													removeUser: {
														userId: member.id,
													},
												},
												loadingMsg: "Removing user...",
												successMsg:
													"Successfully removed user from circle.",
												successFunc: () =>
													fetchCircle(),
											}),
										header: "Remove user",
									};
								});
								onOpen();
							}}
							className="w-4 h-4 hover:text-red-500 duration-300 transition-all">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
				)}
			</div>
		);
	});
};
export default ListMembers;
