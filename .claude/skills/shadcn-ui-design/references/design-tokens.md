# Design Tokens — `shadcn-ui-design`

> Quick Reference (§1–6) + Notes (§24–25) from the Figma design system
> For all 1,812 raw variables → see `full-registry.md`

---

## ── Quick Reference ──────────────────────────────────────────────

## 1. globals.css — Copy to New Project

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --card-foreground: #0a0a0a;
  --popover: #ffffff;
  --popover-foreground: #0a0a0a;
  --primary: #171717;
  --primary-foreground: #fafafa;
  --secondary: #f5f5f5;
  --secondary-foreground: #0a0a0a;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --accent: #f5f5f5;
  --accent-foreground: #171717;
  --destructive: #dc2626;
  --border: #e5e5e5;
  --input: #e5e5e5;
  --ring: #737373;
  --chart-1: #5eb1ef;
  --chart-2: #0090ff;
  --chart-3: #0588f0;
  --chart-4: #0d74ce;
  --chart-5: #113264;
  --sidebar: #fafafa;
  --sidebar-foreground: #0a0a0a;
  --sidebar-primary: #171717;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #f5f5f5;
  --sidebar-accent-foreground: #171717;
  --sidebar-border: #d4d4d4;
  --sidebar-ring: #737373;
  --background-color: rgba(0,0,0,0.30);
  --semantic-background: #6b7280;
  --semantic-border: #4b5563;
  --semantic-foreground: #ffffff;
  --radius: 0.5rem; /* 8px = rounded-lg */
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #171717;
  --card-foreground: #fafafa;
  --popover: #262626;
  --popover-foreground: #fafafa;
  --primary: #e5e5e5;
  --primary-foreground: #171717;
  --secondary: #262626;
  --secondary-foreground: #fafafa;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
  --accent: #404040;
  --accent-foreground: #fafafa;
  --destructive: #f87171;
  --border: #404040;
  --input: #171717;
  --ring: #737373;
  --chart-1: #5eb1ef;
  --chart-2: #0090ff;
  --chart-3: #0588f0;
  --chart-4: #0d74ce;
  --chart-5: #113264;
  --sidebar: #171717;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #0588f0;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #262626;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: rgba(255,255,255,0.80);
  --sidebar-ring: #737373;
  --background-color: rgba(0,0,0,0.30);
  --semantic-background: #6b7280;
  --semantic-border: #4b5563;
  --semantic-foreground: #ffffff;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-background-color: var(--background-color);
  --color-semantic-background: var(--semantic-background);
  --color-semantic-border: var(--semantic-border);
  --color-semantic-foreground: var(--semantic-foreground);
  --radius-sm:  calc(var(--radius) - 4px); /* 4px  */
  --radius-md:  calc(var(--radius) - 2px); /* 6px  */
  --radius-lg:  var(--radius);              /* 8px  */
  --radius-xl:  calc(var(--radius) + 4px); /* 12px */
  --radius-2xl: calc(var(--radius) + 8px); /* 16px */
}
```

PostCSS:
```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } }
```

---

## 2. Semantic Color Tokens (shdcn/ui — 35 variables, 4 modes)

> Typo in Figma source: `pimary-foreground` → use `primary-foreground` in code

| Token | Light | Dark | Primary (blue) | Secondary (yellow) |
|-------|-------|------|----------------|-------------------|
| `background` | white `#ffffff` | neutral/950 `#0a0a0a` | blue/950 `#172554` | yellow/900 `#713f12` |
| `foreground` | neutral/950 `#0a0a0a` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `card` | white `#ffffff` | neutral/900 `#171717` | blue/900 `#1e3a8a` | yellow/900 `#713f12` |
| `card-foreground` | neutral/950 `#0a0a0a` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `popover` | white `#ffffff` | neutral/800 `#262626` | blue/800 `#1e40af` | yellow/800 `#854d0e` |
| `popover-foreground` | neutral/950 `#0a0a0a` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `primary` | neutral/900 `#171717` | neutral/200 `#e5e5e5` | blue/200 `#bfdbfe` | yellow/200 `#fef08a` |
| `pimary-foreground` | neutral/50 `#fafafa` | neutral/900 `#171717` | blue/900 `#1e3a8a` | yellow/900 `#713f12` |
| `secondary` | neutral/100 `#f5f5f5` | neutral/800 `#262626` | blue/800 `#1e40af` | yellow/800 `#854d0e` |
| `secondary-foreground` | neutral/950 `#0a0a0a` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `muted` | neutral/100 `#f5f5f5` | neutral/800 `#262626` | blue/800 `#1e40af` | yellow/800 `#854d0e` |
| `muted-foreground` | neutral/500 `#737373` | neutral/400 `#a3a3a3` | blue/400 `#60a5fa` | yellow/400 `#facc15` |
| `accent` | neutral/100 `#f5f5f5` | neutral/700 `#404040` | blue/700 `#1d4ed8` | yellow/700 `#a16207` |
| `accent-foreground` | neutral/900 `#171717` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `destructive` | red/600 `#dc2626` | red/400 `#f87171` | red/400 `#f87171` | red/600 `#dc2626` |
| `border` | neutral/200 `#e5e5e5` | neutral/700 `#404040` | blue/700 `#1d4ed8` | yellow/700 `#a16207` |
| `input` | neutral/200 `#e5e5e5` | neutral/900 `#171717` | blue/900 `#1e3a8a` | yellow/900 `#713f12` |
| `ring` | neutral/500 `#737373` | neutral/500 `#737373` | blue/500 `#3b82f6` | yellow/50 `#fefce8` |
| `chart-1` | blue/8 `#5eb1ef` | blue/8 `#5eb1ef` | blue/8 `#5eb1ef` | yellow/8 `#d5ae39` |
| `chart-2` | blue/9 `#0090ff` | blue/9 `#0090ff` | blue/9 `#0090ff` | yellow/9 `#ffe629` |
| `chart-3` | blue/10 `#0588f0` | blue/10 `#0588f0` | blue/10 `#0588f0` | yellow/10 `#ffdc00` |
| `chart-4` | blue/11 `#0d74ce` | blue/11 `#0d74ce` | blue/11 `#0d74ce` | yellow/11 `#9e6c00` |
| `chart-5` | blue/12 `#113264` | blue/12 `#113264` | blue/12 `#113264` | yellow/12 `#473b1f` |
| `sidebar` | neutral/50 `#fafafa` | neutral/900 `#171717` | blue/900 `#1e3a8a` | yellow/900 `#713f12` |
| `sidebar-foreground` | neutral/950 `#0a0a0a` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `sidebar-primary` | neutral/900 `#171717` | blue/10 `#0588f0` | blue/10 `#0588f0` | yellow/10 `#ffdc00` |
| `sidebar-primary-foreground` | neutral/50 `#fafafa` | neutral/50 `#fafafa` | neutral/50 `#fafafa` | yellow/50 `#fefce8` |
| `sidebar-accent` | neutral/100 `#f5f5f5` | neutral/800 `#262626` | blue/800 `#1e40af` | yellow/800 `#854d0e` |
| `sidebar-accent-foreground` | neutral/900 `#171717` | neutral/50 `#fafafa` | blue/50 `#eff6ff` | yellow/50 `#fefce8` |
| `sidebar-border` | neutral/300 `#d4d4d4` | white/10 `rgba(255,255,255,0.80)` | white/10 `rgba(255,255,255,0.80)` | white/10 `rgba(255,255,255,0.80)` |
| `sidebar-ring` | neutral/500 `#737373` | neutral/500 `#737373` | blue/500 `#3b82f6` | yellow/500 `#eab308` |
| `background-color` | black/5 `rgba(0,0,0,0.30)` | black/5 `rgba(0,0,0,0.30)` | black/5 `rgba(0,0,0,0.30)` | black/5 `rgba(0,0,0,0.30)` |
| `semantic-background` | gray/500 `#6b7280` | gray/500 `#6b7280` | gray/900 `#111827` | gray/600 `#4b5563` |
| `semantic-border` | gray/600 `#4b5563` | gray/600 `#4b5563` | gray/800 `#1f2937` | gray/800 `#1f2937` |
| `semantic-foreground` | white `#ffffff` | white `#ffffff` | white `#ffffff` | white `#ffffff` |

