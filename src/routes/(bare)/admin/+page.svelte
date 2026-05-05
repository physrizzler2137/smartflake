<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { 
    Newspaper, Sparkles, Milestone, Users, Lightbulb, BookOpen, 
    LogOut, UserPlus, Settings, Shield, AlertCircle, Plus, Trash2,
    Edit, Eye, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp
  } from 'lucide-svelte';
  import { fly, fade, slide } from 'svelte/transition';
  import LogoText from '$lib/components/LogoText.svelte';

  // ─── Auth State ──────────────────────────────────────────────────────────────
  let user = $state<any>(null);
  let isCheckingAuth = $state(true);

  // ─── CMS State ───────────────────────────────────────────────────────────────
  let activeTile = $state<string | null>(null);
  let cmsData = $state<Record<string, any[]>>({});
  let isLoadingTile = $state(false);
  let notification = $state<{ type: 'success' | 'error'; message: string } | null>(null);

  // ─── New User Panel ───────────────────────────────────────────────────────────
  let showNewUserPanel = $state(false);
  let newUserEmail = $state('');
  let newUserPassword = $state('');
  let isCreatingUser = $state(false);
  let userCreateResult = $state<string | null>(null);

  // ─── CMS Tiles Config ────────────────────────────────────────────────────────
  const tiles = [
    { id: 'news_items',          label: 'News',                icon: Newspaper,  color: 'text-blue-400',   bg: 'bg-blue-400/10',   desc: 'Manage lab news posts' },
    { id: 'research_highlights', label: 'Research Highlights', icon: Sparkles,   color: 'text-purple-400', bg: 'bg-purple-400/10', desc: 'Feature key research outcomes' },
    { id: 'history_milestones',  label: 'History',             icon: Milestone,  color: 'text-amber-400',  bg: 'bg-amber-400/10',  desc: 'Edit timeline milestones' },
    { id: 'team_members',        label: 'Team',                icon: Users,      color: 'text-green-400',  bg: 'bg-green-400/10',  desc: 'Manage team members' },
    { id: 'projects',            label: 'Projects',            icon: Lightbulb,  color: 'text-yellow-400', bg: 'bg-yellow-400/10', desc: 'Track research projects' },
    { id: 'publications',        label: 'Publications',        icon: BookOpen,   color: 'text-rose-400',   bg: 'bg-rose-400/10',   desc: 'Manage publication list' },
  ];

  // ─── Column display configs per table ────────────────────────────────────────
  const tableColumns: Record<string, string[]> = {
    news_items:          ['title', 'author', 'date', 'location'],
    research_highlights: ['display_order', 'title', 'category'],
    history_milestones:  ['year', 'title'],
    team_members:        ['first_name', 'last_name', 'role', 'is_active'],
    projects:            ['title', 'status', 'funding_source'],
    publications:        ['year', 'title', 'journal'],
  };

  // ─── Auth ─────────────────────────────────────────────────────────────────────
  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      goto('/login');
      return;
    }
    user = session.user;
    isCheckingAuth = false;
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    goto('/login');
  }

  // ─── CMS ─────────────────────────────────────────────────────────────────────
  async function loadTile(tileId: string) {
    if (activeTile === tileId) {
      activeTile = null;
      return;
    }
    activeTile = tileId;
    isLoadingTile = true;
    
    try {
      let query = supabase.from(tileId).select('*');
      
      // Ordering per table
      if (tileId === 'news_items') query = query.order('date', { ascending: false });
      else if (tileId === 'research_highlights') query = query.order('display_order', { ascending: true });
      else if (tileId === 'history_milestones') query = query.order('year', { ascending: true });
      else if (tileId === 'team_members') query = query.order('display_order', { ascending: true });
      else if (tileId === 'projects') query = query.order('start_date', { ascending: false });
      else if (tileId === 'publications') query = query.order('year', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      cmsData[tileId] = data ?? [];
    } catch (e: any) {
      showNotification('error', `Failed to load ${tileId}: ${e.message}`);
    } finally {
      isLoadingTile = false;
    }
  }

  async function deleteRow(tileId: string, rowId: string) {
    if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) return;
    
    const { error } = await supabase.from(tileId).delete().eq('id', rowId);
    if (error) {
      showNotification('error', `Delete failed: ${error.message}`);
    } else {
      cmsData[tileId] = cmsData[tileId].filter(r => r.id !== rowId);
      showNotification('success', 'Entry deleted successfully.');
    }
  }

  function showNotification(type: 'success' | 'error', message: string) {
    notification = { type, message };
    setTimeout(() => { notification = null; }, 4000);
  }

  function formatCellValue(value: any): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No';
    if (Array.isArray(value)) return value.join(', ');
    const str = String(value);
    return str.length > 60 ? str.substring(0, 60) + '…' : str;
  }

  // ─── User Management ──────────────────────────────────────────────────────────
  async function createUser() {
    if (!newUserEmail || !newUserPassword) return;
    isCreatingUser = true;
    userCreateResult = null;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail.trim(),
        password: newUserPassword,
        options: {
          data: { role: 'admin' }
        }
      });
      
      if (error) throw error;
      userCreateResult = `✓ User ${newUserEmail} created. They may need to confirm their email.`;
      newUserEmail = '';
      newUserPassword = '';
    } catch (e: any) {
      userCreateResult = `Error: ${e.message}`;
    } finally {
      isCreatingUser = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Dashboard | SMaRT-Lab</title>
</svelte:head>

{#if isCheckingAuth}
  <div class="min-h-screen bg-background flex items-center justify-center">
    <Loader2 class="w-8 h-8 animate-spin text-primary" />
  </div>
{:else}
  <div class="min-h-screen bg-background text-foreground">
    <!-- ─── Topbar ───────────────────────────────────────────────────────────── -->
    <header class="bg-card/60 backdrop-blur-lg border-b border-border/50 sticky top-0 z-40">
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
          <Shield class="w-5 h-5 text-primary" />
          <span class="font-slab font-bold text-lg"><LogoText /></span>
          <span class="text-xs font-mono text-muted-foreground uppercase tracking-widest pl-2 border-l border-border">CMS Admin</span>
        </a>
        <div class="flex items-center gap-3">
          <span class="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
          <button
            onclick={handleLogout}
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive border border-border/50 hover:border-destructive/50 rounded-lg px-3 py-1.5 transition-all"
          >
            <LogOut class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- ─── Notification Toast ────────────────────────────────────────────────── -->
    {#if notification}
      <div
        class="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium
          {notification.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-destructive/10 border-destructive/30 text-destructive'}"
        in:fly={{ x: 50, duration: 300 }}
        out:fade={{ duration: 200 }}
      >
        {#if notification.type === 'success'}
          <CheckCircle2 class="w-4 h-4 shrink-0" />
        {:else}
          <XCircle class="w-4 h-4 shrink-0" />
        {/if}
        {notification.message}
      </div>
    {/if}

    <main class="container mx-auto px-6 py-10 max-w-7xl">
      <!-- ─── Welcome ─────────────────────────────────────────────────────────── -->
      <div class="mb-10" in:fly={{ y: 20, duration: 500 }}>
        <h1 class="font-slab text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p class="text-muted-foreground text-sm">Manage all SMaRT-Lab website content from here.</p>
      </div>

      <!-- ─── CMS Tiles ──────────────────────────────────────────────────────── -->
      <section class="mb-12">
        <h2 class="font-slab text-xl font-semibold mb-6 text-foreground/80">Content Management</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {#each tiles as tile, i (tile.id)}
            {@const Icon = tile.icon}
            {@const ChevronIcon = activeTile === tile.id ? ChevronUp : ChevronDown}
            <button
              class="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 text-center
                {activeTile === tile.id 
                  ? 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/10' 
                  : 'border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/80 hover:shadow-md'}"
              onclick={() => loadTile(tile.id)}
              in:fly={{ y: 20, duration: 400, delay: i * 60 }}
            >
              <div class="p-3 rounded-xl {tile.bg} transition-colors">
                <Icon class="w-6 h-6 {tile.color}" />
              </div>
              <div>
                <p class="font-semibold text-sm text-foreground">{tile.label}</p>
                <p class="text-xs text-muted-foreground mt-0.5 hidden sm:block">{tile.desc}</p>
              </div>
              <div class="absolute top-2 right-2">
                <ChevronIcon class="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
          {/each}
        </div>
      </section>

      <!-- ─── Active CMS Tile Content ────────────────────────────────────────── -->
      {#if activeTile}
        {@const tile = tiles.find(t => t.id === activeTile)}
        <section class="mb-12 bg-card/50 border border-border/50 rounded-2xl overflow-hidden" transition:slide={{ duration: 350 }}>
          <div class="flex items-center justify-between p-5 border-b border-border/50">
            <div class="flex items-center gap-3">
              {#if tile}
                {@const Icon = tile.icon}
                <div class="p-2 rounded-lg {tile.bg}">
                  <Icon class="w-5 h-5 {tile.color}" />
                </div>
                <h3 class="font-slab font-bold text-lg">{tile.label}</h3>
              {/if}
              {#if !isLoadingTile && cmsData[activeTile]}
                <span class="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  {cmsData[activeTile].length} records
                </span>
              {/if}
            </div>
            <a 
              href="/" 
              class="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              title="Preview on main site"
            >
              <Eye class="w-3.5 h-3.5" /> Preview
            </a>
          </div>

          {#if isLoadingTile}
            <div class="flex justify-center items-center py-16">
              <Loader2 class="w-6 h-6 animate-spin text-primary" />
            </div>
          {:else if cmsData[activeTile]?.length === 0}
            <div class="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <AlertCircle class="w-10 h-10 mb-3 opacity-30" />
              <p class="text-sm">No records found in <code class="font-mono">{activeTile}</code>.</p>
            </div>
          {:else if cmsData[activeTile]}
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-muted/30 text-left">
                    {#each tableColumns[activeTile] as col}
                      <th class="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest whitespace-nowrap">{col}</th>
                    {/each}
                    <th class="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/30">
                  {#each cmsData[activeTile] as row (row.id)}
                    <tr class="hover:bg-muted/20 transition-colors group" in:fade={{ duration: 200 }}>
                      {#each tableColumns[activeTile] as col}
                        <td class="px-4 py-3 text-foreground/80 max-w-xs truncate">
                          {#if col === 'is_active'}
                            <span class="inline-flex items-center gap-1 text-xs font-mono {row[col] ? 'text-green-400' : 'text-muted-foreground'}">
                              {row[col] ? '● Active' : '○ Alumni'}
                            </span>
                          {:else}
                            {formatCellValue(row[col])}
                          {/if}
                        </td>
                      {/each}
                      <td class="px-4 py-3">
                        <button
                          class="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 p-1.5 rounded-lg hover:bg-destructive/10"
                          onclick={() => deleteRow(activeTile!, row.id)}
                          title="Delete entry"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <div class="p-4 border-t border-border/30 bg-muted/10">
              <p class="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertCircle class="w-3.5 h-3.5" />
                Full record editing (add/edit fields) is coming soon. Delete is functional. Data changes via Supabase SQL for now.
              </p>
            </div>
          {/if}
        </section>
      {/if}

      <!-- ─── User Management ─────────────────────────────────────────────────── -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-slab text-xl font-semibold text-foreground/80">User Management</h2>
          <button
            class="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            onclick={() => showNewUserPanel = !showNewUserPanel}
          >
            <UserPlus class="w-4 h-4" />
            Add Admin User
          </button>
        </div>

        {#if showNewUserPanel}
          <div class="bg-card/50 border border-border/50 rounded-2xl p-6" transition:slide={{ duration: 300 }}>
            <h3 class="font-slab font-bold text-base mb-4 flex items-center gap-2">
              <UserPlus class="w-4 h-4 text-primary" />
              Create New Admin Account
            </h3>
            <div class="grid sm:grid-cols-2 gap-4 mb-4">
              <div class="space-y-1.5">
                <label for="newUserEmail" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                <input
                  id="newUserEmail"
                  type="email"
                  bind:value={newUserEmail}
                  placeholder="user@smartlab.simr.pw.edu.pl"
                  class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <div class="space-y-1.5">
                <label for="newUserPassword" class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initial Password</label>
                <input
                  id="newUserPassword"
                  type="password"
                  bind:value={newUserPassword}
                  placeholder="Minimum 6 characters"
                  class="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>
            {#if userCreateResult}
              <p class="text-sm mb-4 px-3 py-2 rounded-lg {userCreateResult.startsWith('✓') ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'}" in:fade>
                {userCreateResult}
              </p>
            {/if}
            <button
              onclick={createUser}
              disabled={isCreatingUser || !newUserEmail || !newUserPassword}
              class="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {#if isCreatingUser}
                <Loader2 class="w-4 h-4 animate-spin" />
                Creating...
              {:else}
                <UserPlus class="w-4 h-4" />
                Create User
              {/if}
            </button>
            <p class="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              The new user will be able to log in immediately. Ask them to change their password on first login.
            </p>
          </div>
        {/if}
      </section>

      <!-- ─── Quick Links ─────────────────────────────────────────────────────── -->
      <section>
        <h2 class="font-slab text-xl font-semibold mb-6 text-foreground/80">Quick Links</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <a href="/" class="flex items-center gap-3 p-4 bg-card/40 border border-border/50 rounded-xl hover:border-primary/40 transition-all group">
            <Eye class="w-5 h-5 text-primary" />
            <div>
              <p class="font-semibold text-sm">View Website</p>
              <p class="text-xs text-muted-foreground">Preview the public-facing site</p>
            </div>
          </a>
          <a href="https://supabase.com/dashboard/project/wmmbswlajfwahiaadtxc" target="_blank" rel="noopener noreferrer" 
            class="flex items-center gap-3 p-4 bg-card/40 border border-border/50 rounded-xl hover:border-primary/40 transition-all group">
            <Settings class="w-5 h-5 text-primary" />
            <div>
              <p class="font-semibold text-sm">Supabase Dashboard</p>
              <p class="text-xs text-muted-foreground">Manage database directly</p>
            </div>
          </a>
        </div>
      </section>
    </main>
  </div>
{/if}
