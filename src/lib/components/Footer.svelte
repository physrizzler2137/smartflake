<script lang="ts">
  import { Palette, Type, Ghost } from 'lucide-svelte';
  import LogoText from './LogoText.svelte';

  let { onToggleFont, onToggleTheme } = $props<{
    onToggleFont: () => void;
    onToggleTheme: () => void;
  }>();

  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-card/50 border-t border-border/50 py-10 font-slab">
  <div class="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-6">
    <div class="flex items-center gap-2">
      <p>&copy; {currentYear} <LogoText class="tight-logo" />.</p>
      <p class="hidden sm:inline">All rights reserved.</p>
    </div>
    
    <div class="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto ml-auto justify-end">
      <p class="text-foreground/80 font-slab font-semibold tracking-wide text-center md:text-right">Smart Materials and Soft Robotics Laboratory</p>
      
      <div class="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/50 h-10">
        <a href="/login" class="p-2 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg transition-all active:scale-95 flex items-center justify-center" aria-label="Admin Login">
          <Ghost class="w-4 h-4" />
        </a>
        
        <button 
          onclick={onToggleTheme}
          class="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all active:scale-95 flex items-center justify-center" 
          aria-label="Toggle Theme"
        >
          <Palette class="w-4 h-4" />
        </button>
        
        <button 
          onclick={onToggleFont}
          class="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-all active:scale-95 flex items-center justify-center" 
          aria-label="Toggle Font"
        >
          <Type class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</footer>

<style>
  :global(.tight-logo span) {
    margin: 0 !important;
  }
</style>
