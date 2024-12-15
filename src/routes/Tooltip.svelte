<script module>
	let instanceCount = 0;
	function generateUniqueId() {
		instanceCount += 1;
		return `${instanceCount}`;
	}
</script>

<script lang="ts">
	import {
		checkSupportedCSS,
		debounce,
		animateIn,
		animateOut,
		defaultanimation,
		defaultcss
	} from '$lib/index.js';
	import TooltipDocumentation from './TooltipDocumentation.svelte';

	const id = generateUniqueId();
	const notSupported = checkSupportedCSS();
	let ttContainer: HTMLDivElement;

	let {
		triggerevent = 'hover',
		side = 'top',
		arrow = true,
		arrowsize = '0.5em',
		offset = '0em',
		slide = '2em',
		css = {},
		animation = {},
		children,
		onShow = () => {},
		onHide = () => {},
		onToggle = () => {}
	}: App.TooltipProps = $props();

	$effect(() => {
		const trigger = ttContainer.querySelector('.trigger') as HTMLElement;
		const tooltip = ttContainer.querySelector('.tooltip') as HTMLElement;

		if (trigger && tooltip) {
			// Apply css
			css = { ...defaultcss, ...css };
			Object.entries(css).forEach(
				([key, value]: [string, unknown]) => (tooltip.style[key as any] = value as string)
			);

			// Empty animation object or animation=false then turn off animation
			if (Object.keys(animation).length === 0 || !animation)
				animation = { in: { delay: 0, duration: 0 }, out: { delay: 0, duration: 0 } };
			animation = { ...defaultanimation, ...animation };

			// add display to props needed for make animations work
			if (animation.in) animation.in.props = { ...animation.in?.props, display: 'block' };
			if (animation.out) animation.out.props = { ...animation.out?.props, display: 'none' };

			// Optimize animation
			tooltip.style.willChange = Object.keys({
				...animation.in?.props,
				...animation.out?.props
			}).join(', ');

			// offset to at least include arrow size
			if (arrow && arrowsize > offset) offset = arrowsize;

			/* Apply ids, and popover and ARIA attributes */
			trigger.setAttribute('id', `tt-trigger-${id}`);
			trigger.setAttribute('popovertarget', `tt-content-${id}`);
			trigger.setAttribute('aria-describedby', `tt-content-${id}`);
			tooltip.setAttribute('id', `tt-content-${id}`);
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

			const handleShowing = debounce(() => {
				animateIn(tooltip, animation, () => {
					tooltip.setAttribute('aria-hidden', 'false');
					tooltip.showPopover();
					if (onShow) onShow();
					if (onToggle) onToggle();
				});
			}, animation.in?.delay || 0);

			const handleHiding = debounce(() => {
				animateOut(tooltip, animation, () => {
					tooltip.setAttribute('aria-hidden', 'true');
					tooltip.hidePopover();
					if (onHide) onHide();
					if (onToggle) onToggle();
				});
			}, animation.out?.delay || 0);

			const handleClick = (e: MouseEvent) => {
				if (triggerevent === 'hover') {
					e.preventDefault();
					e.stopPropagation();
				} else if (triggerevent === 'click') {
					if (tooltip.getAttribute('aria-hidden') === 'true') {
						handleShowing();
					} else {
						handleHiding();
					}
				}
			};

			// Add event listeners
			if (triggerevent === 'hover') {
				trigger?.addEventListener('mouseover', handleShowing);
				trigger?.addEventListener('mouseleave', handleHiding);
			}
			trigger?.addEventListener('click', handleClick);
			trigger?.addEventListener('focus', handleShowing);
			trigger?.addEventListener('blur', handleHiding);

			// cleanup to prevent memory leaks
			return () => {
				if (triggerevent === 'hover') {
					trigger.removeEventListener('mouseenter', handleShowing);
					trigger.removeEventListener('mouseleave', handleHiding);
				}
				trigger.removeEventListener('click', handleClick);
				trigger.removeEventListener('focus', handleShowing);
				trigger.removeEventListener('blur', handleHiding);
			};
		}
	});
</script>

<TooltipDocumentation />
<div bind:this={ttContainer}>
	{#if notSupported}
		<p>{notSupported}</p>
	{:else if children}
		{@render children()}
	{:else}
		Missing child trigger and/or tooltip content.
	{/if}
</div>

<style>
	:global(.trigger) {
		position: relative;
	}

	:global(.tooltip) {
		position: absolute;
		border: none;
		overflow: visible;
		pointer-events: none;
		position-area: top;
		margin: 0;

		:global(&.arrow::before) {
			content: '';
			border: solid transparent;
			position: absolute;
			pointer-events: none;
			border-bottom-color: red; /* var(--ttbackgroundcolor); */
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
				justify-self: anchor-center;
				top: 100%;
				/* left: calc(50% - var(--arrowsize)); */
				rotate: 180deg;
			}
		}

		:global(&.right) {
			--ttmovex: var(--ttslide);
			--ttmovey: 0;
			position-area: right;
			position-try-fallbacks:
				flip-inline,
				flip-block,
				flip-inline flip-block;
			margin-top: var(--ttoffset);
			margin-left: calc(var(--ttoffset) + var(--arrowsize));
			&.arrow::before {
				align-self: anchor-center;
				left: calc(-2 * var(--arrowsize));
				rotate: -90deg;
			}
		}

		:global(&.bottom) {
			--ttmovex: 0;
			--ttmovey: var(--ttslide);
			position-area: bottom;
			position-try-fallbacks:
				flip-block,
				flip-inline,
				flip-block flip-inline;
			margin-top: calc(var(--ttoffset) + var(--arrowsize));
			&.arrow::before {
				justify-self: anchor-center;
				top: calc(0% - (2 * var(--arrowsize)));
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
				align-self: anchor-center;
				left: 100%;
				rotate: 90deg;
			}
		}
	}
</style>
