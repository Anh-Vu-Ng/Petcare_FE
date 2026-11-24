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

## Overview

**Creative North Star: "Stoneware & Collar Tag"**

Petcare models a modern Vietnamese veterinary clinic and spa reception desk on everyday pet-home stoneware and engraved collar hardware. Warm stoneware grounds, matte ceramic panels, and crisp 1px clay rims establish clinical order without sterile hospital coldness, while deep glazed-slate headers and terracotta collar-tag accents anchor every decision point across AI consultation (*Tư Vấn AI*), live-priced appointment booking (*Đặt Lịch Hẹn*), and self-service ticket lookup (*Tra Cứu*).

The system favors density with breathing room: pet owners see transparent weight-tiered prices in aligned tabular numerals, clear color-coded service corridors (Spa, Medical, Boarding), and a calm workspace free of neon-teal healthcare tropes, floating cartoon sticker patterns, RGB AI glows, and heavy drop shadows. Motion stays brisk and respectful (`160ms–200ms` transitions, `MotionConfig reducedMotion="user"`, and `@media (prefers-reduced-motion: reduce)` fallbacks), while technical RAG metadata remains tucked behind an optional collapsed inspector toggle.

**Key Characteristics:**
- Tactile four-step warm ceramic surface ladder (`#F4F2ED` ground, `#FAF9F6` card, `#FFFFFF` interactive inset, `#EFECE4` recessed tray) bounded by 1px stone borders (`#D8D2C6`, `#C8C0B2`, `#B8AFA0`).
- Deep glazed-slate (`#1E3A4C` / `#162C3A`) reserved for structural navigation bars, ticket headers, step index badges, and selected control states.
- Terracotta collar accent (`#B84A2D` / `#9E3D23`) reserved for primary conversion CTAs, active weight tags, range thumbs, and estimated price totals.
- Semantic 3-corridor color coding (`#B84A2D` Spa, `#1F6E4A` Veterinary Medical, `#1E3A4C` 24h Boarding) rendered as compact `10px × 10px` square markers and dot badges.
- Native Vietnamese diacritic clarity with `Be Vietnam Pro` paired with tabular `JetBrains Mono` for VND currency, weight tiers, time slots, and `BK-` reservation codes.

## Colors

A warm mineral neutral foundation anchors crisp espresso ink, paired with a disciplined glazed-slate structural shell, terracotta collar actions, and restrained semantic accents.

### Primary
- **Collar Terracotta** (`#B84A2D`): Primary conversion actions (booking submission, chat send button, active navigation tab, booking quick-jump CTAs), active weight collar-tag pills, range slider accent, final estimated total figure, prose blockquote rules, and the **Spa** service corridor marker.
- **Deep Terracotta** (`#9E3D23`): Hover press state for terracotta buttons and high-contrast text inside soft Spa category badges.
- **Terracotta Blush** (`#FBF0EC`): Soft surface wash for Spa category chips and the top (`>=11` day) boarding discount tier tile.

### Secondary
- **Glazed Slate** (`#1E3A4C`): Sticky top workspace header (`64px`), ticket and price-ledger headers, numbered step badges (`01–03`), user chat bubbles, selected service tiles, active species collar tags, active time slots, secondary action buttons, prose headings/inline code, focus-visible outlines, and the **Boarding (24h)** corridor marker.
- **Deep Glazed Slate** (`#162C3A`): Recessed slate wells inside dark headers (segmented tab rail container, opening-hours pill, ticket header icon frame, modal close button) and secondary button hover fill.
- **Slate Etch** (`#2C4D61`): 1px internal hairline framing on `#162C3A` wells and background fill for `COMPLETED` status chips.
- **Slate Mist** (`#B7C8D2`): Subdued caption and metadata ink on `#1E3A4C` surfaces plus border accent for `TOOL` intent and afternoon shift chips.

