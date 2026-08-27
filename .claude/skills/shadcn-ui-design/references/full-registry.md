# Full Token Registry — shadcn-ui-design

> All 1,812 Figma variables across 17 collections
> For quick reference → see `design-tokens.md`

---

## ── Full Token Registry ──────────────────────────────────────────

## 7. shdcn/ui — All 4 Theme Modes (35 variables)

*See §2 for the full table with all mode values.*

**Primary mode** (blue brand):
```css
.theme-primary {
  --background: #172554;
  --foreground: #eff6ff;
  --card: #1e3a8a;
  --card-foreground: #eff6ff;
  --popover: #1e40af;
  --popover-foreground: #eff6ff;
  --primary: #bfdbfe;
  --primary-foreground: #1e3a8a;
  --secondary: #1e40af;
  --secondary-foreground: #eff6ff;
  --muted: #1e40af;
  --muted-foreground: #60a5fa;
  --accent: #1d4ed8;
  --accent-foreground: #eff6ff;
  --destructive: #f87171;
  --border: #1d4ed8;
  --input: #1e3a8a;
  --ring: #3b82f6;
  --chart-1: #5eb1ef;
  --chart-2: #0090ff;
  --chart-3: #0588f0;
  --chart-4: #0d74ce;
  --chart-5: #113264;
  --sidebar: #1e3a8a;
  --sidebar-foreground: #eff6ff;
  --sidebar-primary: #0588f0;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #1e40af;
  --sidebar-accent-foreground: #eff6ff;
  --sidebar-border: rgba(255,255,255,0.80);
  --sidebar-ring: #3b82f6;
  --background-color: rgba(0,0,0,0.30);
  --semantic-background: #111827;
  --semantic-border: #1f2937;
  --semantic-foreground: #ffffff;
}
```

**Secondary mode** (yellow brand):
```css
.theme-secondary {
  --background: #713f12;
  --foreground: #fefce8;
  --card: #713f12;
  --card-foreground: #fefce8;
  --popover: #854d0e;
  --popover-foreground: #fefce8;
  --primary: #fef08a;
  --primary-foreground: #713f12;
  --secondary: #854d0e;
  --secondary-foreground: #fefce8;
  --muted: #854d0e;
  --muted-foreground: #facc15;
  --accent: #a16207;
  --accent-foreground: #fefce8;
  --destructive: #dc2626;
  --border: #a16207;
  --input: #713f12;
  --ring: #fefce8;
  --chart-1: #d5ae39;
  --chart-2: #ffe629;
  --chart-3: #ffdc00;
  --chart-4: #9e6c00;
  --chart-5: #473b1f;
  --sidebar: #713f12;
  --sidebar-foreground: #fefce8;
  --sidebar-primary: #ffdc00;
  --sidebar-primary-foreground: #fefce8;
  --sidebar-accent: #854d0e;
  --sidebar-accent-foreground: #fefce8;
  --sidebar-border: rgba(255,255,255,0.80);
  --sidebar-ring: #eab308;
  --background-color: rgba(0,0,0,0.30);
  --semantic-background: #4b5563;
  --semantic-border: #1f2937;
  --semantic-foreground: #ffffff;
}
```

---

## 8. tw/colors — Tailwind Palette (244 variables)

**slate**: `slate/50`:`#f8fafc` · `slate/100`:`#f1f5f9` · `slate/200`:`#e2e8f0` · `slate/300`:`#cbd5e1` · `slate/400`:`#94a3b8` · `slate/500`:`#64748b` · `slate/600`:`#475569` · `slate/700`:`#334155` · `slate/800`:`#1e293b` · `slate/900`:`#0f172a` · `slate/950`:`#020617`

**gray**: `gray/50`:`#f9fafb` · `gray/100`:`#f3f4f6` · `gray/200`:`#e5e7eb` · `gray/300`:`#d1d5db` · `gray/400`:`#9ca3af` · `gray/500`:`#6b7280` · `gray/600`:`#4b5563` · `gray/700`:`#374151` · `gray/800`:`#1f2937` · `gray/900`:`#111827` · `gray/950`:`#030712`

**zinc**: `zinc/50`:`#fafafa` · `zinc/100`:`#f4f4f5` · `zinc/200`:`#e4e4e7` · `zinc/300`:`#d4d4d8` · `zinc/400`:`#a1a1aa` · `zinc/500`:`#71717a` · `zinc/600`:`#52525b` · `zinc/700`:`#3f3f46` · `zinc/800`:`#27272a` · `zinc/900`:`#18181b` · `zinc/950`:`#09090b`

**neutral**: `neutral/50`:`#fafafa` · `neutral/100`:`#f5f5f5` · `neutral/200`:`#e5e5e5` · `neutral/300`:`#d4d4d4` · `neutral/400`:`#a3a3a3` · `neutral/500`:`#737373` · `neutral/600`:`#525252` · `neutral/700`:`#404040` · `neutral/800`:`#262626` · `neutral/900`:`#171717` · `neutral/950`:`#0a0a0a`

**stone**: `stone/50`:`#fafaf9` · `stone/100`:`#f5f5f4` · `stone/200`:`#e7e5e4` · `stone/300`:`#d6d3d1` · `stone/400`:`#a8a29e` · `stone/500`:`#78716c` · `stone/600`:`#57534e` · `stone/700`:`#44403c` · `stone/800`:`#292524` · `stone/900`:`#1c1917` · `stone/950`:`#0c0a09`

**red**: `red/50`:`#fef2f2` · `red/100`:`#fee2e2` · `red/200`:`#fecaca` · `red/300`:`#fca5a5` · `red/400`:`#f87171` · `red/500`:`#ef4444` · `red/600`:`#dc2626` · `red/700`:`#b91c1c` · `red/800`:`#991b1b` · `red/900`:`#7f1d1d` · `red/950`:`#450a0a`

**orange**: `orange/50`:`#fff7ed` · `orange/100`:`#ffedd5` · `orange/200`:`#fed7aa` · `orange/300`:`#fdba74` · `orange/400`:`#fb923c` · `orange/500`:`#f97316` · `orange/600`:`#ea580c` · `orange/700`:`#c2410c` · `orange/800`:`#9a3412` · `orange/900`:`#7c2d12` · `orange/950`:`#431407`

**amber**: `amber/50`:`#fffbeb` · `amber/100`:`#fef3c7` · `amber/200`:`#fde68a` · `amber/300`:`#fcd34d` · `amber/400`:`#fbbf24` · `amber/500`:`#f59e0b` · `amber/600`:`#d97706` · `amber/700`:`#b45309` · `amber/800`:`#92400e` · `amber/900`:`#78350f` · `amber/950`:`#451a03`

**yellow**: `yellow/50`:`#fefce8` · `yellow/100`:`#fef9c3` · `yellow/200`:`#fef08a` · `yellow/300`:`#fde047` · `yellow/400`:`#facc15` · `yellow/500`:`#eab308` · `yellow/600`:`#ca8a04` · `yellow/700`:`#a16207` · `yellow/800`:`#854d0e` · `yellow/900`:`#713f12` · `yellow/950`:`#422006`

**lime**: `lime/50`:`#f7fee7` · `lime/100`:`#ecfccb` · `lime/200`:`#d9f99d` · `lime/300`:`#bef264` · `lime/400`:`#a3e635` · `lime/500`:`#84cc16` · `lime/600`:`#65a30d` · `lime/700`:`#4d7c0f` · `lime/800`:`#3f6212` · `lime/900`:`#365314` · `lime/950`:`#1a2e05`

**green**: `green/50`:`#f0fdf4` · `green/100`:`#dcfce7` · `green/200`:`#bbf7d0` · `green/300`:`#86efac` · `green/400`:`#4ade80` · `green/500`:`#22c55e` · `green/600`:`#16a34a` · `green/700`:`#15803d` · `green/800`:`#166534` · `green/900`:`#14532d` · `green/950`:`#052e16`

**emerald**: `emerald/50`:`#ecfdf5` · `emerald/100`:`#d1fae5` · `emerald/200`:`#a7f3d0` · `emerald/300`:`#6ee7b7` · `emerald/400`:`#34d399` · `emerald/500`:`#10b981` · `emerald/600`:`#059669` · `emerald/700`:`#047857` · `emerald/800`:`#065f46` · `emerald/900`:`#064e3b` · `emerald/950`:`#022c22`

