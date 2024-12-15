export type Props = {
	triggerevent?: 'click' | 'hover';
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

export type Animation = {
	in?: {
		delay?: number; // Delay in milliseconds
		duration?: number; // Duration in milliseconds
		props?: Record<string, any>; // Props as a flexible key-value pair
	};
	out?: {
		delay?: number; // Delay in milliseconds
		duration?: number; // Duration in milliseconds
		props?: Record<string, any>; // Props as a flexible key-value pair
	};
};