### Tertiary
- **Botanical Pine** (`#1F6E4A`): **Veterinary Medical** corridor marker, doctor-quote pricing labels, valid phone confirmation, `CONFIRMED` status chip, free Spa gift banners, and completed order timeline nodes.
- **Ochre Amber** (`#9A5B13`): `PENDING` booking status chip, morning shift pill (`08:00–12:00`), boarding discount milestones (`4–10` days), price disclaimer callout, `KNOWLEDGE` RAG intent chip, and empty-search alert icon.
- **Kiln Red** (`#B43228`): Required field asterisks, Zod validation borders and error text, `CANCELLED` booking badges/alerts, and application error boundary icon frame.

### Neutral
- **Warm Stoneware** (`#F4F2ED`): Root viewport background (`html`, `body`), message scroll-well tint, and primary light ink inside dark glazed-slate header bars.
- **Ceramic Cream** (`#FAF9F6`): Outer container and card surface across chat desk, pet-profile rail, booking step cards, sticky ledger body, confirmation modal, and lookup cards.
- **Pure Porcelain** (`#FFFFFF`): Interactive inset tiles (topic cards, service cards, form inputs, composer box, assistant bubbles, itemized price rows, ticket info cells, QR frame).
- **Stoneware Wash** (`#EFECE4`): Recessed panel headers, weight-slider tray, ticket booking-code callout, timeline track tray, disabled controls, prose code/table headers, and stoneware shimmer base.
- **Espresso Ink** (`#231F1D`): Primary body copy, headings inside cards, field values, and Shiba companion linework.
- **Umber Ink** (`#564F49`): Secondary descriptive subtitles, form helper copy, ledger field labels, and muted timeline descriptions.
- **Pebble Ink** (`#756C63`): Input placeholders, micro-captions, disabled timeline step indices, timestamps, and medical disclaimers.
- **Ceramic Rim** (`#D8D2C6`): Default 1px structural card border, section header rule, range track fill, and timeline connector rail.
- **Clay Rim** (`#C8C0B2`): Interactive control borders (unselected collar tags, form inputs, time slots, outline buttons), QR frame border, and custom scrollbar thumb.
- **Strong Clay Rim** (`#B8AFA0`): High-definition control rims (`Button` outline, `Làm mới` reset button, composer shell, copy-code button) and dashed horizontal ledger tear-lines.

### Named Rules
**The Restraint on Terracotta Rule.** Reserve Collar Terracotta (`#B84A2D`) strictly for primary submission CTAs, active weight collar tags, estimated price totals, and Spa corridor markers—never flood entire cards or headers with terracotta.

**The Corridor Marker Rule.** Distinguish the three care domains (**Spa** `#B84A2D`, **Khám bệnh** `#1F6E4A`, **Lưu trú 24h** `#1E3A4C`) exclusively via compact `10px × 10px` square markers (`rounded-[2px]`) or `6px` circular tag dots (`rounded-full`) paired with neutral `#FFFFFF` / `#EFECE4` card fills.

**The Ceramic-Over-Stoneware Rule.** Establish spatial hierarchy through tonal steps (`#F4F2ED` -> `#FAF9F6` -> `#FFFFFF`) bounded by 1px borders (`#D8D2C6`) before reaching for drop shadows.

## Typography

