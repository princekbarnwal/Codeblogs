---
name: Atelier Editorial
colors:
  surface: '#faf9f6'
  surface-dim: '#dadad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#eeeeea'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ed'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#006c48'
  on-secondary: '#ffffff'
  secondary-container: '#92f7c3'
  on-secondary-container: '#00734d'
  tertiary: '#152b1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a4131'
  on-tertiary-container: '#93ad98'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#92f7c3'
  secondary-fixed-dim: '#75daa8'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#cee9d3'
  tertiary-fixed-dim: '#b3cdb7'
  on-tertiary-fixed: '#092012'
  on-tertiary-fixed-variant: '#354c3b'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: '500'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 38px
    fontWeight: '500'
    lineHeight: 46px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-snippet:
    fontFamily: JetBrains Mono
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system manifests an intersection of classical print journalism and meticulous software engineering. Designed for developers, architects, and technical essayists, it balances intellectual authority with understated digital craft. The emotional response is calm, contemplative, and intentional—deliberately avoiding high-velocity SaaS clichés, hyper-saturated accents, and synthetic visual effects.

The aesthetic fuses **Editorial Minimalism** with subtle tactile material cues. It honors the spatial dignity of broadsheet layouts while delivering the precision required for dense code blocks, technical schemata, and extended long-form prose. The UI recedes gracefully, functioning as a warm, paper-inspired canvas that prioritizes typographic rhythm and focused readability.

## Colors
The palette evokes archival paper, rich vegetable inks, and botanical forest undertones. Rather than sterile pure white and pitch black, it relies on warm, organic neutrals to reduce optical fatigue during extended reading sessions.

- **Primary (`#1B4332`)**: Deep Forest Green. Serves as the primary brand signature, used for key actions, interactive emphasis, active states, and focal headlines. A brighter variant (`#2D6A4F`) handles interactive hover and focus rings.
- **Secondary (`#52B788`)**: Balanced Verdant Sage. Utilized for secondary highlights, status indicators, and graphic sub-elements.
- **Tertiary (`#D8F3DC`)**: Soft Tinted Sage. Applied to selected badge backgrounds, subtle callout fills, inline code tags, and low-contrast surface highlights.
- **Neutral (`#1E201E`)**: Deep Charcoal ink for primary body copy and high-emphasis display titles. The secondary text scale leverages `#3C3F3D` for muted contrast, while borders strictly use archival tone `#E6E2DA`.
- **Surfaces**: Primary canvas background is warm linen `#FBF9F5`, with secondary elevated surfaces and cards utilizing tinted parchment `#F4EFEB`.

## Typography
Typographic discipline is central to this design system. Titles and editorial headers adopt **Newsreader**, an authoritative transitional serif with optical weight sizing, providing warmth, literary prestige, and human cadence.

All programmatic content, UI controls, navigation, and continuous article bodies utilize **Plus Jakarta Sans**, offering optical clarity, tall x-height, and clean geometric rendering at small to medium sizes. Long-form article text relies on generous line heights (`30px` on `18px` base) to allow the eye to glide across comfortable paragraph measures (ideal range: 60–72 characters per line). Monospaced code blocks and inline syntax snippets implement **JetBrains Mono** to guarantee legibility and typographic distinction.

## Layout & Spacing
The layout adheres strictly to an 8px base rhythm, prioritizing spatial serenity and asymmetrical, editorial pacing over hyper-compressed app layouts.

- **Grid Architecture**: A 12-column responsive layout with a maximum content canvas of 1280px. Long-form editorial passages collapse down to a disciplined 760px single-column reading lane flanked by dynamic margin annotations and technical sidenotes.
- **Breakpoints**: Mobile (<640px) uses single-column flow with `margin-mobile: 1.25rem`. Tablet (640px–1024px) activates an 8-column layout with `gutter: 1.5rem`. Desktop (>1024px) resolves to the full 12-column structure with expansive vertical whitespace between editorial passages (`space-xl` to double `space-xl`).
- **Pacing**: Generous section margins give technical topics breathing room. Dense code blocks and interactive playgrounds are punctuated by ample white margin boundaries to prevent cognitive overload.

## Elevation & Depth
Elevation eschews glossy blurs, deep drop shadows, and high-frequency light effects. Instead, depth is articulated through **tonal layering** and **matte paper shadows**:

1. **Surface Tiers**: Base views sit on `#FBF9F5`. Elevated panels, cards, and inset callouts live on `#F4EFEB`. Overlays and flyouts rest on `#FFFFFF`.
2. **Matte Paper Shadows**: To mimic sheets of archival bond paper resting on a wooden desk, shadows use ultra-low blur radii with faint sepia tinting:
   - *Level 1 (Cards, Code Boxes)*: `0 1px 2px rgba(30, 32, 30, 0.04), 0 2px 6px rgba(30, 32, 30, 0.03)`
   - *Level 2 (Popovers, Dropdowns)*: `0 4px 12px rgba(30, 32, 30, 0.06), 0 1px 3px rgba(30, 32, 30, 0.04)`
   - *Level 3 (Modal Dialogs)*: `0 12px 32px rgba(30, 32, 30, 0.08), 0 2px 6px rgba(30, 32, 30, 0.04)`
3. **Borders as Structure**: All containers, dividers, and framing elements use a hairline 1px solid rule in `#E6E2DA`, grounding elements visually without relying on heavy shading.

## Shapes
The shape language bridges classic bookbinding geometry with refined digital interaction. Containers, cards, and modal dialogs use rounded geometry (`12px` to `16px`, scaling to `rounded-xl` and `rounded-2xl`) to evoke smoothed edges of leather bound journals and fine stationery.

Buttons and badges employ smooth curvature, avoiding harsh stark rectangles without dissolving into playful capsule blobs. Interactive focus states feature a distinct, offset double-ring with zero border collapse, maintaining crisp spatial edges.

## Components

### Buttons
- **Primary**: Solid Deep Forest Green (`#1B4332`) background, crisp off-white text (`#FBF9F5`), 12px border radius, 10px vertical and 20px horizontal padding. Hover shifts smoothly to `#2D6A4F`. Focus presents a 2px offset ring in `#52B788`.
- **Secondary / Outline**: 1px border in `#E6E2DA`, background transparent, text in `#1E201E`. Hover triggers a subtle background transition to `#F4EFEB` with border darkening to `#1B4332`.
- **Tertiary / Ghost**: Zero border, text in `#1B4332`, gentle underline accent that expands on hover.

### Chips & Metadata Tags
- Rendered in `label-md`, using `4px` vertical and `10px` horizontal padding with an 8px border-radius.
- Default style: `#D8F3DC` background with `#1B4332` text for technical category tags. Muted editorial indicators use `#F4EFEB` background with `#3C3F3D` neutral text and a `#E6E2DA` border.

### Input Fields & Controls
- **Inputs**: Solid `#FFFFFF` or `#F4EFEB` base framed by a 1px border in `#E6E2DA`. Text renders in `body-md` deep charcoal. On active focus, the border shifts to `#1B4332` with a 3px soft halo in `#D8F3DC`.
- **Checkboxes & Radios**: Custom square (checkbox: 4px radius) and circle (radio) marks in 18px size. Unchecked features a 1.5px `#E6E2DA` border on cream background; checked transitions to solid `#1B4332` with an ivory check glyph.

### Cards & Editorial Modules
- Built on `#F4EFEB` or framed `#FBF9F5` with a 1px `#E6E2DA` boundary and Level 1 matte paper shadow.
- Inner padding follows a strict `space-lg` (24px) rhythm. Card titles employ `Newsreader` (`headline-sm` or `headline-md`), while metadata manifests in clean `Plus Jakarta Sans` (`label-md`).

### Specialized Components
- **Code Blocks**: Formatted with `#1E201E` charcoal background or tinted parchment `#F4EFEB` inset with `#E6E2DA` border. Language chip affixed to top-right corner in `label-md`. Syntax highlighting calibrated around muted botanical hues (forest, sage, warm ochre).
- **Pull Quotes & Callouts**: Left-bordered with a 3px solid vertical bar in `#1B4332`, set in `Newsreader` italic `headline-md`, padded generously by `space-lg`.
- **Footnotes & Margin Sidenotes**: Positioned in adjacent desktop gutters using `body-sm` neutral copy (`#3C3F3D`), anchored by numerical super-scripts in `#1B4332`.