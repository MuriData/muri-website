# MuriData Component Specification

## Architecture

```
src/
├── styles/
│   ├── tokens.css          # All design tokens (~50 CSS custom properties)
│   └── reset.css           # Box-sizing, margin reset, body styles
├── index.css               # Thin orchestrator: @import tokens + reset
├── App.css                 # Layout grid (.main-wrapper)
├── App.jsx                 # Composition root
└── components/
    ├── index.js            # Barrel export
    ├── Panel/              # Primitive
    ├── Button/             # Primitive
    ├── Badge/              # Primitive
    ├── BrandMark/          # Primitive
    ├── Divider/            # Primitive
    ├── ArrowIcon/          # Primitive (SVG, no CSS)
    ├── FeatureCard/        # Composite
    ├── Header/             # Section
    ├── Hero/               # Section
    ├── Features/           # Section
    ├── Technical/          # Section
    ├── StatPanel/          # Section
    └── Footer/             # Section
```

**Import pattern:** Every component self-imports its own CSS. Consumers import from the barrel `components/index.js`.

---

## Primitives

### Panel

Reusable card container. Replaces duplicated `.panel` + `.stat-panel` base styles.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'surface' \| 'teal' \| 'hero' \| 'glass'` | `'surface'` | Visual style |
| `hover` | `boolean` | `true` | Enables lift + shadow transition on hover |
| `className` | `string` | `''` | Additional CSS classes |

**Variant details:**

| Variant | Background | Border | Extra |
|---|---|---|---|
| `surface` | White | `--border-card` | Default card appearance |
| `teal` | `--color-bg-teal` | `--border-glass` | Accent panels (StatPanel) |
| `hero` | Teal→Mint gradient | `--border-hero` (4px) | `min-height: 600px`, `justify-content: space-between` |
| `glass` | White 60% + backdrop blur | `--border-glass-bright` | Glassmorphism (Navbar) |

### Button

Extracts CTA and navigation link styles into a single component.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'ghost'` | `'primary'` | Visual style |
| `as` | `'button' \| 'a'` | `'button'` | Rendered HTML element |

**Variant details:**

| Variant | Background | Shape | Hover |
|---|---|---|---|
| `primary` | `--color-bg-teal` | Pill (`radius-pill`) | Darker teal, `scale(1.05)`, brighter shadow |
| `ghost` | Transparent | Rounded (`radius-badge`) | White 50% bg, teal text |

### Badge

Inline label / value markers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'label' \| 'value'` | `'label'` | Visual style |

| Variant | Style | Usage |
|---|---|---|
| `label` | Uppercase, wider tracking, teal text, bold | Feature card category labels |
| `value` | Canvas bg pill, teal text, semibold | Technical spec values |

### BrandMark

Two-bar logo mark. Renders two horizontal bars (18px + 12px wide).

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `undefined` | Overrides bar `backgroundColor`. Falls back to `currentColor` (teal) |

### Divider

Horizontal rule element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tight` | `boolean` | `false` | Reduces vertical margin from `--space-md` to `--space-sm` |
| `variant` | `'default' \| 'subtle' \| 'dark'` | `undefined` | Color/opacity override |

| Variant | Color | Opacity | Usage |
|---|---|---|---|
| (default) | `--color-bg-teal` | `0.15` | Standard divider |
| `subtle` | `--color-text-primary` | `0.1` | Hero section |
| `dark` | `--color-text-primary` | `0.15` | StatPanel (on teal bg) |

### ArrowIcon

Northeast arrow SVG. No CSS file — pure inline SVG.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | `''` | CSS class for sizing/color |

---

## Composites

### FeatureCard

Standalone card component (promoted from inline function in Features).

| Prop | Type | Description |
|---|---|---|
| `label` | `string` | Category label (e.g. "01 — Core") |
| `description` | `string` | Card body text |
| `heading` | `string` | Card title |
| `variant` | `'light' \| 'dark' \| 'image-bg'` | Visual variant |

**Internals:** Uses `Badge(label)` for the category marker, `Divider` between header and content.

| Variant | Background | Text | Border |
|---|---|---|---|
| `light` | White | Primary | `--border-card` |
| `dark` | `--color-bg-deep` | Inverse | None |
| `image-bg` | Radial gradient (white → canvas) | Primary | `--border-card-mint` |

Hover: `translateY(--lift-md)` + `--shadow-hover` via `--transition-smooth`.

---

## Sections

### Header

Glassmorphism navigation bar.

- Uses `Panel(glass, hover=false)` as container
- Renders `BrandMark` + logo text on left, `Button(ghost)` links + `Button(primary)` CTA on right
- **Mobile (≤768px):** Collapses to hamburger menu. Three-bar toggle animates to X on open. Nav links slide down with `max-height` + `opacity` transition

### Hero

Full-width gradient panel with topographic SVG decoration.

- Uses `Panel(hero)` as container
- Contains `BrandMark`, `Divider(subtle)`, headline (`--text-display`), lead paragraph, `ArrowIcon`
- SVG topo lines at 40% opacity with white stroke + drop-shadow

### Features

Three-column responsive grid of `FeatureCard` components.

- Grid: `repeat(auto-fit, minmax(min(300px, 100%), 1fr))` — safe for narrow viewports
- Spans full grid width (`grid-column: 1 / -1`)

### Technical

Specification list panel.

- Uses `Panel(surface)` with `--border-card` override
- Rows: key (bold, `--text-lg`) + `Badge(value)` separated by `--border-dashed`
- Desktop: spans 8 of 12 grid columns

### StatPanel

Single-stat accent card.

- Uses `Panel(teal)` with `justify-content: space-between`
- Decorative `::before` white circle blob (300x300px, top-right)
- `Divider(dark, tight)` between meta and number
- Stat number uses `--text-display-sm` (responsive clamp)
- Desktop: spans 4 of 12 grid columns

### Footer

Full-width dark footer with navigation and legal links.

- Background: `--color-bg-deep`, rounded `--radius-lg`
- Top section: brand column (logo, tagline, social icons) + 4 nav columns (Protocol, Developers, Community, Resources)
- Nav titles: teal uppercase badges; links: white 60% → white on hover
- Social icons: 36x36px hit targets, teal glow on hover
- Bottom bar: copyright + legal links separated by `Divider` (white 8% opacity)
- **Mobile (≤768px):** Brand stacks above 2x2 nav grid, legal links wrap vertically

---

## Layout Grid

Defined in `App.css` on `.main-wrapper`:

| Viewport | Columns | Behaviour |
|---|---|---|
| `< 1024px` | `1fr` | Single column, all items stack |
| `≥ 1024px` | `repeat(12, 1fr)` | 12-column grid. Header/Hero/Features/Footer span `1 / -1`. Technical spans 8, StatPanel spans 4 |

Grid gap: `--space-md` (32px desktop, 20px mobile).

---

## Body Background

Three fixed radial gradients over `--color-bg-canvas`:
1. White at 10%/20% position (20% spread)
2. White at 90%/10% position (15% spread)
3. White 50% opacity at center (50% spread)
