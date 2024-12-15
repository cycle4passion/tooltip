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

// Although we use built in fallbacks for anchor positioning in primary plane, secondart plane could need adjusted manually.

/*			// Check if position-try-fallbacks is used
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
			}*/
