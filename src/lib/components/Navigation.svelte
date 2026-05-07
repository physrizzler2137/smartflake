<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import { navLinks } from '$lib/data';
  import { cn } from '$lib/utils';
  import { Menu, X, Eye, EyeOff, AlignLeft, LogOut, Ghost, Shield } from 'lucide-svelte';
  import LogoText from './LogoText.svelte';

  let isOpen = $state(false);
  let isScrolled = $state(false);
  let isHighContrast = $state(false);
  let isFontMenuOpen = $state(false);
  let currentFontSize = $state('text-size-default');

  let { forceScrolled = false, isAdmin = false, onLogout = () => {}, userEmail = "" } = $props();

  const fontSizes = [
    { id: 'text-size-default', label: 'Default' },
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
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-slab",
    (isScrolled || forceScrolled) ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : "bg-transparent"
  )}
>
  <!-- h-24 (96px) header strip with architectural offsets -->
  <div class="container mx-auto px-6 max-w-6xl h-24 flex flex-col justify-start pt-[30px]">
    <!-- Desktop Header -->
    <div class="hidden xl:flex items-baseline justify-between w-full">
          <!-- Logo Block -->
          <div class="flex flex-col group shrink-0 w-[140px] relative">
            <a href="/#home" class="flex flex-col group relative">
              <span class={cn(
                "text-2xl font-bold transition-colors leading-none inline-block",
                (isScrolled || forceScrolled) ? "text-foreground group-hover:text-primary" : "text-white"
              )}>
                <LogoText animated={false} justified={true} />
              </span>
              
              <div class={cn(
                "mt-2 text-[7.5px] uppercase font-slab font-medium transition-colors leading-tight w-full space-y-0.5",
                (isScrolled || forceScrolled) ? "text-muted-foreground" : "text-white/60"
              )}>
                <div class="flex justify-between w-full">
                  <span>S</span><span>M</span><span>A</span><span>R</span><span>T</span><span>&nbsp;</span><span>M</span><span>A</span><span>R</span><span>T</span><span>E</span><span>R</span><span>I</span><span>A</span><span>L</span><span>S</span><span>&nbsp;</span><span>&</span>
                </div>
                <div class="flex justify-between w-full">
                  <span>S</span><span>O</span><span>F</span><span>T</span><span>&nbsp;</span><span>R</span><span>O</span><span>T</span><span>I</span><span>C</span><span>S</span><span>&nbsp;</span><span>L</span><span>A</span><span>B</span>
                </div>
              </div>
            </a>
          </div>
          
          <!-- Navigation Block -->
          <nav class="flex-grow flex items-baseline justify-center px-12">
            <div class="flex items-baseline justify-between w-full max-w-5xl">
              {#each navLinks as link}
                <a 
                  href={link.href} 
                  class={cn(
                    "px-1 py-1 font-slab font-semibold text-[14px] tracking-tight transition-all hover:scale-105 whitespace-nowrap",
                    (isScrolled || forceScrolled) 
                      ? "text-foreground hover:text-primary" 
                      : "text-white/90 hover:text-white"
                  )}
                  onclick={closeMenus}
                >
                  {link.name}
                </a>
              {/each}
            </div>
          </nav>
          
          <!-- Accessibility & Auth Block -->
          <div class="flex items-center gap-2 shrink-0 border-l border-border/20 pl-4 h-6">
            {#if isAdmin}
              <div class="flex items-center gap-2 mr-2">
                <button
                  onclick={onLogout}
                  class="flex items-center gap-1.5 text-[10px] font-slab font-bold text-muted-foreground hover:text-destructive border border-border/50 hover:border-destructive/50 rounded-lg px-2 py-1 transition-all bg-card/30"
                >
                  <LogOut class="w-3 h-3" />
                  Exit
                </button>
              </div>
            {:else}
              <a 
                href="/admin" 
                class={cn(
                  "p-1.5 rounded-lg transition-all hover:bg-primary/10 group/admin",
                  (isScrolled || forceScrolled) ? "text-foreground/60 hover:text-primary" : "text-white/40 hover:text-white"
                )}
                aria-label="Admin Access"
              >
                <Ghost class="w-4 h-4 transition-transform group-hover/admin:scale-110" />
              </a>
            {/if}

            <div class="relative">
              <button
                onclick={(e) => { e.stopPropagation(); isFontMenuOpen = !isFontMenuOpen; }}
                class={cn(
                  "p-1.5 rounded-lg transition-all",
                  currentFontSize !== 'text-size-default' 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : (isScrolled || forceScrolled) ? "hover:bg-muted text-foreground" : "text-white hover:bg-white/10"
                )}
                aria-label="Change font size"
              >
                <AlignLeft class="w-4 h-4" />
              </button>
              {#if isFontMenuOpen}
                <div class="absolute right-0 top-full mt-2 w-48 bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-xl py-2 overflow-hidden font-slab" onclick={(e) => e.stopPropagation()}>
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
                "p-1.5 rounded-lg transition-all",
                isHighContrast 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : (isScrolled || forceScrolled) ? "hover:bg-muted text-foreground" : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle high contrast mode"
            >
              <Eye class="w-4 h-4" />
            </button>
          </div>
    </div>

    <!-- Mobile Header -->
    <div class="xl:hidden flex items-center justify-between h-full py-4">
      <button 
        onclick={(e) => { e.stopPropagation(); isOpen = !isOpen; isFontMenuOpen = false; }} 
        class={cn(
          "p-2 rounded-lg transition-colors",
          (isScrolled || forceScrolled) ? "hover:bg-muted text-foreground" : "text-white hover:bg-white/10"
        )}
      >
        {#if isOpen}
          <X class="w-6 h-6" />
        {:else}
          <Menu class="w-6 h-6" />
        {/if}
      </button>

      <a href="/#home" class="flex flex-col items-center group">
        <span class={cn(
          "text-xl font-bold transition-colors relative",
          (isScrolled || forceScrolled) ? "text-foreground" : "text-white"
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
                : (isScrolled || forceScrolled) ? "text-foreground" : "text-white"
            )}
            aria-label="Change text size"
          >
            <AlignLeft class="w-6 h-6" />
          </button>
          {#if isFontMenuOpen}
            <div class="absolute right-0 top-full mt-2 w-48 bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-xl py-2 overflow-hidden font-slab" onclick={(e) => e.stopPropagation()}>
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
            isHighContrast ? "bg-primary text-primary-foreground" : (isScrolled || forceScrolled) ? "text-foreground" : "text-white"
          )}
          aria-label="Toggle high contrast mode"
        >
          <Eye class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
  
  {#if isOpen}
    <div class="xl:hidden bg-background/40 backdrop-blur-2xl pb-4 border-b border-white/10 shadow-lg font-slab" onclick={(e) => e.stopPropagation()}>
      <nav class="px-8 flex flex-col items-start gap-2">
        {#each navLinks as link}
          <a
            href={link.href}
            class="w-full text-left px-4 py-3 rounded-md font-slab font-bold text-base hover:bg-primary hover:text-primary-foreground transition-colors"
            onclick={closeMenus}
          >
            {link.name}
          </a>
        {/each}
        {#if isAdmin}
          <button
            onclick={onLogout}
            class="w-full text-left px-4 py-3 rounded-md font-slab font-bold text-base text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors mt-2 border-t border-border/30 pt-4 flex items-center gap-3"
          >
            <LogOut class="w-5 h-5" />
            Sign Out
          </button>
        {:else}
          <a
            href="/admin"
            class="w-full text-left px-4 py-3 rounded-md font-slab font-bold text-base hover:bg-primary hover:text-primary-foreground transition-colors mt-2 border-t border-border/30 pt-4 flex items-center gap-3"
            onclick={closeMenus}
          >
            <Ghost class="w-5 h-5" />
            Admin Panel
          </a>
        {/if}
      </nav>
    </div>
  {/if}
</header>
