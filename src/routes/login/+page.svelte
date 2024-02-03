<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<body>
	<div class="container">
		<form action="?/login" method="post">
			<div class="inputs">
				<p>E-Mail:</p>
				<input name="login" type="text" minlength="3" maxlength="50" /><br />
				<p>Password:</p>
				<input id="password" name="password" type="password" minlength="6" /><br />
			</div>
			{#if form?.success}
				<p class="goodMessage">User registered succesfully!</p>
			{:else if form?.passwordRequired}
				<p class="message">Password is required!</p>
			{:else if form?.loginRequired}
				<p class="message">Login is required!</p>
			{:else if form?.userExists}
				<p class="message">User already exists!</p>
			{:else if form?.dontMatch}
				<p class="message">Wrong login or password!</p>
			{/if}

			<div class="buttons">
				<button>Log in</button>
				<button formaction="?/register">Register</button>
			</div>
		</form>
	</div>
</body>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');
	body {
		margin: 0;
		background-color: rgb(69, 69, 69);
		font-family: 'Roboto';
	}
	.container {
		height: 1000px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}

	form input {
		text-align: center;
		width: 250px;
		height: 20px;
	}

	.inputs,
	input[type='text'],
	input[type='password'] {
		margin-top: 0px;
		margin-bottom: 25px;
	}

	#password {
		margin-bottom: 2px;
	}
	.inputs,
	p {
		margin-top: 0px;
		margin-bottom: 5px;
		color: white;
	}

	.buttons {
		margin-top: 20px;
		display: flex;
		justify-content: space-evenly;
	}

	.message {
		color: red;
	}

	.goodMessage {
		color: green;
	}
</style>
