<script lang="ts">
	let totalSilver = 5000;
	let totalPlayers = 4;

	let wheel: any;
	let slces: any;

	function SpinWheel() {
		let degree = Math.floor(Math.random() * 5000);
		wheel.style.transition = 'all 10s ease-out';
		wheel.style.transform = `rotate(${degree}deg)`;

		setTimeout(() => {
			wheel.style.transition = 'none';
			let actualDeg = degree % 360;
			wheel.style.transform = `rotate(${actualDeg}deg)`;

			let winningSlice = getWinningSlice(actualDeg);
			let winningValue = winningSlice.dataset.value;
			alert(`The spin wheel has stopped at ${winningValue}`);
		}, 10000);
	}

	function getWinningSlice(degrees: number) {
		let slices = document.querySelectorAll('ul div');
		let sliceAngle = 360 / slices.length;
		let sliceIndex = Math.floor(degrees / sliceAngle);
		console.log(degrees);
		console.log(sliceIndex + 1);
		return slices[sliceIndex];
	}
</script>

<ul bind:this={wheel} class="wheel" style="--rotation: calc(-360deg / {totalPlayers} )">
	<li>
		<div data-value="alideniz" class="slice"></div>
	</li>
	<li>
		<div data-value="teeco" class="slice"></div>
	</li>
	<li>
		<div data-value="dofianis" class="slice"></div>
	</li>
	<li>
		<div data-value="kris" class="slice"></div>
	</li>
</ul>

<button on:click={SpinWheel}></button>

<style>
	.wheel {
		position: relative;
		border: 1px solid rgb(241, 0, 0);
		padding: 0;
		width: 50rem;
		height: 50rem;
		border-radius: 50%;
		list-style: none;
		overflow: hidden;
		transform: rotate(54deg);
	}

	.slice {
		position: absolute;
		left: -100%;
		width: 200%;
		height: 200%;
		font-size: larger;
	}

	li {
		overflow: hidden;
		position: absolute;
		top: -50%;
		right: -50%;
		width: 100%;
		height: 100%;
		transform-origin: 0% 100%;
	}

	li:first-child {
		transform: rotate(calc(var(--rotation) * 1)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(2) {
		transform: rotate(calc(var(--rotation) * 2)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(3) {
		transform: rotate(calc(var(--rotation) * 3)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(4) {
		transform: rotate(calc(var(--rotation) * 4)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(5) {
		transform: rotate(calc(var(--rotation) * 5)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(6) {
		transform: rotate(calc(var(--rotation) * 6)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(7) {
		transform: rotate(calc(var(--rotation) * 7)) skewY(calc(var(--rotation) + 90deg));
	}

	li:nth-child(8) {
		transform: rotate(calc(var(--rotation) * 8)) skewY(calc(var(--rotation) + 90deg));
	}

	li:first-child .slice {
		background: red;
	}

	li:nth-child(2) .slice {
		background: green;
	}

	li:nth-child(3) .slice {
		background: blue;
	}

	li:nth-child(4) .slice {
		background: black;
	}

	li:nth-child(5) .slice {
		background: blue;
	}

	li:nth-child(6) .slice {
		background: yellow;
	}

	li:nth-child(7) .slice {
		background: tomato;
	}
	li:nth-child(7) .slice {
		background: aqua;
	}
</style>
