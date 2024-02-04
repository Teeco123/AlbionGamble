<script lang="ts">
	import WheelOfFortune from './WheelOfFortune.svelte';
	import { docStore } from 'sveltefire';
	import { firestore } from '$lib/firebase';
	export let data;

	import type { ActionData } from './$types';

	export let form: ActionData;

	$: user = data.user !== undefined ? docStore(firestore, `users/${data.user.id}`) : undefined;
</script>

<body>
	<header>
		<img class="logo" src="" alt="LOGO" />
		<form action="?" method="post" class="user">
			{#if !data.user}
				<button formaction="?/loginRedirect">
					<img src="images/login.png" alt="login" />
					<p>Login / Register</p>
				</button>
			{:else}
				<div class="balance">
					<img src="images/balance.png" alt="balance" />

					<p>{$user?.balance}</p>
				</div>

				<button formaction="?/myProfile">
					<img src="images/myprofile.png" alt="my profile" />
				</button>
				<button formaction="?/logout">
					<img src="images/logout.png" alt="logout" />
				</button>
			{/if}
		</form>
	</header>
	<WheelOfFortune {form} {data} />
</body>

<style lang="scss">
	body {
		margin: 0;
		background-color: rgb(148, 148, 148);
		color: white;
		header {
			display: flex;
			height: 9vh;
			background-color: rgb(50, 50, 50);
			justify-content: space-around;
			form {
				display: flex;
				align-items: center;
				button {
					margin: 0 20px 0 20px;
					background-color: Transparent;
					border: none;
					cursor: pointer;
					img {
						width: 50px;
					}
				}
				.balance {
					margin: 0 30px 0 20px;
					display: flex;
					color: silver;
					img {
						width: 50px;
						margin-right: 20px;
					}
				}
			}
		}
	}
</style>