**Display Font:** Be Vietnam Pro (with `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
**Body Font:** Be Vietnam Pro (with `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
**Label/Mono Font:** JetBrains Mono (with `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`)

**Character:** `Be Vietnam Pro` provides clean geometric warmth and balanced Vietnamese diacritics across multi-tone labels, paired with `JetBrains Mono` in tabular figures (`font-variant-numeric: tabular-nums`) so every price, weight tier, slot hour, and `BK-` code locks into vertical alignment.

### Hierarchy
- **Display** (`700`, `1.75rem` / `28px` on chat hero & `26px` on booking title, `1.375` line-height, `-0.02em` tracking): Workspace welcomes and top-of-flow page headers in `#1E3A4C`.
- **Headline** (`700`, `1.25rem` / `20px`, `1.35` line-height, `-0.02em` tracking): Lookup hero title, modal confirmation heading, and error boundary heading.
- **Title** (`700`, `1rem`–`1.125rem` / `16px–18px`, `1.25` line-height): Card headers (`Bàn Tư Vấn Petcare`, `01–03` step headings, `Phiếu Dịch Vụ Tạm Tính`).
- **Body** (`400`–`500`, `0.875rem`–`0.9375rem` / `14px–15px`, `1.625`–`1.65` line-height, max `65ch–68ch` line measure): Form field text, descriptions, and Markdown chat responses.
- **Label** (`600`, `0.6875rem`–`0.75rem` / `11px–12px`, `1.33` line-height, `0.02em`–`0.04em` tracking): Form labels, collar-tag pills, status badges, corridor legends, and micro-captions.
- **Mono / Tabular** (`600`–`700`, `0.75rem`–`1.5rem` / `12px–24px`, `1.25` line-height, `tabular-nums`): VND currency figures (scaling up to `24px` / `text-2xl` on the final ledger total), kg presets, appointment time grid cells, timestamps, RAG timings, and `BK-` reservation codes.

### Named Rules
**The Tabular Ledger Rule.** Every currency amount, weight preset, time slot, date string, and booking code MUST pair `JetBrains Mono` with `font-variant-numeric: tabular-nums` so dynamic updates never jitter horizontal layout.

**The Vietnamese Diacritic Clarity Rule.** Never set uppercase micro-labels smaller than `11px` on primary interactive controls or navigation tabs, preserving crisp tone-mark legibility across `Be Vietnam Pro`.

## Layout

Petcare runs inside a single continuous centered container (`max-width: 1280px` / `max-w-7xl`, horizontal gutters `16px` on mobile and `24px` at `>=640px`) anchored beneath a sticky `64px` (`min-h-16`) glazed-slate workspace bar (`z-40`).

- **AI Consultation View (`Tư Vấn AI`):** Desktop (`>=1024px` / `lg`) pairs the primary consultation desk (`1fr`, viewport-locked `calc(100vh - 124px)`, `min-height: 520px`) beside a `340px` Collar-Tag Pet Profile & Quick-Pricing rail with a `20px` (`gap-5`) gutter. Below `1024px`, the sidebar collapses into an inline quick-booking bar inside the desk welcome screen (`calc(100dvh - 140px)`). Empty-state topic prompts form a 2-column grid (`sm:grid-cols-2`, `gap-2.5 sm:gap-3`) inside a `max-w-2xl` center frame; active conversations constrain bubbles to `max-w-3xl`.
- **Appointment Booking View (`Đặt Lịch Hẹn`):** Desktop (`>=1024px`) divides into a `1fr` three-step form stack (`01` Customer & Pet, `02` Service Grid, `03` Date & Slots, separated by `20px`) and a `380px` sticky `LivePriceSummaryCard` (`lg:top-[84px]`, `gap-6` = `24px`). Service options arrange in `sm:grid-cols-2` (`gap-3`); appointment time slots arrange in `grid-cols-4 sm:grid-cols-8` (`gap-2`).
- **Booking Lookup View (`Tra Cứu`):** Centered single-column workspace (`max-w-4xl`, `space-y-6`) with `max-w-xl` search bar (`flex-col sm:flex-row`) and 3-column summary grids (`sm:grid-cols-3`) inside reservation cards.
- **Print Isolation (`#printable-ticket`):** `@media print` hides all document chrome (`visibility: hidden`) and expands `#printable-ticket` fixed at `(0, 0)` across `100%` width on `#FFFFFF` with modal shadows and scrims stripped.
- **Spacing Rhythm:** Grounded on a 4px grid (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`), where outer card headers use `12px–16px` vertical padding, card bodies use `20px–24px`, and nested inset tiles use `12px–16px`.

### Named Rules
**The Single-Viewport Desk Rule.** Keep the AI consultation workspace pinned cleanly within the desktop viewport (`calc(100vh - 124px)`) so the header, message feed, composer, and live collar-tag rail stay immediately accessible without page-level scroll fatigue.

## Elevation & Depth

Petcare is **flat-by-default**: 95% of surfaces rely exclusively on tonal stepping (`#F4F2ED` -> `#FAF9F6` -> `#FFFFFF`) and 1px hairline ceramic borders (`#D8D2C6`, `#C8C0B2`) rather than layered drop shadows. Shadows appear solely on two floating/overlay elements:

### Shadow Vocabulary
- **Sticky Ledger Float** (`box-shadow: 0 6px 20px -8px rgba(35, 31, 29, 0.12)`): Applied to `LivePriceSummaryCard` so the sticky price ticket detaches gently from scrolling form cards on desktop.
- **Confirmation Modal Lift** (`box-shadow: 0 20px 50px -15px rgba(35, 31, 29, 0.35)`): Applied to `BookingConfirmationModal` floating over a `rgba(35, 31, 29, 0.6)` scrim (`z-50`), stripped during `@media print`.

### Named Rules
**The Flat-By-Default Rule.** Rest cards, service options, inputs, and chat bubbles flat against `#FAF9F6` or `#FFFFFF` with 1px `#D8D2C6` / `#C8C0B2` borders; reserve elevation shadows strictly for sticky ledgers and modal overlays.

## Shapes

Every silhouette balances warm rounded stoneware with crisp machined edges:

- **Outer Workspace Containers (`14px`):** Consultation desk, pet-profile rail, `01–03` step panels, sticky ledger, confirmation modal, lookup cards, and error boundary card.
- **Inner Trays & Message Containers (`12px`):** Chat bubbles (with an asymmetric `3px` speech tail corner on top-right for user or top-left for assistant), composer shell, `StatusPuppy` banner, weight-slider tray, and boarding discount enclosure.
- **Interactive Controls & Inset Tiles (`10px`):** Standard buttons, form inputs, segmented nav rail outer trough, topic cards, info summary cells, QR frames, and alert banners.
- **Compact Controls & Badges (`8px` / `6px`):** Step index badges (`01–03`), time slot buttons, icon frames, and `Làm mới` button use `8px`; checkboxes, status/intent chips, category badges, and boarding plus/minus steppers use `6px`. *(Note: the built code also uses 1px nested insets at `7px`, `9px`, and `11px` inside parent `10px–14px` containers.)*
- **Collar-Tag Pills (`9999px`):** Species selectors (`Cún cưng`, `Mèo cưng`, `Khác`), weight presets (`3 kg`–`20+ kg`), header opening-hours badge, timeline stations, and loading bars.
- **Corridor Squares (`2px`):** `10px × 10px` solid domain markers (`rounded-sm`) for Spa, Medical, and Boarding.
- **Dashed Ledger Dividers:** `1px dashed` rules (`#B8AFA0` / `#C8C0B2`) separate summary snapshots from itemized totals and QR check-in footers.

### Named Rules
**The Engraved Tag Silhouette Rule.** Render pet profile selectors (species and weight tiers) as full-pill collar tags (`9999px` radius) and functional form inputs/buttons as `10px`-radius machined controls so tactile hardware cues remain distinct from form fields.

## Components

Every component pairs 1px tactile borders with instant `transition-colors` feedback and a `2px` glazed-slate `#1E3A4C` focus-visible ring (`#FAF9F6` on dark slate shells).

### Buttons
Crisp `40px`-tall (`10px` radius) interactive controls with `14px` semibold copy and zero idle elevation (`Button.tsx` and inline action buttons).
- **Shape:** Gently rounded rectangle (`10px` radius; `9px` inside modal/composer footer, `8px` for compact header reset).
- **Primary:** Solid Collar Terracotta (`#B84A2D`) with `#FFFFFF` ink, `10px 16px` (`py-2.5 px-4`) padding; `hover` shifts cleanly to `#9E3D23`.
- **Secondary:** Solid Glazed Slate (`#1E3A4C`) with `#FAF9F6` ink; `hover` deepens to `#162C3A`.
- **Outline / Ghost:** Ceramic Cream (`#FAF9F6`) or `#FFFFFF` surface with `1px solid #B8AFA0` (or `#C8C0B2`) border and `#231F1D` ink; `hover` fills with `#EFECE4`. Ghost buttons omit border until `#EFECE4` hover.
- **Hover / Focus:** `transition-colors`, `focus-visible` `2px` ring in `#1E3A4C` (`ring-offset-2` `#FAF9F6` on `Button.tsx`), `50%` opacity when disabled.

### Chips
Compact pill tags and rectangular status badges communicating pet attributes, corridors, and booking states.
- **Collar Tags (Species & Weight):** Full-pill (`9999px` radius) `1px solid #C8C0B2` chips on `#FFFFFF`; species active state switches to `#1E3A4C` fill with `#FAF9F6` text, while weight active state switches to `#B84A2D` fill with `#FFFFFF` text (`JetBrains Mono`).
- **Status Badges (`BookingLookupTab`):** `7px`-radius (`border` + `12px` semibold) pills using solid semantic tones (`CONFIRMED`: `#1F6E4A`, `PENDING`: `#9A5B13`, `CANCELLED`: `#B43228`, `COMPLETED`: `#2C4D61`).
- **Intent & Category Chips:** `6px`-radius soft tinted pills (`#FBF0EC` / `#EDF7F2` / `#EDF2F7` / `#FDF6E9`) with matching semantic `1px` borders.

### Cards / Containers
Tonal ceramic enclosures layered via 1px mineral rims (`#D8D2C6`) and recessed stoneware header bars (`#EFECE4` or `#1E3A4C`).
- **Corner Style:** `14px` outer radius; `12px` (`#FFFFFF`) for service selection tiles (hovered border `#1E3A4C`/60, selected `ring-1 ring-[#1E3A4C]`).
- **Background:** `#FAF9F6` card body with `#EFECE4` header bar (`ChatBox`), or `#1E3A4C` glazed-slate ticket header (`LivePriceSummaryCard`, `BookingConfirmationModal`, `BookingLookupTab`).
- **Shadow Strategy:** Flat by default; `0 6px 20px -8px rgba(35,31,29,0.12)` exclusively on `LivePriceSummaryCard`.
- **Border:** `1px solid #D8D2C6` (`#C8C0B2` on ledger/lookup ticket frames); `1px solid #142835` under glazed-slate headers.
- **Internal Padding:** `20px–24px` (`p-5 sm:p-6`) for main step cards; `16px` (`p-4`) for service tiles and inner trays.

### Inputs / Fields
Clean porcelain fields anchored inside stoneware panels with explicit error and valid states.
- **Style:** `#FFFFFF` background, `1px solid #C8C0B2` border, `10px` radius, `10px 14px` padding (`pl-10` when prefixed with a `16px` `#756C63` icon). Phone and date inputs use `JetBrains Mono` (`tabular-nums`).
- **Focus:** Shifts border to `#1E3A4C` with a subtle `2px` `#1E3A4C` `15%` alpha focus halo (`focus:ring-2 focus:ring-[#1E3A4C]/15`).
- **Error / Valid / Disabled:** Errors switch border and `12px` helper text to `#B43228`; validated Vietnamese mobile numbers highlight border and inline badge in `#1F6E4A`; unavailable time slots disable to `#EFECE4` fill, `#9E958B` text, and `line-through`.
- **Composer Shell:** `12px`-radius `#FFFFFF` border-`#B8AFA0` tray holding an auto-growing textarea (max `144px`) and a `36px`-tall `#B84A2D` send button.

### Navigation
Sticky `64px`-tall `#1E3A4C` top bar containing the bespoke inline SVG terracotta collar-tag paw emblem, `PETCARE` wordmark (`16px`, `700`, `0.04em` tracking), centered segmented workflow tabs, and desktop opening-hours pill (`08:00–19:00 · CN đến 17:00` with `#3BB273` live status dot).
- **Tab Rail:** `#162C3A` trough (`10px` radius, `1px solid #2C4D61`, `4px` padding) housing equal-flex workflow tabs (`36px` min-height, `7px` radius, `12px–14px` semibold).
- **Active / Hover States:** Active tab switches cleanly to `#B84A2D` with `#FFFFFF` text; inactive tabs carry `#D5E0E6` text and hover to `#FFFFFF` over `#234357`.

### Signature Component: Collar-Tag Profile, Price Ledger & QR Check-In Pass
Three synchronized artifacts connect consultation to check-in without context loss:
- **Collar-Tag Profile Sidebar:** Shares `petType` and `weightKg` state directly into `BookingContainer`, computing live client-side VND estimates across Spa, Vet, and Boarding rows (`3 kg`–`25 kg`).
- **Itemized Price Ledger (`LivePriceSummaryCard`):** Combines a `#1E3A4C` glazed-slate header, `#EFECE4` customer/date snapshot, white `#EAE5DC`-divided line items, `#EDF7F2` free-gift notice (`>=11` days boarding), dashed `#B8AFA0` total rule, and `24px` `#B84A2D` tabular VND total.
- **Digital QR Pass (`#printable-ticket`) & Companion Feedback:** Displays a `#EFECE4` `BK-` reservation tag with one-click copy, 2-column pet/slot tiles, corridor-dotted service chips, and a `PETCARE-CHECKIN:<code>` QR block formatted for clean `@media print` output. Inside consultation, `StatusPuppy` renders a warm `#F2B880`/`#D4793B` line-and-wash Shiba wearing a `#B84A2D` collar and `#1E3A4C` tag (`0.18s` fade-up), while `Chi tiết nguồn RAG` stays collapsed by default.

## Do's and Don'ts

### Do:
- **Do** enforce the four-tier stoneware surface hierarchy (`#F4F2ED` ground -> `#FAF9F6` card -> `#FFFFFF` tile/input -> `#EFECE4` recessed header/tray) separated by 1px `#D8D2C6` / `#C8C0B2` borders.
- **Do** apply `JetBrains Mono` with `tabular-nums` on every price, weight preset, time slot, date badge, and `BK-` booking code.
- **Do** mark Spa (`#B84A2D`), Khám bệnh (`#1F6E4A`), and Lưu trú 24h (`#1E3A4C`) consistently with compact square or dot corridor markers.
- **Do** keep terracotta (`#B84A2D`) focused on primary conversion buttons, active weight tags, and estimated totals so visual hierarchy stays unmistakable.
- **Do** preserve `MotionConfig reducedMotion="user"`, `@media (prefers-reduced-motion: reduce)` guards, `focus-visible` outlines (`#1E3A4C` or `#FAF9F6`), and `#printable-ticket` print isolation.
- **Do** keep technical RAG inspection collapsed behind an explicit `Chi tiết nguồn RAG` toggle inside assistant replies.

### Don't:
- **Don't** introduce generic neon-teal gradients, pastel rainbow badges, or glowing AI borders that break the calm mineral stoneware palette.
- **Don't** stack drop shadows on standard cards, service tiles, inputs, or chat bubbles; stay flat-by-default with 1px ceramic rims.
- **Don't** use Terracotta (`#B84A2D`) as a full-width header background or container fill (keep dark structural bars in Glazed Slate `#1E3A4C`).
- **Don't** render Vietnamese UI text in micro sizes below `11px` or drop `tabular-nums` from dynamic numeric ledgers.
- **Don't** replace the bespoke collar-tag emblem or `StatusPuppy` SVG with generic icon-font glyphs or ungrounded stock photography.
