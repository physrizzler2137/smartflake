<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { supabase } from '$lib/supabase';
  import { Users, GraduationCap, Camera, Loader2 } from 'lucide-svelte';

  interface TeamMember {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    bio: string | null;
    image_url: string | null;
    image_url_hover: string | null;
    image_position: string | null;
    is_active: boolean;
    end_year: number | null;
    display_order: number;
  }

  interface GroupPhoto {
    id: string;
    year: number;
    image_url: string;
    image_position: string;
  }

  let members: TeamMember[] = $state([]);
  let groupPhotos: GroupPhoto[] = $state([]);
  let isLoading = $state(true);
  
  let currentTab = $state<'active' | 'alumni' | 'groups'>('active');

  let activeMembers = $derived(members.filter(m => m.is_active));
  
  let alumniByYear = $derived.by(() => {
    const alumni = members.filter(m => !m.is_active);
    return alumni.reduce((acc, member) => {
      const year = member.end_year ? member.end_year.toString() : 'Unknown';
      if (!acc[year]) acc[year] = [];
      acc[year].push(member);
      return acc;
    }, {} as Record<string, TeamMember[]>);
  });

  let alumniYears = $derived(
    Object.keys(alumniByYear).sort((a, b) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return Number(b) - Number(a);
    })
  );

  onMount(async () => {
    try {
      const [membersRes, photosRes] = await Promise.all([
        supabase.from('team_members').select('*').order('display_order', { ascending: true }),
        supabase.from('group_photos').select('*').order('year', { ascending: false })
      ]);
      
      if (membersRes.error) throw membersRes.error;
      if (photosRes.error) throw photosRes.error;
      
      if (membersRes.data) members = membersRes.data;
      if (photosRes.data) groupPhotos = photosRes.data;
    } catch (e) {
      console.error("Error fetching team data:", e);
    } finally {
      isLoading = false;
    }
  });

  const seaCreatures = ['🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🦭'];
  function getSeaCreatureSVG(firstName: string, lastName: string) {
    const sum = (firstName + lastName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const creature = seaCreatures[sum % seaCreatures.length];
    const svg = `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="56px">${creature}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
</script>

<section id="team" class="py-20 sm:py-32 bg-card/20 overflow-hidden">
  <div class="container mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
        <Users class="w-8 h-8 text-primary" />
        Meet the Team
      </h2>
    </div>

    <div class="max-w-6xl mx-auto">
      <!-- Custom Tabs Header -->
      <div class="flex justify-center mb-10">
        <div class="inline-flex items-center justify-center rounded-xl bg-muted/60 p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] border border-border/50 backdrop-blur-md">
          <button 
            class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300 {currentTab === 'active' ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md scale-105 z-10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'}"
            onclick={() => currentTab = 'active'}
          >
            <Users class="w-4 h-4 mr-2 {currentTab === 'active' ? 'text-primary-foreground' : ''}" /> Active Members
          </button>
          <button 
            class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300 {currentTab === 'alumni' ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md scale-105 z-10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'}"
            onclick={() => currentTab = 'alumni'}
          >
            <GraduationCap class="w-4 h-4 mr-2 {currentTab === 'alumni' ? 'text-primary-foreground' : ''}" /> Alumni
          </button>
          <button 
            class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300 {currentTab === 'groups' ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md scale-105 z-10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'}"
            onclick={() => currentTab = 'groups'}
          >
            <Camera class="w-4 h-4 mr-2 {currentTab === 'groups' ? 'text-primary-foreground' : ''}" /> Group Photos
          </button>
        </div>
      </div>

      {#if isLoading}
        <div class="flex justify-center items-center py-20">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>
      {:else}
        <!-- Tab Content -->
        <div class="grid relative" style="grid-template-areas: 'stack';">
          {#if currentTab === 'active'}
            <div style="grid-area: stack;" in:fade={{ duration: 400, delay: 100 }} out:fade={{ duration: 300 }} class="w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {#each activeMembers as member, i (member.id)}
                <div 
                  in:fly={{ y: 20, duration: 400, delay: 100 + (i * 50) }}
                  class="group text-center bg-card shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-xl border border-border/50 h-full flex flex-col overflow-hidden"
                >
                  <div class="p-6 items-center flex flex-col">
                    <div class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary bg-muted {member.first_name === 'Gözen' || member.first_name === 'Maja' ? 'wash-container' : ''}">
                      {#if member.image_url}
                        <div
                          class="absolute inset-0 w-full h-full bg-cover bg-no-repeat transition-all duration-500 {member.image_url_hover ? 'group-hover:opacity-0' : 'group-hover:scale-110'}"
                          style="background-image: url({member.image_url}); background-position: {member.image_position};"
                        ></div>
                        {#if member.image_url_hover}
                          <div
                            class="absolute inset-0 w-full h-full bg-cover bg-no-repeat transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                            style="background-image: url({member.image_url_hover}); background-position: {member.image_position};"
                          ></div>
                        {/if}
                      {:else}
                        <div class="w-full h-full flex items-center justify-center">
                          <Users class="w-16 h-16 text-muted-foreground" />
                        </div>
                      {/if}
                      {#if member.first_name === 'Gözen' || member.first_name === 'Maja'}
                        <div class="bubbles absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {#each Array.from({ length: 12 }) as _, j}
                            <span class="bubble" style="
                              left: {10 + (j * 7.5)}%; 
                              animation-delay: {j * 0.3}s;
                              width: {4 + (j % 3) * 2}px;
                              height: {4 + (j % 3) * 2}px;
                              --rise-duration: {3 + (j % 4)}s;
                            "></span>
                          {/each}
                        </div>
                      {/if}
                    </div>
                    <h3 class="font-slab font-bold pt-4 text-xl mt-2">{member.first_name} {member.last_name}</h3>
                    <p class="text-sm text-muted-foreground mt-1">{member.role}</p>
                  </div>
                  {#if member.bio}
                    <div class="p-6 pt-0 flex-grow">
                      <div class="text-sm text-muted-foreground text-justify">
                        {@html member.bio}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          {#if currentTab === 'alumni'}
            <div style="grid-area: stack;" in:fade={{ duration: 400, delay: 100 }} out:fade={{ duration: 300 }} class="w-full space-y-12">
              {#each alumniYears as year, yearIndex}
                <div in:fly={{ y: 20, duration: 400, delay: 100 + (yearIndex * 100) }}>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center">
                    {#each alumniByYear[year] as member (member.id)}
                      <div class="group flex flex-col items-center text-center">
                        <div class="relative w-24 h-24">
                          <div class="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                            {#if member.image_url}
                              <img src={member.image_url} alt="{member.first_name} {member.last_name}" class="w-full h-full object-cover" style="object-position: {member.image_position};" />
                            {:else}
                              <img src={getSeaCreatureSVG(member.first_name, member.last_name)} alt="Sea creature avatar" class="w-full h-full object-cover" />
                            {/if}
                          </div>
                        </div>
                        <p class="font-semibold mt-3 text-sm text-foreground">{member.first_name} {member.last_name}</p>
                        <p class="text-xs text-muted-foreground mt-1">{member.role}</p>
                      </div>
                    {/each}
                  </div>
                  <h3 class="text-2xl font-bold font-slab mt-8 border-t border-border/50 pt-4 text-center text-foreground">{year}</h3>
                </div>
              {/each}
            </div>
          {/if}

          {#if currentTab === 'groups'}
            <div style="grid-area: stack;" in:fade={{ duration: 400, delay: 100 }} out:fade={{ duration: 300 }} class="w-full grid md:grid-cols-1 gap-12">
              {#each groupPhotos as photo, i (photo.id)}
                <div in:fly={{ y: 20, duration: 400, delay: 100 + (i * 100) }}>
                  <div class="relative rounded-xl overflow-hidden shadow-xl bg-muted group">
                    <img 
                      src={photo.image_url} 
                      alt="Group photo from {photo.year}" 
                      class="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 class="font-slab text-2xl font-bold text-center mt-6 text-foreground">{photo.year}</h4>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  @keyframes wash {
    0%   { transform: rotate(0deg); }
    10%  { transform: rotate(180deg); }
    30%  { transform: rotate(1080deg); }
    45%  { transform: rotate(1620deg); }
    55%  { transform: rotate(1800deg); }
    65%  { transform: rotate(1800deg); }
    80%  { transform: rotate(720deg); }
    90%  { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }

  .group:hover .wash-container {
    animation: wash 8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
  }

  .bubbles {
    overflow: hidden;
  }

  .bubble {
    position: absolute;
    bottom: -10px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.8);
    animation: rise var(--rise-duration) ease-in infinite;
  }

  @keyframes rise {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    20% { opacity: 0.7; transform: translateY(-20%) translateX(4px); }
    40% { transform: translateY(-40%) translateX(-4px); }
    60% { transform: translateY(-60%) translateX(4px); }
    80% { opacity: 0.5; transform: translateY(-80%) translateX(-4px); }
    100% { transform: translateY(-120%) translateX(0); opacity: 0; }
  }
</style>