**white**: `white`:`#ffffff`

**black**: `black`:`#000000`

**teal**: `teal/50`:`#f0fdfa` · `teal/100`:`#ccfbf1` · `teal/200`:`#99f6e4` · `teal/300`:`#5eead4` · `teal/400`:`#2dd4bf` · `teal/500`:`#14b8a6` · `teal/600`:`#0d9488` · `teal/700`:`#0f766e` · `teal/800`:`#115e59` · `teal/900`:`#134e4a` · `teal/950`:`#042f2e`

**cyan**: `cyan/50`:`#ecfeff` · `cyan/100`:`#cffafe` · `cyan/200`:`#a5f3fc` · `cyan/300`:`#67e8f9` · `cyan/400`:`#22d3ee` · `cyan/500`:`#06b6d4` · `cyan/600`:`#0891b2` · `cyan/700`:`#0e7490` · `cyan/800`:`#155e75` · `cyan/900`:`#164e63` · `cyan/950`:`#083344`

**sky**: `sky/50`:`#f0f9ff` · `sky/100`:`#e0f2fe` · `sky/200`:`#bae6fd` · `sky/300`:`#7dd3fc` · `sky/400`:`#38bdf8` · `sky/500`:`#0ea5e9` · `sky/600`:`#0284c7` · `sky/700`:`#0369a1` · `sky/800`:`#075985` · `sky/900`:`#0c4a6e` · `sky/950`:`#082f49`

**blue**: `blue/50`:`#eff6ff` · `blue/100`:`#dbeafe` · `blue/200`:`#bfdbfe` · `blue/300`:`#93c5fd` · `blue/400`:`#60a5fa` · `blue/500`:`#3b82f6` · `blue/600`:`#2563eb` · `blue/700`:`#1d4ed8` · `blue/800`:`#1e40af` · `blue/900`:`#1e3a8a` · `blue/950`:`#172554`

**indigo**: `indigo/50`:`#eef2ff` · `indigo/100`:`#e0e7ff` · `indigo/200`:`#c7d2fe` · `indigo/300`:`#a5b4fc` · `indigo/400`:`#818cf8` · `indigo/500`:`#6366f1` · `indigo/600`:`#4f46e5` · `indigo/700`:`#4338ca` · `indigo/800`:`#3730a3` · `indigo/900`:`#312e81` · `indigo/950`:`#1e1b4b`

**violet**: `violet/50`:`#f5f3ff` · `violet/100`:`#ede9fe` · `violet/200`:`#ddd6fe` · `violet/300`:`#c4b5fd` · `violet/400`:`#a78bfa` · `violet/500`:`#8b5cf6` · `violet/600`:`#7c3aed` · `violet/700`:`#6d28d9` · `violet/800`:`#5b21b6` · `violet/900`:`#4c1d95` · `violet/950`:`#2e1065`

**purple**: `purple/50`:`#faf5ff` · `purple/100`:`#f3e8ff` · `purple/200`:`#e9d5ff` · `purple/300`:`#c084fc` · `purple/400`:`#a78bfa` · `purple/500`:`#a855f7` · `purple/600`:`#9333ea` · `purple/700`:`#7e22ce` · `purple/800`:`#6b21a8` · `purple/900`:`#581c87` · `purple/950`:`#3b0764`

**fuchsia**: `fuchsia/50`:`#fdf4ff` · `fuchsia/100`:`#fae8ff` · `fuchsia/200`:`#f5d0fe` · `fuchsia/300`:`#f0abfc` · `fuchsia/400`:`#e879f9` · `fuchsia/500`:`#d946ef` · `fuchsia/600`:`#c026d3` · `fuchsia/700`:`#a21caf` · `fuchsia/800`:`#86198f` · `fuchsia/900`:`#701a75` · `fuchsia/950`:`#4a044e`

**pink**: `pink/50`:`#fdf2f8` · `pink/100`:`#fce7f3` · `pink/200`:`#fbcfe8` · `pink/300`:`#f9a8d4` · `pink/400`:`#f472b6` · `pink/500`:`#ec4899` · `pink/600`:`#db2777` · `pink/700`:`#be185d` · `pink/800`:`#9d174d` · `pink/900`:`#831843` · `pink/950`:`#500724`

**rose**: `rose/50`:`#fff1f2` · `rose/100`:`#ffe4e6` · `rose/200`:`#fecdd3` · `rose/300`:`#fda4af` · `rose/400`:`#fb7185` · `rose/500`:`#f43f5e` · `rose/600`:`#e11d48` · `rose/700`:`#be123c` · `rose/800`:`#9f1239` · `rose/900`:`#881337` · `rose/950`:`#4c0519`

---

## 9. tokens — Base Numeric Scale (87 variables)

| Name | Value | Name | Value | Name | Value |
|------|-------|------|-------|------|-------|
| `-0,8` | -0.800000011920929 | `-0,4` | -0.4000000059604645 | `0` | 0 |
| `0,4` | 0.4000000059604645 | `0,5` | 0.5 | `0,75` | 0.75 |
| `0,8` | 0.800000011920929 | `1` | 1 | `1,25` | 1.25 |
| `1,5` | 1.5 | `1,6` | 1.600000023841858 | `1,75` | 1.75 |
| `2` | 2 | `2,25` | 2.25 | `2,5` | 2.5 |
| `2,75` | 2.75 | `3` | 3 | `4` | 4 |
| `5` | 5 | `6` | 6 | `8` | 8 |
| `10` | 10 | `12` | 12 | `14` | 14 |
| `15` | 15 | `16` | 16 | `18` | 18 |
| `20` | 20 | `24` | 24 | `25` | 25 |
| `28` | 28 | `30` | 30 | `32` | 32 |
| `35` | 35 | `36` | 36 | `40` | 40 |
| `44` | 44 | `45` | 45 | `48` | 48 |
| `50` | 50 | `55` | 55 | `56` | 56 |
| `60` | 60 | `64` | 64 | `65` | 65 |
| `70` | 70 | `72` | 72 | `75` | 75 |
| `80` | 80 | `85` | 85 | `90` | 90 |
| `95` | 95 | `96` | 96 | `100` | 100 |
| `112` | 112 | `128` | 128 | `144` | 144 |
| `160` | 160 | `176` | 176 | `192` | 192 |
| `200` | 200 | `208` | 208 | `224` | 224 |
| `240` | 240 | `256` | 256 | `288` | 288 |
| `300` | 300 | `320` | 320 | `384` | 384 |
| `400` | 400 | `448` | 448 | `500` | 500 |
| `512` | 512 | `576` | 576 | `600` | 600 |
| `640` | 640 | `672` | 672 | `700` | 700 |
| `768` | 768 | `800` | 800 | `896` | 896 |
| `900` | 900 | `1024` | 1024 | `1152` | 1152 |
| `1280` | 1280 | `1536` | 1536 | `9999` | 9999 |

---

