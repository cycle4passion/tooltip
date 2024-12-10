<script lang="ts">
	import Tooltip from '$lib/Tooltip.svelte';
	let side: 'top' | 'right' | 'bottom' | 'left' = 'top';
</script>

<div>
	<label>
		<input type="radio" bind:group={side} value="top" />
		Top
	</label>
	<label>
		<input type="radio" bind:group={side} value="right" />
		Right
	</label>
	<label>
		<input type="radio" bind:group={side} value="bottom" />
		Bottom
	</label>
	<label>
		<input type="radio" bind:group={side} value="left" />
		Left
	</label>
</div>

<Tooltip {side}>
	<button class="trigger">?</button>
	<div class="tooltip">
		<p>
			The sun dipped, fiery orange melting into buttery yellow. Maya mirrored the hues on canvas,
			each stroke bittersweet – fleeting beauty, a day gone. Yet, she painted on, for in those
			streaks lay the promise of a new dawn.
		</p>
	</div>
</Tooltip>

<Tooltip>
	<button class="trigger">?</button>
	<div class="tooltip">
		<p>aaa</p>
	</div>
</Tooltip>

<style>
	button {
		--btn-size: 2rem;
		font-size: calc(var(--btn-size) - 0.75rem);
		border-radius: var(--btn-size);
		height: var(--btn-size);
		width: var(--btn-size);
		display: grid;
		border: 2px solid var(--bg);
		place-content: center;
		background: linear-gradient(15deg, #ff7e7e, #ffcd73, #ffffb0);
	}
</style>
