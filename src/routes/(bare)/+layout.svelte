<script lang="ts">
  import '../../app.css';
  let { children } = $props();
</script>

<!-- Bare layout — no site navigation, just a clean page shell for auth/admin routes -->
<div class="min-h-screen bg-background text-foreground break-words">
  {@render children()}
</div>