## 10. border-radius (150 variables)

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `rounded-xs` | 2 | `rounded-sm` | 4 | `rounded-md` | 6 |
| `rounded-lg` | 8 | `rounded-xl` | 12 | `rounded-2xl` | 16 |
| `rounded-3xl` | 24 | `rounded-4xl` | 32 | `rounded-none` | 0 |
| `rounded-full` | 9999 | `rounded-s-xs` | 2 | `rounded-s-sm` | 4 |
| `rounded-s-md` | 6 | `rounded-s-lg` | 8 | `rounded-s-xl` | 12 |
| `rounded-s-2xl` | 16 | `rounded-s-3xl` | 24 | `rounded-s-4xl` | 32 |
| `rounded-s-none` | 0 | `rounded-s-full` | 9999 | `rounded-e-xs` | 2 |
| `rounded-e-sm` | 4 | `rounded-e-md` | 6 | `rounded-e-lg` | 8 |
| `rounded-e-xl` | 12 | `rounded-e-2xl` | 16 | `rounded-e-3xl` | 24 |
| `rounded-e-4xl` | 32 | `rounded-e-none` | 0 | `rounded-e-full` | 9999 |
| `rounded-t-xs` | 2 | `rounded-t-sm` | 4 | `rounded-t-md` | 6 |
| `rounded-t-lg` | 8 | `rounded-t-xl` | 12 | `rounded-t-2xl` | 16 |
| `rounded-t-3xl` | 24 | `rounded-t-4xl` | 32 | `rounded-t-none` | 0 |
| `rounded-t-full` | 9999 | `rounded-r-xs` | 2 | `rounded-r-sm` | 4 |
| `rounded-r-md` | 6 | `rounded-r-lg` | 8 | `rounded-r-xl` | 12 |
| `rounded-r-2xl` | 16 | `rounded-r-3xl` | 24 | `rounded-r-4xl` | 32 |
| `rounded-r-none` | 0 | `rounded-r-full` | 9999 | `rounded-b-xs` | 2 |
| `rounded-b-sm` | 4 | `rounded-b-md` | 6 | `rounded-b-lg` | 8 |
| `rounded-b-xl` | 12 | `rounded-b-2xl` | 16 | `rounded-b-3xl` | 24 |
| `rounded-b-4xl` | 32 | `rounded-b-none` | 0 | `rounded-b-full` | 9999 |
| `rounded-l-xs` | 2 | `rounded-l-sm` | 4 | `rounded-l-md` | 6 |
| `rounded-l-lg` | 8 | `rounded-l-xl` | 12 | `rounded-l-2xl` | 16 |
| `rounded-l-3xl` | 24 | `rounded-l-4xl` | 32 | `rounded-l-none` | 0 |
| `rounded-l-full` | 9999 | `rounded-ss-xs` | 2 | `rounded-ss-sm` | 4 |
| `rounded-ss-md` | 6 | `rounded-ss-lg` | 8 | `rounded-ss-xl` | 12 |
| `rounded-ss-2xl` | 16 | `rounded-ss-3xl` | 24 | `rounded-ss-4xl` | 32 |
| `rounded-ss-none` | 0 | `rounded-ss-full` | 9999 | `rounded-se-xs` | 2 |
| `rounded-se-sm` | 4 | `rounded-se-md` | 6 | `rounded-se-lg` | 8 |
| `rounded-se-xl` | 12 | `rounded-se-2xl` | 16 | `rounded-se-3xl` | 24 |
| `rounded-se-4xl` | 32 | `rounded-se-none` | 0 | `rounded-se-full` | 9999 |
| `rounded-ee-xs` | 2 | `rounded-ee-sm` | 4 | `rounded-ee-md` | 6 |
| `rounded-ee-lg` | 8 | `rounded-ee-xl` | 12 | `rounded-ee-2xl` | 16 |
| `rounded-ee-3xl` | 24 | `rounded-ee-4xl` | 32 | `rounded-ee-none` | 0 |
| `rounded-ee-full` | 9999 | `rounded-es-xs` | 2 | `rounded-es-sm` | 4 |
| `rounded-es-md` | 6 | `rounded-es-lg` | 8 | `rounded-es-xl` | 12 |
| `rounded-es-2xl` | 16 | `rounded-es-3xl` | 24 | `rounded-es-4xl` | 32 |
| `rounded-es-none` | 0 | `rounded-es-full` | 9999 | `rounded-tl-xs` | 2 |
| `rounded-tl-sm` | 4 | `rounded-tl-md` | 6 | `rounded-tl-lg` | 8 |
| `rounded-tl-xl` | 12 | `rounded-tl-2xl` | 16 | `rounded-tl-3xl` | 24 |
| `rounded-tl-4xl` | 32 | `rounded-tl-none` | 0 | `rounded-tl-full` | 9999 |
| `rounded-tr-xs` | 2 | `rounded-tr-sm` | 4 | `rounded-tr-md` | 6 |
| `rounded-tr-lg` | 8 | `rounded-tr-xl` | 12 | `rounded-tr-2xl` | 16 |
| `rounded-tr-3xl` | 24 | `rounded-tr-4xl` | 32 | `rounded-tr-none` | 0 |
| `rounded-tr-full` | 9999 | `rounded-br-xs` | 2 | `rounded-br-sm` | 4 |
| `rounded-br-md` | 6 | `rounded-br-lg` | 8 | `rounded-br-xl` | 12 |
| `rounded-br-2xl` | 16 | `rounded-br-3xl` | 24 | `rounded-br-4xl` | 32 |
| `rounded-br-none` | 0 | `rounded-br-full` | 9999 | `rounded-bl-xs` | 2 |
| `rounded-bl-sm` | 4 | `rounded-bl-md` | 6 | `rounded-bl-lg` | 8 |
| `rounded-bl-xl` | 12 | `rounded-bl-2xl` | 16 | `rounded-bl-3xl` | 24 |
| `rounded-bl-4xl` | 32 | `rounded-bl-none` | 0 | `rounded-bl-full` | 9999 |

---

## 11. border-width (50 variables)

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `border-0` | 0 | `border` | 1 | `border-2` | 2 |
| `border-4` | 4 | `border-8` | 8 | `border-x-0` | 0 |
| `border-x` | 1 | `border-x-2` | 2 | `border-x-4` | 4 |
| `border-x-8` | 8 | `border-y-0` | 0 | `border-y` | 1 |
| `border-y-2` | 2 | `border-y-4` | 4 | `border-y-8` | 8 |
| `border-s-0` | 0 | `border-s` | 1 | `border-s-2` | 2 |
| `border-s-4` | 4 | `border-s-8` | 8 | `border-e-0` | 0 |
| `border-e` | 1 | `border-e-2` | 2 | `border-e-4` | 4 |
| `border-e-8` | 8 | `border-bs-0` | 0 | `border-bs` | 1 |
| `border-bs-2` | 2 | `border-bs-4` | 4 | `border-bs-8` | 8 |
| `border-be-0` | 0 | `border-be` | 1 | `border-be-2` | 2 |
| `border-be-4` | 4 | `border-be-8` | 8 | `border-t-0` | 0 |
| `border-t` | 1 | `border-t-2` | 2 | `border-t-4` | 4 |
| `border-t-8` | 8 | `border-r-0` | 0 | `border-r` | 1 |
| `border-r-2` | 2 | `border-r-4` | 4 | `border-r-8` | 8 |
| `border-l-0` | 0 | `border-l` | 1 | `border-l-2` | 2 |
| `border-l-4` | 4 | `border-l-8` | 8 | `—` |  |

---

## 12. font (45 variables)

| Variable | Value | Variable | Value |
|----------|-------|----------|-------|
| `family/sans` | `inter` | `family/mono` | `Giest Mono` |
| `size/xs` | `12` | `size/sm` | `14` |
| `size/base` | `16` | `size/lg` | `18` |
| `size/xl` | `20` | `size/2xl` | `24` |
| `size/3xl` | `30` | `size/4xl` | `36` |
| `size/5xl` | `48` | `size/6xl` | `60` |
| `size/7xl` | `72` | `size/8xl` | `96` |
| `size/9xl` | `128` | `style/italic` | `italic` |
| `style/not-italic` | `normal` | `weight/thin` | `100` |
| `weight/extralight` | `200` | `weight/light` | `300` |
| `weight/normal` | `400` | `weight/medium` | `500` |
| `weight/semibold` | `600` | `weight/bold` | `700` |
| `weight/extrabold` | `800` | `weight/black` | `900` |
| `leading/3` | `12` | `leading/4` | `16` |
| `leading/5` | `20` | `leading/6` | `24` |
| `leading/7` | `28` | `leading/8` | `32` |
| `leading/9` | `36` | `leading/10` | `40` |
| `leading/12` | `48` | `leading/15` | `60` |
| `leading/18` | `72` | `leading/24` | `96` |
| `leading/32` | `128` | `tracking/tighter` | `-0.800000011920929` |
| `tracking/tight` | `-0.4000000059604645` | `tracking/normal` | `0` |
| `tracking/wide` | `0.4000000059604645` | `tracking/wider` | `0.800000011920929` |
| `tracking/widest` | `1.600000023841858` | `—` | `` |

---

## 13. fontUse — Thai Fonts (2 variables)

| Variable | Value |
|----------|-------|
| `Sans Sarif` | `IBM Plex Sans Thai` |
| `Serif` | `SF Thonburi` |

---

## 14. height (24 variables)

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `h-0` | 0 | `h-px` | 1 | `h-0,5` | 2 |
| `h-1` | 4 | `h-2` | 8 | `h-2,5` | 10 |
| `h-3` | 12 | `h-3,5` | 14 | `h-4` | 16 |
| `h-5` | 20 | `h-6` | 24 | `h-7` | 28 |
| `h-8` | 32 | `h-9` | 36 | `h-10` | 40 |
| `h-11` | 48 | `h-14` | 56 | `h-16` | 64 |
| `h-18` | 72 | `h-20` | 80 | `h-24` | 96 |
| `h-48` | 192 | `h-72` | 288 | `h-96` | 384 |

