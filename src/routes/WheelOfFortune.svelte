<script lang="ts">
	import { onMount } from 'svelte';

	let wheelCanvas: any;
	let slice: any;
	
	let x=0;
	let numberOfSlices = 5;
	let player = [70, 40, 35, 15,20];
	let totalSilver = 0;
	for(x=0;x<numberOfSlices;x++){
		totalSilver += player[x];
	};
	const kolory =["red","blue","green"] //kolory kawałów

	for (x = 0; x < numberOfSlices; x++) {
		player[x] = player[x] / totalSilver; //procent szans :)
	}

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

	x=0; //zmienna do kawałów
	let ileKulkaPelne = 0; //zmienna do kawałów
	const drawSlice = (sliceCtx: any) => {
		for(x; x<numberOfSlices;x++){
		sliceCtx.beginPath();
		sliceCtx.arc(400, 400, 300, ileKulkaPelne, ileKulkaPelne += player[x] * Math.PI * 2); //nadanie lie kula pelne wartości zalełnionego koła
		sliceCtx.lineTo(400, 400);
		sliceCtx.fillStyle = kolory[x%3]
		sliceCtx.fill();
		sliceCtx.stroke();
		}
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
		<canvas bind:this={slice} width={canvas.width} height={canvas.height} />
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
