export function debounce(fn: () => void, delay: number) {
	let timeout: number | undefined;
	return () => {
		clearTimeout(timeout);
		timeout = window.setTimeout(fn, delay);
	};
}

export function checkSupportedCSS(): string {
	// const supportChecks = {
	// 	'position-try-fallbacks': CSS.supports('position', 'try(absolute, fixed)'),
	// 	'position-anchor': CSS.supports('position', 'anchor(0% 0%)'),
	// 	'position-area': CSS.supports('position', 'area(top)'),
	// 	popover: CSS.supports('position', 'popover(auto)')
	// };

	// let notSupported = '';

	// Object.entries(supportChecks).forEach(([feature, isSupported]) => {
	// 	if (!isSupported) {
	// 		notSupported += `${feature} is not supported.\n`;
	// 	}
	// });

	// return notSupported;
	return '';
}

	export const defaultcss = {
		background: 'black',
		color: 'white',
		padding: '1em',
		'border-radius': '1em',
		'font-size': '1em',
		'max-width': '300px',
		'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.2)'
	};

	export const defaultanimation = {
		in: {
			delay: 500,
			duration: 100,
			props: {
				opacity: 1,
				transform: 'translateX(0) translateY(0)'
			}
		},
		out: {
			delay: 100,
			duration: 100,
			props: {
				opacity: 0,
				transform: 'translateX(var(--ttmovex, 0)) translateY(var(--ttmovey, 0))'
			}
		}
	};