---

## 15. gap (102 variables)

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `gap-0` | 0 | `gap-x-0` | 0 | `gap-y-0` | 0 |
| `gap-0,5` | 2 | `gap-x-0,5` | 2 | `gap-y-0,5` | 2 |
| `gap-1` | 4 | `gap-x-1` | 4 | `gap-y-1` | 4 |
| `gap-1,5` | 6 | `gap-x-1,5` | 6 | `gap-y-1,5` | 6 |
| `gap-2` | 8 | `gap-x-2` | 8 | `gap-y-2` | 8 |
| `gap-2,5` | 10 | `gap-x-2,5` | 10 | `gap-y-2,5` | 10 |
| `gap-3` | 12 | `gap-x-3` | 12 | `gap-y-3` | 12 |
| `gap-3,5` | 14 | `gap-x-3,5` | 14 | `gap-y-3,5` | 14 |
| `gap-4` | 16 | `gap-x-4` | 16 | `gap-y-4` | 16 |
| `gap-5` | 20 | `gap-x-5` | 20 | `gap-y-5` | 20 |
| `gap-6` | 24 | `gap-x-6` | 24 | `gap-y-6` | 24 |
| `gap-7` | 28 | `gap-x-7` | 28 | `gap-y-7` | 28 |
| `gap-8` | 32 | `gap-x-8` | 32 | `gap-y-8` | 32 |
| `gap-9` | 36 | `gap-x-9` | 36 | `gap-y-9` | 36 |
| `gap-10` | 40 | `gap-x-10` | 40 | `gap-y-10` | 40 |
| `gap-11` | 44 | `gap-x-11` | 44 | `gap-y-11` | 44 |
| `gap-12` | 48 | `gap-x-12` | 48 | `gap-y-12` | 48 |
| `gap-14` | 56 | `gap-x-14` | 56 | `gap-y-14` | 56 |
| `gap-16` | 64 | `gap-x-16` | 64 | `gap-y-16` | 64 |
| `gap-20` | 80 | `gap-x-20` | 80 | `gap-y-20` | 80 |
| `gap-24` | 96 | `gap-x-24` | 96 | `gap-y-24` | 96 |
| `gap-28` | 112 | `gap-x-28` | 112 | `gap-y-28` | 112 |
| `gap-32` | 128 | `gap-x-32` | 128 | `gap-y-32` | 128 |
| `gap-36` | 144 | `gap-x-36` | 144 | `gap-y-36` | 144 |
| `gap-40` | 160 | `gap-x-40` | 160 | `gap-y-40` | 160 |
| `gap-44` | 176 | `gap-x-44` | 176 | `gap-y-44` | 176 |
| `gap-48` | 192 | `gap-x-48` | 192 | `gap-y-48` | 192 |
| `gap-52` | 208 | `gap-x-52` | 208 | `gap-y-52` | 208 |
| `gap-56` | 224 | `gap-x-56` | 224 | `gap-y-56` | 224 |
| `gap-60` | 240 | `gap-x-60` | 240 | `gap-y-60` | 240 |
| `gap-64` | 256 | `gap-x-64` | 256 | `gap-y-64` | 256 |
| `gap-72` | 288 | `gap-x-72` | 288 | `gap-y-72` | 288 |
| `gap-80` | 320 | `gap-x-80` | 320 | `gap-y-80` | 320 |
| `gap-96` | 384 | `gap-x-96` | 384 | `gap-y-96` | 384 |

---

## 16. max-height (35 variables)

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `max-h-0` | 0 | `max-h-px` | 1 | `max-h-0,5` | 2 |
| `max-h-1` | 4 | `max-h-1,5` | 6 | `max-h-2` | 8 |
| `max-h-2,5` | 10 | `max-h-3` | 12 | `max-h-3,5` | 14 |
| `max-h-4` | 16 | `max-h-5` | 20 | `max-h-6` | 24 |
| `max-h-7` | 28 | `max-h-8` | 32 | `max-h-9` | 36 |
| `max-h-10` | 40 | `max-h-11` | 44 | `max-h-12` | 48 |
| `max-h-14` | 56 | `max-h-16` | 64 | `max-h-20` | 80 |
| `max-h-24` | 96 | `max-h-28` | 112 | `max-h-32` | 128 |
| `max-h-36` | 144 | `max-h-40` | 160 | `max-h-44` | 176 |
| `max-h-48` | 192 | `max-h-52` | 208 | `max-h-56` | 224 |
| `max-h-60` | 240 | `max-h-64` | 256 | `max-h-72` | 288 |
| `max-h-80` | 320 | `max-h-96` | 384 | `—` |  |

---

## 17. max-width (52 variables)

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `max-w-0` | 0 | `max-w-px` | 1 | `max-w-0,5` | 2 |
| `max-w-1` | 4 | `max-w-1,5` | 6 | `max-w-2` | 8 |
| `max-w-2,5` | 10 | `max-w-3` | 12 | `max-w-3,5` | 14 |
| `max-w-4` | 16 | `max-w-5` | 20 | `max-w-6` | 24 |
| `max-w-7` | 28 | `max-w-8` | 32 | `max-w-9` | 36 |
| `max-w-10` | 40 | `max-w-11` | 44 | `max-w-12` | 48 |
| `max-w-14` | 56 | `max-w-16` | 64 | `max-w-20` | 80 |
| `max-w-24` | 96 | `max-w-28` | 112 | `max-w-32` | 128 |
| `max-w-36` | 144 | `max-w-40` | 160 | `max-w-44` | 176 |
| `max-w-48` | 192 | `max-w-52` | 208 | `max-w-56` | 224 |
| `max-w-60` | 240 | `max-w-64` | 256 | `max-w-72` | 288 |
| `max-w-80` | 320 | `max-w-96` | 384 | `max-w-xs` | 320 |
| `max-w-sm` | 384 | `max-w-md` | 448 | `max-w-lg` | 512 |
| `max-w-xl` | 576 | `max-w-2xl` | 672 | `max-w-3xl` | 768 |
| `max-w-4xl` | 896 | `max-w-5xl` | 1024 | `max-w-6xl` | 1152 |
| `max-w-7xl` | 1280 | `max-w-none` | 0 | `max-w-screen-sm` | 640 |
| `max-w-screen-md` | 768 | `max-w-screen-lg` | 1024 | `max-w-screen-xl` | 1280 |
| `max-w-screen-xl 2` | 1536 | `—` |  | `—` |  |

---

## 18. margin (245 variables)

