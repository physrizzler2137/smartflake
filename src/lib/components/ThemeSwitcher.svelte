<script lang="ts">
  import { uiState } from '$lib/state.svelte';
  import { Palette, X, CheckCircle } from 'lucide-svelte';
  import { fly } from 'svelte/transition';

  const themes = [
    { 
        id: 'dark', 
        name: 'Default Navy', 
        colors: {
            bg: 'hsl(215 60% 16%)',
            primary: 'hsl(60 68% 81%)',
            accent: 'hsl(345 50% 45%)',
            card: 'hsl(212 65% 15%)',
            foreground: 'hsl(210 40% 96%)'
        } 
    },
    { 
        id: 'theme-classic-rw', 
        name: 'Classic Red & White', 
        colors: {
            bg: 'hsl(0 0% 100%)',
            primary: 'hsl(0 72% 51%)',
            accent: 'hsl(0 0% 9%)',
            card: 'hsl(0 0% 96%)',
            foreground: 'hsl(0 0% 3.9%)'
        } 
    },
    { 
        id: 'theme-cyberpunk-2077', 
        name: 'Cyberpunk 2077', 
        colors: {
            bg: 'hsl(240 10% 4%)',
            primary: 'hsl(54 100% 50%)',
            accent: 'hsl(180 100% 50%)',
            card: 'hsl(240 15% 8%)',
            foreground: 'hsl(60 90% 95%)'
        } 
    },
    { 
        id: 'theme-cyberpunk-yellow-glitch', 
        name: 'Cyberpunk Yellow', 
        colors: {
            bg: 'hsl(54 100% 50%)',
            primary: 'hsl(315 90% 60%)',
            accent: 'hsl(315 90% 60%)',
            card: 'hsl(0 0% 100%)',
            foreground: 'hsl(190 90% 50%)'
        } 
    },
    { 
        id: 'theme-ocean', 
        name: 'Ocean', 
        colors: {
            bg: 'hsl(200 80% 10%)',
            primary: 'hsl(175 70% 60%)',
            accent: 'hsl(185 65% 50%)',
            card: 'hsl(200 70% 14%)',
            foreground: 'hsl(180 20% 95%)'
        } 
    },
    { 
        id: 'theme-forest', 
        name: 'Forest', 
        colors: {
            bg: 'hsl(120 40% 8%)',
            primary: 'hsl(80 60% 65%)',
            accent: 'hsl(40 60% 55%)',
            card: 'hsl(120 30% 12%)',
            foreground: 'hsl(90 25% 94%)'
        }
    },
    { 
        id: 'theme-sunset', 
        name: 'Sunset', 
        colors: {
            bg: 'hsl(260 50% 10%)',
            primary: 'hsl(25 90% 60%)',
            accent: 'hsl(340 80% 65%)',
            card: 'hsl(260 45% 15%)',
            foreground: 'hsl(300 20% 95%)'
        }
    },
    { 
        id: 'theme-amber', 
        name: 'Amber', 
        colors: {
            bg: 'hsl(25 20% 12%)',
            primary: 'hsl(35 90% 60%)',
            accent: 'hsl(20 80% 55%)',
            card: 'hsl(25 25% 15%)',
            foreground: 'hsl(35 30% 92%)'
        } 
    },
    { 
        id: 'theme-poppy', 
        name: 'Poppy Fields', 
        colors: {
            bg: 'hsl(100 12% 10%)',
            primary: 'hsl(5 80% 55%)',
            accent: 'hsl(120 50% 40%)',
            card: 'hsl(110 15% 14%)',
            foreground: 'hsl(90 15% 95%)'
        } 
    },
    { 
        id: 'theme-bialowieza', 
        name: 'Białowieża', 
        colors: {
            bg: 'hsl(190 15% 18%)',
            primary: 'hsl(160 40% 65%)',
            accent: 'hsl(110 25% 50%)',
            card: 'hsl(190 20% 22%)',
            foreground: 'hsl(180 10% 90%)'
        } 
    },
    { 
        id: 'theme-warsaw-neon', 
        name: 'Warsaw Neon', 
        colors: {
            bg: 'hsl(240 10% 4%)',
            primary: 'hsl(310 100% 70%)',
            accent: 'hsl(180 100% 50%)',
            card: 'hsl(240 15% 8%)',
            foreground: 'hsl(240 10% 95%)'
        } 
    },
    { 
        id: 'theme-kyoto-garden', 
        name: 'Kyoto Garden', 
        colors: {
            bg: 'hsl(140 30% 10%)',
            primary: 'hsl(340 70% 70%)',
            accent: 'hsl(210 10% 50%)',
            card: 'hsl(140 25% 15%)',
            foreground: 'hsl(40 10% 95%)'
        } 
    },
    { 
        id: 'theme-seoul-night', 
        name: 'Seoul Night', 
        colors: {
            bg: 'hsl(220 40% 5%)',
            primary: 'hsl(320 100% 65%)',
            accent: 'hsl(180 100% 50%)',
            card: 'hsl(220 35% 10%)',
            foreground: 'hsl(220 10% 95%)'
        } 
    },
    { 
        id: 'theme-hanok-village', 
        name: 'Hanok Village', 
        colors: {
            bg: 'hsl(30 20% 12%)',
            primary: 'hsl(160 30% 50%)',
            accent: 'hsl(20 50% 55%)',
            card: 'hsl(30 25% 18%)',
            foreground: 'hsl(40 40% 90%)'
        } 
    },
    { 
        id: 'theme-tokyo-night', 
        name: 'Tokyo Night', 
        colors: {
            bg: 'hsl(250 30% 8%)',
            primary: 'hsl(315 90% 65%)',
            accent: 'hsl(180 80% 50%)',
            card: 'hsl(250 30% 12%)',
            foreground: 'hsl(240 10% 95%)'
        } 
    },
    { 
        id: 'theme-osaka-downtown', 
        name: 'Osaka Downtown', 
        colors: {
            bg: 'hsl(30 5% 10%)',
            primary: 'hsl(25 95% 60%)',
            accent: 'hsl(45 100% 55%)',
            card: 'hsl(30 5% 15%)',
            foreground: 'hsl(30 20% 94%)'
        } 
    }
  ];