**Token → Tailwind class:**
```
bg-background       text-foreground
bg-card             text-card-foreground
bg-popover          text-popover-foreground
bg-primary          text-primary-foreground
bg-secondary        text-secondary-foreground
bg-muted            text-muted-foreground
bg-accent           text-accent-foreground
bg-destructive
border-border       border-input         ring-ring
bg-sidebar          text-sidebar-foreground
bg-sidebar-primary  text-sidebar-primary-foreground
bg-sidebar-accent   text-sidebar-accent-foreground
border-sidebar-border
bg-semantic-background  border-semantic-border  text-semantic-foreground
```

---

## 3. Typography

**Fonts** (from `font` + `fontUse` collections):

```css
@theme {
  --font-sans:       "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono:       "Geist Mono", ui-monospace, monospace;
  --font-thai-sans:  "IBM Plex Sans Thai", sans-serif;
  --font-thai-serif: "SF Thonburi", serif;
}
```

**Font Size** (`font` collection — 13 variables):

| Token | px | Tailwind |
|-------|----|----------|
| `size/xs` | 12 | `text-xs` |
| `size/sm` | 14 | `text-sm` |
| `size/base` | 16 | `text-base` |
| `size/lg` | 18 | `text-lg` |
| `size/xl` | 20 | `text-xl` |
| `size/2xl` | 24 | `text-2xl` |
| `size/3xl` | 30 | `text-3xl` |
| `size/4xl` | 36 | `text-4xl` |
| `size/5xl` | 48 | `text-5xl` |
| `size/6xl` | 60 | `text-6xl` |
| `size/7xl` | 72 | `text-7xl` |
| `size/8xl` | 96 | `text-8xl` |
| `size/9xl` | 128 | `text-9xl` |

