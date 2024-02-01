<script lang="ts">
	export let data;
</script>

<body>
	<header>
		<img class="logo" src="" alt="LOGO" />
		<div class="user">
			<form action="?" method="post">
				{#if !data.user}
					<button formaction="?/loginRedirect">
						<img src="images/login.png" alt="login" />
						<p>Login / Register</p>
					</button>
				{:else}
					<button formaction="?/logout">
						<img src="images/logout.png" alt="logout" />
						<p>Logout</p>
					</button>
					<button formaction="?/myProfile">
						<img src="images/myprofile.png" alt="my profile" />
						<p>My Profile</p>
					</button>
				{/if}
			</form>
		</div>
	</header>
	dada
</body>

<style lang="scss">
	body {
		margin: 0;
		background-color: black;
		color: white;
		header {
			display: flex;
			height: 10%;
			background-color: blanchedalmond;
			justify-content: space-around;
		}
	}
</style>
