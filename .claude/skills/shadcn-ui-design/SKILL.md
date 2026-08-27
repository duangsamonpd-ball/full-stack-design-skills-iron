---
name: shadcn-ui-design
description: Build UI on Next.js with shadcn/ui and Tailwind CSS v4 — component CLI, semantic color/spacing/radius tokens, and dark mode wired to a 1,812-variable Figma registry. Scoped to the Next.js + shadcn/ui stack only; for React/Astro/Vue styling use css-styling-pixel-perfect, for token-layer architecture use design-tokens-system, and for WCAG 2.2 and universal design use web-accessibility-a11y, inclusive-design-patterns and responsive-universal-design. Use when the user says "shadcn", "shadcn/ui", "add a shadcn component", "next.js ui", or names a shadcn primitive to install or restyle.
---

# shadcn/ui + Tailwind CSS v4 + Next.js

> **Scope:** this skill is the *implementation catalogue* for one stack — Next.js +
> shadcn/ui. It is not the authority on accessibility or universal design: the
> baseline it teaches (labels, `aria-*`, focus) stops at the component level.
> Anything above that — WCAG 2.2 composition rules (focus-not-obscured, target
> size, dragging alternatives), `forced-colors`, `prefers-reduced-motion`, RTL,
> cognitive load, text scaling — belongs to **web-accessibility-a11y**,
> **inclusive-design-patterns** and **responsive-universal-design**. Defer to them
> and verify against them; do not re-derive those rules here.
>
> **Reference files in this skill:**
> - `references/design-tokens.md` — color tokens, typography, spacing, radius (quick ref)
> - `references/full-registry.md` — all 1,812 Figma variables (full lookup)
> - `assets/globals.css` — ready-to-copy CSS variables for new project
> - `assets/variables-export.json` — Figma source (1,812 variables, 17 collections)
> - `scripts/verify-tokens.py` — run to verify token coverage

---

## ── Rules & Setup ─────────────────────────────────────────────

## 1. Core Rules — Always Apply

1. Read `references/design-tokens.md` §1–§2 before writing any color, spacing, or radius class
2. Never use hardcoded colors — `bg-blue-500` `text-gray-700` → always use semantic tokens
3. Never build a component from scratch when shadcn/ui provides one — install via CLI
4. Every component must support dark mode (CSS variables handle this automatically)
5. Use `gap-*` instead of `space-*` (v4 changed `space-*` selector behavior)
6. Use `size-4` instead of `w-4 h-4` for square elements
7. Check **Tailwind v4 renamed utilities** before using `shadow` `rounded` `blur` `ring` (see §11)
8. `"use client"` is required for any interactive hook or event handler (see §4)
9. Never edit files inside `components/ui/` directly — wrap or extend instead
10. `<Label htmlFor>` + `aria-label` + `aria-describedby` are required on every form (see §10)

---

## 2. Project Commands

```bash
# Init new project
pnpm dlx shadcn@latest init -t next

# Add single component
pnpm dlx shadcn@latest add button

# Add multiple components
pnpm dlx shadcn@latest add button input label card dialog table

# Run dev server
pnpm dev

# Verify all design tokens are documented
python3 ~/.claude/skills/shadcn-ui-design/scripts/verify-tokens.py
```

**Component → CLI name:**

| Component | CLI | Component | CLI |
|-----------|-----|-----------|-----|
| Button | `button` | Tabs | `tabs` |
| Input | `input` | Accordion | `accordion` |
| Label | `label` | Collapsible | `collapsible` |
| Textarea | `textarea` | Table | `table` |
| Card | `card` | Pagination | `pagination` |
| Badge | `badge` | Breadcrumb | `breadcrumb` |
| Avatar | `avatar` | Navigation Menu | `navigation-menu` |
| Separator | `separator` | Sidebar | `sidebar` |
| Skeleton | `skeleton` | Menubar | `menubar` |
| Progress | `progress` | Alert | `alert` |
| Dialog | `dialog` | Sonner (Toast) | `sonner` |
| Alert Dialog | `alert-dialog` | Command | `command` |
| Sheet | `sheet` | Calendar | `calendar` |
| Drawer | `drawer` | Scroll Area | `scroll-area` |
| Popover | `popover` | Resizable | `resizable` |
| Tooltip | `tooltip` | Toggle | `toggle` |
| Dropdown Menu | `dropdown-menu` | Toggle Group | `toggle-group` |
| Context Menu | `context-menu` | Form | `form` |
| Select | `select` | Combobox | `command` + `popover` |
| Checkbox | `checkbox` | Date Picker | `calendar` + `popover` |
| Radio Group | `radio-group` | — | — |
| Switch | `switch` | — | — |
| Slider | `slider` | — | — |

