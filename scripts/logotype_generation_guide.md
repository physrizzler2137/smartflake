# SMaRT-Lab Logotype — Generation & Animation Guide

> **Purpose:** This document provides a complete prompt and specification for regenerating the SMaRT-Lab logotype and its CSS animation from scratch. Use this when recreating the component in any framework or asking an AI to reproduce it.

---

## 1. Brand Identity

**Full name:** Smart Materials and Soft Robotics Laboratory  
**Short logotype:** `SMaRT-Lab`  
**Typeface:** [Roboto Slab](https://fonts.google.com/specimen/Roboto+Slab) — a geometric slab-serif that conveys precision, technical authority, and academic credibility. It is the only permitted font for the logotype under all circumstances.

**Key typographic rule:** The logotype is always written as `SMaRT-Lab` — never `Smart-Lab`, `SMART-Lab`, or any other casing. The capitalisation carries semantic meaning:
- `SM` — Smart Materials
- `a` — the **special character** (see §3)
- `RT` — Robotics Technology  
- `-` — separator
- `Lab` — Laboratory

---

## 2. The Special "a" Character

The lowercase `a` in `SMaRT` is the **visual centrepiece** of the logotype. It must be the **double-storey "a"** — the form with a fully closed upper bowl, as found in Roboto Slab's regular weight. This is intentional:

- It visually distinguishes the logotype from an acronym (`SMART`)
- It creates a unique letterform that is instantly recognisable at any size
- At rest, it is scaled **vertically 1.4×** and translated **upward by 0.17em**, making it taller than the surrounding capitals — a deliberate design accent

---

## 3. Colour

The logotype colour is **theme-aware** via CSS custom properties:

| Context | Value |
|---|---|
| Primary colour (used for logotype text) | `hsl(var(--primary))` |
| Default dark theme primary | `hsl(60, 68%, 81%)` — warm pale gold |
| High-contrast override | `hsl(60, 95%, 50%)` — bright yellow |

The logotype should **never** be rendered in a fixed hex colour in production. It must inherit from `--primary` so it adapts to all themes (Ocean, Cyberpunk, Classic R&W, etc.).

---

## 4. Animation: "Heartbeat Squeeze"

The animation runs on the animated variant of the logotype (`animated={true}`) and uses three coordinated keyframe sequences that repeat on a **4-second infinite loop**.

### 4.1 Overall Structure

The logotype is split into **4 animated segments** (all `inline-block` spans):

```
[SM] [a] [RT-] [Lab]
```

- `SM` — slides **right** by `0.12em`
- `a` — **scales and pops** upward
- `RT-` — slides **left** by `0.12em`
- `Lab` — **static**, no animation

The effect is a rhythmic "squeeze-and-pop" — like the letters are breathing or pulsing around the special `a`.

### 4.2 Keyframe Definitions (Tailwind / CSS)

```css
/* SM: squeeze right */
@keyframes logo-sm-squeeze {
  0%, 100%  { transform: translateX(0); }
  37.5%, 62.5% { transform: translateX(0.12em); }
}

/* RT-: squeeze left */
@keyframes logo-rt-squeeze {
  0%, 100%  { transform: translateX(0); }
  37.5%, 62.5% { transform: translateX(-0.12em); }
}

/* a: scale and pop upward */
@keyframes logo-a-pop {
  0%, 100% { transform: scale(1, 1.4) translateY(-0.17em); }
  37.5%    { transform: scale(0.5, 1.4) translateY(-0.17em); }
  50%      { transform: scale(1.1, 1.9) translateY(-0.4em); }
  62.5%    { transform: scale(0.5, 1.4) translateY(-0.17em); }
}
```

**All three animations run with the same duration and easing:**
- Duration: `4s`
- Easing: `ease-in-out`
- Repeat: `infinite`

### 4.3 Timing Narrative

| Time | Event |
|---|---|
| `0%` | Resting — `a` is tall, letters at natural spacing |
| `37.5%` (1.5s) | `SM` and `RT-` squeeze toward `a`; `a` squishes horizontally |
| `50%` (2s) | `a` explodes upward — peak pop, taller and wider |
| `62.5%` (2.5s) | Letters release, `a` squishes back |
| `100%` (4s) | Returns to rest |

---

## 5. Component Structure (Svelte 5)

```svelte
<script lang="ts">
  let { animated = true, class: className = "", useHeadlineFont = true } = $props();
</script>

{#if !animated}
  <span class="{useHeadlineFont ? 'font-slab' : ''} {className}">SMaRT-Lab</span>
{:else}
  <span class="contents {useHeadlineFont ? 'font-slab' : ''} {className}">
    <span class="inline-block animate-logo-sm-squeeze mr-[0.02em]">SM</span>
    <span class="relative inline-block animate-logo-a-pop">a</span>
    <span class="inline-block animate-logo-rt-squeeze ml-[0.02em]">RT-</span>
    <span class="inline-block ml-[0.01em]">Lab</span>
  </span>
{/if}
```

**Props:**

| Prop | Default | Description |
|---|---|---|
| `animated` | `true` | Enables the heartbeat squeeze animation |
| `class` | `""` | Extra Tailwind classes passed from parent |
| `useHeadlineFont` | `true` | Applies `font-slab` (Roboto Slab). Set to `false` in font playground preview cards so each card renders in its own showcase font |

---

## 6. Usage Contexts

| Location | `animated` | Notes |
|---|---|---|
| Hero section (`h1`) | `true` | Full animation, large size (`text-5xl md:text-7xl`) |
| Navigation bar | `false` | Static, `text-2xl` |
| Footer | `false` | Static, tightened kerning |
| Font playground cards | `false` + `useHeadlineFont={false}` | Shows card's own font as preview |

---

## 7. AI Regeneration Prompt

Use the following prompt verbatim to regenerate this component in any AI assistant:

---

> **Prompt:**
>
> Create a logotype component for a university research lab called **SMaRT-Lab** (Smart Materials and Soft Robotics Laboratory).
>
> **Typography:** Use the Google Font **Roboto Slab** (slab-serif). The logotype text is always `SMaRT-Lab` — this exact casing is required.
>
> **Special character:** The lowercase `a` in `SMaRT` is the visual centrepiece. It must be the **double-storey "a"** form. At rest, scale it vertically to `1.4×` its normal height and shift it `0.17em` upward so it sits taller than the surrounding capitals.
>
> **Animation (4-second infinite loop, ease-in-out):** Split the text into four spans: `[SM]`, `[a]`, `[RT-]`, `[Lab]`. Animate them as follows:
> - At `37.5%`: `SM` slides right by `0.12em`, `RT-` slides left by `0.12em`, and `a` squishes to `scaleX(0.5)` while staying tall
> - At `50%`: `a` explodes upward — `scale(1.1, 1.9) translateY(-0.4em)` — the peak pop
> - At `62.5%`: all three return through the squeeze position before releasing back to rest at `100%`
> - `Lab` is always static
>
> **Colour:** Apply `hsl(var(--primary))` from a CSS custom property so the colour adapts to the active theme. Do not hardcode any colour.
>
> **Component props:**
> - `animated` (boolean, default `true`) — toggles the animation
> - `useHeadlineFont` (boolean, default `true`) — toggles whether to apply the Roboto Slab class (useful for font showcase cards where the parent font should show instead)
>
> Output as a Svelte 5 component using `$props()` runes.

---

*Last updated: 2026-04-28 | Component: `src/lib/components/LogoText.svelte`*
