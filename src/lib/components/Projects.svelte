<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { pb } from '$lib/pocketbase';
  import { staticProjects } from '$lib/data';
  import { Lightbulb, Calendar, Landmark, Banknote, ExternalLink, Loader2 } from 'lucide-svelte';

  interface Project {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    status: string;
    funding_source: string;
    funding_source_url: string | null;
    budget: number;
    research_area: string;
  }

  let projects: Project[] = $state([]);
  let isLoading = $state(true);

  onMount(async () => {
    try {
      const data = await pb.collection('projects').getFullList({
        sort: '-start_date',
      });
        
      const dbProjects = (data as unknown as Project[]) || [];
      const mergedProjects = [...dbProjects];

      // Add static projects that aren't already in the DB
      staticProjects.forEach(staticProj => {
        const exists = dbProjects.some(dbProj => 
          dbProj.title.toLowerCase().trim() === staticProj.title.toLowerCase().trim()
        );
        if (!exists) {
          mergedProjects.push({
            ...staticProj,
            description: `A research project focused on ${staticProj.title.toLowerCase()}.`
          } as any);
        }
      });

      projects = mergedProjects.sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
    } catch (e) {
      console.error("Error fetching projects:", e);
      projects = staticProjects as any;
    } finally {
      isLoading = false;
    }
  });

</script>

<section id="projects" class="py-20 sm:py-32 bg-secondary/10 overflow-hidden">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
        <Lightbulb class="w-8 h-8 text-primary" />
        Projects
      </h2>
    </div>
    
    <div class="max-w-6xl mx-auto">
      {#if isLoading}
        <div class="flex justify-center items-center py-20">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>
      {:else if projects.length === 0}
        <div class="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/50 rounded-xl border border-border">
          <Lightbulb class="w-12 h-12 mb-4 opacity-50" />
          <p class="text-lg font-medium">No projects found.</p>
        </div>
      {:else}
        <div class="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {#each projects as project, i (project.id)}
            <div 
              in:fly={{ y: 20, duration: 600, delay: i * 100 }}
              class="flex flex-col bg-card rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full border border-border/50"
            >
              <div class="p-6 sm:p-8 flex-grow flex flex-col">
                <h3 class="font-slab font-bold text-xl mb-6 text-foreground">{project.title}</h3>
                
                <div class="space-y-4 text-sm text-muted-foreground flex-grow">
                  {#if project.funding_source}
                    <div class="flex items-start gap-3">
                      <Landmark class="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <p class="flex-1">
                        <span class="font-semibold text-foreground/90">Funding provided by: </span>
                        {#if project.funding_source_url}
                          <a href={project.funding_source_url} target="_blank" rel="noopener noreferrer" class="group inline-flex flex-wrap items-center gap-1 hover:text-primary transition-colors">
                            <span>{project.funding_source}</span>
                            <ExternalLink class="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        {:else}
                          <span>{project.funding_source}</span>
                        {/if}
                      </p>
                    </div>
                  {/if}
                  
                  <div class="flex items-center gap-3">
                    <Calendar class="w-5 h-5 text-primary shrink-0" />
                    <p>
                      <span class="font-semibold text-foreground/90">Duration: </span>
                      {new Date(project.start_date).getFullYear()} - {project.end_date ? new Date(project.end_date).getFullYear() : 'Ongoing'}
                    </p>
                  </div>
                  
                  {#if project.budget > 0}
                    <div class="flex items-center gap-3">
                      <Banknote class="w-5 h-5 text-primary shrink-0" />
                      <p>
                        <span class="font-semibold text-foreground/90">Budget: </span>
                        {project.budget.toLocaleString('en-US')} PLN
                      </p>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>
