// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Snippet } from 'svelte';

declare global {
	namespace App {
				// interface Error {}
				// interface Locals {}
				// interface PageData {}
				// interface PageState {}
				// interface Platform {}
				
				type TooltipAnimations = false | {
					in?: {
							delay?: number;
							duration?: number;
							props?: Record<string, string|number>;
					};
					out?: {
							delay?: number;	
							duration?: number;
							props?: Record<string, string|number>;
					};
			}

			interface TooltipProps {
					triggerevent?: 'click' | 'hover';
					side?: 'top' | 'right' | 'bottom' | 'left';
					arrow?: boolean;
					offset?: string;
					arrowsize?: string;
					slide?: string;
					css?: Record<string, string>;
					animation?: TooltipAnimations;
					children?: Snippet;
					onShow?: () => void;
					onHide?: () => void;
					onToggle?: () => void;
			}
    }
	}

export {};
