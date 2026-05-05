<script lang="ts">
  import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = $state('admin@smartlab.simr.pw.edu.pl');
  let password = $state('');
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let showPassword = $state(false);

  async function handleLogin(e: Event) {
    e.preventDefault();
    isLoading = true;
    error = null;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          error = 'Incorrect email or password. Please try again.';
        } else if (authError.message.includes('Email not confirmed')) {
          error = 'Please confirm your email address before signing in.';
        } else {
          error = authError.message;
        }
        return;
      }

      if (data.session) {
        await goto('/admin');
      }
    } catch (e: any) {
      error = e?.message || 'An unexpected error occurred. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login | SMaRT-Lab</title>
</svelte:head>

<div class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
  <div class="absolute top-8 left-8">
    <a href="/" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
      <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      Back to Home
    </a>
  </div>

  <div 
    class="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
    in:fly={{ y: 20, duration: 600 }}
  >
    <div class="p-8 text-center bg-primary/5 border-b border-border/30">
      <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
        <Lock class="w-8 h-8" />
      </div>
      <h1 class="font-slab text-2xl font-bold">Admin Portal</h1>
      <p class="text-sm text-muted-foreground mt-2">Sign in to manage lab content</p>
    </div>

    <form class="p-8 space-y-6" onsubmit={handleLogin}>
      {#if error}
        <div class="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" in:fade>
          {error}
        </div>
      {/if}

      <div class="space-y-2">
        <label for="email" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
        <input 
          id="email"
          type="email" 
          bind:value={email}
          required
          autocomplete="email"
          class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          placeholder="admin@smartlab.simr.pw.edu.pl"
        />
      </div>

      <div class="space-y-2">
        <label for="password" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
        <div class="relative">
          <input 
            id="password"
            type={showPassword ? 'text' : 'password'} 
            bind:value={password}
            required
            autocomplete="current-password"
            class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <EyeOff class="w-4 h-4" />
            {:else}
              <Eye class="w-4 h-4" />
            {/if}
          </button>
        </div>
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        class="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin" />
          Signing in...
        {:else}
          Sign In
        {/if}
      </button>
    </form>
  </div>
</div>
