<script lang="ts">
	import Tooltip from './Tooltip.svelte';
</script>

<Tooltip animation={false} css={{ background: 'red' }}>
	<button class="trigger">?</button>
	<div class="tooltip" popover="auto">
		The sun dipped, fiery orange melting into buttery yellow. Maya mirrored the hues on canvas, each
		stroke bittersweet – fleeting beauty, a day gone. Yet, she painted on, for in those streaks lay
		the promise of a new dawn.
	</div>
</Tooltip>

<style>
	:global(body) {
		padding-top: 50vh;
		height: 2500px;
		display: grid;
		justify-content: center;
		position: relative;
		font-family: system-ui, serif;
		line-height: 1.4;
	}

	button {
		font-size: calc(2rem - 0.75rem);
		border-radius: 2rem;
		height: 2rem;
		width: 2rem;
		display: grid;
		border: 2px solid var(--bg);
		place-content: center;
		background: linear-gradient(15deg, #ff7e7e, #ffcd73, #ffffb0);
	}
</style>
