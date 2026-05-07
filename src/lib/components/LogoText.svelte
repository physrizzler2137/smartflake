<script lang="ts">
  let { animated = true, class: className = "", useHeadlineFont = true, justified = false } = $props();
  const text = "SMaRT-Lab";
</script>

{#if !animated}
  <span class="{useHeadlineFont ? 'font-slab' : ''} {className} {justified ? 'flex justify-between w-full' : ''}">
    {#if justified}
      {#each text.split('') as char}
        <span>{char === '-' ? '–' : char}</span>
      {/each}
    {:else}
      {text}
    {/if}
  </span>
{:else}
  <span class="contents {useHeadlineFont ? 'font-slab' : ''} {className}"><span class="inline-flex items-baseline animate-logo-smart-push"><span class="inline-block {useHeadlineFont ? 'font-slab' : ''} animate-logo-sm-squeeze mr-[0.02em]">SM</span><span class="relative inline-block {useHeadlineFont ? 'font-slab' : ''} animate-logo-a-pop">a</span><span class="inline-block {useHeadlineFont ? 'font-slab' : ''} animate-logo-rt-squeeze ml-[0.02em]">RT</span></span><span class="inline-flex items-center animate-logo-dash-elastic ml-[-0.08em]" style="width:0.42em;vertical-align:middle;"><span class="block w-full bg-current" style="height:0.1em;"></span></span><span class="inline-block {useHeadlineFont ? 'font-slab' : ''} ml-[0.01em]">Lab</span></span>
{/if}
