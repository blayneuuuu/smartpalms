<script lang="ts">
	import {SignUp} from 'svelte-clerk'
</script>

<div class="w-screen h-screen flex justify-center items-center">
	<SignUp redirectUrl="/dashboard" signInUrl="/"/>
</div>