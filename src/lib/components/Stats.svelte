<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  interface Stat {
    valueStore: any;
    label: string;
    super?: string;
    decimals: number;
  }

  let isLoading = $state(true);
  
  let projectsCount = tweened(0, { duration: 2000, easing: cubicOut });
  let publicationsCount = tweened(0, { duration: 2000, easing: cubicOut });
  let totalImpactFactor = tweened(0, { duration: 2000, easing: cubicOut });
  let hIndex = tweened(0, { duration: 2000, easing: cubicOut });
  let totalFunding = tweened(0, { duration: 2000, easing: cubicOut });

  let activeCoinIndex = $state<number | null>(null);
  let hasAnimated = false;
  let sectionRef: HTMLElement;

  onMount(() => {
    (async () => {
      try {
      const [projectsRes, pubsRes] = await Promise.all([
        pb.collection('projects').getFullList({ fields: 'budget' }),
        pb.collection('publications').getFullList({ fields: 'impact_factor' })
      ]);

      const pCount = projectsRes?.length || 0;
      const pubCount = pubsRes?.length || 0;
      const funding = projectsRes?.reduce((acc, p) => acc + (p.budget || 0), 0) || 0;
      const impactFactor = pubsRes?.reduce((acc, p) => acc + (p.impact_factor || 0), 0) || 0;

      // Intersection Observer to trigger animation
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          hasAnimated = true;
          projectsCount.set(pCount);
          publicationsCount.set(pubCount);
          totalImpactFactor.set(impactFactor);
          hIndex.set(42);
          
          if (funding >= 1000000) {
            totalFunding.set(funding / 1000000);
          } else if (funding >= 1000) {
            totalFunding.set(funding / 1000);
          } else {
            totalFunding.set(funding);
          }
        }
      }, { threshold: 0.3 });

      if (sectionRef) observer.observe(sectionRef);

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      isLoading = false;
    }
    })();

    activeCoinIndex = Math.floor(Math.random() * 5);
    const interval = setInterval(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * 5);
      } while (nextIndex === activeCoinIndex);
      activeCoinIndex = nextIndex;
    }, 8000);

    return () => clearInterval(interval);
  });

  let stats = $derived([
    { value: $projectsCount, label: 'Projects', super: '+', decimals: 0 },
    { value: $publicationsCount, label: 'Publications', super: '+', decimals: 0 },
    { value: $totalImpactFactor, label: 'Impact Factor', decimals: 1 },
    { value: $hIndex, label: 'Hirsch Index', decimals: 0 },
    { value: $totalFunding, label: 'Total Funding', super: 'M+', decimals: 1 } // Hardcoded M+ for now since budget is 1.6M
  ]);

  let stars = Array.from({ length: 12 }).map((_, i) => {
    const angle = Math.random() * 2 * Math.PI;
    const radius = 24 + Math.random() * 24;
    const x = 50 + (radius / 96) * 100 * Math.cos(angle);
    const y = 50 + (radius / 96) * 100 * Math.sin(angle);
    return {
      id: i,
      x: `${x}%`,
      y: `${y}%`,
      duration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
      delay: `${(Math.random() * 5).toFixed(2)}s`,
      size: Math.random() * 1.5 + 1
    };
  });
</script>

<style>
  @keyframes bling-pop {
    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(var(--star-size)); }
  }
  .animate-bling-pop {
    animation: bling-pop var(--animation-duration) ease-in-out infinite;
    animation-delay: var(--animation-delay);
  }
  .coin-outer {
    background: linear-gradient(135deg, #c5a059 0%, #f1f1ae 50%, #8c7336 100%);
  }
  .coin-inner {
    background: linear-gradient(135deg, #f1f1ae 0%, #c5a059 50%, #5e4a1a 100%);
  }
</style>

<section bind:this={sectionRef} id="stats" class="py-16 sm:py-20 border-y border-border/50 bg-gradient-to-r from-background via-secondary/10 to-background">
  <div class="container mx-auto px-6 max-w-6xl">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
        SMaRT-Lab in numbers
      </h2>
    </div>
    
    {#if isLoading}
      <div class="flex justify-center items-center py-10">
        <div class="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 text-center" in:fade={{ duration: 500 }}>
        {#each stats as stat, index}
          <div class="relative flex flex-col items-center">
            <div class="relative w-24 h-24 transition-transform duration-500 hover:scale-110">
              <div class="relative flex items-center justify-center coin-outer shadow-[0_8px_16px_rgba(140,115,54,0.3)] w-full h-full rounded-full p-1.5 {activeCoinIndex === index ? 'scale-110' : ''} transition-all duration-500">
                <div class="w-full h-full rounded-full coin-inner flex items-center justify-center shadow-[inset_0_4px_8px_rgba(94,74,26,0.4)]">
                  <p class="font-bold text-stone-900/80 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] font-slab {(stat.value.toFixed(stat.decimals) + (stat.super || '')).length > 4 ? 'text-lg' : 'text-2xl'}">
                    {stat.value.toFixed(stat.decimals)}{stat.super || ''}
                  </p>
                </div>
                
                {#if activeCoinIndex === index}
                  {#each stars as star}
                    <span 
                      class="absolute text-white pointer-events-none animate-bling-pop z-10"
                      style="top: {star.y}; left: {star.x}; --animation-duration: {star.duration}; --animation-delay: {star.delay}; --star-size: {star.size};"
                    >✦</span>
                  {/each}
                {/if}
              </div>
            </div>
            <p class="mt-4 text-sm md:text-base text-foreground/80 uppercase tracking-widest text-center font-medium">
              {stat.label}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
