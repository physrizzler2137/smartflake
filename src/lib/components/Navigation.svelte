<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { navLinks } from '$lib/data';
  import { cn } from '$lib/utils';
  import { Menu, X, Eye, EyeOff, AlignLeft } from 'lucide-svelte';
  import LogoText from './LogoText.svelte';

  let isOpen = $state(false);
  let isScrolled = $state(false);
  let isHighContrast = $state(false);
  let isFontMenuOpen = $state(false);
  let currentFontSize = $state('text-size-default');

  const fontSizes = [
    { id: 'text-size-default', label: 'Default Size' },
    { id: 'text-size-large', label: 'Large' },
    { id: 'text-size-larger', label: 'Larger' },
    { id: 'text-size-huge', label: 'Huge' },
    { id: 'text-size-humongous', label: 'Humongous' },
  ];

  function toggleHighContrast() {
    isHighContrast = !isHighContrast;
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }

  function setFontSize(sizeId: string) {
    fontSizes.forEach(s => document.documentElement.classList.remove(s.id));
    document.documentElement.classList.add(sizeId);
    currentFontSize = sizeId;
    isFontMenuOpen = false;
  }

  function closeMenus() {
    isOpen = false;
    isFontMenuOpen = false;
  }

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<svelte:window onclick={() => { if (isFontMenuOpen) isFontMenuOpen = false; }} />

<header
  class={cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
  )}
>
  <div class="container mx-auto px-6 h-20">
    <!-- Desktop Header -->
    <div class="hidden xl:flex items-center justify-between w-full h-full">
          <a href="#home" class="flex flex-col items-start group leading-none gap-0.5">
            <span class={cn(
              "text-2xl font-bold transition-colors leading-none",
              isScrolled ? "text-foreground group-hover:text-primary" : "text-white"
            )}>
              <LogoText animated={false} />
            </span>
            <span class={cn(
              "text-[10px] uppercase tracking-[0.2em] font-slab font-medium transition-colors leading-tight",
              isScrolled ? "text-muted-foreground" : "text-white/60"
            )}>Smart Materials &<br />Soft Robotics Lab</span>
          </a>
          
          <div class="flex items-center gap-8">
            <nav class="flex items-center gap-1">
              {#each navLinks as link}
                <a 
                  href={link.href} 
                  class={cn(
                    "px-4 py-2 rounded-md font-medium text-sm transition-all hover:scale-105",
                    isScrolled 
                      ? "text-foreground hover:bg-primary hover:text-primary-foreground" 
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                  onclick={closeMenus}
                >
                  {link.name}
                </a>
              {/each}
            </nav>
            
            <div class="flex items-center gap-3 border-l border-border/20 pl-6 ml-2">
              <div class="relative">
                <button
                  onclick={(e) => { e.stopPropagation(); isFontMenuOpen = !isFontMenuOpen; }}
                  class={cn(
                    "p-2 rounded-lg transition-all",
                    currentFontSize !== 'text-size-default' 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : isScrolled ? "hover:bg-muted text-foreground" : "text-white hover:bg-white/10"
                  )}
                  aria-label="Change font size"
                >
                  <AlignLeft class="w-5 h-5" />
                </button>
                {#if isFontMenuOpen}
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div class="absolute right-0 top-full mt-2 w-48 bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-xl py-2 overflow-hidden" onclick={(e) => e.stopPropagation()}>
                    {#each fontSizes as size}
                      <button 
                        class={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/10",
                          currentFontSize === size.id ? "text-primary font-bold bg-primary/5" : "text-foreground"
                        )}
                        onclick={() => setFontSize(size.id)}
                      >
                        {size.label}
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
              <button
                onclick={toggleHighContrast}
                class={cn(
                  "p-2 rounded-lg transition-all",
                  isHighContrast 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : isScrolled ? "hover:bg-muted text-foreground" : "text-white hover:bg-white/10"
                )}
                aria-label="Toggle high contrast mode"
              >
                <Eye class="w-5 h-5" />
              </button>
            </div>
          </div>
    </div>

    <!-- Mobile Header -->
    <div class="xl:hidden flex items-center justify-between h-full">
      <button 
        onclick={(e) => { e.stopPropagation(); isOpen = !isOpen; isFontMenuOpen = false; }} 
        class={cn(
          "p-2 rounded-lg transition-colors",
          isScrolled ? "hover:bg-muted text-foreground" : "text-white hover:bg-white/10"
        )}
      >
        {#if isOpen}
          <X class="w-6 h-6" />
        {:else}
          <Menu class="w-6 h-6" />
        {/if}
      </button>

      <a href="#home" class="flex flex-col items-center group">
        <span class={cn(
          "text-xl font-bold transition-colors",
          isScrolled ? "text-foreground" : "text-white"
        )}>
            <LogoText animated={false} />
        </span>
      </a>
      
      <div class="flex items-center gap-2">
        <div class="relative">
          <button
            onclick={(e) => { e.stopPropagation(); isFontMenuOpen = !isFontMenuOpen; isOpen = false; }}
            class={cn(
              "p-2 rounded-lg transition-colors",
              currentFontSize !== 'text-size-default'
                ? "bg-primary text-primary-foreground"
                : isScrolled ? "text-foreground" : "text-white"
            )}
            aria-label="Change text size"
          >
            <AlignLeft class="w-6 h-6" />
          </button>
          {#if isFontMenuOpen}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="absolute right-0 top-full mt-2 w-48 bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-xl py-2 overflow-hidden" onclick={(e) => e.stopPropagation()}>
              {#each fontSizes as size}
                <button
                  class={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/10",
                    currentFontSize === size.id ? "text-primary font-bold bg-primary/5" : "text-foreground"
                  )}
                  onclick={() => setFontSize(size.id)}
                >
                  {size.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>
        <button
          onclick={toggleHighContrast}
          class={cn(
            "p-2 rounded-lg transition-colors",
            isHighContrast ? "bg-primary text-primary-foreground" : isScrolled ? "text-foreground" : "text-white"
          )}
          aria-label="Toggle high contrast mode"
        >
          <Eye class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
  
  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="xl:hidden bg-background/40 backdrop-blur-2xl pb-4 border-b border-white/10 shadow-lg" onclick={(e) => e.stopPropagation()}>
      <nav class="px-8 flex flex-col items-start gap-2">
        {#each navLinks as link}
          <a
            href={link.href}
            class="w-full text-left px-4 py-3 rounded-md font-headline text-base hover:bg-primary hover:text-primary-foreground transition-colors"
            onclick={closeMenus}
          >
            {link.name}
          </a>
        {/each}
      </nav>
    </div>
  {/if}
</header>
