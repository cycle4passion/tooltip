<!-- 
@component
## Tooltip
Wrapping Svelte 5 TS component for creating a tooltip via Snippet children.

### Snippet Requirements
1. Include a trigger element identified by the class "`.trigger`"
1. Include tooltip element identified by the class "`.tooltip`" with attribute `popover="auto"`.

### Usage
```svelte
<Tooltip>
    <div class="trigger">Hover me</div>
    <div class="tooltip" popover="auto">This is a tooltip</div>
</Tooltip>
```

### Props
- `triggerevent`: "hover" | "click" - Event to trigger the tooltip. Default is `"hover"`.
- `side`: "top" | "right" | "bottom" | "left" - Side to show the tooltip. Default is `"top"`.
- `arrow`: boolean - Include arrow on the tooltip. Default is `"true"`.
- `arrowsize`: string - Size of the arrow. Default is `"0.5em"`.
- `offset`: string - extra offset of the tooltip (beyond arrowsize). Default is `"0"`.
- `slide`: string - translate animation distance of the tooltip. Default is `"2em"`.
- `css`: Record<string, any> - Custom css for the tooltip. Default is
```js
css = {
    background: 'black',
    color: 'white',
    padding: '1em',
    'border-radius': '1em',
    'font-size': '1em',
    'max-width': '300px',
    'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.2)'
  }
```
  - `animation`: false | {} | TooltipAnimations - Animation for show and hide. Default is 
  ```js
  animation = {
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
  }
  ```
  note: `--ttmovex` and `--ttmovey` are set by the `slide` prop depending on `side`.
- `onShow`: () => void - Callback function when tooltip is shown, default is `() => {}`.
- `onHide` - () => void - Callback function when tooltip is hidden, default is `() => {}`.
- `onToggle` - () => void - Callback function when tooltip is toggled, default is `() => {}`.
``` -->
