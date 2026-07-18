# Inclusive Patterns — code recipes

Concrete implementations. Loaded on demand by the `inclusive-design-patterns` skill.

---

## 1. Respect system preferences

### Reduced motion
```css
/* default: motion on */
.card { transition: transform 200ms ease; }
.card:hover { transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
For JS animations, gate them:
```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduce) animate()
```

### Color scheme & reduced data
```css
@media (prefers-color-scheme: dark) { :root { /* dark semantic tokens */ } }
@media (prefers-reduced-data: reduce) { .hero-video { display: none; } }
```

### Text scaling — size in rem, never px
```css
/* ✅ scales with the user's browser/OS setting */
body { font-size: 1rem; }
/* ❌ ignores the user's preference */
body { font-size: 16px; }
```

---

## 2. Cognitive load — forgiving form

```html
<form novalidate>
  <label for="email">Email</label>
  <input id="email" type="email" name="email"
         aria-describedby="email-err" autocomplete="email" />
  <!-- error appears inline, tied to the field, announced politely -->
  <p id="email-err" role="alert" hidden>Please enter a valid email like name@example.com.</p>

  <button type="submit">Continue</button>
</form>
```
Rules: validate on submit/blur (not every keystroke), keep entered data on error, one
primary action (`Continue`), no time limits.

---

## 3. Internationalization

### Externalize strings + placeholders + plurals
```js
// ❌ hardcoded + concatenated (breaks translation & word order)
const msg = 'You have ' + n + ' new messages'

// ✅ catalog with placeholder + plural rule
t('inbox.count', { count: n })
// en: { one: 'You have 1 new message', other: 'You have {count} new messages' }
```

### Logical properties for RTL
```css
/* ✅ flips automatically under dir="rtl" */
.item { margin-inline-start: 1rem; padding-inline: 1rem; text-align: start; }
/* ❌ hardcoded physical sides */
.item { margin-left: 1rem; text-align: left; }
```
```html
<html lang="ar" dir="rtl"> … </html>
```

### Room for text expansion
```html
<!-- ❌ fixed width clips longer languages (German ~ +35%) -->
<button class="w-24">Save</button>
<!-- ✅ intrinsic width + wrapping tolerance -->
<button class="px-md min-w-[6rem]">Save</button>
```

### Locale-aware formatting
```js
new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
```

---

## 4. Input diversity

```css
/* touch targets ≥ 44×44 with spacing */
.icon-btn { min-width: 44px; min-height: 44px; }
```
```html
<!-- no hover-only affordance: the action is always reachable -->
<div class="group">
  <button class="opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
    Edit
  </button>
</div>
```
- Focus-within (not just hover) reveals actions, so keyboard users get them too.
- Pair color with an icon/label; pair any audio cue with a visible one.

---

## 5. Robust to context

```html
<!-- skeleton while loading; content degrades gracefully on slow networks -->
<div aria-busy="true">
  <div class="skeleton h-4 w-3/4"></div>
</div>
```
- Server-render meaningful content so a failed/slow JS load still shows something.
- Ensure real contrast for sunlight legibility (verify in `web-accessibility-a11y`).

---

## Quick audit checklist

- [ ] `prefers-reduced-motion` honored (CSS + JS)
- [ ] Dark mode is a real theme; `prefers-reduced-data` respected
- [ ] Font sizes in `rem`
- [ ] One clear primary action per screen; forms forgiving
- [ ] Strings externalized; plurals & placeholders used
- [ ] Logical CSS properties; `dir`/`lang` set; expansion room
- [ ] Targets ≥ 44px; keyboard + pointer parity; no hover-only; no sense-dependency
- [ ] Meaningful content without JS; readable in bright light
