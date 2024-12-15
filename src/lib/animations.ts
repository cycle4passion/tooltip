export const animateIn = (tooltip: HTMLElement, animation: App.TooltipAnimations, onFinish: () => void) => {
	if (animation === false || !animation?.in?.props) {
		onFinish();
		return;
	}
	requestAnimationFrame(() => {
		const animationIn = tooltip.animate(
			[
				{ ...animation.out?.props }, // Start with fade-out props
				{ ...animation.in?.props } // End with fade-in props
			],
			{
				duration: animation.in?.duration,
				iterations: 1
			}
		)
		animationIn.onfinish = onFinish;
	});
};

export const animateOut = (tooltip: HTMLElement, animation: App.TooltipAnimations, onFinish: () => void) => {
	if (animation === false || !animation?.out?.props) {
		onFinish();
		return;
	}
	requestAnimationFrame(() => {
		const animationOut = tooltip.animate(
			[
				{ ...(animation.in?.props) }, // Start with fade-in props
				{ ...animation.out?.props } // End with fade-out props
			],
			{
				duration: animation.out?.duration,
				iterations: 1
			}
		);

		animationOut.onfinish = onFinish;
	});
};
