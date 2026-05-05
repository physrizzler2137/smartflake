<script lang="ts">
  import { ArrowDown } from 'lucide-svelte';
  import LogoText from './LogoText.svelte';
</script>

<section id="home" class="relative w-full min-h-[100svh] lg:min-h-0 lg:aspect-[21/9] flex flex-col text-center overflow-hidden bg-black">
  <div class="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-90">
    <video
      src="/smartlab_pomo_2026_v02.m4v"
      autoplay
      muted
      loop
      playsinline
      class="absolute min-w-full min-h-full object-cover"
    >
        <track kind="captions" />
    </video>
    <div class="absolute inset-0 bg-black/60 z-10"></div>
  </div>
  
  <div class="relative z-10 px-4 w-full flex flex-col items-center justify-center flex-grow pt-24">
    <h1 class="text-5xl md:text-7xl font-medium font-slab tracking-normal text-balance text-primary scale-110">
      <LogoText animated={true} />
    </h1>
    <p class="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90 text-balance drop-shadow-sm font-slab font-medium tracking-wide">
      Smart Materials and Soft Robotics Laboratory
    </p>
  </div>
  
  <div class="relative z-20 pb-32">
    <a 
        href="#news"
        class="inline-flex items-center justify-center px-8 py-3 rounded-md bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
    >
        Explore our research
        <ArrowDown class="ml-2 h-5 w-5 animate-bounce" />
    </a>
  </div>
</section>


