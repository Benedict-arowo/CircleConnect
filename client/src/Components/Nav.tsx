import {
	Avatar,
	Button,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	useDisclosure,
} from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
import UseFetch from "./Fetch";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../slices/userSlice";
import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { NotificationType } from "../types";
import { format } from "timeago.js";
import { UseSocketContext } from "../contexts/SocketContext";
import Notify from "./Notify";
import { Socket } from "socket.io-client";
import { UseSetUser, UseUser } from "../contexts/UserContext";
import { LogoutFunc } from "./Fetch/LogoutFunc";

type Props = {
	className?: string;
	type?: "dark" | "light";
	useBackground?: boolean;
};

const activeStyles = {
	color: "#E53E3E",
	fontWeight: "normal",
	textDecoration: "underline",
};

type Notification = {
	read: NotificationType[];
	unread: NotificationType[];
};

const Nav = (props: Props) => {
	const dispatch = useDispatch();
	const socket: Socket = UseSocketContext();
	const setUser = UseSetUser();
	const { className, type = "dark", useBackground = true } = props;
	// const user = useSelector((state) => state.user);
	const user = UseUser();
	// const { io, connected: socketConnected } = useSelector((state) => state.io);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [notifications, setNotifications] = useState<Notification>({
		unread: [],
		read: [],
	});
	const btnRef = useRef();

	const fetchNotifications = async () => {
		const { data, response } = await UseFetch({
			url: `notification`,
			options: {
				method: "GET",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok)
			throw new Error("Error trying to fetch notifications");
		setNotifications(() => {
			// Filters the notification by the read status.
			return {
				read: data.data.filter(
					(notification: NotificationType) => notification.is_read
				),
				unread: data.data.filter(
					(notification: NotificationType) => !notification.is_read
				),
			};
		});
	};

	useEffect(() => {
		socket.on("notification", (notification) => {
			setNotifications((prev) => ({
				unread: [notification, ...prev.unread],
				read: prev.read,
			}));
			Notify(notification.content);
		});
	}, [socket]);

	useEffect(() => {
		fetchNotifications();
	}, []);

	const updateNotification = async (id: string, status: boolean) => {
		const { data, response } = await UseFetch({
			url: `notification/${id}/${status ? "markAsUnread" : "markAsRead"}`,
			options: {
				method: "PATCH",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) console.log(response);
		fetchNotifications();
	};

	const markAllAsRead = async () => {
		const { data, response } = await UseFetch({
			url: `notification/markAll`,
			options: {
				method: "PATCH",
				useServerUrl: true,
				returnResponse: true,
			},
		});

		if (!response.ok) console.log(response);
		fetchNotifications();
	};

	const DisplayNotifications = () => {
		// Puts all notifications into an array, and sorts them by their timestamp
		const allNotifications = [
			...notifications.unread,
			...notifications.read,
		].sort((a, b) => {
			if (a.createdAt < b.createdAt) return 1;
			else if (a.createdAt > b.createdAt) return -1;
			else return 0;
		});

		return allNotifications.map((notification) => {
			const { id, content, is_read, url, user, createdAt } = notification;
			return (
				<div
					key={id}
					className={`px-2 py-3 flex flex-row gap-3 items-center border-b border-b-slate-200 border-1 hover:bg-slate-100 duration-300 cursor-pointer bg-white ${
						!is_read ? "bg-red-50" : ""
					}`}
				>
					<Avatar
						name={`${user.info.first_name}`}
						src={user.info.profile_picture}
						width="32px"
						height="32px"
						className="cursor-pointer"
						colorScheme="teal"
					/>
					<div className="flex flex-col gap-0">
						<a href={url} className="font-light">
							{content}
						</a>
						<div className="flex flex-row justify-between font-light text-xs text-gray-400">
							<p className=" ">{format(createdAt)}</p>
							<button
								className="hover:underline"
								onClick={() => updateNotification(id, is_read)}
							>
								{is_read ? "Unread" : "Mark as read"}
							</button>
						</div>
					</div>
				</div>
			);
		});
	};

	return (
		<>
			<header
				className={`flex flex-row justify-between py-4 pr-4 md:px-8 items-center ${className} ${
					useBackground && "nav_background"
				}`}
			>
				<div className="flex-1 sm:flex hidden justify-between items-center">
					{/* <Logo type={type} /> */}
					{/* <img src={Logo} className="w-[140px] object-cover" /> */}
					<svg
						width="200"
						height="90"
						viewBox="0 0 202 115"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M38 36.2398C38 33.6007 38.5893 31.2434 39.768 29.168C40.9722 27.067 42.5992 25.4399 44.649 24.2869C46.7245 23.1083 49.0433 22.519 51.6055 22.519C54.6034 22.519 57.2297 23.2876 59.4845 24.825C61.7392 26.3623 63.315 28.489 64.2118 31.205H58.024C57.409 29.9239 56.5379 28.963 55.4105 28.3225C54.3087 27.6819 53.0276 27.3616 51.5671 27.3616C50.0041 27.3616 48.6077 27.7331 47.3778 28.4762C46.1736 29.1936 45.2255 30.2185 44.5337 31.5509C43.8676 32.8833 43.5345 34.4462 43.5345 36.2398C43.5345 38.0078 43.8676 39.5707 44.5337 40.9287C45.2255 42.2611 46.1736 43.2988 47.3778 44.0419C48.6077 44.7593 50.0041 45.118 51.5671 45.118C53.0276 45.118 54.3087 44.7977 55.4105 44.1572C56.5379 43.491 57.409 42.5173 58.024 41.2362H64.2118C63.315 43.9778 61.7392 46.1173 59.4845 47.6546C57.2553 49.1664 54.629 49.9222 51.6055 49.9222C49.0433 49.9222 46.7245 49.3457 44.649 48.1927C42.5992 47.0141 40.9722 45.387 39.768 43.3116C38.5893 41.2362 38 38.8789 38 36.2398Z"
							fill="#393939"
						/>
						<path
							d="M71.5364 25.8627C70.5884 25.8627 69.7941 25.568 69.1535 24.9787C68.5386 24.3638 68.2311 23.6079 68.2311 22.7111C68.2311 21.8143 68.5386 21.0713 69.1535 20.482C69.7941 19.867 70.5884 19.5596 71.5364 19.5596C72.4845 19.5596 73.266 19.867 73.8809 20.482C74.5215 21.0713 74.8417 21.8143 74.8417 22.7111C74.8417 23.6079 74.5215 24.3638 73.8809 24.9787C73.266 25.568 72.4845 25.8627 71.5364 25.8627ZM74.1884 28.3993V49.6916H68.8076V28.3993H74.1884Z"
							fill="#393939"
						/>
						<path
							d="M84.8853 31.7046C85.5771 30.5772 86.4739 29.6933 87.5756 29.0527C88.703 28.4121 89.9841 28.0919 91.419 28.0919V33.7416H89.9969C88.3059 33.7416 87.0247 34.1388 86.1536 34.9331C85.308 35.7274 84.8853 37.111 84.8853 39.0839V49.6916H79.5045V28.3993H84.8853V31.7046Z"
							fill="#393939"
						/>
						<path
							d="M93.6596 39.0455C93.6596 36.8419 94.108 34.9203 95.0047 33.2804C95.9015 31.615 97.1442 30.3338 98.7328 29.437C100.321 28.5146 102.141 28.0534 104.19 28.0534C106.83 28.0534 109.007 28.7196 110.724 30.052C112.466 31.3587 113.632 33.2035 114.222 35.5864H108.418C108.111 34.664 107.585 33.9466 106.842 33.4342C106.125 32.8961 105.228 32.627 104.152 32.627C102.615 32.627 101.398 33.1907 100.501 34.3181C99.604 35.4199 99.1556 36.9957 99.1556 39.0455C99.1556 41.0697 99.604 42.6454 100.501 43.7728C101.398 44.8746 102.615 45.4255 104.152 45.4255C106.33 45.4255 107.752 44.4518 108.418 42.5045H114.222C113.632 44.8105 112.466 46.6425 110.724 48.0005C108.982 49.3585 106.804 50.0375 104.19 50.0375C102.141 50.0375 100.321 49.5891 98.7328 48.6923C97.1442 47.7699 95.9015 46.4888 95.0047 44.849C94.108 43.1835 93.6596 41.249 93.6596 39.0455Z"
							fill="#393939"
						/>
						<path
							d="M123.544 21.2507V49.6916H118.163V21.2507H123.544Z"
							fill="#393939"
						/>
						<path
							d="M148.654 38.5843C148.654 39.3529 148.602 40.0448 148.5 40.6597H132.934C133.062 42.197 133.601 43.4013 134.549 44.2725C135.497 45.1436 136.662 45.5792 138.046 45.5792C140.045 45.5792 141.467 44.7209 142.312 43.0042H148.116C147.501 45.054 146.322 46.745 144.58 48.0774C142.837 49.3842 140.698 50.0375 138.161 50.0375C136.112 50.0375 134.267 49.5891 132.627 48.6923C131.013 47.7699 129.744 46.476 128.822 44.8105C127.925 43.1451 127.477 41.2234 127.477 39.0455C127.477 36.8419 127.925 34.9074 128.822 33.242C129.719 31.5765 130.974 30.2954 132.588 29.3986C134.203 28.5018 136.06 28.0534 138.161 28.0534C140.186 28.0534 141.992 28.489 143.58 29.3602C145.195 30.2313 146.437 31.474 147.309 33.0882C148.205 34.6768 148.654 36.5088 148.654 38.5843ZM143.081 37.0469C143.055 35.6633 142.556 34.5615 141.582 33.7416C140.608 32.8961 139.417 32.4733 138.008 32.4733C136.675 32.4733 135.548 32.8833 134.625 33.7032C133.729 34.4975 133.178 35.6121 132.973 37.0469H143.081Z"
							fill="#393939"
						/>
						<path
							d="M38 74.6736C38 72.0344 38.5893 69.6772 39.768 67.6017C40.9722 65.5007 42.5992 63.8737 44.649 62.7207C46.7245 61.542 49.0433 60.9527 51.6055 60.9527C54.6034 60.9527 57.2297 61.7214 59.4845 63.2587C61.7392 64.7961 63.315 66.9227 64.2118 69.6387H58.024C57.409 68.3576 56.5379 67.3968 55.4105 66.7562C54.3087 66.1156 53.0276 65.7954 51.5671 65.7954C50.0041 65.7954 48.6077 66.1669 47.3778 66.9099C46.1736 67.6274 45.2255 68.6523 44.5337 69.9846C43.8676 71.317 43.5345 72.88 43.5345 74.6736C43.5345 76.4415 43.8676 78.0045 44.5337 79.3625C45.2255 80.6948 46.1736 81.7325 47.3778 82.4756C48.6077 83.193 50.0041 83.5517 51.5671 83.5517C53.0276 83.5517 54.3087 83.2315 55.4105 82.5909C56.5379 81.9247 57.409 80.9511 58.024 79.6699H64.2118C63.315 82.4115 61.7392 84.551 59.4845 86.0884C57.2553 87.6001 54.629 88.356 51.6055 88.356C49.0433 88.356 46.7245 87.7795 44.649 86.6264C42.5992 85.4478 40.9722 83.8208 39.768 81.7454C38.5893 79.6699 38 77.3127 38 74.6736Z"
							fill="#393939"
						/>
						<path
							d="M78.2623 88.4713C76.2125 88.4713 74.3677 88.0229 72.7279 87.1261C71.088 86.2037 69.7941 84.9097 68.8461 83.2443C67.9237 81.5788 67.4625 79.6571 67.4625 77.4792C67.4625 75.3013 67.9365 73.3796 68.8845 71.7142C69.8582 70.0487 71.1777 68.7676 72.8432 67.8708C74.5086 66.9484 76.3663 66.4872 78.4161 66.4872C80.4659 66.4872 82.3235 66.9484 83.989 67.8708C85.6544 68.7676 86.9612 70.0487 87.9092 71.7142C88.8829 73.3796 89.3697 75.3013 89.3697 77.4792C89.3697 79.6571 88.8701 81.5788 87.8708 83.2443C86.8971 84.9097 85.5648 86.2037 83.8737 87.1261C82.2082 88.0229 80.3378 88.4713 78.2623 88.4713ZM78.2623 83.7824C79.236 83.7824 80.1456 83.5517 80.9911 83.0905C81.8623 82.6037 82.5541 81.8863 83.0666 80.9383C83.579 79.9902 83.8352 78.8372 83.8352 77.4792C83.8352 75.455 83.2972 73.9049 82.221 72.8287C81.1705 71.727 79.8766 71.1761 78.3392 71.1761C76.8019 71.1761 75.5079 71.727 74.4574 72.8287C73.4325 73.9049 72.9201 75.455 72.9201 77.4792C72.9201 79.5034 73.4197 81.0664 74.419 82.1681C75.4439 83.2443 76.725 83.7824 78.2623 83.7824Z"
							fill="#393939"
						/>
						<path
							d="M105.116 66.5256C107.652 66.5256 109.702 67.3327 111.265 68.9469C112.828 70.5355 113.61 72.7647 113.61 75.6344V88.1254H108.229V76.3646C108.229 74.6735 107.806 73.3796 106.961 72.4828C106.115 71.5604 104.962 71.0992 103.502 71.0992C102.015 71.0992 100.837 71.5604 99.9657 72.4828C99.1202 73.3796 98.6974 74.6735 98.6974 76.3646V88.1254H93.3167V66.8331H98.6974V69.485C99.4148 68.5626 100.324 67.8452 101.426 67.3327C102.554 66.7946 103.783 66.5256 105.116 66.5256Z"
							fill="#393939"
						/>
						<path
							d="M130.526 66.5256C133.062 66.5256 135.112 67.3327 136.675 68.9469C138.238 70.5355 139.019 72.7647 139.019 75.6344V88.1254H133.639V76.3646C133.639 74.6735 133.216 73.3796 132.37 72.4828C131.525 71.5604 130.372 71.0992 128.911 71.0992C127.425 71.0992 126.247 71.5604 125.375 72.4828C124.53 73.3796 124.107 74.6735 124.107 76.3646V88.1254H118.726V66.8331H124.107V69.485C124.825 68.5626 125.734 67.8452 126.836 67.3327C127.963 66.7946 129.193 66.5256 130.526 66.5256Z"
							fill="#393939"
						/>
						<path
							d="M163.93 77.018C163.93 77.7867 163.878 78.4785 163.776 79.0934H148.21C148.338 80.6308 148.876 81.835 149.824 82.7062C150.772 83.5774 151.938 84.013 153.322 84.013C155.32 84.013 156.743 83.1546 157.588 81.4379H163.392C162.777 83.4877 161.598 85.1788 159.856 86.5111C158.113 87.8179 155.974 88.4713 153.437 88.4713C151.387 88.4713 149.543 88.0229 147.903 87.1261C146.289 86.2037 145.02 84.9097 144.098 83.2443C143.201 81.5788 142.753 79.6571 142.753 77.4792C142.753 75.2757 143.201 73.3412 144.098 71.6757C144.995 70.0103 146.25 68.7291 147.864 67.8323C149.479 66.9356 151.336 66.4872 153.437 66.4872C155.461 66.4872 157.268 66.9227 158.856 67.7939C160.471 68.6651 161.713 69.9078 162.584 71.522C163.481 73.1106 163.93 74.9426 163.93 77.018ZM158.357 75.4807C158.331 74.097 157.831 72.9953 156.858 72.1754C155.884 71.3298 154.693 70.907 153.284 70.907C151.951 70.907 150.824 71.317 149.901 72.1369C149.005 72.9312 148.454 74.0458 148.249 75.4807H158.357Z"
							fill="#393939"
						/>
						<path
							d="M166.473 77.4792C166.473 75.2757 166.922 73.354 167.819 71.7142C168.715 70.0487 169.958 68.7676 171.547 67.8708C173.135 66.9484 174.955 66.4872 177.004 66.4872C179.643 66.4872 181.821 67.1533 183.538 68.4857C185.28 69.7925 186.446 71.6373 187.036 74.0202H181.232C180.925 73.0978 180.399 72.3803 179.656 71.8679C178.939 71.3298 178.042 71.0608 176.966 71.0608C175.429 71.0608 174.211 71.6245 173.315 72.7519C172.418 73.8536 171.97 75.4294 171.97 77.4792C171.97 79.5034 172.418 81.0792 173.315 82.2066C174.211 83.3083 175.429 83.8592 176.966 83.8592C179.144 83.8592 180.566 82.8856 181.232 80.9383H187.036C186.446 83.2443 185.28 85.0763 183.538 86.4343C181.796 87.7923 179.618 88.4713 177.004 88.4713C174.955 88.4713 173.135 88.0229 171.547 87.1261C169.958 86.2037 168.715 84.9225 167.819 83.2827C166.922 81.6172 166.473 79.6828 166.473 77.4792Z"
							fill="#393939"
						/>
						<path
							d="M197.242 71.253V81.5532C197.242 82.2706 197.409 82.7959 197.742 83.129C198.1 83.4364 198.69 83.5902 199.51 83.5902H202.008V88.1254H198.626C194.091 88.1254 191.823 85.9218 191.823 81.5148V71.253H189.286V66.8331H191.823V61.5676H197.242V66.8331H202.008V71.253H197.242Z"
							fill="#393939"
						/>
						<path
							d="M17.0374 78.2544C24.1458 78.0003 27.0291 72.2438 27.3229 69.1011C27.475 67.4751 27.3986 66.6027 27.3906 65.9091C27.4507 63.5668 26.2337 62.5313 24.5415 62.4378C23.8643 62.4003 19.8942 62.5252 15.9568 62.5179C13.945 62.5406 12.5403 62.5393 11.3751 62.5734C9.78911 62.594 8.18515 62.398 7.18267 63.476C6.23967 64.4406 6.40457 65.9738 6.42426 67.7081C6.44684 69.703 6.9898 71.6908 7.87273 73.0685C10.4336 77.1153 14.0015 78.2021 17.0374 78.2544ZM17.0374 78.2544L17.1201 85.5381"
							stroke="#0367F2"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<path
							d="M16.5474 34.8463C9.43635 35.0998 6.59432 40.867 6.30069 44.0108C6.14874 45.6374 6.22528 46.5101 6.23316 47.2041C6.17324 49.5472 7.39108 50.5831 9.08386 50.6769C9.32737 50.6905 9.99683 50.6829 10.9373 50.6683M16.5474 34.8463C19.5845 34.8987 23.1956 35.9953 25.7578 40.0441C26.6411 41.4222 27.1846 43.4107 27.2074 45.4066C27.2274 47.1414 27.3924 48.6751 26.4491 49.64C25.4463 50.7184 24.1511 50.5206 22.5646 50.5411M16.5474 34.8463L16.464 27.5597M10.9373 50.6683C12.6129 50.642 15.1491 50.5926 17.6717 50.5976C19.6844 50.5752 21.399 50.575 22.5646 50.5411M10.9373 50.6683L11.0023 55.1572M22.5646 50.5411L22.5616 55.0151"
							stroke="#0367F2"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
						<circle
							cx="17.7645"
							cy="14.4956"
							r="10.2505"
							transform="rotate(-45.6505 17.7645 14.4956)"
							fill="#0367F2"
						/>
						<circle
							cx="17.286"
							cy="100.035"
							r="10.2505"
							transform="rotate(-45.6505 17.286 100.035)"
							fill="#0367F2"
						/>
					</svg>

					<ul
						className={`flex flex-row gap-6 font-light ${
							type === "dark" ? "text-black" : "text-white"
						}`}
					>
						<li className="cursor-pointer text-lg">
							<NavLink
								to="/project"
								style={({ isActive }) => {
									return isActive ? activeStyles : {};
								}}
								className="text-neutral-700 text-lg font-normal"
							>
								Projects
							</NavLink>
						</li>
						<li className="cursor-pointer text-lg">
							<NavLink
								to="/discover"
								style={({ isActive }) => {
									return isActive ? activeStyles : {};
								}}
								className="text-neutral-700 text-lg font-normal"
							>
								Circle
							</NavLink>
						</li>
						<li className="cursor-pointer text-lg">
							<NavLink
								to="/profile"
								style={({ isActive }) => {
									return isActive ? activeStyles : {};
								}}
								className="text-neutral-700 text-lg font-normal"
							>
								My profile
							</NavLink>
						</li>
					</ul>

					<div>
						{user.isLoggedIn && (
							<section
								className={`flex flex-row gap-4 items-center text-black`}
							>
								{/* <div>
									<Popover>
										<PopoverTrigger>
											<Button
												variant="unstyled"
												className="relative"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.25}
													stroke="currentColor"
													className={`w-6 h-6 cursor-pointer duration-300 active:text-red-300
													${type === "dark" ? "text-black" : "text-white"}`}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
													/>
												</svg>
												{notifications.unread.length >
													0 && (
													<div className="bg-red-500 rounded-full text-xs py-1 px-1 absolute bottom-3 right-4"></div>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="mx-2">
											<PopoverArrow />
											<PopoverCloseButton />
											<PopoverHeader>
												<div className="flex flex-col gap-0 items-center">
													<h4 className="font-light text-base text-center">
														Notifications (
														<span className="text-red-500">
															{notifications
																.unread.length +
																notifications
																	.read
																	.length}
														</span>
														)
													</h4>
													<button
														onClick={markAllAsRead}
														className="font-light self-end text-xs text-gray-500"
													>
														Mark all as read
													</button>
												</div>
											</PopoverHeader>
											<PopoverBody>
												<div className="flex flex-col max-h-[350px] overflow-y-auto">
													{notifications.unread
														.length === 0 &&
														notifications.read
															.length === 0 && (
															<p>
																You currently
																have no
																notifications!
															</p>
														)}
													{(notifications.read
														.length > 0 ||
														notifications.unread
															.length > 0) && (
														<DisplayNotifications />
													)}
												</div>
											</PopoverBody>
										</PopoverContent>
									</Popover>
								</div>

								<a>
									<Avatar
										name={`${user.info.first_name}`}
										src={user.info.profile_picture}
										width="32px"
										height="32px"
										className="cursor-pointer"
										onClick={onOpen}
										colorScheme="teal"
										ref={btnRef}
									/>
								</a> */}
								<button>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-16 h-16 text-blue-800 drop-shadow-md"
									>
										<path
											fillRule="evenodd"
											d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</section>
						)}
						{!user.isLoggedIn && (
							<Link to={"/login"}>
								<button className="px-4 py-2 border border-blue-800 text-blue-700 rounded-md font-medium">
									Login
								</button>
							</Link>
						)}
					</div>

					<Drawer
						isOpen={isOpen}
						placement="right"
						onClose={onClose}
						finalFocusRef={btnRef}
					>
						<DrawerOverlay />
						<DrawerContent>
							<DrawerCloseButton />
							<DrawerHeader className="flex flex-row gap-2">
								<Avatar
									name={`${user.info.first_name}`}
									src={user.info.profile_picture}
									width="32px"
									height="32px"
									className="cursor-pointer outline outline-slate-600 outline-1"
									onClick={onOpen}
									colorScheme="red"
									ref={btnRef}
								/>
								<div className="flex flex-col gap-0">
									<h4 className="font-medium text-sm leading-tight">
										{user.info.first_name}
									</h4>
									<p className="font-light text-xs leading-tight">
										Benedict
									</p>
								</div>
							</DrawerHeader>

							<DrawerBody>
								<button className="px-2 py-1 text-left hover:outline outline-1 rounded-sm outline-slate-300 w-full mt-1">
									Your Profile
								</button>
								<div className="w-full h-[1px] rounded-md bg-gray-200 my-1"></div>
								<section className="flex flex-col gap-2 mt-2">
									<button className="px-2 py-1 text-left hover:outline outline-1 rounded-sm outline-slate-300">
										Projects
									</button>
									<button className="px-2 py-1 text-left hover:outline outline-1 rounded-sm outline-slate-300">
										Reviews
									</button>
									<button className="px-2 py-1 text-left hover:outline outline-1 rounded-sm outline-slate-300">
										Stars
									</button>
									<button className="px-2 py-1 text-left hover:outline outline-1 rounded-sm outline-slate-300">
										Circle
									</button>
									<Link to={"/dashboard"}>
										<button className="px-2 py-1 text-left hover:outline outline-1 rounded-sm outline-slate-300">
											Dashboard
										</button>
									</Link>
								</section>
								<div className="w-full h-[1px] rounded-md bg-gray-200 my-1"></div>

								<button
									onClick={() => {
										LogoutFunc();
										setUser({ mode: "LOGOUT" });
										onClose();
									}}
									className="mt-2 px-2 font-light"
								>
									Logout
								</button>
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				</div>

				{/* Mobile Screens */}
				<div className="flex flex-row justify-between items-center w-full sm:hidden">
					{/* <Logo type={type} /> */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`w-6 h-6 ${
							type === "dark" ? "text-black" : "text-white"
						}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</div>
			</header>
		</>
	);
};

export default Nav;