7 directions (`m` `mx` `my` `mr` `ml` `mt` `mb`) × 35 steps = 245

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `m-0` | 0 | `mx-0` | 0 | `my-0` | 0 |
| `mr-0` | 0 | `ml-0` | 0 | `mt-0` | 0 |
| `mb-0` | 0 | `m-px` | 1 | `mx-px` | 1 |
| `my-px` | 1 | `mr-px` | 1 | `ml-px` | 1 |
| `mt-px` | 1 | `mb-px` | 1 | `m-0,5` | 2 |
| `mx-0,5` | 2 | `my-0,5` | 2 | `mr-0,5` | 2 |
| `ml-0,5` | 2 | `mt-0,5` | 2 | `mb-0,5` | 2 |
| `m-1` | 4 | `mx-1` | 4 | `my-1` | 4 |
| `mr-1` | 4 | `ml-1` | 4 | `mt-1` | 4 |
| `mb-1` | 4 | `m-1,5` | 6 | `mx-1,5` | 6 |
| `my-1,5` | 6 | `mr-1,5` | 6 | `ml-1,5` | 6 |
| `mt-1,5` | 6 | `mb-1,5` | 6 | `m-2` | 8 |
| `mx-2` | 8 | `my-2` | 8 | `mr-2` | 8 |
| `ml-2` | 8 | `mt-2` | 8 | `mb-2` | 8 |
| `m-2,5` | 10 | `mx-2,5` | 10 | `my-2,5` | 10 |
| `mr-2,5` | 10 | `ml-2,5` | 10 | `mt-2,5` | 10 |
| `mb-2,5` | 10 | `m-3` | 12 | `mx-3` | 12 |
| `my-3` | 12 | `mr-3` | 12 | `ml-3` | 12 |
| `mt-3` | 12 | `mb-3` | 12 | `m-3,5` | 14 |
| `mx-3,5` | 14 | `my-3,5` | 14 | `mr-3,5` | 14 |
| `ml-3,5` | 14 | `mt-3,5` | 14 | `mb-3,5` | 14 |
| `m-4` | 16 | `mx-4` | 16 | `my-4` | 16 |
| `mr-4` | 16 | `ml-4` | 16 | `mt-4` | 16 |
| `mb-4` | 16 | `m-5` | 20 | `mx-5` | 20 |
| `my-5` | 20 | `mr-5` | 20 | `ml-5` | 20 |
| `mt-5` | 20 | `mb-5` | 20 | `m-6` | 24 |
| `mx-6` | 24 | `my-6` | 24 | `mr-6` | 24 |
| `ml-6` | 24 | `mt-6` | 24 | `mb-6` | 24 |
| `m-7` | 28 | `mx-7` | 28 | `my-7` | 28 |
| `mr-7` | 28 | `ml-7` | 28 | `mt-7` | 28 |
| `mb-7` | 28 | `m-8` | 32 | `mx-8` | 32 |
| `my-8` | 32 | `mr-8` | 32 | `ml-8` | 32 |
| `mt-8` | 32 | `mb-8` | 32 | `m-9` | 36 |
| `mx-9` | 36 | `my-9` | 36 | `mr-9` | 36 |
| `ml-9` | 36 | `mt-9` | 36 | `mb-9` | 36 |
| `m-10` | 40 | `mx-10` | 40 | `my-10` | 40 |
| `mr-10` | 40 | `ml-10` | 40 | `mt-10` | 40 |
| `mb-10` | 40 | `m-11` | 44 | `mx-11` | 44 |
| `my-11` | 44 | `mr-11` | 44 | `ml-11` | 44 |
| `mt-11` | 44 | `mb-11` | 44 | `m-12` | 48 |
| `mx-12` | 48 | `my-12` | 48 | `mr-12` | 48 |
| `ml-12` | 48 | `mt-12` | 48 | `mb-12` | 48 |
| `m-14` | 56 | `mx-14` | 56 | `my-14` | 56 |
| `mr-14` | 56 | `ml-14` | 56 | `mt-14` | 56 |
| `mb-14` | 56 | `m-16` | 64 | `mx-16` | 64 |
| `my-16` | 64 | `mr-16` | 64 | `ml-16` | 64 |
| `mt-16` | 64 | `mb-16` | 64 | `m-20` | 80 |
| `mx-20` | 80 | `my-20` | 80 | `mr-20` | 80 |
| `ml-20` | 80 | `mt-20` | 80 | `mb-20` | 80 |
| `m-24` | 96 | `mx-24` | 96 | `my-24` | 96 |
| `mr-24` | 96 | `ml-24` | 96 | `mt-24` | 96 |
| `mb-24` | 96 | `m-28` | 112 | `mx-28` | 112 |
| `my-28` | 112 | `mr-28` | 112 | `ml-28` | 112 |
| `mt-28` | 112 | `mb-28` | 112 | `m-32` | 128 |
| `mx-32` | 128 | `my-32` | 128 | `mr-32` | 128 |
| `ml-32` | 128 | `mt-32` | 128 | `mb-32` | 128 |
| `m-36` | 144 | `mx-36` | 144 | `my-36` | 144 |
| `mr-36` | 144 | `ml-36` | 144 | `mt-36` | 144 |
| `mb-36` | 144 | `m-40` | 160 | `mx-40` | 160 |
| `my-40` | 160 | `mr-40` | 160 | `ml-40` | 160 |
| `mt-40` | 160 | `mb-40` | 160 | `m-44` | 176 |
| `mx-44` | 176 | `my-44` | 176 | `mr-44` | 176 |
| `ml-44` | 176 | `mt-44` | 176 | `mb-44` | 176 |
| `m-48` | 192 | `mx-48` | 192 | `my-48` | 192 |
| `mr-48` | 192 | `ml-48` | 192 | `mt-48` | 192 |
| `mb-48` | 192 | `m-52` | 208 | `mx-52` | 208 |
| `my-52` | 208 | `mr-52` | 208 | `ml-52` | 208 |
| `mt-52` | 208 | `mb-52` | 208 | `m-56` | 224 |
| `mx-56` | 224 | `my-56` | 224 | `mr-56` | 224 |
| `ml-56` | 224 | `mt-56` | 224 | `mb-56` | 224 |
| `m-60` | 240 | `mx-60` | 240 | `my-60` | 240 |
| `mr-60` | 240 | `ml-60` | 240 | `mt-60` | 240 |
| `mb-60` | 240 | `m-64` | 256 | `mx-64` | 256 |
| `my-64` | 256 | `mr-64` | 256 | `ml-64` | 256 |
| `mt-64` | 256 | `mb-64` | 256 | `m-72` | 288 |
| `mx-72` | 288 | `my-72` | 288 | `mr-72` | 288 |
| `ml-72` | 288 | `mt-72` | 288 | `mb-72` | 288 |
| `m-80` | 320 | `mx-80` | 320 | `my-80` | 320 |
| `mr-80` | 320 | `ml-80` | 320 | `mt-80` | 320 |
| `mb-80` | 320 | `m-96` | 384 | `mx-96` | 384 |
| `my-96` | 384 | `mr-96` | 384 | `ml-96` | 384 |
| `mt-96` | 384 | `mb-96` | 384 | `—` |  |

---

## 19. padding (245 variables)

7 directions (`p` `px` `py` `pr` `pl` `pt` `pb`) × 35 steps = 245

