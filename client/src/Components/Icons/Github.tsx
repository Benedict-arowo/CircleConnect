const Github = ({ size = 38, color = "#24292F", className = "" }) => {
	return (
		<svg
			width={size}
			height={size}
			className={className}
			viewBox="0 0 38 38"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clip-path="url(#clip0_86_247)" filter="url(#filter0_d_86_247)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M18.9553 0C10.6854 0 4 6.875 4 15.3803C4 22.1791 8.28357 27.9341 14.226 29.9709C14.969 30.1241 15.2411 29.64 15.2411 29.2328C15.2411 28.8762 15.2166 27.6541 15.2166 26.3806C11.0564 27.2975 10.1901 24.5472 10.1901 24.5472C9.52153 22.7647 8.53092 22.3066 8.53092 22.3066C7.16929 21.3644 8.6301 21.3644 8.6301 21.3644C10.1405 21.4662 10.9331 22.9431 10.9331 22.9431C12.2699 25.2856 14.4241 24.6237 15.2907 24.2162C15.4144 23.2231 15.8108 22.5356 16.2317 22.1537C12.9137 21.7972 9.42265 20.4731 9.42265 14.5653C9.42265 12.8847 10.0165 11.5097 10.9576 10.4403C10.8091 10.0584 10.289 8.47937 11.1063 6.36594C11.1063 6.36594 12.3691 5.95844 15.2163 7.94469C16.4353 7.60802 17.6925 7.43675 18.9553 7.43531C20.2181 7.43531 21.5053 7.61375 22.694 7.94469C25.5415 5.95844 26.8043 6.36594 26.8043 6.36594C27.6216 8.47937 27.1012 10.0584 26.9528 10.4403C27.9186 11.5097 28.488 12.8847 28.488 14.5653C28.488 20.4731 24.9969 21.7716 21.6541 22.1537C22.199 22.6375 22.6692 23.5541 22.6692 25.0056C22.6692 27.0681 22.6447 28.7234 22.6447 29.2325C22.6447 29.64 22.9171 30.1241 23.6598 29.9712C29.6022 27.9337 33.8858 22.1791 33.8858 15.3803C33.9103 6.875 27.2004 0 18.9553 0Z"
					fill={color}
				/>
			</g>
			<defs>
				<filter
					id="filter0_d_86_247"
					x="0"
					y="0"
					width="38"
					height="38"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_86_247"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_86_247"
						result="shape"
					/>
				</filter>
				<clipPath id="clip0_86_247">
					<rect
						width="30"
						height="30"
						fill="white"
						transform="translate(4)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default Github;
