# SMaRT-LaB Coin Generation & Animation Guide

This guide details how to replicate the "Premium Gold" interactive statistics coins used in the SMaRT-LaB website.

## 1. Visual Design: The "Premium Gold" Palette

To achieve a sophisticated, non-generic gold look, we use a desaturated "Champagne Gold" palette. Avoid bright yellows; instead, use HSL/Hex values with subtle brown and pale cream undertones.

### Core Colors:
- **Highlight (Pale Gold):** `#f1f1ae` (HSL 60, 68%, 81%)
- **Midtone (Champagne):** `#c5a059` (HSL 40, 48%, 56%)
- **Shadow (Bronze/Deep Gold):** `#8c7336` (HSL 43, 45%, 38%)
- **Deep Shadow:** `#5e4a1a` (HSL 42, 57%, 23%)

## 2. Component Structure (CSS/Tailwind)

The coin is composed of two concentric circles to create a 3D "beveled" edge effect.

### CSS Classes:
```css
/* The beveled edge */
.coin-outer {
  background: linear-gradient(135deg, #c5a059 0%, #f1f1ae 50%, #8c7336 100%);
  box-shadow: 0 8px 16px rgba(140, 115, 54, 0.3);
}

/* The recessed face */
.coin-inner {
  background: linear-gradient(135deg, #f1f1ae 0%, #c5a059 50%, #5e4a1a 100%);
  box-shadow: inset 0 4px 8px rgba(94, 74, 26, 0.4);
}
```

### HTML Template:
```html
<div class="relative w-24 h-24 transition-transform hover:scale-110">
  <div class="coin-outer rounded-full p-1.5 w-full h-full">
    <div class="coin-inner rounded-full w-full h-full flex items-center justify-center">
      <!-- Stat Value Here -->
    </div>
  </div>
</div>
```

## 3. Animation Logic

### Value Counting
Use Svelte's `tweened` motion for a smooth count-up effect when the section enters the viewport.
```ts
const count = tweened(0, { duration: 2000, easing: cubicOut });
```

### The "Bling-Bling" Cycle
To keep the UI alive, implement a randomized 8-second cycle that picks one coin at a time to "sparkle."

1. **State:** Track the currently active index with `$state`.
2. **Interval:** Every 8 seconds, pick a new random index (different from the current one).
3. **Scaling:** Apply a subtle `scale-110` to the active coin via conditional classes.

### Particle Sparkles (Stars)
When a coin is active, render 12+ star particles (`✦`) at randomized positions within the coin's radius.

**Keyframes for Sparkles:**
```css
@keyframes bling-pop {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(var(--star-size)); }
}
```
Apply variable `animation-delay` and `animation-duration` to each star to make the effect look organic and non-repetitive.

## 4. Implementation Checklist
- [ ] Use `font-slab` for the numbers to give them weight.
- [ ] Ensure `drop-shadow` is applied to the text for legibility against the gold.
- [ ] Use `IntersectionObserver` to only start the counter when the user scrolls to the section.
- [ ] Avoid high-saturation yellows; stick to the desaturated champagne tones for a premium feel.