| Variable | px | Variable | px | Variable | px |
|----------|----|----------|----|----------|----|  
| `p-0` | 0 | `px-0` | 0 | `py-0` | 0 |
| `pr-0` | 0 | `pl-0` | 0 | `pt-0` | 0 |
| `pb-0` | 0 | `p-px` | 1 | `px-px` | 1 |
| `py-px` | 1 | `pr-px` | 1 | `pl-px` | 1 |
| `pt-px` | 1 | `pb-px` | 1 | `p-0,5` | 2 |
| `px-0,5` | 2 | `py-0,5` | 2 | `pr-0,5` | 2 |
| `pl-0,5` | 2 | `pt-0,5` | 2 | `pb-0,5` | 2 |
| `p-1` | 4 | `px-1` | 4 | `py-1` | 4 |
| `pr-1` | 4 | `pl-1` | 4 | `pt-1` | 4 |
| `pb-1` | 4 | `p-1,5` | 6 | `px-1,5` | 6 |
| `py-1,5` | 6 | `pr-1,5` | 6 | `pl-1,5` | 6 |
| `pt-1,5` | 6 | `pb-1,5` | 6 | `p-2` | 8 |
| `px-2` | 8 | `py-2` | 8 | `pr-2` | 8 |
| `pl-2` | 8 | `pt-2` | 8 | `pb-2` | 8 |
| `p-2,5` | 10 | `px-2,5` | 10 | `py-2,5` | 10 |
| `pr-2,5` | 10 | `pl-2,5` | 10 | `pt-2,5` | 10 |
| `pb-2,5` | 10 | `p-3` | 12 | `px-3` | 12 |
| `py-3` | 12 | `pr-3` | 12 | `pl-3` | 12 |
| `pt-3` | 12 | `pb-3` | 12 | `p-3,5` | 14 |
| `px-3,5` | 14 | `py-3,5` | 14 | `pr-3,5` | 14 |
| `pl-3,5` | 14 | `pt-3,5` | 14 | `pb-3,5` | 14 |
| `p-4` | 16 | `px-4` | 16 | `py-4` | 16 |
| `pr-4` | 16 | `pl-4` | 16 | `pt-4` | 16 |
| `pb-4` | 16 | `p-5` | 20 | `px-5` | 20 |
| `py-5` | 20 | `pr-5` | 20 | `pl-5` | 20 |
| `pt-5` | 20 | `pb-5` | 20 | `p-6` | 24 |
| `px-6` | 24 | `py-6` | 24 | `pr-6` | 24 |
| `pl-6` | 24 | `pt-6` | 24 | `pb-6` | 24 |
| `p-7` | 28 | `px-7` | 28 | `py-7` | 28 |
| `pr-7` | 28 | `pl-7` | 28 | `pt-7` | 28 |
| `pb-7` | 28 | `p-8` | 32 | `px-8` | 32 |
| `py-8` | 32 | `pr-8` | 32 | `pl-8` | 32 |
| `pt-8` | 32 | `pb-8` | 32 | `p-9` | 36 |
| `px-9` | 36 | `py-9` | 36 | `pr-9` | 36 |
| `pl-9` | 36 | `pt-9` | 36 | `pb-9` | 36 |
| `p-10` | 40 | `px-10` | 40 | `py-10` | 40 |
| `pr-10` | 40 | `pl-10` | 40 | `pt-10` | 40 |
| `pb-10` | 40 | `p-11` | 44 | `px-11` | 44 |
| `py-11` | 44 | `pr-11` | 44 | `pl-11` | 44 |
| `pt-11` | 44 | `pb-11` | 44 | `p-12` | 48 |
| `px-12` | 48 | `py-12` | 48 | `pr-12` | 48 |
| `pl-12` | 48 | `pt-12` | 48 | `pb-12` | 48 |
| `p-14` | 56 | `px-14` | 56 | `py-14` | 56 |
| `pr-14` | 56 | `pl-14` | 56 | `pt-14` | 56 |
| `pb-14` | 56 | `p-16` | 64 | `px-16` | 64 |
| `py-16` | 64 | `pr-16` | 64 | `pl-16` | 64 |
| `pt-16` | 64 | `pb-16` | 64 | `p-20` | 80 |
| `px-20` | 80 | `py-20` | 80 | `pr-20` | 80 |
| `pl-20` | 80 | `pt-20` | 80 | `pb-20` | 80 |
| `p-24` | 96 | `px-24` | 96 | `py-24` | 96 |
| `pr-24` | 96 | `pl-24` | 96 | `pt-24` | 96 |
| `pb-24` | 96 | `p-28` | 112 | `px-28` | 112 |
| `py-28` | 112 | `pr-28` | 112 | `pl-28` | 112 |
| `pt-28` | 112 | `pb-28` | 112 | `p-32` | 128 |
| `px-32` | 128 | `py-32` | 128 | `pr-32` | 128 |
| `pl-32` | 128 | `pt-32` | 128 | `pb-32` | 128 |
| `p-36` | 144 | `px-36` | 144 | `py-36` | 144 |
| `pr-36` | 144 | `pl-36` | 144 | `pt-36` | 144 |
| `pb-36` | 144 | `p-40` | 160 | `px-40` | 160 |
| `py-40` | 160 | `pr-40` | 160 | `pl-40` | 160 |
| `pt-40` | 160 | `pb-40` | 160 | `p-44` | 176 |
| `px-44` | 176 | `py-44` | 176 | `pr-44` | 176 |
| `pl-44` | 176 | `pt-44` | 176 | `pb-44` | 176 |
| `p-48` | 192 | `px-48` | 192 | `py-48` | 192 |
| `pr-48` | 192 | `pl-48` | 192 | `pt-48` | 192 |
| `pb-48` | 192 | `p-52` | 208 | `px-52` | 208 |
| `py-52` | 208 | `pr-52` | 208 | `pl-52` | 208 |
| `pt-52` | 208 | `pb-52` | 208 | `p-56` | 224 |
| `px-56` | 224 | `py-56` | 224 | `pr-56` | 224 |
| `pl-56` | 224 | `pt-56` | 224 | `pb-56` | 224 |
| `p-60` | 240 | `px-60` | 240 | `py-60` | 240 |
| `pr-60` | 240 | `pl-60` | 240 | `pt-60` | 240 |
| `pb-60` | 240 | `p-64` | 256 | `px-64` | 256 |
| `py-64` | 256 | `pr-64` | 256 | `pl-64` | 256 |
| `pt-64` | 256 | `pb-64` | 256 | `p-72` | 288 |
| `px-72` | 288 | `py-72` | 288 | `pr-72` | 288 |
| `pl-72` | 288 | `pt-72` | 288 | `pb-72` | 288 |
| `p-80` | 320 | `px-80` | 320 | `py-80` | 320 |
| `pr-80` | 320 | `pl-80` | 320 | `pt-80` | 320 |
| `pb-80` | 320 | `p-96` | 384 | `px-96` | 384 |
| `py-96` | 384 | `pr-96` | 384 | `pl-96` | 384 |
| `pt-96` | 384 | `pb-96` | 384 | `—` |  |

---

## 20. space (68 variables)

2 variants (`space-x` `space-y`) × 34 steps = 68

| Variable | px | Variable | px |
|----------|----|----------|----|  
| `space-x-0` | 0 | `space-y-0` | 0 |
| `space-x-0,5` | 2 | `space-y-0,5` | 2 |
| `space-x-1` | 4 | `space-y-1` | 4 |
| `space-x-1,5` | 6 | `space-y-1,5` | 6 |
| `space-x-2` | 8 | `space-y-2` | 8 |
| `space-x-2,5` | 10 | `space-y-2,5` | 10 |
| `space-x-3` | 12 | `space-y-3` | 12 |
| `space-x-3,5` | 14 | `space-y-3,5` | 14 |
| `space-x-4` | 16 | `space-y-4` | 16 |
| `space-x-5` | 20 | `space-y-5` | 20 |
| `space-x-6` | 24 | `space-y-6` | 24 |
| `space-x-7` | 28 | `space-y-7` | 28 |
| `space-x-8` | 32 | `space-y-8` | 32 |
| `space-x-9` | 36 | `space-y-9` | 36 |
| `space-x-10` | 40 | `space-y-10` | 40 |
| `space-x-11` | 44 | `space-y-11` | 44 |
| `space-x-12` | 48 | `space-y-12` | 48 |
| `space-x-14` | 56 | `space-y-14` | 56 |
| `space-x-16` | 64 | `space-y-16` | 64 |
| `space-x-20` | 80 | `space-y-20` | 80 |
| `space-x-24` | 96 | `space-y-24` | 96 |
| `space-x-28` | 112 | `space-y-28` | 112 |
| `space-x-32` | 128 | `space-y-32` | 128 |
| `space-x-36` | 144 | `space-y-36` | 144 |
| `space-x-40` | 160 | `space-y-40` | 160 |
| `space-x-44` | 176 | `space-y-44` | 176 |
| `space-x-48` | 192 | `space-y-48` | 192 |
| `space-x-52` | 208 | `space-y-52` | 208 |
| `space-x-56` | 224 | `space-y-56` | 224 |
| `space-x-60` | 240 | `space-y-60` | 240 |
| `space-x-64` | 256 | `space-y-64` | 256 |
| `space-x-72` | 288 | `space-y-72` | 288 |
| `space-x-80` | 320 | `space-y-80` | 320 |
| `space-x-96` | 384 | `space-y-96` | 384 |

---

## 21. stroke-width (11 variables)

| Variable | Value | Variable | Value |
|----------|-------|----------|-------|
| `stroke-0,5` | 0.5 | `stroke-0,75` | 0.75 |
| `stroke-1` | 1 | `stroke-1,25` | 1.25 |
| `stroke-1,5` | 1.5 | `stroke-1,75` | 1.75 |
| `stroke-2` | 2 | `stroke-2,25` | 2.25 |
| `stroke-2,5` | 2.5 | `stroke-2,75` | 2.75 |
| `stroke-2,75 2` | 3 | `—` |  |

---

## 22. opacity (21 variables)

| Variable | % | Variable | % | Variable | % |
|----------|---|----------|---|----------|-|
| `opacity-0` | 0 | `opacity-5` | 5 | `opacity-10` | 10 |
| `opacity-15` | 15 | `opacity-20` | 20 | `opacity-25` | 25 |
| `opacity-30` | 30 | `opacity-35` | 35 | `opacity-40` | 40 |
| `opacity-45` | 45 | `opacity-50` | 50 | `opacity-55` | 55 |
| `opacity-60` | 60 | `opacity-65` | 65 | `opacity-70` | 70 |
| `opacity-75` | 75 | `opacity-80` | 80 | `opacity-85` | 85 |
| `opacity-90` | 90 | `opacity-95` | 95 | `opacity-100` | 100 |

