const X = ({ size = 30 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="30" height="30" rx="8" fill="#2E2E2E" />
			<path
				d="M17.26 13.0863L26.1 2.5H24.005L16.3275 11.6912L10.1975 2.5H3.125L12.3975 16.4L3.125 27.5H5.22L13.3275 17.7937L19.8025 27.5H26.875L17.26 13.0863ZM14.39 16.5212L13.45 15.1375L5.975 4.125H9.19375L15.2262 13.0125L16.165 14.3962L24.0063 25.9488H20.7887L14.39 16.5212Z"
				fill="white"
			/>
		</svg>
	);
};

export default X;
