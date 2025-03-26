<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, DarkMode, Button } from 'flowbite-svelte';
	import { page } from '$app/stores';
	
	let { children } = $props();
	
	// Only show the navigation on public pages
	const isPublicPage = $derived($page.url.pathname === '/' || $page.url.pathname === '/about' || $page.url.pathname === '/register');
</script>

{#if isPublicPage}
	<div class="flex flex-col min-h-screen">
		<Navbar let:hidden let:toggle class="py-3 px-4 border-b">
			<NavBrand href="/">
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
					SmartPalms
				</span>
			</NavBrand>
			<NavHamburger on:click={toggle} />
			<NavUl {hidden} class="mx-auto md:flex md:w-auto" ulClass="flex flex-col md:flex-row">
				<NavLi href="/about" activeClass="text-blue-700 md:text-blue-700 dark:text-white md:dark:text-white"
					class={$page.url.pathname === '/about' ? 'active' : ''}>About Us</NavLi>
			</NavUl>
			<div class="flex items-center gap-2">
					<Button href="/" color="light" class="hidden md:block">Login</Button>
				<Button href="/register" color="blue">Sign Up</Button>
			</div>
		</Navbar>
		<main class="flex-grow flex flex-col">
			{@render children()}
		</main>
		<footer class="bg-white border-t py-4 text-center text-sm text-gray-600">
			© {new Date().getFullYear()} SmartPalms. All rights reserved.
		</footer>
	</div>
{:else}
	{@render children()}
{/if}
