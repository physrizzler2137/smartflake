<script lang="ts">
  let { animated = true, class: className = "", useHeadlineFont = true } = $props();
</script>

{#if !animated}
  <span class="{useHeadlineFont ? 'font-slab' : ''} {className}">SMaRT-Lab</span>
{:else}
  <span class="contents {useHeadlineFont ? 'font-slab' : ''} {className}"><span class="inline-block {useHeadlineFont ? 'font-slab' : ''} animate-logo-sm-squeeze mr-[0.02em]">SM</span><span class="relative inline-block {useHeadlineFont ? 'font-slab' : ''} animate-logo-a-pop">a</span><span class="inline-block {useHeadlineFont ? 'font-slab' : ''} animate-logo-rt-squeeze ml-[0.02em]">RT-</span><span class="inline-block {useHeadlineFont ? 'font-slab' : ''} ml-[0.01em]">Lab</span></span>
{/if}
