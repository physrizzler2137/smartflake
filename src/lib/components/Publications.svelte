<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { pb } from '$lib/pocketbase';
  import { BookMarked, ExternalLink, Loader2 } from 'lucide-svelte';

  interface Publication {
    id: string;
    year: number;
    title: string;
    authors: string[];
    journal: string;
    abstract: string | null;
    doi: string | null;
    impact_factor: number | null;
    external_link: string | null;
    journal_link: string | null;
  }

  let publications: Publication[] = $state([]);
  let isLoading = $state(true);
  
  let publicationsByYear = $derived(() => {
    return publications.reduce((acc, pub) => {
      const year = pub.year.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(pub);
      return acc;
    }, {} as Record<string, Publication[]>);
  });
  
  let sortedYears = $derived(() => {
    return Object.keys(publicationsByYear()).sort((a, b) => Number(b) - Number(a));
  });

  onMount(async () => {
    try {
      const data = await pb.collection('publications').getFullList({
        sort: '-year',
      });
        
      if (data) publications = data as unknown as Publication[];
    } catch (e) {
      console.error("Error fetching publications:", e);
    } finally {
      isLoading = false;
    }
  });
</script>

<section id="publications" class="py-20 sm:py-32 overflow-hidden">
  <div class="container mx-auto px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
          <BookMarked class="w-8 h-8 text-primary" />
          Publications
        </h2>
      </div>

      {#if isLoading}
        <div class="flex justify-center items-center py-20">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>
      {:else if publications.length === 0}
        <div class="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/50 rounded-xl border border-border">
          <BookMarked class="w-12 h-12 mb-4 opacity-50" />
          <p class="text-lg font-medium">No publications found.</p>
        </div>
      {:else}
        <div class="space-y-12">
          {#each sortedYears() as year, yearIndex}
            <div in:fly={{ y: 20, duration: 600, delay: yearIndex * 150 }}>
              <h3 class="text-2xl font-bold font-slab mb-6 border-b border-border pb-3 text-foreground">{year}</h3>
              <ul class="space-y-6">
                {#each publicationsByYear()[year] as pub, pubIndex (pub.id)}
                  <li 
                    in:fly={{ y: 10, duration: 400, delay: (yearIndex * 150) + (pubIndex * 50) }}
                    class="flex items-start gap-4"
                  >
                    <BookMarked class="w-5 h-5 text-primary mt-1 shrink-0"/>
                    <div>
                        <p class="font-semibold text-foreground">
                          {#if pub.external_link}
                            <a href={pub.external_link} target="_blank" rel="noopener noreferrer" class="group inline-flex flex-wrap items-center gap-2 hover:text-primary transition-colors">
                              <span>{pub.title}</span>
                              <ExternalLink class="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                          {:else}
                            {pub.title}
                          {/if}
                        </p>
                        <p class="text-sm text-muted-foreground mt-1">
                          {pub.authors.join(', ')}
                        </p>
                        <p class="text-sm text-primary/80 italic mt-1">
                          {#if pub.journal_link}
                            <a href={pub.journal_link} target="_blank" rel="noopener noreferrer" class="hover:underline">
                              {pub.journal}
                            </a>
                          {:else}
                            {pub.journal}
                          {/if}
                          {#if pub.doi}
                            <span class="not-italic text-muted-foreground">
                              , doi: {pub.doi}
                            </span>
                          {/if}
                        </p>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>
