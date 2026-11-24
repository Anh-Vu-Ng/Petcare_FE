---
name: Petcare — Stoneware & Collar Tag
description: Calm stoneware surfaces, deep glazed-slate framing, and terracotta collar-tag controls for Vietnamese pet consultation, booking, and check-in.
colors:
  collar-terracotta: "#B84A2D"
  collar-terracotta-hover: "#9E3D23"
  collar-terracotta-soft: "#FBF0EC"
  glazed-slate: "#1E3A4C"
  glazed-slate-deep: "#162C3A"
  glazed-slate-border: "#2C4D61"
  slate-mist: "#B7C8D2"
  botanical-pine: "#1F6E4A"
  ochre-amber: "#9A5B13"
  kiln-red: "#B43228"
  warm-stoneware: "#F4F2ED"
  ceramic-cream: "#FAF9F6"
  pure-porcelain: "#FFFFFF"
  stoneware-wash: "#EFECE4"
  espresso-ink: "#231F1D"
  umber-ink: "#564F49"
  pebble-ink: "#756C63"
  ceramic-rim: "#D8D2C6"
  clay-rim: "#C8C0B2"
  strong-clay-rim: "#B8AFA0"
typography:
  display:
    fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.02em"
  headline:
    fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  title:
    fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0em"
  body:
    fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.02em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0em"
    fontFeature: "tnum"
rounded:
  marker: "2px"
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "12px"
  card: "14px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.collar-terracotta}"
    textColor: "{colors.pure-porcelain}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.collar-terracotta-hover}"
  button-secondary:
    backgroundColor: "{colors.glazed-slate}"
    textColor: "{colors.ceramic-cream}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.glazed-slate-deep}"
  button-outline:
    backgroundColor: "{colors.ceramic-cream}"
    textColor: "{colors.espresso-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.stoneware-wash}"
  collar-tag:
    backgroundColor: "{colors.pure-porcelain}"
    textColor: "{colors.espresso-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  collar-tag-active-species:
    backgroundColor: "{colors.glazed-slate}"
    textColor: "{colors.ceramic-cream}"
  collar-tag-active-weight:
    backgroundColor: "{colors.collar-terracotta}"
    textColor: "{colors.pure-porcelain}"
  input-field:
    backgroundColor: "{colors.pure-porcelain}"
    textColor: "{colors.espresso-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  card-surface:
    backgroundColor: "{colors.ceramic-cream}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.card}"
    padding: "20px 24px"
  nav-tab:
    backgroundColor: "{colors.glazed-slate-deep}"
    textColor: "{colors.slate-mist}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 16px"
    height: "36px"
  nav-tab-active:
    backgroundColor: "{colors.collar-terracotta}"
    textColor: "{colors.pure-porcelain}"
  service-tile:
    backgroundColor: "{colors.pure-porcelain}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  ledger-header:
    backgroundColor: "{colors.glazed-slate}"
    textColor: "{colors.ceramic-cream}"
    padding: "16px 20px"
---

# Design System: Petcare — Stoneware & Collar Tag

<!-- impeccable:design-map -->
Name: Petcare — Stoneware & Collar Tag
Colors: primary: collar-terracotta #B84A2D; secondary: glazed-slate #1E3A4C; tertiary: botanical-pine #1F6E4A; neutral: warm-stoneware #F4F2ED; primary: collar-terracotta-hover #9E3D23 (+15 more in the sidecar)
Fonts: Be Vietnam Pro (display, headline, title, body, label); JetBrains Mono (mono)
Spacing: xs 4px, sm 8px, md 12px, lg 16px, xl 20px, 2xl 24px, section 32px
Radius: marker 2px, xs 6px, sm 8px, md 10px, lg 12px, card 14px, pill 9999px
North Star: "Stoneware & Collar Tag"
Rules:
- The Restraint on Terracotta Rule. Reserve Collar Terracotta (`#B84A2D`) strictly for primary submission CTAs, active weight collar tags, estimated price totals, and Spa corridor markers—never flood entire cards or headers with terracotta.
- The Corridor Marker Rule. Distinguish the three care domains (Spa `#B84A2D`, Khám bệnh `#1F6E4A`, Lưu trú 24h `#1E3A4C`) exclusively via compact `10px × 10px` square markers (`rounded-[2px]`) or `6px` circular tag dots (`rounded-full`) paired with neutral `#FFFFFF` / `...
- The Ceramic-Over-Stoneware Rule. Establish spatial hierarchy through tonal steps (`#F4F2ED` -> `#FAF9F6` -> `#FFFFFF`) bounded by 1px borders (`#D8D2C6`) before reaching for drop shadows.
- The Tabular Ledger Rule. Every currency amount, weight preset, time slot, date string, and booking code MUST pair `JetBrains Mono` with `font-variant-numeric: tabular-nums` so dynamic updates never jitter horizontal layout.
- (+4 more)
Elevation:
- Sticky Ledger Float: 0 6px 20px -8px rgba(35, 31, 29, 0.12)
- Confirmation Modal Lift: 0 20px 50px -15px rgba(35, 31, 29, 0.35)
Don't:
- Don't introduce generic neon-teal gradients, pastel rainbow badges, or glowing AI borders that break the calm mineral stoneware palette.
- Don't stack drop shadows on standard cards, service tiles, inputs, or chat bubbles; stay flat-by-default with 1px ceramic rims.
- Don't use Terracotta (`#B84A2D`) as a full-width header background or container fill (keep dark structural bars in Glazed Slate `#1E3A4C`).
- Don't render Vietnamese UI text in micro sizes below `11px` or drop `tabular-nums` from dynamic numeric ledgers.
- Don't replace the bespoke collar-tag emblem or `StatusPuppy` SVG with generic icon-font glyphs or ungrounded stock photography.
Full: .impeccable/design-full.md (read a section when you need its detail)
