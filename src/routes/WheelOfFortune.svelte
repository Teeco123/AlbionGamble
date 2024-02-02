<script lang="ts">
	import { onMount } from 'svelte';

	let wheelCanvas: any;
	let slice: any;

	let numberOfSlices = 3;
	let player = [20, 30, 10];
	let totalSilver = player[0] + player[1] + player[2];

	for (let x = 0; x < numberOfSlices; x++) {
		player[x] = player[x] / totalSilver; //procent szans :)
	}

	console.log(player);

	const canvas = {
		width: 800,
		height: 800
	};

	const drawWheel = (ctx: any) => {
		ctx.beginPath();
		ctx.arc(400, 400, 300, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.moveTo(400, 400);
	};

	const drawSlice = (sliceCtx: any) => {
		sliceCtx.beginPath();
		sliceCtx.moveTo(400, 400);
		sliceCtx.lineTo(200, 200);
		sliceCtx.stroke();
	};

	onMount(() => {
		console.log('Onmount');
		const ctx = wheelCanvas.getContext('2d');
		const sliceCtx = slice.getContext('2d');
		drawWheel(ctx);
		drawSlice(sliceCtx);
	});
</script>

<div class="WheelOfFortune">
	<canvas bind:this={wheelCanvas} width={canvas.width} height={canvas.height} />
	{#each { length: numberOfSlices } as _, i}
		<canvas bind:this={slice} width={canvas.width} height={canvas.height} />
	{/each}
</div>

<style lang="scss">
	.WheelOfFortune {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		canvas {
			position: absolute;
			left: 50%;
			top: 50%;

			transform: translate(-50%, 0%);
		}
	}
</style>
