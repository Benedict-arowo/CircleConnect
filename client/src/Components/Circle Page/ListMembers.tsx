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
const ListMembers = ({ circle, removeUser, onOpen, setAlertState }: Props) => {
	return circle.members.map((member) => {
		return (
			<div className="flex flex-row justify-between" key={member.id}>
				<h6>{member.first_name}</h6>

				<div>
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
						className="w-6 h-6 cursor-pointer">
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
export default ListMembers;
