# AIMadeThis Design Guidelines

**Version:** 1.0
**Last Updated:** October 9, 2025
**Status:** Production

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Guidelines](#component-guidelines)
6. [Layout Patterns](#layout-patterns)
7. [Animation & Motion](#animation--motion)
8. [Accessibility](#accessibility)
9. [Dark Mode](#dark-mode)
10. [Icon System](#icon-system)
11. [Shadows & Elevation](#shadows--elevation)
12. [States & Interactions](#states--interactions)
13. [Best Practices](#best-practices)

---

## Design Philosophy

### Core Principles

**1. Bold & Modern**
- Large, confident typography (text-6xl to text-8xl for heroes)
- Gradient text effects for emphasis
- Clean geometric shapes with generous border radius

**2. Community-Focused**
- Transparent interactions (visible vote counts, reviews, comments)
- User-generated content takes center stage
- Social proof prominently displayed

**3. Tech-Forward**
- Gradient accents (emerald to teal)
- Glass morphism effects for premium feel
- Animated background elements
- Smooth transitions throughout

**4. Accessibility-First**
- WCAG 2.1 AA compliance minimum
- Reduced motion support built-in
- High contrast ratios in all themes
- Keyboard navigation throughout

### Design DNA

**What makes AIMadeThis unique:**
- Emerald-to-teal gradient signature (not generic blue)
- "AIMMT" bold wordmark with gradient fill
- Card-based layouts with hover elevation
- Section-based homepage storytelling
- Animated background blobs for depth

---

## Color System

### Color Palette (HSL Format)

The color system uses CSS custom properties defined in HSL format for easy theme switching.

#### Light Mode

| Token | HSL Value | Hex Equivalent | Usage |
|-------|-----------|----------------|-------|
| `--background` | `0 0% 100%` | `#FFFFFF` | Page backgrounds |
| `--foreground` | `215 25% 15%` | `#1C2532` | Primary text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `215 25% 15%` | `#1C2532` | Card text |
| `--primary` | `160 84% 39%` | `#10B981` | Primary actions (emerald-600) |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary |
| `--accent` | `158 64% 52%` | `#2DD4BF` | Accent elements (teal) |
| `--accent-foreground` | `0 0% 100%` | `#FFFFFF` | Text on accent |
| `--secondary` | `210 17% 95%` | `#F1F3F5` | Secondary surfaces |
| `--secondary-foreground` | `215 25% 15%` | `#1C2532` | Text on secondary |
| `--muted` | `210 17% 95%` | `#F1F3F5` | Muted backgrounds |
| `--muted-foreground` | `215 16% 47%` | `#667085` | Muted text |
| `--border` | `215 16% 88%` | `#DFE3E8` | Border color |
| `--input` | `215 16% 88%` | `#DFE3E8` | Input borders |
| `--ring` | `160 84% 39%` | `#10B981` | Focus rings |
| `--destructive` | `0 84% 60%` | `#EF4444` | Error/delete actions |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on destructive |

#### Dark Mode

| Token | HSL Value | Hex Equivalent | Usage |
|-------|-----------|----------------|-------|
| `--background` | `222 47% 11%` | `#0F1729` | Page backgrounds |
| `--foreground` | `210 40% 98%` | `#F8FAFC` | Primary text |
| `--card` | `222 47% 15%` | `#151D2F` | Card backgrounds |
| `--card-foreground` | `210 40% 98%` | `#F8FAFC` | Card text |
| `--primary` | `160 84% 39%` | `#10B981` | Primary actions |
| `--primary-foreground` | `222 47% 11%` | `#0F1729` | Text on primary |
| `--secondary` | `217 33% 17%` | `#1D2939` | Secondary surfaces |
| `--secondary-foreground` | `210 40% 98%` | `#F8FAFC` | Text on secondary |
| `--muted` | `217 33% 17%` | `#1D2939` | Muted backgrounds |
| `--muted-foreground` | `215 20% 65%` | `#94A3B8` | Muted text |
| `--border` | `217 33% 20%` | `#242E3F` | Border color |
| `--input` | `217 33% 17%` | `#1D2939` | Input backgrounds |
| `--ring` | `160 84% 39%` | `#10B981` | Focus rings |
| `--destructive` | `0 63% 31%` | `#991B1B` | Error/delete actions |
| `--destructive-foreground` | `210 40% 98%` | `#F8FAFC` | Text on destructive |

### Gradient Colors

**Primary Gradient (Emerald to Teal):**
```css
/* Default gradient */
.gradient-primary {
  background: linear-gradient(to right, #059669 /* emerald-600 */, #14B8A6 /* teal-600 */);
}

/* Lighter variant (hover states) */
.gradient-primary-hover {
  background: linear-gradient(to right, #10B981 /* emerald-500 */, #2DD4BF /* teal-500 */);
}

/* Dark mode variant */
.dark .gradient-primary {
  background: linear-gradient(to right, #10B981 /* emerald-500 */, #2DD4BF /* teal-500 */);
}
```

**Background Gradients:**
```css
/* Hero background */
background: linear-gradient(to bottom, #f8fafc, #ffffff); /* slate-50 to white */

/* Dark mode hero */
.dark {
  background: linear-gradient(to bottom, #020617, #0f172a); /* slate-950 to slate-900 */
}

/* Section backgrounds */
background: linear-gradient(to bottom right, #f8fafc, rgba(240, 253, 250, 0.3), rgba(236, 253, 245, 0.3));
/* slate-50, teal-50/30, emerald-50/30 */
```

### Color Usage Guidelines

**Do:**
- Use emerald-600 (`#10B981`) as primary brand color
- Apply gradients to CTAs, headings, and key UI elements
- Maintain 4.5:1 contrast ratio for text (WCAG AA)
- Use muted colors for secondary information
- Apply accent colors sparingly for emphasis

**Don't:**
- Use pure black (`#000000`) - use foreground token instead
- Mix warm colors (orange/red) except for destructive actions
- Create custom colors outside the system
- Use low contrast combinations
- Overuse gradients (max 3-4 per screen)

### Semantic Color Mapping

```typescript
// Status colors
const statusColors = {
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
}

// Pricing types
const pricingColors = {
  free: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  freemium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  paid: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  subscription: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
}
```

---

## Typography

### Font Families

**Body Text:** Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)
- Use for: Paragraphs, UI text, captions, labels

**Headings:** Space Grotesk
```css
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Use for: H1-H6, section titles, card titles
- Special: `-0.02em` letter spacing for tighter, modern look

### Type Scale

| Element | Size (Tailwind) | Size (rem/px) | Weight | Line Height | Letter Spacing |
|---------|----------------|---------------|--------|-------------|----------------|
| Hero XXL | `text-8xl` | 6rem / 96px | 900 (black) | 1 | -0.02em |
| Hero XL | `text-7xl` | 4.5rem / 72px | 900 (black) | 1 | -0.02em |
| Hero Large | `text-6xl` | 3.75rem / 60px | 900 (black) | 1 | -0.02em |
| Display | `text-5xl` | 3rem / 48px | 800 (extrabold) | 1.1 | -0.02em |
| H1 | `text-4xl` | 2.25rem / 36px | 700 (bold) | 1.2 | -0.02em |
| H2 | `text-3xl` | 1.875rem / 30px | 700 (bold) | 1.25 | -0.02em |
| H3 | `text-2xl` | 1.5rem / 24px | 600 (semibold) | 1.3 | -0.02em |
| H4 | `text-xl` | 1.25rem / 20px | 600 (semibold) | 1.4 | normal |
| H5 | `text-lg` | 1.125rem / 18px | 600 (semibold) | 1.5 | normal |
| Body Large | `text-lg` | 1.125rem / 18px | 400 (regular) | 1.75 | normal |
| Body | `text-base` | 1rem / 16px | 400 (regular) | 1.5 | normal |
| Body Small | `text-sm` | 0.875rem / 14px | 400 (regular) | 1.5 | normal |
| Caption | `text-xs` | 0.75rem / 12px | 500 (medium) | 1.5 | normal |

### Typography Patterns

**Hero Headline:**
```tsx
<h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight">
  <span className="block text-gray-900 dark:text-white">First Line</span>
  <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
    Gradient Line
  </span>
</h1>
```

**Section Heading:**
```tsx
<h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
  Section Title
</h2>
<p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
  Section description
</p>
```

**Card Title:**
```tsx
<h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1">
  Product Name
</h3>
```

**Body Text:**
```tsx
<p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
  Regular paragraph text
</p>
```

### Text Colors

```css
/* Primary text */
.text-primary { color: hsl(var(--foreground)); }

/* Secondary text */
.text-secondary { color: hsl(var(--muted-foreground)); }

/* Gradient text */
.text-gradient {
  background: linear-gradient(to right, #10B981, #14B8A6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

---

## Spacing System

### Base Unit: 0.25rem (4px)

The spacing system follows Tailwind's default scale with consistent increments:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0` | 0 | 0px | Reset spacing |
| `px` | 1px | 1px | Borders |
| `0.5` | 0.125rem | 2px | Micro spacing |
| `1` | 0.25rem | 4px | Tight spacing |
| `2` | 0.5rem | 8px | Compact spacing |
| `3` | 0.75rem | 12px | Standard spacing |
| `4` | 1rem | 16px | Comfortable spacing |
| `5` | 1.25rem | 20px | Spacious |
| `6` | 1.5rem | 24px | Card padding |
| `8` | 2rem | 32px | Section padding |
| `10` | 2.5rem | 40px | Large section spacing |
| `12` | 3rem | 48px | Extra large spacing |
| `16` | 4rem | 64px | Hero element spacing |
| `20` | 5rem | 80px | Section dividers |
| `24` | 6rem | 96px | Major sections |
| `32` | 8rem | 128px | Hero sections |

### Spacing Patterns

**Container Padding:**
```tsx
// Mobile-first responsive padding
<div className="px-4 md:px-8 lg:px-12">
  {/* Content */}
</div>

// Container with max width
<div className="container mx-auto px-4">
  {/* Content */}
</div>
```

**Card Padding:**
```tsx
// Standard card
<div className="p-6">
  <div className="space-y-4">
    {/* Content with vertical spacing */}
  </div>
</div>

// Compact card
<div className="p-4">
  <div className="space-y-3">
    {/* Content */}
  </div>
</div>
```

**Section Spacing:**
```tsx
// Standard section
<section className="py-24 md:py-32">
  {/* Section content */}
</section>

// Compact section
<section className="py-16 md:py-20">
  {/* Section content */}
</section>
```

**Stack Spacing (Vertical):**
```tsx
<div className="space-y-2">  {/* Tight - labels, form fields */}
<div className="space-y-3">  {/* Standard - list items */}
<div className="space-y-4">  {/* Comfortable - card content */}
<div className="space-y-6">  {/* Spacious - card sections */}
<div className="space-y-8">  {/* Loose - major content blocks */}
<div className="space-y-16"> {/* Section spacing */}
```

**Inline Spacing (Horizontal):**
```tsx
<div className="flex gap-2">  {/* Tight - tags, pills */}
<div className="flex gap-3">  {/* Standard - icon + text */}
<div className="flex gap-4">  {/* Comfortable - button groups */}
<div className="flex gap-6">  {/* Spacious - navigation items */}
<div className="flex gap-8">  {/* Loose - stats, features */}
```

---

## Component Guidelines

### Buttons

**Variants:**

```tsx
// Default (Primary Gradient)
<Button variant="default">
  Submit Product
</Button>
// Styles: Gradient emerald-600 to teal-600, white text, shadow

// Outline
<Button variant="outline">
  Learn More
</Button>
// Styles: 2px border, emerald-600 color, transparent bg, hover bg-emerald-50

// Ghost
<Button variant="ghost">
  Cancel
</Button>
// Styles: No border, hover bg-emerald-50, emerald text on hover

// Link
<Button variant="link">
  Read More
</Button>
// Styles: Emerald text, underline on hover

// Destructive
<Button variant="destructive">
  Delete
</Button>
// Styles: Red bg, white text, red shadow

// Secondary
<Button variant="secondary">
  Back
</Button>
// Styles: Gray bg, gray text
```

**Sizes:**

```tsx
<Button size="sm">    {/* h-8, px-3, text-xs */}
<Button size="default"> {/* h-10, px-5, text-sm (DEFAULT) */}
<Button size="lg">    {/* h-12, px-8, text-base */}
<Button size="icon">  {/* h-10, w-10, square */}
```

**States:**

```tsx
// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>

// With icon
<Button>
  <Rocket className="mr-2 h-4 w-4" />
  Launch
</Button>

// Icon only
<Button size="icon">
  <Heart className="h-4 w-4" />
</Button>
```

**Usage Guidelines:**

- **Primary actions:** Use `variant="default"` (gradient)
- **Secondary actions:** Use `variant="outline"` or `variant="secondary"`
- **Tertiary actions:** Use `variant="ghost"`
- **Destructive actions:** Use `variant="destructive"` with confirmation
- **Navigation:** Use `variant="link"` for text links
- **Icon buttons:** Always include `aria-label` and `size="icon"`

**Full Button Spec:**
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-teal-500",
        outline: "border-2 border-emerald-600 bg-transparent text-emerald-700 hover:bg-emerald-50",
        ghost: "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700",
        link: "text-emerald-600 underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
  }
)
```

### Cards

**Basic Structure:**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description or metadata</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions or metadata */}
  </CardFooter>
</Card>
```

**Styles:**
- Border radius: `rounded-xl` (0.75rem)
- Border: `border` (1px solid border color)
- Background: `bg-card`
- Shadow: Default `shadow`
- Padding: `p-6` for header/content

**Product Card Pattern:**

```tsx
<div className="group h-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg">
  {/* Image */}
  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-900">
    <Image
      src={image}
      alt={name}
      fill
      className="object-cover transition-transform group-hover:scale-105"
    />
  </div>

  {/* Content */}
  <div className="p-6 space-y-3">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 line-clamp-1">
      {name}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
      {description}
    </p>
  </div>
</div>
```

**Card Variants:**

```tsx
// Elevated card (hover effect)
<Card className="hover:shadow-xl transition-shadow duration-300">

// Glass morphism card (dashboard)
<Card className="bg-white/10 backdrop-blur-lg border-white/20">

// Gradient border card
<Card className="border-2 border-transparent hover:border-teal-500 bg-gradient-to-br from-slate-50 to-slate-100">
```

### Forms

**Form Structure:**

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm({
  resolver: zodResolver(schema),
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field Label</FormLabel>
          <FormControl>
            <Input placeholder="Placeholder text" {...field} />
          </FormControl>
          <FormDescription>
            Helper text goes here
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

**Input Styles:**

```tsx
// Text input
<Input
  type="text"
  placeholder="Enter text..."
  className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
/>

// Textarea
<Textarea
  placeholder="Enter description..."
  className="min-h-[120px] resize-none"
/>

// Select
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Form Validation:**
- Use Zod schemas for validation
- Display errors below fields using `<FormMessage />`
- Disabled submit button during loading
- Show loading spinner on button during submission

### Badges

**Variants:**

```tsx
// Default (Primary)
<Badge variant="default">New</Badge>
// emerald background, white text

// Secondary
<Badge variant="secondary">Beta</Badge>
// gray background, gray text

// Outline
<Badge variant="outline">Featured</Badge>
// transparent background, border only

// Destructive
<Badge variant="destructive">Error</Badge>
// red background, white text
```

**Pricing Badges:**

```tsx
const pricingBadge = {
  free: <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Free</Badge>,
  freemium: <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Freemium</Badge>,
  paid: <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">Paid</Badge>,
}
```

### Navigation

**Navbar Structure:**

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    {/* Logo */}
    <Link href="/" className="flex items-center space-x-2">
      <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
        AIMMT
      </span>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/products" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition-colors">
        Explore
      </Link>
    </nav>

    {/* Actions */}
    <div className="flex items-center gap-4">
      <Button asChild>
        <Link href="/products/new">Submit Product</Link>
      </Button>
    </div>
  </div>
</header>
```

**Navigation Link Styles:**
```css
.nav-link {
  @apply text-sm font-medium text-gray-700 dark:text-gray-200;
  @apply hover:text-emerald-600 dark:hover:text-emerald-400;
  @apply transition-colors duration-200;
}
```

---

## Layout Patterns

### Container System

**Standard Container:**
```tsx
<div className="container mx-auto px-4">
  {/* Content with responsive padding */}
</div>
```

**Max Width Containers:**
```tsx
<div className="max-w-7xl mx-auto"> {/* 1280px - dashboard, complex layouts */}
<div className="max-w-5xl mx-auto"> {/* 1024px - hero sections, forms */}
<div className="max-w-3xl mx-auto"> {/* 768px - articles, narrow content */}
<div className="max-w-md mx-auto">  {/* 448px - modals, auth forms */}
```

### Grid Systems

**Product Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* 1 column mobile, 2 tablet, 4 desktop */}
</div>
```

**Feature Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {features.map((feature) => (
    <div key={feature.id} className="p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      {/* Feature content */}
    </div>
  ))}
</div>
```

**Dashboard Sidebar Layout:**
```tsx
<div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
    {/* Sidebar content */}
  </aside>

  {/* Main content */}
  <main className="flex-1 overflow-y-auto">
    <div className="container mx-auto p-6 md:p-8">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

**Responsive Patterns:**

```tsx
// Mobile-first approach
<div className="text-base md:text-lg lg:text-xl">
  {/* Scales up on larger screens */}
</div>

// Hide on mobile
<div className="hidden md:block">
  {/* Only visible on tablet+ */}
</div>

// Show only on mobile
<div className="block md:hidden">
  {/* Only visible on mobile */}
</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Responsive columns */}
</div>

// Responsive flex direction
<div className="flex flex-col md:flex-row gap-4">
  {/* Stacks on mobile, horizontal on desktop */}
</div>
```

### Section Layouts

**Hero Section:**
```tsx
<section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
  {/* Animated background */}
  <div className="absolute inset-0 overflow-hidden">
    <motion.div className="absolute top-1/4 -left-48 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
  </div>

  {/* Content */}
  <div className="container mx-auto px-4 py-20 relative z-10">
    <div className="max-w-5xl mx-auto text-center space-y-10">
      {/* Hero content */}
    </div>
  </div>
</section>
```

**Feature Section:**
```tsx
<section className="py-24 md:py-32 bg-white dark:bg-slate-900">
  <div className="container mx-auto px-4">
    <div className="space-y-16">
      {/* Section header */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black">Section Title</h2>
        <p className="text-xl text-slate-600 dark:text-slate-300">Description</p>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Grid items */}
      </div>
    </div>
  </div>
</section>
```

---

## Animation & Motion

### Animation Library: Framer Motion

**Installation:**
```bash
npm install framer-motion
```

**Basic Import:**
```tsx
import { motion } from "framer-motion"
```

### Animation Patterns

**Fade In:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

**Stagger Children:**
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

<motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

**Hover Effects:**
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  transition={{ duration: 0.2 }}
  className="cursor-pointer"
>
  {/* Hoverable content */}
</motion.div>
```

**Page Transitions:**
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  transition={{ duration: 0.3 }}
>
  {/* Page content */}
</motion.div>
```

**Scroll Animations:**
```tsx
<motion.div
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-100px" }}
  variants={container}
>
  {/* Content animates when scrolled into view */}
</motion.div>
```

**Continuous Animations:**
```tsx
// Rotating blob
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    rotate: [0, 90, 0],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  }}
  className="w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
/>

// Scroll indicator
<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  {/* Bouncing indicator */}
</motion.div>
```

### CSS Animations

**Gradient Shift:**
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  animation: gradient-shift 6s ease infinite;
  background-size: 200% 200%;
}
```

**Usage:**
```tsx
<div className="bg-gradient-to-r from-emerald-500 to-teal-500 animate-gradient">
  {/* Animated gradient */}
</div>
```

### Transition Timings

| Duration | Use Case | Class |
|----------|----------|-------|
| 75ms | Micro interactions | `duration-75` |
| 150ms | Button hover, link hover | `duration-150` |
| 200ms | Default transitions | `duration-200` |
| 300ms | Card hover, modal open | `duration-300` |
| 500ms | Page transitions | `duration-500` |
| 1000ms | Loading states | `duration-1000` |

**Transition Classes:**
```tsx
// All properties
className="transition-all duration-300"

// Specific properties
className="transition-colors duration-200"
className="transition-transform duration-300"
className="transition-opacity duration-500"

// Easing
className="transition-all duration-300 ease-in-out"
className="transition-all duration-300 ease-out"
```

### Reduced Motion

**Always include reduced motion support:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**In React components:**
```tsx
import { useReducedMotion } from "framer-motion"

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ x: shouldReduceMotion ? 0 : 100 }}
    >
      {/* Content */}
    </motion.div>
  )
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: 4.5:1 minimum contrast ratio
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Tested Combinations:**
```tsx
// Light mode - PASS
text-gray-900 on bg-white // 17.6:1
text-gray-600 on bg-white // 7.2:1
text-emerald-600 on bg-white // 4.8:1

// Dark mode - PASS
text-white on bg-gray-900 // 17.6:1
text-gray-300 on bg-gray-900 // 11.7:1
text-emerald-400 on bg-gray-900 // 8.2:1
```

### Keyboard Navigation

**Focus Styles:**
```tsx
// All interactive elements
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// Custom focus
className="focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
```

**Tab Order:**
- Use semantic HTML (`<button>`, `<a>`, `<input>`)
- Maintain logical tab order (top to bottom, left to right)
- Use `tabIndex={0}` for custom interactive elements
- Use `tabIndex={-1}` to remove from tab order

### ARIA Labels

**Required Patterns:**

```tsx
// Icon-only buttons
<Button size="icon" aria-label="Close menu">
  <X className="h-4 w-4" />
</Button>

// Form inputs
<Input
  id="email"
  type="email"
  aria-label="Email address"
  aria-describedby="email-description"
/>
<span id="email-description">We'll never share your email</span>

// Loading states
<Button disabled aria-busy="true">
  <Loader2 className="animate-spin" aria-hidden="true" />
  <span>Loading...</span>
</Button>

// Modal dialogs
<Dialog aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <DialogTitle id="dialog-title">Confirm Action</DialogTitle>
  <DialogDescription id="dialog-description">
    Are you sure you want to proceed?
  </DialogDescription>
</Dialog>
```

### Screen Reader Support

**Best Practices:**

```tsx
// Hide decorative icons
<Star className="h-4 w-4" aria-hidden="true" />

// Provide context
<span className="sr-only">Navigate to </span>
<Link href="/products">Products</Link>

// Loading announcements
<div role="status" aria-live="polite">
  {isLoading ? "Loading products..." : `${products.length} products loaded`}
</div>

// Form validation
<FormMessage role="alert" aria-live="assertive">
  {error}
</FormMessage>
```

### Semantic HTML

**Use appropriate elements:**

```tsx
// Navigation
<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/products">Products</Link></li>
  </ul>
</nav>

// Headings hierarchy
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

// Buttons vs Links
<button onClick={handleClick}>Trigger Action</button> {/* For actions */}
<Link href="/page">Navigate</Link> {/* For navigation */}

// Landmarks
<header>...</header>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

---

## Dark Mode

### Implementation Strategy

**Library:** next-themes

**Setup:**
```tsx
// providers.tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Theme Toggle:**
```tsx
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

### Dark Mode Color Adjustments

**Background Layers:**
```tsx
// Light mode → Dark mode
bg-white → bg-gray-900 / bg-gray-950
bg-gray-50 → bg-gray-900
bg-gray-100 → bg-gray-800
```

**Text Colors:**
```tsx
// Light mode → Dark mode
text-gray-900 → text-white / text-gray-100
text-gray-700 → text-gray-200
text-gray-600 → text-gray-300
text-gray-500 → text-gray-400
```

**Border Colors:**
```tsx
// Light mode → Dark mode
border-gray-200 → border-gray-800
border-gray-300 → border-gray-700
```

**Interactive Colors:**
```tsx
// Emerald remains consistent
text-emerald-600 → text-emerald-400
bg-emerald-600 → bg-emerald-500
border-emerald-600 → border-emerald-500

// Hover states lighten in dark mode
hover:bg-emerald-50 → hover:bg-emerald-950/30
```

### Dark Mode Patterns

**Conditional Classes:**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Switches colors based on theme */}
</div>
```

**Gradient Adjustments:**
```tsx
// Slightly lighter gradients in dark mode
<div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500">
  {/* Gradient adjusts for dark mode */}
</div>
```

**Shadow Adjustments:**
```tsx
// Reduce shadow intensity in dark mode
<div className="shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20">
  {/* Lighter shadow in dark mode */}
</div>
```

### Testing Dark Mode

**Checklist:**
- [ ] All text has sufficient contrast (use Chrome DevTools Color Picker)
- [ ] Images have appropriate backgrounds (no transparent PNGs on dark bg)
- [ ] Shadows are visible but not too intense
- [ ] Borders are visible between similar-colored sections
- [ ] Loading states are visible
- [ ] Focus indicators are clear
- [ ] Icons are appropriately colored
- [ ] Gradients look good in both themes

---

## Icon System

### Library: Lucide React

**Installation:**
```bash
npm install lucide-react
```

**Import:**
```tsx
import { IconName } from "lucide-react"
```

### Icon Sizes

| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| xs | `h-3 w-3` | 12px | Inline text icons |
| sm | `h-4 w-4` | 16px | Button icons, badges |
| base | `h-5 w-5` | 20px | Navigation icons |
| lg | `h-6 w-6` | 24px | Section headers |
| xl | `h-8 w-8` | 32px | Feature icons |
| 2xl | `h-12 w-12` | 48px | Hero icons |
| 3xl | `h-16 w-16` | 64px | Empty states |

### Icon Patterns

**Icon with Text:**
```tsx
<Button>
  <Rocket className="mr-2 h-4 w-4" />
  Launch Product
</Button>
```

**Icon Only:**
```tsx
<Button size="icon" aria-label="Settings">
  <Settings className="h-4 w-4" />
</Button>
```

**Icon in Card:**
```tsx
<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
  <Eye className="w-8 h-8" />
</div>
```

**Animated Icons:**
```tsx
// Loading spinner
<Loader2 className="h-4 w-4 animate-spin" />

// Rotating icon
<motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
  <RefreshCw className="h-5 w-5" />
</motion.div>
```

### Common Icons

| Icon | Component | Usage |
|------|-----------|-------|
| Rocket | `<Rocket />` | Launch, submit, new |
| Star | `<Star />` | Favorites, ratings |
| Heart | `<Heart />` | Likes, bookmarks |
| MessageSquare | `<MessageSquare />` | Comments, chat |
| TrendingUp | `<TrendingUp />` | Trending, growth |
| Eye | `<Eye />` | Views, visibility |
| Users | `<Users />` | Community, team |
| Sparkles | `<Sparkles />` | AI, magic, special |
| Zap | `<Zap />` | Speed, energy |
| Search | `<Search />` | Search functionality |
| Menu | `<Menu />` | Mobile menu |
| X | `<X />` | Close, dismiss |
| Check | `<Check />` | Success, completed |
| ChevronDown | `<ChevronDown />` | Dropdowns, accordions |
| ArrowRight | `<ArrowRight />` | Next, forward |
| Settings | `<Settings />` | Settings, configuration |
| LogOut | `<LogOut />` | Sign out |
| User | `<User />` | Profile, account |

### Icon Colors

```tsx
// Match text color
<Star className="h-5 w-5 text-yellow-500" />

// Inherit from parent
<div className="text-emerald-600">
  <Check className="h-4 w-4" />
</div>

// Dark mode aware
<Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
```

---

## Shadows & Elevation

### Shadow Scale

| Level | Class | Usage |
|-------|-------|-------|
| None | `shadow-none` | Flat UI, minimal design |
| Extra Small | `shadow-sm` | Inputs, subtle borders |
| Small | `shadow` | Cards (default) |
| Medium | `shadow-md` | Dropdowns, popovers |
| Large | `shadow-lg` | Modals, elevated cards |
| Extra Large | `shadow-xl` | Hero elements, CTAs |
| 2XL | `shadow-2xl` | Maximum elevation |

### Shadow Colors

**Default Shadows:**
```tsx
// Standard shadow
<div className="shadow-lg">

// Colored shadow (emerald)
<div className="shadow-lg shadow-emerald-500/30">

// Dark mode adjustment
<div className="shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20">
```

### Elevation Patterns

**Card Elevation:**
```tsx
// Base state
<Card className="shadow">

// Hover state
<Card className="shadow hover:shadow-lg transition-shadow duration-300">

// Active state
<Card className="shadow-lg">
```

**Button Elevation:**
```tsx
// Default button (with gradient)
<Button className="shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40">
  Submit
</Button>

// Outline button (no shadow)
<Button variant="outline">
  Cancel
</Button>
```

**Modal Elevation:**
```tsx
<Dialog className="shadow-2xl">
  {/* Highest elevation for modals */}
</Dialog>
```

### Drop Shadow (for images/icons)

```tsx
// Subtle drop shadow
<div className="drop-shadow-sm">

// Standard drop shadow
<div className="drop-shadow">

// Pronounced drop shadow
<div className="drop-shadow-lg">
```

---

## States & Interactions

### Interactive States

**Button States:**

```tsx
// Default
<Button>Click me</Button>

// Hover
<Button className="hover:shadow-xl hover:from-emerald-500">
  Hover effect
</Button>

// Active (pressed)
<Button className="active:scale-95">
  Press me
</Button>

// Focus
<Button className="focus-visible:ring-2 focus-visible:ring-emerald-500">
  Focus me
</Button>

// Disabled
<Button disabled>
  Disabled
</Button>

// Loading
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

**Link States:**

```tsx
<Link
  href="/products"
  className="text-emerald-600 hover:text-emerald-700 hover:underline active:text-emerald-800"
>
  Explore Products
</Link>
```

**Card States:**

```tsx
// Default
<Card>

// Hover (interactive)
<Card className="hover:border-emerald-400 hover:shadow-lg transition-all duration-300 cursor-pointer">

// Selected
<Card className="border-emerald-500 border-2 bg-emerald-50 dark:bg-emerald-950/30">

// Disabled
<Card className="opacity-50 pointer-events-none">
```

### Form States

**Input States:**

```tsx
// Default
<Input placeholder="Enter text..." />

// Focus
<Input className="focus:ring-2 focus:ring-emerald-500" />

// Error
<Input className="border-red-500 focus:ring-red-500" />
{errorMessage && <p className="text-sm text-red-600 mt-1">{errorMessage}</p>}

// Success
<Input className="border-green-500 focus:ring-green-500" />
<p className="text-sm text-green-600 mt-1 flex items-center gap-1">
  <Check className="h-4 w-4" /> Looks good!
</p>

// Disabled
<Input disabled className="opacity-50 cursor-not-allowed" />
```

**Checkbox States:**

```tsx
// Unchecked
<Checkbox id="terms" />

// Checked
<Checkbox id="terms" checked />

// Indeterminate
<Checkbox id="select-all" checked="indeterminate" />

// Disabled
<Checkbox id="disabled" disabled />
```

### Loading States

**Skeleton Loaders:**

```tsx
// Product card skeleton
<div className="space-y-3 p-6 border rounded-lg animate-pulse">
  <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg" />
  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
</div>

// Text skeleton
<div className="space-y-2 animate-pulse">
  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
</div>
```

**Spinner:**

```tsx
import { Loader2 } from "lucide-react"

<Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
```

**Progress Bar:**

```tsx
<div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
    <Inbox className="h-8 w-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    No products yet
  </h3>
  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
    Get started by creating your first AI product
  </p>
  <Button asChild>
    <Link href="/products/new">
      <Plus className="mr-2 h-4 w-4" />
      Create Product
    </Link>
  </Button>
</div>
```

### Error States

```tsx
<div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">
        Error loading products
      </h4>
      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
        {errorMessage}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={handleRetry}
      >
        Try Again
      </Button>
    </div>
  </div>
</div>
```

---

## Best Practices

### Do's

**Design:**
- Use the emerald-to-teal gradient for brand consistency
- Apply generous spacing (min 16px between sections)
- Use large, bold typography for hero sections
- Implement hover states on all interactive elements
- Maintain 4.5:1 contrast ratio for text
- Use semantic HTML elements
- Test in both light and dark modes

**Code:**
- Use Tailwind utility classes for styling
- Leverage shadcn/ui components
- Apply the `cn()` utility for conditional classes
- Use Framer Motion for animations
- Implement loading skeletons for async content
- Add aria-labels to icon-only buttons
- Use React Hook Form with Zod validation

**Layout:**
- Start with mobile design (mobile-first)
- Use the container system for consistent width
- Apply responsive grid patterns (1-2-3-4 columns)
- Maintain visual hierarchy with spacing
- Group related content in cards
- Use appropriate heading hierarchy (h1 → h6)

**Performance:**
- Lazy load images with Next.js Image component
- Use `priority` for above-the-fold images
- Optimize images (WebP format when possible)
- Minimize animation complexity
- Debounce search inputs
- Use React Query for data fetching and caching

### Don'ts

**Design:**
- Don't use pure black (`#000000`) backgrounds
- Don't create custom colors outside the system
- Don't use more than 3-4 gradients per page
- Don't ignore dark mode styling
- Don't use small touch targets (<44px mobile)
- Don't mix different icon styles
- Don't animate excessively (causes motion sickness)

**Code:**
- Don't use inline styles (use Tailwind classes)
- Don't create custom components when shadcn/ui has them
- Don't skip form validation
- Don't forget loading/error states
- Don't ignore TypeScript errors
- Don't nest more than 3-4 levels of components
- Don't use `any` type in TypeScript

**Layout:**
- Don't create fixed widths (use responsive units)
- Don't hide content without providing alternatives
- Don't break heading hierarchy (h1 → h3 without h2)
- Don't use absolute positioning for layout
- Don't forget mobile navigation
- Don't create horizontal scroll on mobile

**Accessibility:**
- Don't remove focus outlines
- Don't use color alone to convey information
- Don't auto-play videos/audio
- Don't skip alt text on images
- Don't use low contrast text
- Don't forget keyboard navigation
- Don't ignore screen reader testing

### Common Patterns

**CTA Section:**
```tsx
<section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-5xl font-black text-white mb-6">
      Ready to Get Started?
    </h2>
    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
      Join thousands of creators showcasing their AI products
    </p>
    <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
      <Rocket className="mr-2 h-5 w-5" />
      Launch Your Product
    </Button>
  </div>
</section>
```

**Feature Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map((feature) => (
    <motion.div
      key={feature.id}
      whileHover={{ scale: 1.05, y: -5 }}
      className="p-8 rounded-3xl bg-white dark:bg-gray-800 border shadow-lg hover:shadow-xl transition-all"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white mb-4">
        <feature.icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
    </motion.div>
  ))}
</div>
```

**Stats Display:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {stats.map((stat) => (
    <div key={stat.label} className="text-center">
      <div className="text-6xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
        {stat.value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-2">
        {stat.label}
      </div>
    </div>
  ))}
</div>
```

### Anti-Patterns

**Avoid:**
```tsx
// ❌ Too many colors
<Button className="bg-red-500 hover:bg-blue-600 text-yellow-300">

// ❌ Inline styles
<div style={{ marginTop: '20px', color: '#10B981' }}>

// ❌ No responsive design
<div className="w-[800px]">

// ❌ Missing accessibility
<button onClick={handleClick}>
  <Heart />
</button>

// ❌ Hardcoded values
<div className="mt-[37px] ml-[23px]">
```

**Do Instead:**
```tsx
// ✅ Consistent colors
<Button variant="default">

// ✅ Tailwind classes
<div className="mt-5 text-emerald-600">

// ✅ Responsive
<div className="max-w-7xl mx-auto">

// ✅ Accessible
<Button size="icon" aria-label="Like product" onClick={handleClick}>
  <Heart className="h-4 w-4" />
</Button>

// ✅ Design system spacing
<div className="mt-8 ml-6">
```

---

## Resources

### Design Tools
- **Figma:** Design mockups (use Tailwind CSS plugin)
- **Coolors:** Color palette generation
- **Type Scale:** Typography scale calculator
- **Contrast Checker:** WCAG contrast validation

### Development Tools
- **Tailwind CSS IntelliSense:** VSCode extension
- **Headwind:** Class sorting extension
- **React DevTools:** Component debugging
- **Axe DevTools:** Accessibility testing

### Documentation
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Framer Motion:** https://www.framer.com/motion
- **Lucide Icons:** https://lucide.dev
- **Next.js:** https://nextjs.org/docs

### Testing
- **Lighthouse:** Performance and accessibility audit
- **WAVE:** Web accessibility evaluation tool
- **ChromeVox:** Screen reader testing (Chrome extension)
- **Responsive Design Mode:** Browser DevTools

---

## Changelog

### Version 1.0 - October 9, 2025
- Initial design guidelines document
- Complete color system documentation
- Typography scale and patterns
- Component specifications
- Animation guidelines
- Accessibility standards
- Dark mode implementation
- Best practices and patterns

---

## Contributing

When updating these guidelines:

1. **Document changes** in the Changelog section
2. **Update version number** following semantic versioning
3. **Provide examples** for new patterns
4. **Test in both themes** (light and dark)
5. **Verify accessibility** with contrast checkers
6. **Update affected components** to match guidelines

---

**Maintained by:** AIMadeThis Design Team
**Questions?** Open an issue in the repository or contact the design team.
