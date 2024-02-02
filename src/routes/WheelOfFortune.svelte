<script>
	import { onMount } from 'svelte';

	let wheelCanvas;

	const canvas = {
		width: 800,
		height: 800
	};

	const drawWheel = (ctx) => {
		ctx.beginPath();
		ctx.arc(400, 400, 300, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.moveTo(200, 200);
	};

	onMount(() => {
		console.log('Onmount');
		const ctx = wheelCanvas.getContext('2d');
		drawWheel(ctx);
	});
</script>

<div class="WheelOfFortune">
	<canvas bind:this={wheelCanvas} width={canvas.width} height={canvas.height} />
</div>

<style lang="scss">
	.WheelOfFortune {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
