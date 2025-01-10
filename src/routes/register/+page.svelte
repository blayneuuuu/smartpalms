<script lang="ts">
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte'
</script>

<div class="w-screen h-screen flex justify-center items-center">
	<SignUp redirectUrl="/dashboard" signInUrl="/"/>
</div>