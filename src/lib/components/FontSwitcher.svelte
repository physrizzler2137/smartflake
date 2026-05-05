<script lang="ts">
  import { uiState } from '$lib/state.svelte';
  import { Palette, X } from 'lucide-svelte';
  import LogoText from './LogoText.svelte';
  import { fly } from 'svelte/transition';

  const organicFonts = [
    { name: 'Merriweather', className: 'font-merriweather' },
    { name: 'Lora', className: 'font-lora' },
    { name: 'Playfair Display', className: 'font-playfair-display' },
    { name: 'EB Garamond', className: 'font-eb-garamond' },
    { name: 'Cormorant Garamond', className: 'font-cormorant-garamond' },
    { name: 'Libre Baskerville', className: 'font-libre-baskerville' },
    { name: 'Arvo', className: 'font-arvo' },
    { name: 'PT Serif', className: 'font-pt-serif' },
    { name: 'Cardo', className: 'font-cardo' },
    { name: 'Old Standard TT', className: 'font-old-standard-tt' },
    { name: 'Raleway', className: 'font-raleway' },
    { name: 'Lato', className: 'font-lato' },
    { name: 'Noto Serif', className: 'font-noto-serif' },
    { name: 'Source Serif Pro', className: 'font-source-serif-pro' },
    { name: 'Roboto Slab', className: 'font-roboto-slab' },
  ];

  const technicalFonts = [
    { name: 'Orbitron', className: 'font-orbitron' },
    { name: 'Electrolize', className: 'font-electrolize' },
    { name: 'Audiowide', className: 'font-audiowide' },
    { name: 'Chakra Petch', className: 'font-chakra-petch' },
    { name: 'Share Tech Mono', className: 'font-share-tech-mono' },
    { name: 'Roboto Mono', className: 'font-roboto-mono' },
    { name: 'Nova Square', className: 'font-nova-square' },
    { name: 'Bungee', className: 'font-bungee' },
    { name: 'Cutive Mono', className: 'font-cutive-mono' },
    { name: 'Fira Mono', className: 'font-fira-mono' },
    { name: 'Gruppo', className: 'font-gruppo' },
    { name: 'Syncopate', className: 'font-syncopate' },
    { name: 'VT323', className: 'font-vt323' },
    { name: 'Tomorrow', className: 'font-tomorrow' },
    { name: 'Russo One', className: 'font-russo-one' },
  ];

  const categories = [
    { id: 'organic', name: 'Organic & Classic', fonts: organicFonts },
    { id: 'technical', name: 'Technical & Modern', fonts: technicalFonts }
  ];

  let activeCategory = $state('organic');
</script>

<section id="font-switcher" class="py-20 bg-card/20 border-t border-border/30" in:fly={{ y: 50 }}>
  <div class="container mx-auto px-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl relative">
        <button 
          class="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          onclick={() => uiState.showFontSwitcher = false}
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex flex-col items-center mb-12">
          <h2 class="text-3xl font-bold font-slab bg-gradient-to-l from-secondary to-primary bg-clip-text text-transparent flex items-center gap-3">
            <Palette class="w-8 h-8 text-primary" />
            Font Playground
          </h2>
        </div>

        <div class="flex justify-center gap-4 mb-10">
          {#each categories as cat}
            <button
              class="px-6 py-2 rounded-full text-sm font-bold transition-all {activeCategory === cat.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}"
              onclick={() => activeCategory = cat.id}
            >
              {cat.name}
            </button>
          {/each}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each categories.find(c => c.id === activeCategory)?.fonts || [] as font}
            <div class="bg-background/40 border border-border/30 rounded-xl p-6 transition-all hover:border-primary/50 group {uiState.headlineFont === font.className || uiState.bodyFont === font.className ? 'ring-2 ring-primary/30 border-primary/50' : ''}">
              <div class="text-center mb-6">
                <h3 class="text-xl text-primary mb-2 {font.className}">{font.name}</h3>
                <div class="text-2xl font-bold py-2 {font.className}">
                  <LogoText useHeadlineFont={false} />
                </div>
              </div>
              
              <div class="flex flex-col gap-2">
                <button
                  class="w-full py-2 text-xs font-bold rounded-lg transition-all {font.className} {uiState.headlineFont === font.className ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}"
                  onclick={() => uiState.headlineFont = font.className}
                >
                  Set Headline
                </button>
                <button
                  class="w-full py-2 text-xs font-bold rounded-lg transition-all {font.className} {uiState.bodyFont === font.className ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}"
                  onclick={() => uiState.bodyFont = font.className}
                >
                  Set Body
                </button>
              </div>
            </div>
          {/each}
        </div>
        
        <p class="text-center text-xs text-muted-foreground mt-10 italic">Select a font to apply it to headlines or body text across the site.</p>
      </div>
    </div>
  </div>
</section>
