<script>
	let hidePassword = true;
</script>

<main class="w-full max-w-5xl items-center justify-center flex flex-col pt-24">
	<h2 class="text-4xl mb-12">Login</h2>
	<form method="POST">
		<div class="flex flex-col">
			<label class="mb-2" for="username">Username</label>
			<input type="text" name="username" id="username" />
		</div>
		<br />
		<div class="flex flex-col mb-8">
			<label class="mb-2" for="password">Password</label>
			<div class="flex gap-x-2">
				<input type={hidePassword ? 'password' : 'text'} name="password" id="password" />
				<button class="font-mono" type="button" on:click={() => (hidePassword = !hidePassword)}>
					{#if !hidePassword}
						hide
					{:else}
						show
					{/if}
				</button>
			</div>
		</div>
		<button class="form-input">Submit</button>
	</form>
</main>
