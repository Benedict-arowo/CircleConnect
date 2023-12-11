import { CircleType } from "../types";

type Props = {
	circle: CircleType;
	removeUser: (circleId: number, userId: string) => Promise<void>;
	setAlertState: React.Dispatch<
		React.SetStateAction<{
			header: string;
			body: string;
			doneFunc: () => void;
			doneText: string;
		}>
	>;
	onOpen: () => void;
};

const ListMembers = ({
	circle,
	removeUser,
	promoteUser,
	demoteUser,
	onOpen,
	setAlertState,
}: Props) => {
	return circle.members.map((member) => {
		console.log(member);
		return (
			<div
				className="flex flex-row justify-between border px-2 py-1 cursor-pointer"
				key={member.id}>
				<h6 className="font-light text-xl">{member.first_name}</h6>

				<div className="flex flex-row items-center gap-2">
					<p
						className="bg-red-500 text-white px-2 py-1"
						onClick={() => {
							setAlertState(() => {
								return {
									body: "Are you sure you want to promote this user? You may not be able to undo this action afterwards.",
									doneText: "Promote user",
									doneFunc: () =>
										promoteUser(circle.id, member.id),
									header: "Promote user",
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
										demoteUser(circle.id, member.id),
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
										removeUser(circle.id, member.id),
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
			</div>
		);
	});
};
export default ListMembers;
