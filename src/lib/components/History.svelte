<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { historyMilestones as staticMilestones } from '$lib/data';
  import { Milestone, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  let historyMilestones = $state<any[]>([]);
  let isLoading = $state(true);
  let isLineVisible = $state(false);
  let visibleItems = $state<Set<number>>(new Set());
  let timelineEl: HTMLDivElement;
  let magnifiedImageIndex = $state<number | null>(null);

  const imageMilestones = $derived(historyMilestones.filter(m => m.image));

  function showNextImage() {
    if (magnifiedImageIndex === null) return;
    const currentListIndex = imageMilestones.findIndex(m => m === historyMilestones[magnifiedImageIndex]);
    const nextListIndex = (currentListIndex + 1) % imageMilestones.length;
    magnifiedImageIndex = historyMilestones.indexOf(imageMilestones[nextListIndex]);
  }

  function showPrevImage() {
    if (magnifiedImageIndex === null) return;
    const currentListIndex = imageMilestones.findIndex(m => m === historyMilestones[magnifiedImageIndex]);
    const prevListIndex = (currentListIndex - 1 + imageMilestones.length) % imageMilestones.length;
    magnifiedImageIndex = historyMilestones.indexOf(imageMilestones[prevListIndex]);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (magnifiedImageIndex === null) return;
    if (e.key === 'Escape') magnifiedImageIndex = null;
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }

  onMount(async () => {
    // 1. Fetch data from Supabase
    try {
      const { data, error } = await supabase
        .from('history_milestones')
        .select('*')
        .order('year', { ascending: true });
        
      if (error) throw error;
      if (data && data.length > 0) {
        historyMilestones = data;
      } else {
        // Fallback to static data if Supabase returns nothing
        historyMilestones = staticMilestones;
      }
    } catch (e) {
      console.error("Error fetching milestones:", e);
      // Fallback to static data on error
      historyMilestones = staticMilestones;
    } finally {
      isLoading = false;
    }
  });

  // Action for the central line
  function observeLine(node: HTMLElement) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) isLineVisible = true;
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  // Action for individual cards — bidirectional: animates on entry AND exit
  function observeCard(node: HTMLElement, index: number) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const newSet = new Set(visibleItems);
        if (entry.isIntersecting) {
          newSet.add(index);
        } else {
          // Remove so it re-animates next time it scrolls into view
          newSet.delete(index);
        }
        visibleItems = newSet;
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<section id="history" class="py-20 sm:py-32 bg-secondary/10">
  <div class="container mx-auto px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Milestone class="w-8 h-8 text-primary" />
          Our Journey
        </h2>
      </div>

      {#if isLoading}
        <div class="flex justify-center items-center py-20">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>
      {:else if historyMilestones.length === 0}
        <div class="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/30 rounded-xl border border-border/50">
          <Milestone class="w-12 h-12 mb-4 opacity-50" />
          <p class="text-lg font-medium">No milestones found.</p>
          <p class="text-sm">If you just ran the SQL script, check your browser console for database errors.</p>
        </div>
      {:else}
        <div class="timeline-wrapper relative py-10">
        <!-- Central vertical line -->
        <div class="timeline-line" use:observeLine class:visible={isLineVisible}></div>

        <!-- Milestones -->
        {#each historyMilestones as milestone, i}
          {@const isLeft = i % 2 === 0}
          {@const isLast = i === historyMilestones.length - 1}
          <div
            data-index={i}
            class="milestone-row mb-10 flex items-center justify-center w-full gap-4 md:gap-8"
            class:is-left={isLeft}
            use:observeCard={i}
          >
            <!-- Empty spacer (desktop only) -->
            <div class="hidden md:block w-5/12 shrink-0"></div>

            <!-- Year badge on the line -->
            <div class="z-20 flex items-center justify-center w-16 h-16 flex-shrink-0">
              <div
                class="year-badge flex items-center justify-center rounded-full w-14 h-14 shadow-xl ring-4 ring-background"
                class:visible={visibleItems.has(i)}
                class:is-last={isLast}
              >
                <span class="font-bold text-sm text-primary-foreground">{milestone.year}</span>
              </div>
            </div>

            <!-- Card with signpost swing-in -->
            <div
              class="card-wrapper w-full md:w-5/12 shrink-0"
              class:swing-left={!isLeft && visibleItems.has(i)}
              class:swing-right={isLeft && visibleItems.has(i)}
              class:is-left={isLeft}
              style="
                --delay: {(i % 3) * 150}ms; 
                --duration: {1.4 + ((i * 17) % 7) * 0.25}s;
                --rot-end: {((i * 13) % 7) - 3}deg;
              "
            >
              <div class="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg px-6 py-5 hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
                <div class="flex items-end gap-4">
                  {#if milestone.image}
                    <button 
                      class="relative w-[72px] h-[72px] rounded-lg overflow-hidden flex-shrink-0 shadow-md cursor-pointer hover:animate-pop-then-wiggle border border-border/50"
                      onclick={() => magnifiedImageIndex = i}
                      aria-label="View image for {milestone.title}"
                    >
                      <img src={milestone.image} alt={milestone.image_alt} class="w-full h-full object-cover" />
                    </button>
                  {/if}
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-lg font-slab text-primary truncate leading-none mb-2">{milestone.title}</h4>
                    <p class="text-sm leading-relaxed text-muted-foreground text-justify line-clamp-2 h-[46px]">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      {/if}
    </div>
  </div>
</section>

<!-- Lightbox (Polaroid Style) -->
{#if magnifiedImageIndex !== null}
  <div 
    class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    transition:fade={{ duration: 300 }}
    onclick={() => magnifiedImageIndex = null}
    aria-label="Close lightbox"
    role="button"
    tabindex="0"
    onkeydown={(e) => { if (e.key === 'Enter') magnifiedImageIndex = null; }}
  >
    <button 
      class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
      onclick={() => magnifiedImageIndex = null}
      aria-label="Close"
    >
      <X class="w-10 h-10" />
    </button>

    <button 
      class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
      onclick={(e) => { e.stopPropagation(); showPrevImage(); }}
      aria-label="Previous image"
    >
      <ChevronLeft class="w-12 h-12" />
    </button>

    <div 
      class="relative w-full max-w-2xl"
      onclick={(e) => e.stopPropagation()}
      in:scale={{ start: 0.95, duration: 300 }}
      role="presentation"
    >
      <!-- Polaroid Container -->
      <div class="bg-white p-4 pb-16 sm:p-6 sm:pb-20 shadow-2xl rounded-sm transform -rotate-2 hover:rotate-0 transition-transform duration-300">
        <div class="aspect-square w-full bg-neutral-100 overflow-hidden relative">
          <img 
            src={historyMilestones[magnifiedImageIndex].image} 
            alt={historyMilestones[magnifiedImageIndex].image_alt}
            class="w-full h-full object-cover"
          />
        </div>
        <div class="mt-6 text-center">
          <p class="font-slab italic text-lg text-neutral-800">{historyMilestones[magnifiedImageIndex].image_alt}</p>
        </div>
      </div>
    </div>

    <button 
      class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
      onclick={(e) => { e.stopPropagation(); showNextImage(); }}
      aria-label="Next image"
    >
      <ChevronRight class="w-12 h-12" />
    </button>
  </div>
{/if}

<style>
  /* ── Timeline Line ─────────────────────────────────── */
  .timeline-line {
    position: absolute;
    left: 1rem;
    top: 0;
    width: 2px;
    height: 0;
    background: hsl(var(--primary) / 0.2);
    transform-origin: top;
    transition: height 2s ease-out;
  }

  .timeline-line.visible {
    height: 100%;
  }

  @media (min-width: 768px) {
    .timeline-line {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  /* ── Milestone row (desktop: alternate left/right) ── */
  .milestone-row.is-left {
    flex-direction: row;
  }

  @media (min-width: 768px) {
    .milestone-row.is-left {
      flex-direction: row-reverse;
    }
  }

  /* ── Year Badge ────────────────────────────────────── */
  .year-badge {
    background: hsl(var(--muted) / 0.3);
    transform: scale(0);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                background 0.4s ease;
  }

  .year-badge.visible {
    background-color: hsl(var(--primary));
    background-image: linear-gradient(135deg, transparent 40%, hsl(var(--secondary) / 0.4));
    transform: scale(1);
  }

  .year-badge.is-last.visible {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  /* ── Card Swing Animation ──────────────────────────── */
  .timeline-wrapper {
    perspective: 1200px;
  }

  .card-wrapper {
    transform-style: preserve-3d;
    opacity: 0;
    /* Default: right-side card, pivot from left edge */
    transform-origin: left center;
    transform: rotateY(-90deg);
  }

  .card-wrapper.is-left {
    /* Left-side card, pivot from right edge */
    transform-origin: right center;
    transform: rotateY(90deg);
  }

  /* Right-side cards swing in from left */
  .card-wrapper.swing-left {
    animation: signpost-from-left var(--duration, 1.5s) ease-out var(--delay, 0ms) forwards;
  }

  /* Left-side cards swing in from right */
  .card-wrapper.swing-right {
    animation: signpost-from-right var(--duration, 1.5s) ease-out var(--delay, 0ms) forwards;
  }

  @keyframes signpost-from-left {
    0% {
      transform: rotateY(-90deg);
      opacity: 0;
    }
    40% {
      opacity: 1;
      transform: rotateY(25deg);
    }
    60% {
      transform: rotateY(-15deg);
    }
    80% {
      transform: rotateY(7deg);
    }
    90% {
      transform: rotateY(-2deg);
    }
    100% {
      transform: rotateY(var(--rot-end, 0deg));
      opacity: 1;
    }
  }

  @keyframes signpost-from-right {
    0% {
      transform: rotateY(90deg);
      opacity: 0;
    }
    40% {
      opacity: 1;
      transform: rotateY(-25deg);
    }
    60% {
      transform: rotateY(15deg);
    }
    80% {
      transform: rotateY(-7deg);
    }
    90% {
      transform: rotateY(2deg);
    }
    100% {
      transform: rotateY(var(--rot-end, 0deg));
      opacity: 1;
    }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4); }
    50% { box-shadow: 0 0 20px 6px hsl(var(--primary) / 0.2); }
  }
</style>
