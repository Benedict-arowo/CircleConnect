// export const SERVER_URL = "http://localhost:8000";
// export const SERVER_URL = "http://192.168.0.167:8000";
export const SERVER_URL = "https://circleconnect-backend.onrender.com";
export const GOOGLE_AUTH_URL = `${SERVER_URL}/auth/google`;
export const GITHUB_AUTH_URL = `${SERVER_URL}/auth/github`;
export const DEFAULT_MEMBER_ROLE_ID = "c53fc77e-cb8b-4c05-ae3f-3cdb0bd7fc60";

export const GET_ROLE_COLOR = (role: "LEADER" | "COLEADER" | "MEMBER") => {
	switch (role) {
		case "LEADER":
			return "bg-red-800";
		case "COLEADER":
			return "bg-blue-500";
		case "MEMBER":
			return "bg-gray-500";
	}
};
export const COLLABORATORS = [
	{
		name: "Chuks Omeifeukwu",
		role: "UI/UX Design",
		description:
			"Eager to collaborate & create successful digital products..",
		github: "https://www.behance.net/chuksomeifeukwu",
		image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		linkedin: "https://www.linkedin.com/in/chuks-omeifeukwu-17938b272/",
		twitter: "https://twitter.com/Fhatboy_UI",
	},
	{
		name: "Liasu Aanuoluwapo",
		role: "Backend Developer",
		description:
			"This project has a perfect mix of fun, learning, and challenge. . It's been a practical, hands-on way to grow my skills, making every day a chance to discover something new and exciting in the world of development.",
		github: "https://github.com/holabayor",
		// image: "https://avatars.githubusercontent.com/u/39333226?s=400&u=5f98d25772d3675c0b5a894f4cdeedf66aaa6568&v=4",
		image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		linkedin: "https://linkedin.com/in/laoj",
	},
	{
		name: "Benedict Arowojolu-Alagwe",
		role: "FullStack Developer",
		description:
			"Building CircleConnect has been a great experience. I've learned a lot and I'm excited to see how it will help people connect and collaborate on projects.",
		github: "https://github.com/Benedict-arowo",
		image: "https://avatars.githubusercontent.com/u/49790550?v=4",
		linkedin: "https://www.linkedin.com/in/benedict-arowo/",
	},
];
