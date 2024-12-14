<script module>
	let instanceCount = 0;
	function generateUniqueId() {
		instanceCount += 1;
		return `${instanceCount}`;
	}
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	/*
		Svelte 5 Tooltip Component - Snippet based, No Dependencies
		IMplementation - Import Tooltip Component, wrap trigger (identified with ".trigger" class) and tooltip (identified with ".tooltip" class)
		Minimal JS, leveraging new Native Popover API, Native Anchor API, and new CSS features
		Acccessibility Enabled - handles focus/hover events and aria attributes
		Sane defaults for props side, arrow, offset, arrowSize, backgroundColor, slide, duration
		tooltip flips to the opposite side if not enough space

		Questions:
		why does animateout not work? gone from dom?
	*/

	const id = generateUniqueId();
	let ttContainer: HTMLDivElement;
	let renderedSide = $state();

	type Props = {
		event: 'click' | 'hover';
		side?: 'top' | 'right' | 'bottom' | 'left';
		arrow?: boolean;
		offset?: string;
		arrowsize?: string;
		slide?: string;
		css?: Record<string, string>;
		children?: any;
		onShow?: () => void;
		onHide?: () => void;
		onToggle?: () => void;
	};

	let {
		event = 'hover',
		side = 'top',
		arrow = true,
		arrowsize = '0.5em',
		offset = '0em',
		slide = '30px',
		css = {},
		children,
		onShow = () => {},
		onHide = () => {},
		onToggle = () => {}
	}: Props = $props();

	const defaultcss = {
		background: 'black',
		color: 'white',
		padding: '1em',
		'border-radius': '1em',
		'font-size': '1em',
		'max-width': '300px',
		'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.2)'
	};

	onMount(() => {
		const trigger = ttContainer.querySelector('.trigger') as HTMLElement;
		const tooltip = ttContainer.querySelector('.tooltip') as HTMLElement;

		if (trigger && tooltip) {
			// Apply css
			css = { ...defaultcss, ...css };
			Object.entries(css).forEach(
				([key, value]: [string, string]) => (tooltip.style[key as any] = value)
			);

			if (arrow && arrowsize > offset) offset = arrowsize;

			/* Apply ids, and popover and ARIA attributes */
			trigger.setAttribute('id', `tt-trigger-${id}`);
			trigger.setAttribute('popovertarget', `tt-content-${id}`);
			trigger.setAttribute('aria-describedby', `tt-content-${id}`);
			tooltip.setAttribute('id', `tt-content-${id}`);
			tooltip.setAttribute('popover', 'auto');
			tooltip.setAttribute('role', 'tooltip');
			tooltip.setAttribute('inert', '');
			tooltip.classList.add(side);
			if (arrow) tooltip.classList.add('arrow');

			/* Apply css variables */
			tooltip.style.setProperty('--id', id);
			trigger.style.setProperty('anchor-name', `--tt-anchor-${id}`);
			tooltip.style.setProperty('position-anchor', `--tt-anchor-${id}`);
			tooltip.style.setProperty('--ttbackgroundcolor', css.background);
			tooltip.style.setProperty('--arrowsize', arrowsize);
			tooltip.style.setProperty('--ttoffset', offset);
			tooltip.style.setProperty('--ttslide', `-${slide}`);

			// Although we use built in fallbacks for anchor positioning in primary plane, secondart plane could need adjusted manually.

			// Check if position-try-fallbacks is used
			const computedStyle = getComputedStyle(tooltip);
			const tooltiprect = tooltip.getBoundingClientRect();
			const triggerrect = trigger.getBoundingClientRect();
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			if (tooltiprect.bottom > triggerrect.top) {
				// top
				renderedSide = 'top';
				tooltip.classList.remove('top');
				tooltip.classList.add('bottom');
			} else if (tooltiprect.top < triggerrect.bottom) {
				// bottom
				renderedSide = 'bottom';
				tooltip.classList.remove('bottom');
				tooltip.classList.add('top');
			} else if (tooltiprect.right > triggerrect.left) {
				// left
				renderedSide = 'left';
				tooltip.classList.remove('left');
				tooltip.classList.add('right');
			} else if (tooltiprect.left < triggerrect.right) {
				// right
				renderedSide = 'right';
				tooltip.classList.remove('right');
				tooltip.classList.add('left');
			}

			function tooltipShow(event: Event) {
				if (event instanceof MouseEvent || event instanceof FocusEvent) {
					// allows for other events on trigger not fire tooltipShow
					tooltip?.setAttribute('aria-hidden', 'false');
					tooltip?.showPopover();
					if (onShow) onShow();
					if (onToggle) onToggle();
				}
			}

			function tooltipHide(event: Event) {
				if (event instanceof MouseEvent || event instanceof FocusEvent) {
					// allows for other events on trigger not fire tooltipHide
					tooltip.classList.add('fade-out');
					tooltip.addEventListener(
						'animationend',
						() => {
							tooltip.classList.remove('fade-out'); // Cleanup
							tooltip.hidePopover(); // Actually hide it
						},
						{ once: true }
					);
					if (onHide) onHide();
					if (onToggle) onToggle();
				}
			}

			function noClick(event: MouseEvent) {
				event.preventDefault();
			}

			/* Event listeners for mousover/focus and disabling click */
			if (event === 'hover') {
				trigger.addEventListener('mouseenter', tooltipShow);
				trigger.addEventListener('mouseleave', tooltipHide);
				trigger.addEventListener('click', noClick);
			}
			trigger.addEventListener('focus', tooltipShow);
			trigger.addEventListener('blur', tooltipHide);
		}

		// cleanup to prevent memory leaks
		return (tooltipShow: () => void, tooltipHide: () => void, noClick: () => void) => {
			if (event === 'hover') {
				trigger.removeEventListener('mouseenter', tooltipShow);
				trigger.removeEventListener('mouseleave', tooltipHide);
				trigger.removeEventListener('click', noClick);
			}
			trigger.removeEventListener('focus', tooltipShow);
			trigger.removeEventListener('blur', tooltipHide);
		};
	});

	// 	type Animation = {
	//     in?: {
	//         delay?: number;          // Delay in milliseconds
	//         duration?: number;       // Duration in milliseconds
	//         props?: Record<string, any>; // Props as a flexible key-value pair
	//     };
	//     out?: {
	//         delay?: number;          // Delay in milliseconds
	//         duration?: number;       // Duration in milliseconds
	//         props?: Record<string, any>; // Props as a flexible key-value pair
	//     };
	// };

	// // Example animation object with transform using translateX and translateY
	// const animation: Animation = {
	//     in: {
	//         delay: 100,
	//         duration: 200,
	//         props: {
	//             opacity: 1,
	//             transform: 'translateX(var(--moveX, 0)) translateY(var(--moveY, 0))'
	//         }
	//     },
	//     out: {
	//         delay: 100,
	//         duration: 200,
	//         props: {
	//             opacity: 0,
	//             transform: 'translateX(var(--moveX, 0)) translateY(var(--moveY, 0))'
	//         }
	//     }
	// };

	// // Select the elements
	// const tooltip = document.querySelector('.tooltip') as HTMLElement;
	// const trigger = document.querySelector('.trigger') as HTMLElement;

	// // Timeouts for managing delays
	// let fadeInTimeout: number | undefined;
	// let fadeOutTimeout: number | undefined;

	// // Debounce function to control rapid animations
	// const debounce = (fn: Function, delay: number) => {
	//     let timeout: number | undefined;
	//     return () => {
	//         clearTimeout(timeout);
	//         timeout = window.setTimeout(fn, delay);
	//     };
	// };

	// // Mouseover: Apply fade-in animation and update aria-hidden
	// const handleMouseOver = debounce(() => {
	//     if (document.activeElement === trigger || trigger.matches(':hover')) {
	//         // Show tooltip: Apply fade-in animation
	//         tooltip?.animate(
	//             [
	//                 { ...animation.out?.props }, // Start with fade-out props
	//                 { ...animation.in?.props }  // End with fade-in props
	//             ],
	//             {
	//                 duration: animation.in?.duration || 200,
	//                 iterations: 1
	//             }
	//         );

	//         // Apply aria-hidden="false" directly
	//         tooltip.setAttribute('aria-hidden', 'false');

	//         // Call popoverShow (optional for tooltip management)
	//         tooltip.popoverShow();
	//     }
	// }, animation.in?.delay || 0);

	// // Mouseleave: Apply fade-out animation and update aria-hidden
	// const handleMouseLeave = debounce(() => {
	//     if (!(document.activeElement === trigger || trigger.matches(':hover'))) {
	//         // Hide tooltip: Apply fade-out animation
	//         tooltip?.animate(
	//             [
	//                 { ...animation.in?.props }, // Start with fade-in props
	//                 { ...animation.out?.props } // End with fade-out props
	//             ],
	//             {
	//                 duration: animation.out?.duration || 200,
	//                 iterations: 1
	//             }
	//         );

	//         // Apply aria-hidden="true" directly
	//         tooltip.setAttribute('aria-hidden', 'true');

	//         // Call popoverHide (optional for tooltip management)
	//         tooltip.popoverHide();
	//     }
	// }, animation.out?.delay || 0);

	// // Event listeners for mouse hover and focus
	// trigger?.addEventListener('mouseover', handleMouseOver);
	// trigger?.addEventListener('mouseleave', handleMouseLeave);
	// trigger?.addEventListener('focus', handleMouseOver); // For focus behavior
	// trigger?.addEventListener('blur', handleMouseLeave); // For blur behavior

	// // Click event listener for the trigger element
	// trigger?.addEventListener('click', (event: MouseEvent) => {
	//     event.preventDefault();   // Prevent the default action (if any)
	//     event.stopPropagation();  // Stop the click event from propagating
	//     console.log('Trigger clicked!'); // You can add further logic here if needed
	// });
