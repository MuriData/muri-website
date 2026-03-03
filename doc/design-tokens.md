# MuriData Design Tokens

All values live in `src/styles/tokens.css` as CSS custom properties on `:root`.

---

## Colors

### Backgrounds

| Token | Value | Usage |
|---|---|---|
| `--color-bg-canvas` | `#e8fafb` | Page background (pale aqua) |
| `--color-bg-surface` | `#ffffff` | Card / panel backgrounds |
| `--color-bg-mint` | `#b2f2f4` | Accent borders, gradient endpoint |
| `--color-bg-teal` | `#29d7dc` | Primary brand color, CTA fills, StatPanel bg |
| `--color-bg-teal-hover` | `#1cc8cd` | CTA hover state |
| `--color-bg-deep` | `#0a2f30` | Dark card variant, footer background |

### Text

| Token | Value | Usage |
|---|---|---|
| `--color-text-primary` | `#0d3b3c` | Headings, body text |
| `--color-text-secondary` | `#4a7a7b` | Muted descriptive text |
| `--color-text-inverse` | `#ffffff` | Text on dark / teal surfaces |
| `--color-text-on-teal` | `#0d3b3c` | StatPanel numbers & labels |

### Overlays & Glows

| Token | Value | Usage |
|---|---|---|
| `--color-overlay-white-30` | `rgba(255,255,255,0.3)` | Decorative blobs, muted legal text |
| `--color-overlay-white-50` | `rgba(255,255,255,0.5)` | Ghost button hover, body radial |
| `--color-overlay-white-60` | `rgba(255,255,255,0.6)` | Glass panel bg, footer link text |
| `--color-overlay-white-70` | `rgba(255,255,255,0.7)` | Dark card description text |
| `--color-overlay-white-80` | `rgba(255,255,255,0.8)` | Glass panel border |
| `--color-glow-teal-15` | `rgba(41,215,220,0.15)` | Navbar shadow, dark card badge bg |
| `--color-glow-teal-40` | `rgba(41,215,220,0.4)` | CTA shadow |
| `--color-glow-teal-60` | `rgba(41,215,220,0.6)` | CTA hover shadow |

---

## Typography

**Font family:** `'Quicksand', 'Nunito', sans-serif` (`--font-main`)

### Sizes

| Token | Value | Usage |
|---|---|---|
| `--text-xs` | `0.9rem` | Labels, badges, footer links |
| `--text-sm` | `0.95rem` | Stat meta text |
| `--text-base` | `1rem` | Body text, button labels |
| `--text-md` | `1.1rem` | Panel headers, badge values |
| `--text-lg` | `1.3rem` | Tech spec keys |
| `--text-xl` | `1.4rem` | Nav logo |
| `--text-2xl` | `1.6rem` | Lead paragraph |
| `--text-3xl` | `2.2rem` | Feature card headings |
| `--text-display-sm` | `clamp(5rem, 10vw, 8rem)` | 99.9% stat number |
| `--text-display` | `clamp(3rem, 6vw, 5.5rem)` | Hero headline |

### Weights

| Token | Value | Usage |
|---|---|---|
| `--weight-regular` | `400` | — |
| `--weight-medium` | `500` | Lead paragraph |
| `--weight-semibold` | `600` | Nav links, badge values, stat meta |
| `--weight-bold` | `700` | Headings, CTA, panel headers |
| `--weight-extrabold` | `800` | Nav logo |

### Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `--tracking-tight` | `-0.02em` | Display text, huge-number |
| `--tracking-snug` | `-0.01em` | Nav logo, feature headings |
| `--tracking-normal` | `0` | Lead paragraph |
| `--tracking-wide` | `0.02em` | Panel headers |
| `--tracking-wider` | `0.05em` | Uppercase labels (badges, stat meta) |

---

## Spacing

| Token | Value (desktop) | Value (mobile ≤768px) | Usage |
|---|---|---|---|
| `--space-xs` | `8px` | `8px` | Navbar margin, tight gaps |
| `--space-sm` | `16px` | `16px` | General small gaps, nav padding |
| `--space-md` | `32px` | `20px` | Section gaps, card padding, divider margins |
| `--space-lg` | `64px` | `40px` | Panel header bottom margin, footer column gap |
| `--space-xl` | `96px` | `96px` | Reserved (unused currently) |
| `--space-card` | `48px` | `32px` | Panel internal padding |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-lg` | `40px` | Panels, cards, footer |
| `--radius-md` | `24px` | Mobile navbar |
| `--radius-sm` | `12px` | Badge values, social icons |
| `--radius-pill` | `100px` | Navbar, CTA button |
| `--radius-badge` | `20px` | Ghost button, dark card badge |

---

## Borders

| Token | Value | Usage |
|---|---|---|
| `--border-glass` | `1px solid white/60%` | Teal panel, default panel border |
| `--border-glass-bright` | `1px solid white/80%` | Glass (navbar) panel |
| `--border-card` | `2px solid white` | Surface panel, feature cards |
| `--border-card-mint` | `2px solid mint` | Image-bg feature card |
| `--border-hero` | `4px solid white` | Hero panel |
| `--border-dashed` | `2px dashed mint` | Technical spec row dividers |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-soft` | `0 10px 40px -10px teal/20%` | Panel resting state |
| `--shadow-hover` | `0 20px 50px -10px teal/30%` | Panel hover state |
| `--shadow-navbar` | `0 4px 20px teal/15%` | Navbar |
| `--shadow-cta` | `0 4px 12px teal/40%` | CTA button resting |
| `--shadow-cta-hover` | `0 6px 16px teal/60%` | CTA button hover |

---

## Transitions

| Token | Value | Usage |
|---|---|---|
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Spring easing curve |
| `--transition-bounce` | `all 0.4s bounce` | Panel hover lift |
| `--transition-smooth` | `all 0.3s ease` | Feature card hover |
| `--transition-fast` | `all 0.2s bounce` | Buttons, links, hamburger |

---

## Transforms

| Token | Value | Usage |
|---|---|---|
| `--lift-sm` | `-4px` | Panel hover translateY |
| `--lift-md` | `-8px` | Feature card hover translateY |

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≤ 768px` | Mobile: reduced spacing, single-column layouts, hamburger nav, 2-column footer nav |
| `≥ 1024px` | Desktop: 12-column grid, Technical spans 8 cols, StatPanel spans 4 cols |
