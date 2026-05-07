<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { goto } from '$app/navigation';
  import { cn } from '$lib/utils';
  import { 
    Newspaper, Sparkles, Milestone, Users, Lightbulb, BookOpen, 
    LogOut, UserPlus, Settings, Shield, AlertCircle, Plus, Trash2,
    Edit, Eye, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, Save,
    GripVertical
  } from 'lucide-svelte';
  import { fly, fade, slide } from 'svelte/transition';
  import { dndzone } from 'svelte-dnd-action';
  import LogoText from '$lib/components/LogoText.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';

  // ─── Auth State ──────────────────────────────────────────────────────────────
  let user = $state<any>(null);
  let isCheckingAuth = $state(true);

  // ─── CMS State ───────────────────────────────────────────────────────────────
  let activeTile = $state<string | null>(null);
  let cmsData = $state<Record<string, any[]>>({});
  let isLoadingTile = $state(false);
  let notification = $state<{ type: 'success' | 'error'; message: string } | null>(null);
  let editingRow = $state<any | null>(null);
  let isAddingNew = $state(false);
  let isSaving = $state(false);

  // ─── User Management State ───────────────────────────────────────────────────
  let newUserEmail = $state('');
  let newUserPassword = $state('');
  let isCreatingUser = $state(false);
  let showNewUserPanel = $state(false);
  let userCreateResult = $state<string | null>(null);

  // ─── CMS Tiles Config ────────────────────────────────────────────────────────
  const tiles = [
    { id: 'news_items',          label: 'News',                icon: Newspaper,  color: 'text-blue-400',   bg: 'bg-blue-400/10',   desc: 'Manage lab news posts', sortable: false },
    { id: 'research_highlights', label: 'Research Highlights', icon: Sparkles,   color: 'text-purple-400', bg: 'bg-purple-400/10', desc: 'Feature key research outcomes', sortable: true },
    { id: 'history_milestones',  label: 'History',             icon: Milestone,  color: 'text-amber-400',  bg: 'bg-amber-400/10',  desc: 'Edit timeline milestones', sortable: false },
    { id: 'team_members',        label: 'Team',                icon: Users,      color: 'text-green-400',  bg: 'bg-green-400/10',  desc: 'Manage team members', sortable: true },
    { id: 'projects',            label: 'Projects',            icon: Lightbulb,  color: 'text-yellow-400', bg: 'bg-yellow-400/10', desc: 'Track research projects', sortable: false },
    { id: 'publications',        label: 'Publications',        icon: BookOpen,   color: 'text-rose-400',   bg: 'bg-rose-400/10',   desc: 'Manage publication list', sortable: false },
    { id: 'users',               label: 'Admin Users',         icon: Shield,     color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   desc: 'Manage administrator accounts', sortable: false },
  ];

  // ─── Column display configs per table ────────────────────────────────────────
  const tableColumns: Record<string, string[]> = {
    news_items:          ['title', 'date', 'type', 'author'],
    research_highlights: ['display_order', 'title', 'category'],
    history_milestones:  ['year', 'title', 'type'],
    team_members:        ['first_name', 'last_name', 'role', 'is_active'],
    projects:            ['title', 'status', 'funding_source'],
    publications:        ['year', 'title', 'journal'],
    users:               ['email', 'last_sign_in_at', 'created_at']
  };

  // ─── Form Field Definitions ──────────────────────────────────────────────────
  const formFields: Record<string, { key: string; label: string; type: 'text' | 'textarea' | 'date' | 'number' | 'boolean' | 'select'; options?: string[] }[]> = {
    news_items: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'type', label: 'Type', type: 'select', options: ['news', 'event', 'announcement'] },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'content', label: 'Content (HTML)', type: 'textarea' },
      { key: 'imageUrl', label: 'Image URL', type: 'text' },
      { key: 'imageId', label: 'Placeholder ID', type: 'text' },
      { key: 'externalLink', label: 'External Link', type: 'text' }
    ],
    research_highlights: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'display_order', label: 'Order', type: 'number' },
      { key: 'image_url', label: 'Image URL', type: 'text' }
    ],
    history_milestones: [
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'type', label: 'Type', type: 'select', options: ['research', 'facility', 'team', 'publication'] },
      { key: 'image', label: 'Image URL', type: 'text' }
    ],
    team_members: [
      { key: 'first_name', label: 'First Name', type: 'text' },
      { key: 'last_name', label: 'Last Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'bio', label: 'Bio (HTML)', type: 'textarea' },
      { key: 'image_url', label: 'Photo URL', type: 'text' },
      { key: 'image_url_hover', label: 'Hover Photo URL', type: 'text' },
      { key: 'image_position', label: 'Photo Position (e.g. 50% 50%)', type: 'text' },
      { key: 'is_active', label: 'Active Member', type: 'boolean' },
      { key: 'end_year', label: 'End Year (for Alumni)', type: 'number' },
      { key: 'display_order', label: 'Display Order', type: 'number' }
    ],
    projects: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['ongoing', 'completed', 'planned'] },
      { key: 'funding_source', label: 'Funding', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'start_date', label: 'Start Date', type: 'date' },
      { key: 'end_date', label: 'End Date', type: 'date' }
    ],
    publications: [
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'journal', label: 'Journal', type: 'text' },
      { key: 'authors', label: 'Authors', type: 'text' },
      { key: 'doi_link', label: 'DOI Link', type: 'text' },
      { key: 'bibtex', label: 'BibTeX', type: 'textarea' }
    ],
    users: [
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'role', label: 'Role', type: 'select', options: ['admin', 'editor'] }
    ]
  };

  // ─── Auth ─────────────────────────────────────────────────────────────────────
  onMount(async () => {
    if (!pb.authStore.isValid) {
      goto('/login');
      return;
    }
    user = pb.authStore.model;
    isCheckingAuth = false;
  });

  async function handleLogout() {
    pb.authStore.clear();
    goto('/login');
  }

  // ─── CMS ─────────────────────────────────────────────────────────────────────
  async function loadTile(tileId: string) {
    if (activeTile === tileId) {
      activeTile = null;
      editingRow = null;
      isAddingNew = false;
      return;
    }
    activeTile = tileId;
    editingRow = null;
    isAddingNew = false;
    isLoadingTile = true;
    
    try {
      let sortConfig = '';
      
      // Ordering per table
      if (tileId === 'news_items') sortConfig = '-date';
      else if (tileId === 'research_highlights') sortConfig = 'display_order';
      else if (tileId === 'history_milestones') sortConfig = 'year';
      else if (tileId === 'team_members') sortConfig = 'display_order';
      else if (tileId === 'projects') sortConfig = '-start_date';
      else if (tileId === 'publications') sortConfig = '-year';

      const data = await pb.collection(tileId).getFullList({ sort: sortConfig });
      cmsData[tileId] = data ?? [];
    } catch (e: any) {
      showNotification('error', `Failed to load ${tileId}: ${e.message}`);
    } finally {
      isLoadingTile = false;
    }
  }

  function handleDndConsider(e: any) {
    if (!activeTile) return;
    cmsData[activeTile] = e.detail.items;
  }

  async function handleDndFinalize(e: any) {
    if (!activeTile) return;
    cmsData[activeTile] = e.detail.items;
    
    // Update display_order in background
    const updates = cmsData[activeTile].map((item, index) => ({
      id: item.id,
      display_order: index + 1
    }));

    try {
      await Promise.all(
        updates.map(u => 
          pb.collection(activeTile!).update(u.id, { display_order: u.display_order })
        )
      );
      showNotification('success', 'Order updated successfully.');
    } catch (e: any) {
      showNotification('error', `Failed to save order: ${e.message}`);
    }
  }

  async function deleteRow(tileId: string, rowId: string) {
    if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) return;
    
    try {
      await pb.collection(tileId).delete(rowId);
      cmsData[tileId] = cmsData[tileId].filter(r => r.id !== rowId);
      showNotification('success', 'Entry deleted successfully.');
    } catch (error: any) {
      showNotification('error', `Delete failed: ${error.message}`);
    }
  }

  function startEdit(row: any) {
    editingRow = { ...row };
    isAddingNew = false;
  }

  function startAddNew() {
    if (!activeTile) return;
    const fields = formFields[activeTile];
    const newObj: any = {};
    fields.forEach(f => {
      if (f.type === 'boolean') newObj[f.key] = true;
      else if (f.type === 'number') newObj[f.key] = 0;
      else newObj[f.key] = '';
    });
    editingRow = newObj;
    isAddingNew = true;
  }

  async function saveEntry() {
    if (!activeTile || !editingRow) return;
    isSaving = true;
    
    try {
      const { id, collectionId, collectionName, created, updated, expand, ...updateData } = editingRow;
      
      let result;
      if (isAddingNew) {
        result = await pb.collection(activeTile).create(updateData);
      } else {
        result = await pb.collection(activeTile).update(id, updateData);
      }
      
      // Update local state
      if (isAddingNew) {
        cmsData[activeTile] = [...cmsData[activeTile], result];
      } else {
        cmsData[activeTile] = cmsData[activeTile].map(r => r.id === id ? { ...result } : r);
      }
      
      editingRow = null;
      isAddingNew = false;
      showNotification('success', `Entry ${isAddingNew ? 'created' : 'updated'} successfully.`);
    } catch (e: any) {
      showNotification('error', `Operation failed: ${e.message}`);
    } finally {
      isSaving = false;
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
      await pb.collection('users').create({
        email: newUserEmail.trim(),
        password: newUserPassword,
        passwordConfirm: newUserPassword,
        role: 'admin'
      });
      
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
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <Navigation 
      forceScrolled={true} 
      isAdmin={true} 
      userEmail={user?.email} 
      onLogout={handleLogout} 
    />

    {#if notification}
      <div
        class="fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium
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

    <main class="flex-grow container mx-auto px-6 py-10 max-w-6xl pt-32">
      <div class="mb-10 border-b border-border/30 pb-6 flex items-baseline justify-between font-mono !text-[14px] leading-none" in:fly={{ y: 20, duration: 500 }}>
        <div class="flex items-baseline gap-4">
          <span class="bg-primary text-primary-foreground font-bold px-2 py-1 rounded uppercase tracking-widest !text-[14px] leading-none">
            Admin
          </span>
          <span class="text-muted-foreground/60 font-medium !text-[14px] leading-none">@</span>
          <span class="font-bold text-foreground uppercase tracking-widest !text-[14px] leading-none">
            CMS Dashboard
          </span>
        </div>
        
        <div class="hidden md:flex items-baseline gap-6 uppercase tracking-widest !text-[14px] leading-none">
          <div class="flex items-baseline gap-2">
            <span class="text-muted-foreground/60 !text-[14px] leading-none">Build:</span>
            <span class="text-foreground/90 font-bold !text-[14px] leading-none">v0.2.0-stable</span>
          </div>
          <span class="text-border/60 !text-[14px] leading-none">|</span>
          <div class="flex items-baseline gap-2">
            <span class="text-muted-foreground/60 !text-[14px] leading-none">Branch:</span>
            <span class="text-primary font-bold !text-[14px] leading-none">pocketflake</span>
          </div>
        </div>
      </div>

      <section class="mb-12">
        <h2 class="font-slab text-xl font-semibold mb-6 text-foreground/80">Content Management</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {#each tiles as tile, i (tile.id)}
            {@const Icon = tile.icon}
            <button 
              class="group bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 flex flex-col items-start relative overflow-hidden text-left"
              onclick={() => loadTile(tile.id)}
              in:fly={{ y: 20, duration: 400, delay: i * 60 }}
            >
              <div class="absolute -right-10 -top-10 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
              
              <div class="relative z-10 w-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="p-2.5 rounded-xl {tile.bg} transition-transform duration-500 group-hover:scale-110">
                    <Icon class="w-6 h-6 {tile.color}" />
                  </div>
                  <ChevronDown class={cn("w-4 h-4 text-muted-foreground transition-transform duration-500", activeTile === tile.id && "rotate-180")} />
                </div>
                
                <h3 class="font-slab font-bold text-lg mb-1">{tile.label}</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">{tile.desc}</p>
              </div>

              {#if activeTile === tile.id}
                <div class="absolute bottom-0 left-0 h-1 bg-primary" in:fade={{ duration: 300 }}></div>
              {/if}
            </button>
          {/each}
        </div>
      </section>

      {#if activeTile}
        <section class="mb-12" in:slide={{ duration: 400 }}>
          <div class="bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden shadow-2xl">
            <div class="flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-border/50 bg-primary/5">
              <div class="flex items-center gap-4 mb-4 md:mb-0">
                {@const tile = tiles.find(t => t.id === activeTile)}
                <div class="p-3 rounded-2xl {tile?.bg}">
                  {#if tile}
                    <svelte:component this={tile.icon} class="w-6 h-6 {tile.color}" />
                  {/if}
                </div>
                <div>
                  <h3 class="font-slab font-bold text-2xl tracking-tight">{tile?.label}</h3>
                  <p class="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Collection Management</p>
                </div>
              </div>
              
              <button 
                class="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.95] shadow-lg shadow-primary/20"
                onclick={startAddNew}
              >
                <Plus class="w-5 h-5" />
                Add New Entry
              </button>
            </div>

            {#if editingRow}
              <div class="p-8 bg-background/60 backdrop-blur-md border-b border-border/50" in:slide>
                <div class="flex items-center justify-between mb-8">
                  <h4 class="font-slab font-bold text-xl flex items-center gap-3">
                    <div class="w-2 h-8 bg-primary rounded-full"></div>
                    {isAddingNew ? 'Create New' : 'Edit'} {tiles.find(t => t.id === activeTile)?.label.slice(0, -1)}
                  </h4>
                  <button 
                    class="text-muted-foreground hover:text-foreground p-2 transition-colors"
                    onclick={() => { editingRow = null; isAddingNew = false; }}
                  >
                    <XCircle class="w-6 h-6" />
                  </button>
                </div>
                
                <div class="grid sm:grid-cols-2 gap-8 mb-8">
                  {#each formFields[activeTile] as field}
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        {field.label}
                      </label>
                      
                      {#if field.type === 'textarea'}
                        <textarea
                          bind:value={editingRow[field.key]}
                          rows="4"
                          class="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm leading-relaxed"
                        ></textarea>
                      {:else if field.type === 'select'}
                        <select
                          bind:value={editingRow[field.key]}
                          class="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        >
                          {#each field.options || [] as opt}
                            <option value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                          {/each}
                        </select>
                      {:else if field.type === 'boolean'}
                        <div class="flex items-center gap-4 p-4 bg-background/30 rounded-2xl border border-border/50">
                          <input
                            type="checkbox"
                            bind:checked={editingRow[field.key]}
                            class="w-5 h-5 accent-primary rounded-lg"
                          />
                          <span class="text-sm font-medium">{field.label} Status</span>
                        </div>
                      {:else}
                        <input
                          type={field.type}
                          bind:value={editingRow[field.key]}
                          class="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
                
                <div class="flex justify-end gap-4">
                  <button 
                    class="px-8 py-3 rounded-2xl font-bold text-sm border border-border/50 hover:bg-muted transition-all"
                    onclick={() => { editingRow = null; isAddingNew = false; }}
                  >
                    Cancel
                  </button>
                  <button 
                    class="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-10 py-3 rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-50"
                    onclick={saveEntry}
                    disabled={isSaving}
                  >
                    {#if isSaving}
                      <Loader2 class="w-5 h-5 animate-spin" />
                      Saving...
                    {:else}
                      <Save class="w-5 h-5" />
                      Save Changes
                    {/if}
                  </button>
                </div>
              </div>
            {/if}

            <div class="p-0 overflow-hidden">
              {#if isLoadingTile}
                <div class="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 class="w-12 h-12 animate-spin text-primary opacity-50" />
                  <p class="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Synchronizing Data</p>
                </div>
              {:else if cmsData[activeTile]?.length === 0}
                <div class="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
                  <div class="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center">
                    <AlertCircle class="w-10 h-10 opacity-20" />
                  </div>
                  <p class="text-sm font-medium">No records found in this collection.</p>
                </div>
              {:else if cmsData[activeTile]}
                {#if tiles.find(t => t.id === activeTile)?.sortable}
                  <div 
                    use:dndzone={{ items: cmsData[activeTile], flipDurationMs: 200, dropTargetStyle: {} }} 
                    onconsider={handleDndConsider} 
                    onfinalize={handleDndFinalize}
                    class="divide-y divide-border/20 outline-none"
                  >
                    {#each cmsData[activeTile] as row (row.id)}
                      <div 
                        class="flex items-center hover:bg-primary/5 transition-colors group {editingRow?.id === row.id ? 'bg-primary/10 border-l-2 border-primary' : ''}"
                        animate:fly={{ y: 0, duration: 200 }}
                        style="touch-action: none;"
                      >
                        <div class="px-4 py-4 text-muted-foreground/30 group-hover:text-primary/50 cursor-grab active:cursor-grabbing transition-colors shrink-0">
                          <GripVertical class="w-4 h-4" />
                        </div>
                        
                        <div class="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 px-2 py-4 pointer-events-none">
                          {#each tableColumns[activeTile] as col}
                            <div class="flex flex-col gap-1 min-w-0">
                              <span class="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest">{col.replace(/_/g, ' ')}</span>
                              <div class="text-sm text-foreground/90 truncate">
                                {#if col === 'is_active'}
                                  <span class="inline-flex items-center gap-1.5 text-[11px] font-bold {row[col] ? 'text-green-400' : 'text-muted-foreground/60'}">
                                    <span class="w-1.5 h-1.5 rounded-full {row[col] ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-muted-foreground/40'}"></span>
                                    {row[col] ? 'ACTIVE' : 'ALUMNI'}
                                  </span>
                                {:else if col === 'display_order'}
                                  <span class="font-mono text-primary font-bold">{row[col]}</span>
                                {:else}
                                  {formatCellValue(row[col])}
                                {/if}
                              </div>
                            </div>
                          {/each}
                        </div>

                        <div class="px-6 py-4 text-right shrink-0 flex items-center gap-2 pointer-events-auto">
                          <button
                            class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-all {editingRow?.id === row.id ? 'bg-blue-500/20' : ''}"
                            onclick={() => startEdit(row)}
                          >
                            <Edit class="w-4 h-4" />
                          </button>
                          <button
                            class="text-destructive hover:text-destructive/80 p-2 rounded-lg hover:bg-destructive/10 transition-all"
                            onclick={() => deleteRow(activeTile!, row.id)}
                          >
                            <Trash2 class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    {/each}
                  </div>
                  <div class="p-4 bg-muted/20 border-t border-border/50 text-center">
                    <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                      <GripVertical class="w-3 h-3" /> Drag items to reorder them • Changes persist automatically
                    </p>
                  </div>
                {:else}
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="bg-muted/40 text-left border-b border-border/50">
                          {#each tableColumns[activeTile] as col}
                            <th class="px-6 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em]">{col.replace(/_/g, ' ')}</th>
                          {/each}
                          <th class="px-6 py-4 font-bold text-muted-foreground text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-border/20">
                        {#each cmsData[activeTile] as row (row.id)}
                          <tr class="hover:bg-primary/5 transition-colors group {editingRow?.id === row.id ? 'bg-primary/5' : ''}">
                            {#each tableColumns[activeTile] as col}
                              <td class="px-6 py-4 text-foreground/90 max-w-xs truncate">
                                {#if col === 'is_active'}
                                  <span class="inline-flex items-center gap-1.5 text-[11px] font-bold {row[col] ? 'text-green-400' : 'text-muted-foreground/60'}">
                                    <span class="w-1.5 h-1.5 rounded-full {row[col] ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-muted-foreground/40'}"></span>
                                    {row[col] ? 'ACTIVE' : 'ALUMNI'}
                                  </span>
                                {:else}
                                  {formatCellValue(row[col])}
                                {/if}
                              </td>
                            {/each}
                            <td class="px-6 py-4 text-right">
                              <div class="flex items-center justify-end gap-2">
                                <button
                                  class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-all {editingRow?.id === row.id ? 'opacity-30' : ''}"
                                  onclick={() => startEdit(row)}
                                  disabled={!!editingRow && !isAddingNew}
                                >
                                  <Edit class="w-4 h-4" />
                                </button>
                                <button
                                  class="text-destructive hover:text-destructive/80 p-2 rounded-lg hover:bg-destructive/10 transition-all"
                                  onclick={() => deleteRow(activeTile!, row.id)}
                                >
                                  <Trash2 class="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}
              {/if}
            </div>
          </div>
        </section>
      {/if}

      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-slab text-2xl font-bold text-foreground tracking-tight">User Management</h2>
            <p class="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Access Control</p>
          </div>
          <button
            class="flex items-center gap-2 text-sm bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl hover:bg-primary/90 transition-all hover:scale-[1.02]"
            onclick={() => { showNewUserPanel = !showNewUserPanel; userCreateResult = null; }}
          >
            <UserPlus class="w-5 h-5" />
            Add Admin
          </button>
        </div>

        {#if showNewUserPanel}
          <div class="bg-card/40 backdrop-blur-sm border border-border/50 rounded-3xl p-8 mb-10 shadow-xl" transition:slide={{ duration: 300 }}>
            <h3 class="font-slab font-bold text-xl mb-6 flex items-center gap-3">
              <UserPlus class="w-5 h-5 text-primary" />
              Create New Admin Account
            </h3>
            <div class="grid sm:grid-cols-2 gap-6 mb-6">
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <input
                  type="email"
                  bind:value={newUserEmail}
                  placeholder="user@smartlab.simr.pw.edu.pl"
                  class="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Initial Password</label>
                <input
                  type="password"
                  bind:value={newUserPassword}
                  placeholder="Minimum 6 characters"
                  class="w-full bg-background/50 border border-border/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
              </div>
            </div>
            {#if userCreateResult}
              <p class="text-sm mb-6 px-4 py-3 rounded-xl {userCreateResult.startsWith('✓') ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'}" in:fade>
                {userCreateResult}
              </p>
            {/if}
            <div class="flex justify-end gap-4">
              <button 
                class="px-8 py-3 rounded-2xl font-bold text-sm border border-border/50 hover:bg-muted transition-all"
                onclick={() => showNewUserPanel = false}
              >
                Cancel
              </button>
              <button
                onclick={createUser}
                disabled={isCreatingUser || !newUserEmail || !newUserPassword}
                class="flex items-center gap-2 bg-primary text-primary-foreground font-bold px-10 py-3 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {#if isCreatingUser}
                  <Loader2 class="w-5 h-5 animate-spin" />
                  Creating...
                {:else}
                  <UserPlus class="w-5 h-5" />
                  Create User
                {/if}
              </button>
            </div>
          </div>
        {/if}
      </section>

      <section>
        <h2 class="font-slab text-xl font-semibold mb-6 text-foreground/80">System Management</h2>
        <div class="grid sm:grid-cols-2 gap-6">
          <a href="/" class="flex items-center gap-5 p-6 bg-card/40 border border-border/50 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group shadow-sm">
            <div class="p-3 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Eye class="w-6 h-6" />
            </div>
            <div>
              <p class="font-slab font-bold text-base">View Live Website</p>
              <p class="text-xs text-muted-foreground">Preview the public-facing version of SMaRT-Lab</p>
            </div>
          </a>
          <a href="http://127.0.0.1:8090/_/" target="_blank" rel="noopener noreferrer" 
            class="flex items-center gap-5 p-6 bg-card/40 border border-border/50 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group shadow-sm">
            <div class="p-3 rounded-xl bg-orange-500/10 text-orange-400 transition-transform group-hover:scale-110">
              <Settings class="w-6 h-6" />
            </div>
            <div>
              <p class="font-slab font-bold text-base">Advanced DB Config</p>
              <p class="text-xs text-muted-foreground">Direct access to PocketBase dashboard</p>
            </div>
          </a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
{/if}

<style lang="postcss">
  :global(body) {
    @apply bg-background text-foreground;
  }
  
  /* Custom scrollbar for better aesthetics */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    @apply bg-background;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/20 rounded-full border-4 border-solid border-background hover:bg-muted-foreground/30 transition-colors;
  }
</style>