</script>

<div bind:this={ttContainer}>
	{#if children}
		{@render children()}
	{:else}
		Missing child trigger and/or tooltip content.
	{/if}
</div>
{side}{renderedSide}

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
	:global(body) {
		height: 50vh;
		/* display: grid;
		place-items: center; */
		position: relative;
		font-family: system-ui, serif;
		line-height: 1.4;
	}

	:global(.trigger) {
		position: relative;
	}

	/* :global([popover]:popover-open) {
		opacity: 1;
		transform: translateX(0) translateY(0);
	} */

	:global([popover]) {
		/* Final state of the exit animation */
		/* opacity: 0;
		transform: translateX(var(--ttmovex)) translateY(var(--ttmovey));
		transition:
			overlay allow-discrete,
			display allow-discrete; */
	}

	/* Needs to be after the previous [popover]:popover-open rule
     to take effect, as the specificity is the same */
	/* @starting-style {
		:global([popover]:popover-open) {
			opacity: 0;
			transform: translateX(var(--ttmovex)) translateY(var(--ttmovey));
		}
	} */

	/* 	transition out on popovers are not supported (instanly removed from dom)
			so will use fade-in and fade-out animations */
	:global(.tooltip) {
		animation: fadeIn 0.3s forwards;
	}

	:global(.tooltip.fade-out) {
		animation: fadeOut 0.1s forwards;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(var(--ttmovex)) translateY(var(--ttmovey));
		}
		to {
			opacity: 1;
			transform: translateX(0) translateY(0);
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
			transform: translateX(0) translateY(0);
		}
		to {
			opacity: 0;
			transform: translateX(var(--ttmovex)) translateY(var(--ttmovey));
		}
	}

	:global(.tooltip) {
		position: absolute;
		border: none;
		overflow: visible;
		pointer-events: none;
		position-area: top;
		margin: 0;
		margin-bottom: var(--ttoffset);

		:global(&.arrow::before) {
			content: '';
			border: solid transparent;
			position: absolute;
			pointer-events: none;
			border-bottom-color: var(--ttbackgroundcolor);
			border-width: var(--arrowsize);
			margin: 0;
		}

		:global(&.top) {
			--ttmovex: 0;
			--ttmovey: calc(-1 * var(--ttslide));
			position-area: top;
			position-try-fallbacks:
				flip-block,
				flip-inline,
				flip-block flip-inline;
			margin-bottom: calc(var(--ttoffset) + var(--arrowsize));
			&::before {
				top: 100%;
				left: calc(50% - var(--arrowsize));
				rotate: 180deg;
			}
		}

		:global(&.right) {
			--ttmovex: var(--arrowsize);
			--ttmovey: 0;
			position-area: right;
			position-try-fallbacks:
				flip-inline,
				flip-block,
				flip-inline flip-block;
			margin-top: var(--ttoffset);
			margin-left: calc(var(--ttoffset) + var(--arrowsize));
			&.arrow::before {
				top: calc(50% - var(--arrowsize));
				left: calc(0% - (2 * var(--arrowsize)));
				rotate: -90deg;
			}
		}

		:global(&.bottom) {
			--ttmovex: 0;
			--ttmovey: var(--arrowsize);
			position-area: bottom;
			position-try-fallbacks:
				flip-block,
				flip-inline,
				flip-block flip-inline;
			margin-top: calc(var(--ttoffset) + var(--arrowsize));
			&.arrow::before {
				top: calc(0% - (2 * var(--arrowsize)));
				left: calc(50% - var(--arrowsize));
				rotate: 0deg;
			}
		}
		:global(&.left) {
			--ttmovex: calc(-1 * var(--ttslide));
			--ttmovey: 0;
			position-area: left;
			position-try-fallbacks:
				flip-inline flip-block,
				flip-block,
				flip-inline;
			margin-top: calc(var(--ttoffset));
			margin-right: calc(var(--ttoffset) + var(--arrowsize));
			&.arrow::before {
				top: calc(50% - var(--arrowsize));
				left: 100%;
				rotate: 90deg;
			}
		}
	}
</style>