**Font Weight** (9 variables): `thin`(100) `extralight`(200) `light`(300) `normal`(400) `medium`(500) `semibold`(600) `bold`(700) `extrabold`(800) `black`(900)

**Line Height / Leading** (13 variables): `leading/3`(12px) `leading/4`(16px) `leading/5`(20px) `leading/6`(24px) `leading/7`(28px) `leading/8`(32px) `leading/9`(36px) `leading/10`(40px) `leading/12`(48px) `leading/15`(60px) `leading/18`(72px) `leading/24`(96px) `leading/32`(128px)

**Letter Spacing / Tracking** (6 variables): `tighter`(-0.8) `tight`(-0.4) `normal`(0) `wide`(0.4) `wider`(0.8) `widest`(1.6)

**Font Style** (2 variables): `italic` · `not-italic`

---

## 4. Border Radius (`border-radius` collection — 150 variables)

Base `--radius = 0.5rem (8px)`. Size scale × 15 direction variants = 150 total.

**Size scale (10):**

| Token | px | Token | px |
|-------|----|-------|----|  
| `rounded-none` | 0 | `rounded-3xl` | 24 |
| `rounded-xs` | 2 | `rounded-4xl` | 32 |
| `rounded-sm` | 4 | `rounded-full` | 9999 |
| `rounded-md` | 6 | — | — |
| `rounded-lg` | **8** ← base | — | — |
| `rounded-xl` | 12 | — | — |
| `rounded-2xl` | 16 | — | — |

**Direction variants (15):** `rounded-` `rounded-s-` `rounded-e-` `rounded-t-` `rounded-r-` `rounded-b-` `rounded-l-` `rounded-ss-` `rounded-se-` `rounded-ee-` `rounded-es-` `rounded-tl-` `rounded-tr-` `rounded-br-` `rounded-bl-`

---

## 5. Key Spacing

1 unit = 4px. Use `gap-*` · `p-*` · `m-*` · `max-w-*` (see Full Registry for all values).

| Scale | px | Common use |
|-------|----|------------|
| `0.5` | 2 | icon tight gap |
| `1` | 4 | icon inner gap |
| `1.5` | 6 | element close |
| `2` | 8 | list item gap |
| `3` | 12 | field inner group |
| `4` | 16 | form field standard |
| `5` | 20 | sub-section |
| `6` | 24 | form section |
| `8` | 32 | layout gap |
| `10` | 40 | section margin |
| `12` | 48 | page section |
| `16` | 64 | hero section |

**max-width named sizes:** `max-w-xs`(320) `max-w-sm`(384) `max-w-md`(448) `max-w-lg`(512) `max-w-xl`(576) `max-w-2xl`(672) `max-w-3xl`(768) `max-w-4xl`(896) `max-w-5xl`(1024) `max-w-6xl`(1152) `max-w-7xl`(1280)

---

## 6. Component Variant Reference

**Button** — `variant`: `default` `outline` `ghost` `destructive` `secondary` `link`  
**Button** — `size`: `xs` `sm` `default` `lg` `icon-xs` `icon-sm` `icon` `icon-lg`

| variant | when to use |
|---------|-------------|
| `default` | Primary CTA — one per page |
| `secondary` | Supporting action |
| `outline` | Toolbar / button group |
| `ghost` | Row action / nav item |
| `destructive` | Delete / irreversible |
| `link` | Inline text action |

**Badge** — `variant`: `default` `secondary` `outline` `destructive`  
**Alert** — `variant`: `default` `destructive`

---

---

## ── Notes ────────────────────────────────────────────────────────

## 24. Typos in Figma Source

| Figma source | Correct in code | Note |
|-------------|-----------------|------|
| `pimary-foreground` | `primary-foreground` | Missing 'r' |
| `Giest Mono` | `Geist Mono` | Missing 'e' |
| `Sans Sarif` | `Sans Serif` | Misspelling (fontUse variable name) |

---

## 25. Tailwind v4 Breaking Changes

| v3 | v4 |
|----|----|
| `@tailwind base/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` | `@theme {}` in CSS |
| `shadow-sm` | `shadow-xs` (scale shifted) |
| `rounded-sm` | `rounded-xs` (scale shifted) |
| `ring` | `ring-3` (default width changed) |
| `outline-none` | `outline-hidden` |
| `!flex` | `flex!` (important suffix) |
| `bg-[--var]` | `bg-(--var)` |
| `space-y-4` | `flex flex-col gap-4` (preferred) |
| `w-4 h-4` | `size-4` |
