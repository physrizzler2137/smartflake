<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import News from '$lib/components/News.svelte';
  import History from '$lib/components/History.svelte';
  import Mission from '$lib/components/Mission.svelte';
  import Facilities from '$lib/components/Facilities.svelte';
  import Team from '$lib/components/Team.svelte';
  import ResearchHighlights from '$lib/components/ResearchHighlights.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import Publications from '$lib/components/Publications.svelte';
  import Stats from '$lib/components/Stats.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import FontSwitcher from '$lib/components/FontSwitcher.svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import { uiState } from '$lib/state.svelte';
</script>

<svelte:head>
  <title>SMaRT-LaB | Smart Materials & Soft Robotics Laboratory</title>
  <meta name="description" content="Research at the intersection of soft robotics and intelligent materials." />
</svelte:head>

<main class="min-h-screen bg-background text-foreground {uiState.headlineFont}">
  <Hero />
  <News />
  <Mission />
  <History />
  <Facilities />
  <Team />
  <ResearchHighlights />
  <Projects />
  <Publications />
  <Stats />
  <Contact />
  
  {#if uiState.showFontSwitcher}
    <FontSwitcher />
  {/if}
  
  {#if uiState.showThemeSwitcher}
    <ThemeSwitcher />
  {/if}
  
  <Footer onToggleFont={() => uiState.toggleFontSwitcher()} onToggleTheme={() => uiState.toggleThemeSwitcher()} />
</main>
