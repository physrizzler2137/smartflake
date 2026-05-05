<script lang="ts">
    import { Target, Quote } from 'lucide-svelte';
    import { fly } from 'svelte/transition';

    const mission = {
        intro: "Our research focuses on the exciting field of soft robotics and wearable electronics.<br />We design, fabricate and test not only soft robotic actuators and other, but also flexible sensors,<br />pushing the boundaries of what's possible with intelligent, compliant systems.",
        quotes: [
            {
                text: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.",
                author: "Isaac Asimov"
            }
        ]
    };
</script>

<section id="mission" class="py-20 sm:py-32 bg-background">
  <div class="container mx-auto px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold font-slab bg-gradient-to-r from-secondary to-primary to-[33%] bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Target class="w-8 h-8 text-primary" />
          Mission
        </h2>
      </div>
      
      <div 
        in:fly={{ y: 20, duration: 800, delay: 200 }}
      >
        <p class="text-lg text-foreground/80 leading-relaxed text-center">
            {@html mission.intro}
        </p>
      </div>

      <div class="mt-24 space-y-8">
        {#each mission.quotes as quote, index}
          <div 
            in:fly={{ y: 20, duration: 800, delay: 400 + index * 200 }}
          >
            <blockquote class="p-6 border-l-4 border-primary bg-card/50 rounded-r-lg">
              <Quote class="w-8 h-8 text-primary/50 mb-4" />
              <p class="text-xl italic text-foreground text-balance">
                "{quote.text}"
              </p>
              <footer class="mt-4 text-right text-muted-foreground">
                — {quote.author}
              </footer>
            </blockquote>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
