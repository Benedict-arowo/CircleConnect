/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				blue: {
					50: "#edf9ff",
					100: "#d6efff",
					200: "#b6e5ff",
					300: "#84d7ff",
					400: "#4bbfff",
					500: "#219fff",
					600: "#097fff",
					700: "#0367f2",
					800: "#0a52c3",
					900: "#0f4999",
					950: "#0f2c5c",
				},
			},
		},
		screens: {
			xs: "475px",
			...defaultTheme.screens,
		},
	},
	plugins: [],
};
