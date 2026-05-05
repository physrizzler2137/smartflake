<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { Sparkles, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-svelte';
  import { slide } from 'svelte/transition';

  let highlights = $state<any[]>([]);
  let isLoading = $state(true);
  let page = $state(1);
  let itemsPerPage = 3;
  let openItem = $state<string | null>(null);

  const totalPages = $derived(Math.ceil(highlights.length / itemsPerPage));
  const currentHighlights = $derived(highlights.slice((page - 1) * itemsPerPage, page * itemsPerPage));

  async function fetchHighlights() {
    isLoading = true;
    try {
      const data = await pb.collection('research_highlights').getFullList({
        sort: 'display_order',
      });
        
      if (data) highlights = data;
    } catch (e) {
      console.error("Error fetching highlights:", e);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchHighlights();
  });

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    page = newPage;
    openItem = null;
  }
  
  function toggleItem(id: string) {
    openItem = openItem === id ? null : id;
  }
</script>

<section id="highlights" class="py-20 sm:py-32 overflow-hidden bg-background">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
        <Sparkles class="w-8 h-8 text-primary" />
        Research Highlights
      </h2>
    </div>

    <div class="max-w-6xl mx-auto">
      {#if isLoading}
        <div class="flex justify-center items-center py-20">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>
      {:else if highlights.length === 0}
        <div class="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/30 rounded-xl border border-border/50">
          <Sparkles class="w-12 h-12 mb-4 opacity-50" />
          <p class="text-lg font-medium">No highlights found.</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each currentHighlights as item (item.id)}
            {@const isOpen = openItem === item.id}
            <div class="group bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
              
              <!-- Accordion Header -->
              <button 
                class="w-full text-left relative z-10 flex flex-col sm:flex-row p-4 sm:p-6 sm:items-start gap-4 sm:gap-6 transition-colors hover:bg-muted/30"
                onclick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
              >
                <!-- Image Container -->
                <div class="shrink-0 transition-all duration-500 ease-in-out {isOpen ? 'w-full sm:w-[40%] aspect-video' : 'w-24 sm:w-32 aspect-video sm:aspect-[4/3]'} rounded-lg overflow-hidden shadow-sm">
                  <img src={item.image} alt={item.title} class="w-full h-full object-cover" />
                </div>
                
                <div class="flex-1 flex items-start justify-between w-full">
                  <div>
                    <h3 class="font-slab text-lg sm:text-xl text-foreground transition-colors group-hover:text-primary leading-tight" class:text-primary={isOpen}>
                      {item.title}
                    </h3>
                    <p class="text-sm font-mono text-muted-foreground mt-2">{item.category}</p>
                  </div>
                  <ChevronUp class="w-5 h-5 shrink-0 transition-transform duration-300 text-muted-foreground ml-4 {isOpen ? 'rotate-0' : 'rotate-180'}" />
                </div>
              </button>

              <!-- Accordion Content -->
              {#if isOpen}
                <div transition:slide={{ duration: 300 }}>
                  <div class="px-4 sm:px-6 pb-6 pt-2">
                    <div class="border-t border-border/50 pt-4">
                      <p class="text-foreground/90 text-justify leading-relaxed">{item.description}</p>
                      
                      {#if item.link && item.link !== '#'}
                        <div class="mt-6">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-105 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 shadow-md shadow-primary/20"
                          >
                            Read More <ExternalLink class="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}

            </div>
          {/each}
        </div>

        {#if totalPages > 1}
          <div class="flex justify-center items-center mt-12 gap-2">
            <button
              class="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-50"
              onclick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>
            
            {#each Array.from({ length: totalPages }) as _, i}
              {@const pageNum = i + 1}
              <button
                class="w-10 h-10 rounded-full font-bold transition-all {page === pageNum ? 'bg-gradient-soft text-primary-foreground shadow-md' : 'border border-border text-muted-foreground hover:text-foreground hover:border-foreground'}"
                onclick={() => handlePageChange(pageNum)}
                aria-label="Page {pageNum}"
                aria-current={page === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            {/each}

            <button
              class="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-50"
              onclick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</section>