Usage: `opacity-50` · `bg-primary/50` · `text-foreground/75`

---

## 23. rdx/colors — Radix UI (396 variables)

**gray**: `gray/1`:`#fcfcfc` · `gray/2`:`#f9f9f9` · `gray/3`:`#f0f0f0` · `gray/4`:`#e8e8e8` · `gray/5`:`#e0e0e0` · `gray/6`:`#d9d9d9` · `gray/7`:`#cecece` · `gray/8`:`#bbbbbb` · `gray/9`:`#8d8d8d` · `gray/10`:`#838383` · `gray/11`:`#646464` · `gray/12`:`#202020`

**mauve**: `mauve/1`:`#fdfcfd` · `mauve/2`:`#faf9fb` · `mauve/3`:`#f2eff3` · `mauve/4`:`#eae7ec` · `mauve/5`:`#e3dfe6` · `mauve/6`:`#dbd8e0` · `mauve/7`:`#d0cdd7` · `mauve/8`:`#bcbac7` · `mauve/9`:`#8e8c99` · `mauve/10`:`#84828e` · `mauve/11`:`#65636d` · `mauve/12`:`#211f26`

**slate**: `slate/1`:`#fcfcfd` · `slate/2`:`#f9f9fb` · `slate/3`:`#f0f0f3` · `slate/4`:`#e8e8ec` · `slate/5`:`#e0e1e6` · `slate/6`:`#d9d9e0` · `slate/7`:`#cdced6` · `slate/8`:`#b9bbc6` · `slate/9`:`#8b8d98` · `slate/10`:`#80838d` · `slate/11`:`#60646c` · `slate/12`:`#1c2024`

**sage**: `sage/1`:`#fbfdfc` · `sage/2`:`#f7f9f8` · `sage/3`:`#eeeeff` · `sage/4`:`#e6e9e8` · `sage/5`:`#dfe2e0` · `sage/6`:`#d7dad9` · `sage/7`:`#cbcfcd` · `sage/8`:`#b8bcba` · `sage/9`:`#868e8b` · `sage/10`:`#7c8481` · `sage/11`:`#5f6563` · `sage/12`:`#1a211e`

**olive**: `olive/1`:`#fcfdfc` · `olive/2`:`#f8faf8` · `olive/3`:`#eff1ef` · `olive/4`:`#e7e9e7` · `olive/5`:`#dfe2df` · `olive/6`:`#d7dad7` · `olive/7`:`#cccfcc` · `olive/8`:`#b9bcb8` · `olive/9`:`#898e87` · `olive/10`:`#7f847d` · `olive/11`:`#60655f` · `olive/12`:`#1d211c`

**sand**: `sand/1`:`#fdfdfc` · `sand/2`:`#f9f9f8` · `sand/3`:`#f1f0ef` · `sand/4`:`#e9e8e6` · `sand/5`:`#e2e1de` · `sand/6`:`#dad9d6` · `sand/7`:`#cfceca` · `sand/8`:`#bcbbb5` · `sand/9`:`#8d8d86` · `sand/10`:`#82827c` · `sand/11`:`#63635e` · `sand/12`:`#21201c`

**tomato**: `tomato/1`:`#fffcfc` · `tomato/2`:`#fff8f7` · `tomato/3`:`#feebe7` · `tomato/4`:`#ffdcd3` · `tomato/5`:`#ffcdc2` · `tomato/6`:`#fdbdaf` · `tomato/7`:`#f5a898` · `tomato/8`:`#ec8e7b` · `tomato/9`:`#e54d2e` · `tomato/10`:`#dd4425` · `tomato/11`:`#d13415` · `tomato/12`:`#5c271f`

**red**: `red/1`:`#fffcfc` · `red/2`:`#fff7f7` · `red/3`:`#feebec` · `red/4`:`#ffdbdc` · `red/5`:`#ffcdce` · `red/6`:`#fdbdbe` · `red/7`:`#f4a9aa` · `red/8`:`#eb8e90` · `red/9`:`#e5484d` · `red/10`:`#dc3e42` · `red/11`:`#ce2c31` · `red/12`:`#641723`

**ruby**: `ruby/1`:`#fffcfd` · `ruby/2`:`#fff7f8` · `ruby/3`:`#feeaed` · `ruby/4`:`#ffdce1` · `ruby/5`:`#ffced6` · `ruby/6`:`#f8bfc8` · `ruby/7`:`#efacb8` · `ruby/8`:`#e592a3` · `ruby/9`:`#e54666` · `ruby/10`:`#dc3b5d` · `ruby/11`:`#ca244d` · `ruby/12`:`#64172b`

**crimson**: `crimson/1`:`#fffcfd` · `crimson/2`:`#fef7f9` · `crimson/3`:`#ffe9f0` · `crimson/4`:`#fedce7` · `crimson/5`:`#facedd` · `crimson/6`:`#f3bed1` · `crimson/7`:`#eaacc3` · `crimson/8`:`#e093b2` · `crimson/9`:`#e93d82` · `crimson/10`:`#df3478` · `crimson/11`:`#cb1d63` · `crimson/12`:`#621639`

**pink**: `pink/1`:`#fffcfe` · `pink/2`:`#fef7fb` · `pink/3`:`#fee9f5` · `pink/4`:`#fbdcef` · `pink/5`:`#f6cee7` · `pink/6`:`#efbfdd` · `pink/7`:`#e7acd0` · `pink/8`:`#dd93c2` · `pink/9`:`#d6409f` · `pink/10`:`#cf3897` · `pink/11`:`#c2298a` · `pink/12`:`#651249`

**plum**: `plum/1`:`#fefcff` · `plum/2`:`#fdf7fd` · `plum/3`:`#fbebfb` · `plum/4`:`#f7def8` · `plum/5`:`#f2d1f3` · `plum/6`:`#e9c2ec` · `plum/7`:`#deade3` · `plum/8`:`#cf91d8` · `plum/9`:`#ab4aba` · `plum/10`:`#a144af` · `plum/11`:`#953ea3` · `plum/12`:`#53195d`

**purple**: `purple/1`:`#fefcfe` · `purple/2`:`#fbf7fe` · `purple/3`:`#f7edfe` · `purple/4`:`#f2e2fc` · `purple/5`:`#ead5f9` · `purple/6`:`#e0c4f4` · `purple/7`:`#d1afec` · `purple/8`:`#be93e4` · `purple/9`:`#8e4ec6` · `purple/10`:`#8347b9` · `purple/11`:`#8145b5` · `purple/12`:`#402060`

**iris**: `iris/1`:`#fdfdff` · `iris/2`:`#f8f8ff` · `iris/3`:`#f0f1fe` · `iris/4`:`#e6e7ff` · `iris/5`:`#dadcff` · `iris/6`:`#cbcdff` · `iris/7`:`#b8baf8` · `iris/8`:`#9b9ef0` · `iris/9`:`#5b5bd6` · `iris/10`:`#5151cd` · `iris/11`:`#5753c6` · `iris/12`:`#272962`

**indigo**: `indigo/1`:`#fdfdfe` · `indigo/2`:`#f7f9ff` · `indigo/3`:`#edf2fe` · `indigo/4`:`#e1e9ff` · `indigo/5`:`#d2deff` · `indigo/6`:`#c1d0ff` · `indigo/7`:`#abbdf9` · `indigo/8`:`#8da4ef` · `indigo/9`:`#3e63dd` · `indigo/10`:`#3358d4` · `indigo/11`:`#3a5bc7` · `indigo/12`:`#1f2d5c`

**blue**: `blue/1`:`#fbfdff` · `blue/2`:`#f4faff` · `blue/3`:`#e6f4fe` · `blue/4`:`#d5efff` · `blue/5`:`#c2e5ff` · `blue/6`:`#acd8fc` · `blue/7`:`#8ec8f6` · `blue/8`:`#5eb1ef` · `blue/9`:`#0090ff` · `blue/10`:`#0588f0` · `blue/11`:`#0d74ce` · `blue/12`:`#113264`

**cyan**: `cyan/1`:`#fafdfe` · `cyan/2`:`#f2fafb` · `cyan/3`:`#def7f9` · `cyan/4`:`#caf1f6` · `cyan/5`:`#b5e9f0` · `cyan/6`:`#9ddde7` · `cyan/7`:`#7dcedc` · `cyan/8`:`#3db9cf` · `cyan/9`:`#00a2c7` · `cyan/10`:`#0797b9` · `cyan/11`:`#107d98` · `cyan/12`:`#0d3c48`

