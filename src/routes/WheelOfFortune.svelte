<script lang="ts">
	import { onMount } from 'svelte';
	import { collectionStore } from 'sveltefire';
	import { firestore } from '$lib/firebase';
	import { collection, where, query, orderBy, limit } from 'firebase/firestore';
	import type { ActionData } from './$types';

	export let form: ActionData;

	//Querying gambles to display
	const gambleRef = collection(firestore, 'gambles');
	const q = query(gambleRef, orderBy('date', 'asc'), limit(1)); /// CHANGE TO DESC
	const gambles = collectionStore(firestore, q);

	let wheel: any;
	let wheelCanvas: any;
	let slice: any;

	let x = 0;
	let numberOfSlices = 5;
	let player = [70, 40, 35, 15, 20];
	let totalSilver = 0;
	for (x = 0; x < numberOfSlices; x++) {
		totalSilver += player[x];
	}
	const kolory = ['red', 'blue', 'green']; //kolory kawałów

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

	x = 0; //zmienna do kawałów
	let ileKulkaPelne = 0; //zmienna do kawałów
	const drawSlice = (sliceCtx: any) => {
		for (x; x < numberOfSlices; x++) {
			sliceCtx.beginPath();
			sliceCtx.arc(400, 400, 300, ileKulkaPelne, (ileKulkaPelne += player[x] * Math.PI * 2)); //nadanie lie kula pelne wartości zalełnionego koła
			sliceCtx.lineTo(400, 400);
			sliceCtx.fillStyle = kolory[x % 3];
			sliceCtx.fill();
			sliceCtx.stroke();
		}
	};

	function SpinWheel() {
		let min = 10;
		let max = 30;
		let degree = Math.floor(Math.random() * (max - min) * 1000);
		slice.style.transition = 'all 10s ease-out';
		slice.style.transform = `translate(-50%, 0%) rotate(${degree}deg)`;

		setTimeout(() => {
			slice.style.transition = 'none';
			let actualDeg = degree % 360;
			slice.style.transform = `translate(-50%, 0%) rotate(${actualDeg}deg)`;
		}, 10000);
	}

	onMount(() => {
		console.log('Onmount');
		const ctx = wheelCanvas.getContext('2d');
		const sliceCtx = slice.getContext('2d');
		drawWheel(ctx);
		drawSlice(sliceCtx);
	});
</script>

<div class="WheelOfFortune" bind:this={wheel}>
	<canvas id="wheelCanvas" bind:this={wheelCanvas} width={canvas.width} height={canvas.height} />
	<canvas id="slice" bind:this={slice} width={canvas.width} height={canvas.height} />
</div>
<button on:click={SpinWheel}>SPIN</button>
{#each $gambles as gamble}
	<p>Total Silver:{gamble.totalSilver}</p>
	<p>Total Players:{gamble.totalPlayers}</p>

	{#each gamble.players as player}
		<p>Player:{player.login} Silver:{player.balanceDrop}</p>
	{/each}
{/each}

<form action="?/dropSilver" method="post">
	<input name="silver" type="number" />
	{#if form?.notEnoughSilver}
		<p>Not Enough Silver</p>
	{:else if form?.cantGoFor0}
		<p>Can't go in for 0 silver</p>
	{/if}
	<button>Go In</button>
</form>

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
