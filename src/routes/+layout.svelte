<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import { uiState } from '$lib/state.svelte';
	let { children } = $props();

	const FONT_CLASS_TO_FAMILY: Record<string, string> = {
		'font-merriweather': "'Merriweather', serif",
		'font-lora': "'Lora', serif",
		'font-playfair-display': "'Playfair Display', serif",
		'font-eb-garamond': "'EB Garamond', serif",
		'font-cormorant-garamond': "'Cormorant Garamond', serif",
		'font-libre-baskerville': "'Libre Baskerville', serif",
		'font-arvo': "'Arvo', serif",
		'font-pt-serif': "'PT Serif', serif",
		'font-cardo': "'Cardo', serif",
		'font-old-standard-tt': "'Old Standard TT', serif",
		'font-raleway': "'Raleway', sans-serif",
		'font-lato': "'Lato', sans-serif",
		'font-noto-serif': "'Noto Serif', serif",
		'font-source-serif-pro': "'Source Serif Pro', serif",
		'font-roboto-slab': "'Roboto Slab', serif",
		'font-orbitron': "'Orbitron', sans-serif",
		'font-electrolize': "'Electrolize', sans-serif",
		'font-audiowide': "'Audiowide', sans-serif",
		'font-chakra-petch': "'Chakra Petch', sans-serif",
		'font-share-tech-mono': "'Share Tech Mono', monospace",
		'font-roboto-mono': "'Roboto Mono', monospace",
		'font-nova-square': "'Nova Square', sans-serif",
		'font-bungee': "'Bungee', sans-serif",
		'font-cutive-mono': "'Cutive Mono', monospace",
		'font-fira-mono': "'Fira Mono', monospace",
		'font-gruppo': "'Gruppo', sans-serif",
		'font-syncopate': "'Syncopate', sans-serif",
		'font-vt323': "'VT323', monospace",
		'font-tomorrow': "'Tomorrow', sans-serif",
		'font-russo-one': "'Russo One', sans-serif",
		'font-roboto': "'Roboto', sans-serif",
		'font-roboto-condensed': "'Roboto Condensed', sans-serif",
		'font-roboto-serif': "'Roboto Serif', serif",
		'font-zilla-slab': "'Zilla Slab', serif",
		'font-rokkitt': "'Rokkitt', serif",
		'font-josefin-slab': "'Josefin Slab', serif",
		'font-patua-one': "'Patua One', serif",
		'font-crete-round': "'Crete Round', serif",
	};

	$effect(() => {
		// Update HTML classes for theme
		const themes = ['dark', 'theme-ocean', 'theme-forest', 'theme-sunset', 'theme-amber', 'theme-poppy', 'theme-bialowieza', 'theme-warsaw-neon', 'theme-kyoto-garden', 'theme-seoul-night', 'theme-hanok-village', 'theme-tokyo-night', 'theme-osaka-downtown', 'theme-classic-rw', 'theme-cyberpunk-2077', 'theme-cyberpunk-yellow-glitch'];
		themes.forEach(t => document.documentElement.classList.remove(t));
		document.documentElement.classList.add(uiState.theme);

		// Font overrides via CSS variables
		const bodyFamily = FONT_CLASS_TO_FAMILY[uiState.bodyFont] || "'Inter', sans-serif";
		const headlineFamily = FONT_CLASS_TO_FAMILY[uiState.headlineFont] || "'Space Grotesk', sans-serif";
		
		document.documentElement.style.setProperty('--font-body', bodyFamily);
		document.documentElement.style.setProperty('--font-headline', headlineFamily);

		// Save state to localStorage
		uiState.save();
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Roboto+Slab:wght@400;500;700&family=Orbitron:wght@400;700&family=Merriweather:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;700&family=EB+Garamond:wght@400;700&family=Cormorant+Garamond:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Arvo:wght@400;700&family=PT+Serif:wght@400;700&family=Cardo:wght@400;700&family=Old+Standard+TT:wght@400;700&family=Raleway:wght@400;700&family=Lato:wght@400;700&family=Noto+Serif:wght@400;700&family=Source+Serif+Pro:wght@400;700&family=Electrolize&family=Audiowide&family=Chakra+Petch:wght@400;700&family=Share+Tech+Mono&family=Roboto+Mono:wght@400;700&family=Nova+Square&family=Bungee&family=Cutive+Mono&family=Fira+Mono:wght@400;700&family=Gruppo&family=Syncopate:wght@400;700&family=VT323&family=Tomorrow:wght@400;700&family=Russo+One&family=Roboto:wght@400;700&family=Roboto+Condensed:wght@400;700&family=Roboto+Serif:wght@400;700&family=Zilla+Slab:wght@400;700&family=Rokkitt:wght@400;700&family=Josefin+Slab:wght@400;700&family=Patua+One&family=Crete+Round:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen break-words transition-colors duration-500">
	<Navigation />
	<main class="w-full">
		{@render children()}
	</main>
</div>

<style lang="postcss">
	:global(h1), :global(h2), :global(h3), :global(h4), :global(h5), :global(h6) {
		@apply font-headline;
	}
</style>