**teal**: `teal/1`:`#fafefd` · `teal/2`:`#f3fbf9` · `teal/3`:`#e0f8f3` · `teal/4`:`#ccf3ea` · `teal/5`:`#b8eae0` · `teal/6`:`#a1ded2` · `teal/7`:`#83cdc1` · `teal/8`:`#53b9ab` · `teal/9`:`#12a594` · `teal/10`:`#0d9b8a` · `teal/11`:`#008573` · `teal/12`:`#0d3d38`

**jade**: `jade/1`:`#fbfefd` · `jade/2`:`#f4fbf7` · `jade/3`:`#e6f7ed` · `jade/4`:`#d6f1e3` · `jade/5`:`#c3e9d7` · `jade/6`:`#acdec8` · `jade/7`:`#8bceb6` · `jade/8`:`#56ba9f` · `jade/9`:`#29a383` · `jade/10`:`#26997b` · `jade/11`:`#208368` · `jade/12`:`#1d3b31`

**green**: `green/1`:`#fbfefc` · `green/2`:`#f4fbf6` · `green/3`:`#e6f6eb` · `green/4`:`#d6f1df` · `green/5`:`#c4e8d1` · `green/6`:`#adddc0` · `green/7`:`#8eceaa` · `green/8`:`#5bb98b` · `green/9`:`#30a46c` · `green/10`:`#2b9a66` · `green/11`:`#218358` · `green/12`:`#193b2d`

**grass**: `grass/1`:`#fbfefb` · `grass/2`:`#f5fbf5` · `grass/3`:`#e9f6e9` · `grass/4`:`#daf1db` · `grass/5`:`#c9e8ca` · `grass/6`:`#b2ddb5` · `grass/7`:`#94ce9a` · `grass/8`:`#65ba74` · `grass/9`:`#46a758` · `grass/10`:`#3e9b4f` · `grass/11`:`#2a7e3b` · `grass/12`:`#203c25`

**bronze**: `bronze/1`:`#fdfcfc` · `bronze/2`:`#fdf7f5` · `bronze/3`:`#f6edea` · `bronze/4`:`#efe4df` · `bronze/5`:`#e7d9d3` · `bronze/6`:`#dfcdc5` · `bronze/7`:`#d3bcb3` · `bronze/8`:`#c2a499` · `bronze/9`:`#a18072` · `bronze/10`:`#957468` · `bronze/11`:`#7d5e54` · `bronze/12`:`#43302b`

**violet**: `violet/1`:`#fdfcfe` · `violet/2`:`#faf8ff` · `violet/3`:`#f4f0fe` · `violet/4`:`#ebe4ff` · `violet/5`:`#e1d9ff` · `violet/6`:`#d4cafe` · `violet/7`:`#c2b5f5` · `violet/8`:`#aa99ec` · `violet/9`:`#6e56cf` · `violet/10`:`#654dc4` · `violet/11`:`#6550b9` · `violet/12`:`#2f265f`

**gold**: `gold/1`:`#fdfdfc` · `gold/2`:`#faf9f2` · `gold/3`:`#f2f0e7` · `gold/4`:`#eae6db` · `gold/5`:`#e1dccf` · `gold/6`:`#d8d0bf` · `gold/7`:`#cbc0aa` · `gold/8`:`#b9a88d` · `gold/9`:`#978365` · `gold/10`:`#8c7a5e` · `gold/11`:`#71624b` · `gold/12`:`#3b352b`

**brown**: `brown/1`:`#fefdfc` · `brown/2`:`#fcf9f6` · `brown/3`:`#f6eee7` · `brown/4`:`#f0e4d9` · `brown/5`:`#ebdaca` · `brown/6`:`#e4cdb7` · `brown/7`:`#dcbc9f` · `brown/8`:`#cea37e` · `brown/9`:`#ad7f58` · `brown/10`:`#a07553` · `brown/11`:`#815e46` · `brown/12`:`#3e332e`

**orange**: `orange/1`:`#fefcfb` · `orange/2`:`#fff7ed` · `orange/3`:`#ffefd6` · `orange/4`:`#ffdfb5` · `orange/5`:`#ffd19a` · `orange/6`:`#ffc182` · `orange/7`:`#f5ae73` · `orange/8`:`#ec9455` · `orange/9`:`#f76b15` · `orange/10`:`#ef5f00` · `orange/11`:`#cc4e00` · `orange/12`:`#582d1d`

**amber**: `amber/1`:`#fefdfb` · `amber/2`:`#fefbe9` · `amber/3`:`#fff7c2` · `amber/4`:`#ffee9c` · `amber/5`:`#fbe577` · `amber/6`:`#f3d673` · `amber/7`:`#e9c162` · `amber/8`:`#e2a336` · `amber/9`:`#ffc53d` · `amber/10`:`#ffba18` · `amber/11`:`#ab6400` · `amber/12`:`#4f3422`

**yellow**: `yellow/1`:`#fdfdf9` · `yellow/2`:`#fefce9` · `yellow/3`:`#fffab8` · `yellow/4`:`#fff394` · `yellow/5`:`#ffe770` · `yellow/6`:`#f3d768` · `yellow/7`:`#e4c767` · `yellow/8`:`#d5ae39` · `yellow/9`:`#ffe629` · `yellow/10`:`#ffdc00` · `yellow/11`:`#9e6c00` · `yellow/12`:`#473b1f`

**lime**: `lime/1`:`#fcfdfa` · `lime/2`:`#f8faf3` · `lime/3`:`#eef6d6` · `lime/4`:`#e2f0bd` · `lime/5`:`#d3e7a6` · `lime/6`:`#c2da91` · `lime/7`:`#abc978` · `lime/8`:`#8db654` · `lime/9`:`#bdee63` · `lime/10`:`#b0e64c` · `lime/11`:`#5c7c2f` · `lime/12`:`#37401c`

**mint**: `mint/1`:`#f9fefd` · `mint/2`:`#f2fbf9` · `mint/3`:`#ddf9f2` · `mint/4`:`#c8f4e9` · `mint/5`:`#b3ecde` · `mint/6`:`#9ce0d0` · `mint/7`:`#7ecfbd` · `mint/8`:`#4cbba5` · `mint/9`:`#86ead4` · `mint/10`:`#7de0cb` · `mint/11`:`#027864` · `mint/12`:`#16433c`

**sky**: `sky/1`:`#f9feff` · `sky/2`:`#f1fafd` · `sky/3`:`#e1f6fd` · `sky/4`:`#d1f0fa` · `sky/5`:`#bee7f5` · `sky/6`:`#a9daed` · `sky/7`:`#8dcae3` · `sky/8`:`#60b3d7` · `sky/9`:`#7ce2fe` · `sky/10`:`#74daf8` · `sky/11`:`#00749e` · `sky/12`:`#1d3e56`

**black**: `black/1`:`rgba(0,0,0,0.05)` · `black/2`:`rgba(0,0,0,0.10)` · `black/3`:`rgba(0,0,0,0.15)` · `black/4`:`rgba(0,0,0,0.20)` · `black/5`:`rgba(0,0,0,0.30)` · `black/6`:`rgba(0,0,0,0.40)` · `black/7`:`rgba(0,0,0,0.50)` · `black/8`:`rgba(0,0,0,0.60)` · `black/9`:`rgba(0,0,0,0.70)` · `black/10`:`rgba(0,0,0,0.80)` · `black/11`:`rgba(0,0,0,0.90)` · `black/12`:`rgba(0,0,0,0.95)`

**white**: `white/1`:`rgba(255,255,255,0.05)` · `white/2`:`rgba(255,255,255,0.10)` · `white/3`:`rgba(255,255,255,0.15)` · `white/4`:`rgba(255,255,255,0.20)` · `white/5`:`rgba(255,255,255,0.30)` · `white/6`:`rgba(255,255,255,0.40)` · `white/7`:`rgba(255,255,255,0.50)` · `white/8`:`rgba(255,255,255,0.60)` · `white/9`:`rgba(255,255,255,0.70)` · `white/10`:`rgba(255,255,255,0.80)` · `white/11`:`rgba(255,255,255,0.90)` · `white/12`:`rgba(255,255,255,0.95)`

---
