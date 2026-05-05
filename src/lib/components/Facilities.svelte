<script lang="ts">
  import { facilities } from '$lib/data';
  import { Building, Beaker, Wrench, X, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-svelte';
  import { fade, fly, scale, slide } from 'svelte/transition';

  let magnifiedImageIndex = $state<number | null>(null);
  let openEquipmentAccordions = $state<Record<number, boolean>>({});

  const allEquipment = facilities.flatMap(f =>
    (f.equipment || []).filter(eq => eq.image).map(eq => ({
      ...eq,
      parsedImageUrl: eq.image,
    }))
  );

  function showNextImage() {
    if (magnifiedImageIndex === null) return;
    magnifiedImageIndex = (magnifiedImageIndex + 1) % allEquipment.length;
  }

  function showPrevImage() {
    if (magnifiedImageIndex === null) return;
    magnifiedImageIndex = (magnifiedImageIndex - 1 + allEquipment.length) % allEquipment.length;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (magnifiedImageIndex === null) return;
    if (event.key === 'ArrowRight') showNextImage();
    else if (event.key === 'ArrowLeft') showPrevImage();
    else if (event.key === 'Escape' || event.key === 'ArrowDown') magnifiedImageIndex = null;
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<section id="facilities" class="py-20 sm:py-32 bg-background border-y border-border/30 relative overflow-hidden">
  <div class="absolute inset-0 bg-primary/5 pointer-events-none"></div>
  <div class="container mx-auto px-6 relative z-10">
    <h2 class="text-3xl sm:text-4xl font-bold font-slab mb-16 text-center text-foreground flex items-center justify-center gap-3">
      <Building class="w-8 h-8 text-primary" />
      Facilities
    </h2>

    <div class="max-w-6xl mx-auto space-y-12">
      {#each facilities as facility, i}
        <div 
          class="group bg-card/40 border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1"
          in:fly={{ y: 20, delay: 200 + i * 150 }}
        >
          <div class="aspect-[21/6] relative overflow-hidden bg-muted/20">
            {#if facility.lightImage}
              <picture>
                <source srcset={facility.lightImage} type="image/webp" />
                <img
                  src={facility.lightImageFallback || facility.lightImage}
                  alt={facility.name}
                  class="w-full h-full object-cover"
                  style="object-position: {facility.imagePosition || 'center'}"
                  loading="lazy"
                />
              </picture>
            {/if}
            {#if facility.darkImage}
              <picture class="absolute inset-0">
                <source srcset={facility.darkImage} type="image/webp" />
                <img
                  src={facility.darkImageFallback || facility.darkImage}
                  alt={facility.name}
                  class="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 opacity-100 group-hover:opacity-0"
                  style="object-position: {facility.imagePosition || 'center'}"
                  loading="lazy"
                />
              </picture>
            {/if}
            <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none"></div>
          </div>

          <div class="p-8">
            <div class="flex flex-col md:flex-row md:items-start gap-4 mb-6">
              <div class="p-3 rounded-xl bg-primary/10 text-primary">
                <Beaker class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-2xl font-bold font-slab text-foreground mb-1">{facility.name}</h3>
                <p class="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  Lab Code: <span class="text-primary">{facility.code}</span>
                </p>
              </div>
            </div>

            <p class="text-muted-foreground leading-relaxed text-justify mb-8 text-lg font-light">
              {facility.description}
            </p>

            {#if facility.equipment && facility.equipment.length > 0}
              <div class="border-t border-border/50 pt-8">
                <button 
                  class="w-full text-left flex items-center justify-between group/acc"
                  onclick={() => openEquipmentAccordions[i] = !openEquipmentAccordions[i]}
                >
                  <h4 class="text-sm font-semibold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Wrench 
                      class="w-4 h-4 transition-transform duration-500 {openEquipmentAccordions[i] ? 'rotate-180' : 'wrench-wiggle'}" 
                    />
                    Key Equipment
                  </h4>
                  <ChevronUp class="w-4 h-4 text-muted-foreground group-hover/acc:text-primary transition-transform duration-500 {openEquipmentAccordions[i] ? '' : 'rotate-180'}" />
                </button>
                
                {#if openEquipmentAccordions[i]}
                  <div 
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8 overflow-hidden"
                    transition:slide={{ duration: 400 }}
                  >
                    {#each facility.equipment as eq}
                      <button 
                        class="flex flex-col items-center group/eq"
                        onclick={() => {
                          const index = allEquipment.findIndex(e => e.name === eq.name);
                          if (index !== -1) magnifiedImageIndex = index;
                        }}
                      >
                        <div class="aspect-square w-full rounded-lg overflow-hidden bg-muted/30 border border-border/50 group-hover/eq:border-primary/50 transition-colors">
                          {#if eq.image}
                            <img 
                              src={eq.image} 
                              alt={eq.name}
                              class="w-full h-full object-cover group-hover/eq:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          {:else}
                            <div class="w-full h-full flex items-center justify-center text-muted-foreground/30">
                              <Wrench class="w-8 h-8" />
                            </div>
                          {/if}
                        </div>
                        <span class="mt-3 text-xs text-center text-muted-foreground group-hover/eq:text-foreground transition-colors line-clamp-2 px-1">
                          {@html eq.name}
                        </span>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Lightbox (Polaroid Style) -->
{#if magnifiedImageIndex !== null}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    transition:fade={{ duration: 300 }}
    onclick={() => magnifiedImageIndex = null}
  >
    <button 
      class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
      onclick={() => magnifiedImageIndex = null}
    >
      <X class="w-10 h-10" />
    </button>

    <button 
      class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
      onclick={(e) => { e.stopPropagation(); showPrevImage(); }}
    >
      <ChevronLeft class="w-12 h-12" />
    </button>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="relative w-full max-w-4xl"
      onclick={(e) => e.stopPropagation()}
      in:scale={{ start: 0.95, duration: 300 }}
    >
      <!-- Polaroid Container -->
      <div class="bg-white p-4 pb-20 sm:p-6 sm:pb-24 shadow-2xl rounded-sm transform rotate-1">
        <div class="aspect-square w-full bg-neutral-100 overflow-hidden relative">
          <img 
            src={allEquipment[magnifiedImageIndex].parsedImageUrl} 
            alt={allEquipment[magnifiedImageIndex].name}
            class="w-full h-full object-cover"
          />
        </div>
        <div class="absolute bottom-6 left-0 right-0 text-center">
          <p class="font-serif italic text-xl sm:text-2xl text-neutral-800 px-4">
            {@html allEquipment[magnifiedImageIndex].name}
          </p>
        </div>
      </div>
    </div>

    <button 
      class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
      onclick={(e) => { e.stopPropagation(); showNextImage(); }}
    >
      <ChevronRight class="w-12 h-12" />
    </button>
  </div>
{/if}

<style>
  :global(.wrench-wiggle) {
    animation: wiggle 2.5s ease-in-out infinite;
    transform-origin: center center;
  }

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    10% { transform: rotate(-12deg); }
    20% { transform: rotate(10deg); }
    30% { transform: rotate(-8deg); }
    40% { transform: rotate(4deg); }
    50%, 100% { transform: rotate(0deg); }
  }
</style>
