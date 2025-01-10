<script lang="ts">
	import {SignIn} from 'svelte-clerk'
</script>

<div class="w-screen h-screen flex flex-col justify-center items-center"> 
  <span>Welcome to Smart Palms</span>
	<SignIn redirectUrl="/dashboard" signUpUrl="/register"/>
</div>