---

## 3. File Structure (Next.js App Router)

```
src/
├── app/
│   ├── globals.css          ← copy from assets/globals.css then extend
│   ├── layout.tsx           ← Providers, Toaster (root only)
│   ├── providers.tsx        ← "use client" ThemeProvider
│   └── (routes)/
│       └── page.tsx         ← Server Component by default
├── components/
│   ├── ui/                  ← shadcn generated — do not edit directly
│   ├── layout/              ← header, sidebar, footer
│   └── [feature]/           ← composed components per feature
├── hooks/                   ← custom React hooks
├── lib/
│   └── utils.ts             ← cn() + shared utilities
└── types/
```

**Root layout:**
```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}

// app/providers.tsx
"use client"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

---

## 4. Server vs Client Component

| Condition | Directive |
|-----------|-----------|
| `useState` `useEffect` `useRef` `useContext` | `"use client"` |
| `onClick` `onChange` `onSubmit` any event | `"use client"` |
| `useTheme` (next-themes) | `"use client"` |
| shadcn interactive: `Dialog` `Sheet` `DropdownMenu` `Popover` `Tooltip` `Select` `Command` | `"use client"` |
| `Card` `Badge` `Table` `Avatar` `Skeleton` `Alert` `Separator` | Server Component ✓ |
| Data fetching, static layout, page shell | Server Component ✓ |

```tsx
// Server Component — no directive needed
export default function UserList({ users }: { users: User[] }) {
  return (
    <div className="flex flex-col gap-4">
      {users.map(u => <UserCard key={u.id} user={u} />)}
    </div>
  )
}

// Client Component — must declare
"use client"
export function DeleteButton({ id }: { id: string }) {
  return (
    <Button variant="destructive" onClick={() => handleDelete(id)}>Delete</Button>
  )
}
```

---

## ── Patterns ──────────────────────────────────────────────────

## 5. Component Patterns

### Button

```tsx
import { Button } from "@/components/ui/button"

<Button>Save Changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive"><Trash2 className="size-4" />Delete</Button>
<Button variant="ghost" size="icon" aria-label="Options">
  <MoreHorizontal className="size-4" />
</Button>
<Button disabled><Loader2 className="size-4 animate-spin" />Saving...</Button>
<Button className="w-full">Sign In</Button>
<Button asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
```

### Form Field

```tsx
"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Normal
<div className="flex flex-col gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" aria-describedby="email-hint" />
  <p id="email-hint" className="text-sm text-muted-foreground">Helper text</p>
</div>

// Error state
<div className="flex flex-col gap-2">
  <Label htmlFor="email" className="text-destructive">Email</Label>
  <Input id="email" type="email" aria-invalid="true" aria-describedby="email-error"
    className="border-destructive focus-visible:ring-destructive" />
  <p id="email-error" className="text-sm text-destructive">Please enter a valid email.</p>
</div>
```

### Card

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col gap-4">{/* content */}</CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Dialog

```tsx
"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild><Button variant="outline">Edit</Button></DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-4 py-4">{/* fields */}</div>
    <DialogFooter><Button type="submit">Save changes</Button></DialogFooter>
  </DialogContent>
</Dialog>
```

### Alert Dialog (Destructive Confirm)

```tsx
"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Data Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<div className="rounded-lg border border-border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(row => (
        <TableRow key={row.id}>
          <TableCell className="font-medium">{row.name}</TableCell>
          <TableCell><Badge variant={row.active ? "default" : "secondary"}>{row.status}</Badge></TableCell>
          <TableCell className="text-right">{row.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Select

```tsx
"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<div className="flex flex-col gap-2">
  <Label htmlFor="role">Role</Label>
  <Select>
    <SelectTrigger id="role"><SelectValue placeholder="Select a role" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="admin">Admin</SelectItem>
      <SelectItem value="editor">Editor</SelectItem>
      <SelectItem value="viewer">Viewer</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Tabs

```tsx
"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="mt-4">{/* content */}</TabsContent>
  <TabsContent value="analytics" className="mt-4">{/* content */}</TabsContent>
</Tabs>
```

### Toast (Sonner)

```tsx
"use client"
import { toast } from "sonner"

async function handleSave() {
  const id = toast.loading("Saving...")
  try {
    await saveData()
    toast.success("Saved!", { id })
  } catch {
    toast.error("Failed to save", { id })
  }
}
```

### Dropdown Menu

```tsx
"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="Row actions">
      <MoreVertical className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Combobox

```tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Combobox({ options, value, onChange }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? options.find(o => o.value === value)?.label : "Select..."}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {options.map(opt => (
              <CommandItem key={opt.value} onSelect={() => { onChange(opt.value); setOpen(false) }}>
                <Check className={cn("mr-2 size-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

---

## 6. Page Templates

### Dashboard

```tsx
export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-card">{/* nav */}</aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{/* stat cards */}</div>
        </main>
      </div>
    </div>
  )
}
```

### Settings

```tsx
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences.</p>
        </div>
        <Separator />
      </div>
    </div>
  )
}
```

### Auth

```tsx
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Enter your credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 7. Form — React Hook Form + Zod

```tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Invalid email"),
  name:  z.string().min(2, "At least 2 characters"),
})

export function ProfileForm() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", name: "" } })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="flex flex-col gap-6">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
            <FormDescription>Your public email address.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
```

---

## ── Reference ─────────────────────────────────────────────────

## 8. Token Usage — ✅ / ❌

```tsx
// ✅ Color — semantic tokens
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<p className="text-muted-foreground">
<div className="border border-border">

// ❌ Color — hardcoded
<div className="bg-white text-gray-900">
<div className="bg-blue-600 text-white">

// ✅ Spacing
<div className="flex flex-col gap-4">
<form className="flex flex-col gap-6">

// ✅ Size shorthand
<div className="size-4">        {/* w-4 h-4 */}

// ✅ Border Radius (v4 values)
<div className="rounded-xs">    {/* 2px  */}
<div className="rounded-sm">    {/* 4px  */}
<div className="rounded-md">    {/* 6px  */}
<div className="rounded-lg">    {/* 8px = --radius */}
<div className="rounded-xl">    {/* 12px */}

// ✅ Important suffix (v4)
<div className="flex!">

// ✅ CSS variable in arbitrary value (v4)
<div className="bg-(--brand-color)">

// ✅ cn() for conditional classes
<div className={cn("base rounded-lg", isActive && "bg-accent", className)}>
```

---

## 9. Anti-Patterns

| ❌ Don't | ✅ Do instead |
|----------|--------------|
| `bg-blue-500` | `bg-primary` |
| `text-gray-500` | `text-muted-foreground` |
| `w-4 h-4` | `size-4` |
| `space-y-4` | `flex flex-col gap-4` |
| `shadow-sm` (v3) | `shadow-xs` (v4) |
| `rounded-sm` (v3) | `rounded-xs` (v4) |
| `ring` | `ring-3` (v4 default changed) |
| `outline-none` | `outline-hidden` (v4) |
| `!flex` | `flex!` (v4) |
| `bg-[--var]` | `bg-(--var)` (v4) |
| Build modal with `div` | Use `<Dialog>` |
| Use `<Toast>` component | Use `sonner` |
| `tailwindcss-animate` | `tw-animate-css` |
| `React.forwardRef` | Plain function component (React 19) |
| Edit `components/ui/` directly | Wrap in `components/[feature]/` |
| `outline-none` on focusable | `focus-visible:ring-2 focus-visible:ring-ring` |

---

## 10. Accessibility Checklist

Check before outputting every component:

- [ ] `<Label>` has `htmlFor` matching the input `id`
- [ ] Icon-only buttons have `aria-label`
- [ ] `<Dialog>` has `<DialogTitle>`
- [ ] Error messages linked via `aria-describedby`
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Focus ring is not suppressed
- [ ] Color is not the sole means of conveying meaning

---

## 11. Tailwind v4 Breaking Changes

| v3 | v4 |
|----|-----|
| `@tailwind base/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` | `@theme {}` in CSS |
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `blur-sm` | `blur-xs` |
| `ring` (3px) | `ring-3` (1px default) |
| `outline-none` | `outline-hidden` |
| `!flex` | `flex!` |
| `bg-[--var]` | `bg-(--var)` |
| `@layer utilities { .foo {} }` | `@utility foo {}` |
| `theme(colors.red.500)` | `var(--color-red-500)` |
| `plugins: { tailwindcss: {} }` | `plugins: { "@tailwindcss/postcss": {} }` |
