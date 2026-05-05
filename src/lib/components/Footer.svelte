<script lang="ts">
  import { Palette, Type } from 'lucide-svelte';
  import LogoText from './LogoText.svelte';

  let { onToggleFont, onToggleTheme } = $props<{
    onToggleFont: () => void;
    onToggleTheme: () => void;
  }>();

  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-card/50 border-t border-border/50">
  <div class="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center md:items-baseline text-sm text-muted-foreground">
    <div>
      <p>&copy; {currentYear} <LogoText class="tight-logo" />. All rights reserved.</p>
    </div>
    
    <div class="flex flex-col md:flex-row items-center md:items-baseline gap-4 mt-4 md:mt-0">
      <p class="text-foreground/80 font-headline font-medium tracking-wide">Smart Materials and Soft Robotics Laboratory</p>
      
      <div class="flex items-center gap-2">
        <a href="/login" class="hover:text-primary transition-colors">Admin</a>
        
        <button 
          onclick={onToggleTheme}
          class="p-2 hover:bg-muted rounded-lg transition-colors" 
          aria-label="Toggle Theme Playground"
        >
          <Palette class="w-5 h-5" />
        </button>
        
        <button 
          onclick={onToggleFont}
          class="p-2 hover:bg-muted rounded-lg transition-colors" 
          aria-label="Toggle Font Playground"
        >
          <Type class="w-5 h-5" />
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
