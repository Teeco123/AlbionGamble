<script lang="ts">
	import { onMount } from 'svelte';
	import { collectionStore } from 'sveltefire';
	import { firestore } from '$lib/firebase';
	import pusher from '$lib/pusher';
	import { collection, where, query, orderBy, limit } from 'firebase/firestore';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	export let data;

	//Querying gambles to display
	const gambleRef = collection(firestore, 'gambles');
	const q = query(gambleRef, orderBy('date', 'desc'), limit(1));
	const gambles = collectionStore(firestore, q);

	let wheelCanvas: any;
	let slice: HTMLCanvasElement;
	let center: any;

	let x = 0;
	let totalPlayers = data.gamble.totalPlayers;
	let player = new Array();
	let totalSilver = data.gamble.totalSilver;
	const kolory = ['red', 'blue', 'green'];

	//input player silver flom data base to script
	for (x = 0; x < totalPlayers; x++) {
		player.push(data.gamble.players[x].balanceDrop);
	}

	//calc precent of player silver to total silver w skrócie procent szans :)
	for (x = 0; x < totalPlayers; x++) {
		player[x] = player[x] / totalSilver;
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

	const drawSlice = (sliceCtx: any) => {
		let ileKulkaPelne = 0; //zmienna do kawałów
		for (x = 0; x < totalPlayers; x++) {
			sliceCtx.beginPath();
			sliceCtx.arc(400, 400, 300, ileKulkaPelne, (ileKulkaPelne += player[x] * Math.PI * 2)); //nadanie lie kula pelne wartości zalełnionego koła
			sliceCtx.lineTo(400, 400);
			sliceCtx.fillStyle = kolory[x % 3];
			sliceCtx.fill();
			sliceCtx.stroke();
		}
	};

	const drawCenter = (centerCtx: any) => {
		centerCtx.beginPath();
		centerCtx.arc(400, 400, 50, 0, Math.PI * 2);
		centerCtx.fill();
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
		const ctx = wheelCanvas.getContext('2d');
		const sliceCtx = slice.getContext('2d');
		const centerCtx = center.getContext('2d');
		drawWheel(ctx);
		drawSlice(sliceCtx);
		drawCenter(centerCtx);

		const channel = pusher.subscribe('channel');
		channel.bind('spin', (data: any) => {
			SpinWheel();
		});
	});
</script>

<div class="WheelOfFortune">
	<canvas id="wheelCanvas" bind:this={wheelCanvas} width={canvas.width} height={canvas.height} />
	<canvas id="slice" bind:this={slice} width={canvas.width} height={canvas.height} />
	<canvas id="center" bind:this={center} width={canvas.width} height={canvas.height} />
</div>
<button on:click={SpinWheel}>SPIN</button>
{#each $gambles as gamble}
	<p>Total Silver:{gamble.totalSilver}</p>
	<p>Total Players:{gamble.totalPlayers}</p>

	{#each gamble.players as player}
		<p>Player:{player.login} Silver:{player.balanceDrop}</p>
	{/each}
{/each}

<form action="?/dropSilver" method="post" use:enhance>
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
