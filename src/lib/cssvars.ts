export const cssVars = (node: HTMLElement, props: Record<string, string>) => {
	Object.entries(props).forEach(([key, value]) => {
		node.style.setProperty(`--${key}`, value);
	});

	return {
		update(new_props: Record<string, string>) {
			Object.entries(new_props).forEach(([key, value]) => {
				node.style.setProperty(`--${key}`, value);
				delete props[key];
			});

			Object.keys(props).forEach((name) => node.style.removeProperty(`--${name}`));
			props = new_props;
		}
	};
};

// Declare the cssVars function type
export type CssVars = (
	node: HTMLElement,
	props: Record<string, string>
) => {
	update(new_props: Record<string, string>): void;
};
