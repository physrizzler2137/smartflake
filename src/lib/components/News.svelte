<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { Newspaper, ChevronUp, ChevronLeft, ChevronRight, CalendarDays, MapPin, User, Loader2 } from 'lucide-svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import placeholderData from '$lib/placeholder-images.json';

  // State
  let news = $state<any[]>([]);
  let isLoading = $state(true);
  let page = $state(1);
  let itemsPerPage = 2;
  let openItem = $state<string | null>(null);
  let isHovering = $state(false);
  let animationDirection = $state<'left' | 'right' | null>(null);

  // Derived
  const totalPages = $derived(news.length > 0 ? Math.ceil(news.length / itemsPerPage) : 0);
  const currentNews = $derived(news.slice((page - 1) * itemsPerPage, page * itemsPerPage));

  // Autoplay
  let autoplayTimer: any;

  async function fetchNews() {
    isLoading = true;
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Supabase query error:', error);
      }
      
      if (data) {
        news = data.map(item => {
          let url = item.imageUrl || '';
          if (item.imageId) {
            const placeholder = placeholderData.placeholderImages.find(p => p.id === item.imageId);
            if (placeholder) {
              url = placeholder.imageUrl;
            }
          }
          return { ...item, imageUrl: url };
        });
      }
    } catch (e) {
      console.error('Supabase fetch error:', e);
    } finally {
      isLoading = false;
    }
  }

  function handlePageChange(newPage: number) {
    if (totalPages <= 1) return;
    
    let target = newPage;
    if (target > totalPages) target = 1;
    if (target < 1) target = totalPages;
    
    if (target === page) return;

    animationDirection = target > page ? 'left' : 'right';
    page = target;
    
    setTimeout(() => {
        animationDirection = null;
    }, 500);
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isHovering && !openItem && totalPages > 1) {
      autoplayTimer = setInterval(() => {
        handlePageChange(page + 1);
      }, 5000);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  onMount(() => {
    fetchNews();
  });

  onDestroy(() => {
    stopAutoplay();
  });

  $effect(() => {
    if (!isHovering && !openItem && totalPages > 1) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  });

  function formatDate(dateStr: string) {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }).format(d);
    } catch (e) {
      return dateStr;
    }
  }
</script>

<section 
  id="news" 
  class="py-20 sm:py-32 bg-card/10 overflow-hidden"
  onmouseenter={() => isHovering = true}
  onmouseleave={() => isHovering = false}
>
  <div class="container mx-auto px-6 max-w-6xl">
    <div class="mb-16 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold font-slab text-primary mb-4 flex items-center justify-center gap-3">
        <Newspaper class="w-8 h-8" />
        Latest News
      </h2>
    </div>

    {#if isLoading}
      <div class="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 class="w-10 h-10 animate-spin text-primary" />
        <p class="text-sm font-mono uppercase tracking-widest text-muted-foreground">Synchronizing Archives...</p>
      </div>
    {:else if news.length === 0}
      <div class="text-center bg-card/40 border border-border/50 p-12 rounded-2xl">
        <p class="text-muted-foreground mb-4">No transmission records available at this time.</p>
      </div>
    {:else}
      <div class="relative min-h-[400px] grid grid-cols-1 grid-rows-1">
        {#key page}
          <div 
            class="space-y-6 col-start-1 row-start-1 w-full"
            in:fly={{ x: animationDirection === 'left' ? 50 : -50, duration: 500 }}
            out:fly={{ x: animationDirection === 'left' ? -50 : 50, duration: 300 }}
          >
            {#each currentNews as item}
              <div class="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
                <div class="relative">
                  {#if item.imageUrl}
                    <button 
                      class={cn(
                        "absolute z-20 rounded-lg overflow-hidden transition-all duration-700 ease-in-out cursor-pointer",
                        openItem === item.id 
                          ? "top-24 left-6 right-6 w-[calc(100%-3rem)] aspect-video shadow-2xl" 
                          : "top-6 left-6 w-24 aspect-[4/3] shadow-md group-hover:scale-105"
                      )}
                      onclick={() => openItem = openItem === item.id ? null : item.id}
                    >
                      <img src={item.imageUrl} alt={item.title} class="w-full h-full object-cover" />
                    </button>
                  {/if}

                  <button 
                    class={cn(
                      "w-full text-left p-6 transition-all duration-700 ease-in-out flex items-center justify-between",
                      item.imageUrl && (openItem !== item.id ? "pl-36" : "pb-6")
                    )}
                    onclick={() => openItem = openItem === item.id ? null : item.id}
                  >
                    <div class="flex-1">
                      <h3 class={cn("font-slab text-xl transition-colors", openItem === item.id ? "text-primary" : "text-foreground group-hover:text-primary")}>
                        {@html item.title}
                      </h3>
                      <div class="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono text-muted-foreground">
                        <div class="flex items-center gap-1.5"><CalendarDays class="w-3.5 h-3.5 text-primary" /><span>{formatDate(item.date)}</span></div>
                        {#if item.location}<div class="flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5" /><span>{item.location}</span></div>{/if}
                        {#if item.author}<div class="flex items-center gap-1.5"><User class="w-3.5 h-3.5" /><span>By {item.author}</span></div>{/if}
                      </div>
                    </div>
                    <ChevronUp class={cn("w-5 h-5 transition-transform duration-500", openItem !== item.id && "rotate-180")} />
                  </button>

                  {#if openItem === item.id}
                    <div class="px-6 pb-8" transition:slide={{ duration: 500 }}>
                      <div class={cn(item.imageUrl && "mt-[calc(56.25%_+_1rem)]")}>
                        <div class="pt-6 border-t border-border/50 text-muted-foreground text-justify leading-relaxed" in:fade={{ delay: 300 }}>
                          {@html item.content}
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/key}
      </div>

      {#if totalPages > 1}
        <div class="flex justify-center items-center mt-12 gap-2">
          <button class="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-gradient-soft hover:text-primary-foreground transition-colors disabled:opacity-30" onclick={() => handlePageChange(page - 1)}><ChevronLeft class="w-5 h-5" /></button>
          {#each Array.from({ length: totalPages }) as _, i}
            <button class={cn("w-10 h-10 rounded-full font-mono text-sm transition-all", page === i + 1 ? "bg-gradient-soft text-primary-foreground shadow-lg shadow-primary/20" : "border border-border/50 hover:border-primary/50")} onclick={() => handlePageChange(i + 1)}>{i + 1}</button>
          {/each}
          <button class="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-gradient-soft hover:text-primary-foreground transition-colors disabled:opacity-30" onclick={() => handlePageChange(page + 1)}><ChevronRight class="w-5 h-5" /></button>
        </div>
      {/if}
    {/if}
  </div>
</section>
