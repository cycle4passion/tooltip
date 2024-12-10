<script module>
	let instanceCount = 0;
	function generateUniqueId() {
		instanceCount += 1;
		return `${instanceCount}`;
	}
</script>

<script lang="ts">
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

	type Props = {
		side?: 'top' | 'right' | 'bottom' | 'left';
		arrow?: boolean;
		offset?: string;
		arrowsize?: string;
		slide?: string;
		css?: Record<string, string>;
		children?: any;
	};

	let {
		side = 'top',
		arrow = true,
		arrowsize = '0.5em',
		offset = '0em',
		slide = '30px',
		css = {},
		children
	}: Props = $props();

	const defaultcss = {
		background: 'black',
		color: 'white',
		padding: '1em',
		'border-radius': '1em',
		'font-size': '1em',
		'max-width': '300px',
		'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.2)',
		transition: 'all 0.2s ease-in-out 0.3s'
	};

	$effect(() => {
		const trigger = ttContainer.querySelector('.trigger') as HTMLElement;
		const tooltip = ttContainer.querySelector('.tooltip') as HTMLElement;

		if (trigger && tooltip) {
			// Apply css
			css = { ...defaultcss, ...css };
			console.log(css);
			Object.entries(css).forEach(([key, value]) => (tooltip.style[key] = value));

			if (arrow && arrowsize > offset) offset = arrowsize;

			/* Apply ids, and popover and ARIA attributes */
			tooltip.setAttribute('id', `tt-content-${id}`);
			trigger.setAttribute('id', `tt-trigger-${id}`);
			tooltip.setAttribute('popover', 'auto');
			trigger.setAttribute('popovertarget', `tt-content-${id}`);
			trigger.setAttribute('aria-describedby', `tt-content-${id}`);
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
			tooltip.style.setProperty('--ttslide', slide);
			tooltip.style.setProperty('--ttduration', css.transition.split(' ')[1]);

			function tooltipShow() {
				tooltip?.setAttribute('aria-hidden', 'false');
				tooltip?.showPopover();
			}

			function tooltipHide() {
				tooltip?.setAttribute('aria-hidden', 'true');
				tooltip?.hidePopover();
			}

			/* Event listeners for mousover/focus and disabling click */
			trigger.addEventListener('mouseenter', tooltipShow);
			trigger.addEventListener('focus', tooltipShow);
			trigger.addEventListener('mouseleave', tooltipHide);
			trigger.addEventListener('blur', tooltipHide);
			trigger.addEventListener('click', (e) => {
				e.stopPropagation();
				e.preventDefault();
			});
		}
	});
</script>

<div bind:this={ttContainer}>
	{#if children}
		{@render children()}
	{:else}
		Missing child trigger and/or tooltip content.
	{/if}
</div>

<style>
	:global(body) {
		height: 50vh;
		display: grid;
		place-items: center;
		position: relative;
		font-family: system-ui, serif;
		line-height: 1.4;
	}

	:global(.trigger) {
		position: relative;
	}

	:global([popover]:popover-open) {
		opacity: 1;
		transform: translateX(0) translateY(0);
	}

	:global([popover]) {
		/* Final state of the exit animation */
		opacity: 0;
		transform: translateX(var(--ttmovex)) translateY(var(--ttmovey));
		transition:
			overlay allow-discrete,
			display allow-discrete;
	}

	/* Needs to be after the previous [popover]:popover-open rule
     to take effect, as the specificity is the same */
	@starting-style {
		:global([popover]:popover-open) {
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
