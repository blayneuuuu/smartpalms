<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, NavUl, NavLi, DarkMode, Button } from 'flowbite-svelte';
	import { page } from '$app/stores';
	
	let { children } = $props();
	
	// Only show the navigation on public pages
	const isPublicPage = $derived($page.url.pathname === '/' || $page.url.pathname === '/about' || $page.url.pathname === '/register');
</script>

{#if isPublicPage}
	<div class="flex flex-col min-h-screen relative">
		<!-- Background image with overlay -->
		<div class="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed" style="background-image: url('/landing-bg.png');">
			<div class="absolute inset-0 bg-black/20"></div>
		</div>
		
		<div class="relative z-10 flex flex-col min-h-screen">
			<Navbar let:hidden let:toggle class="bg-transparent border-b-0 z-20">
				<NavBrand href="/">
					<img src="/logo.png" alt="SmartPalms Logo" class="h-32" />
				</NavBrand>
				<NavHamburger on:click={toggle} class="text-black" />
				<NavUl {hidden} class="md:flex md:ml-auto" ulClass="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
					<NavLi href="/about" activeClass="text-black" nonActiveClass="text-black hover:text-gray-700"
						class={$page.url.pathname === '/about' ? 'active' : ''}>ABOUT US</NavLi>
					<NavLi href="/SMARTPALMS-USER-MANUAL.pdf" target="_blank" rel="noopener noreferrer" 
						activeClass="text-black" nonActiveClass="text-black hover:text-gray-700">USER MANUAL</NavLi>
					<NavLi href="/" activeClass="text-black" nonActiveClass="text-black font-black hover:text-gray-700"
						class={$page.url.pathname === '/' ? 'active' : ''}>LOG IN</NavLi>
					
				</NavUl>
			</Navbar>
			<main class="flex-grow flex flex-col">
				{@render children()}
			</main>
			<footer class="bg-transparent border-t-0 py-4 text-center text-sm text-black relative z-10">
				© {new Date().getFullYear()} SmartPalms. All rights reserved.
			</footer>
		</div>
	</div>
{:else}
	{@render children()}
{/if}