</script>

<section id="theme-switcher" class="py-20 bg-card/20 border-t border-border/30" in:fly={{ y: 50 }}>
  <div class="container mx-auto px-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl relative">
        <button 
          class="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          onclick={() => uiState.showThemeSwitcher = false}
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex flex-col items-center mb-12">
          <h2 class="text-3xl font-bold font-slab bg-gradient-to-l from-secondary to-primary bg-clip-text text-transparent flex items-center gap-3">
            <Palette class="w-8 h-8 text-primary" />
            Theme Playground
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each themes as t}
            {@const isActive = uiState.theme === t.id}
            <div class="rounded-xl border-2 transition-all p-4 bg-card {isActive ? 'border-primary shadow-lg ring-4 ring-primary/10' : 'border-border/50 hover:border-border'}">
              <h3 class="font-slab text-lg mb-4 text-center font-bold">{t.name}</h3>
              <div class="flex justify-center space-x-2 mb-6">
                <div class="w-8 h-8 rounded-full border border-border/50 shadow-inner" style="background-color: {t.colors.bg}" />
                <div class="w-8 h-8 rounded-full border border-border/50 shadow-inner" style="background-color: {t.colors.primary}" />
                <div class="w-8 h-8 rounded-full border border-border/50 shadow-inner" style="background-color: {t.colors.accent}" />
                <div class="w-8 h-8 rounded-full border border-border/50 shadow-inner" style="background-color: {t.colors.foreground}" />
              </div>
              <button 
                class="w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 {isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}"
                onclick={() => uiState.theme = t.id}
              >
                {#if isActive}
                  <CheckCircle class="w-4 h-4" />
                  Active
                {:else}
                  Apply Theme
                {/if}
              </button>
            </div>
          {/each}
        </div>
        
        <p class="text-center text-xs text-muted-foreground mt-10 italic">Select a theme to transform the entire website's appearance.</p>
      </div>
    </div>
  </div>
</section>
