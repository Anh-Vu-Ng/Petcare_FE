---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Surface Brief: Petcare Care Workspace (`src/app/page.tsx`)

- **Scope:** Primary web workspace covering AI Consultation (*Tư Vấn AI*), Appointment Booking (*Đặt Lịch Hẹn*), Booking Lookup (*Tra Cứu*), QR Confirmation Pass, and Error state.
- **Visitor Mode:** Operate (code-led)
- **Audience & Job:** Vietnamese pet owners asking care/pricing questions, booking Spa/Vet/Boarding slots with transparent weight-tiered pricing, and checking existing `BK-` passes.
- **Constraints:** Preserve all `/api/chat/*` and `/api/v1/bookings/*` contracts, offline fallbacks, Zod validation, `#printable-ticket` print support, Vietnamese copy, and zero fabricated clinic addresses/testimonials. Keep RAG debug metadata tucked behind an optional toggle.

## Direction contract

THESIS: Petcare is a calm, tactile pet-care desk modeled on everyday pet-home stoneware and collar hardware, refusing neon-teal healthcare templates, cartoon floating backgrounds, and RGB AI gimmickry.

OWN-WORLD: Warm stoneware ground (`#F4F2ED`), ceramic card surfaces (`#FAF9F6`), deep glazed-slate top bar and ticket headers (`#1E3A4C`), terracotta-collar primary CTAs (`#B84A2D`), espresso-charcoal ink (`#231F1D`), strict 1px ceramic-rim borders (`#D8D2C6`), `Be Vietnam Pro` UI type with `JetBrains Mono` tabular numerals, color-coded Spa/Vet/Boarding corridor markers, and engraved collar-tag pet/weight controls.

STORY: Pet owners immediately trust Petcare as a real modern clinic and spa, ask grounded care questions without technical RAG clutter (expanding the RAG inspector only when desired), see live weight-tiered prices adjust transparently, book a verified time slot, and carry or look up a crisp QR check-in pass.

FIRST VIEWPORT: Full-width glazed-slate header (`#1E3A4C`, 64px) with Petcare collar-tag mark, three workflow tabs (`Tư Vấn AI`, `Đặt Lịch Hẹn`, `Tra Cứu`), and clinic hours; below it on `#F4F2ED`, a two-column desktop workspace (`lg:grid-cols-[1fr_340px]`) pairing the AI consultation desk (welcome + 2x2 topic grid + clean bottom composer) with a live Collar-Tag Pet Profile & Quick-Pricing sidebar whose terracotta CTA jumps straight into Booking.

FORM: Stoneware & Collar Tag (candidate 5 of 7 grounded directions, raised with 1px hairline rigor, tabular numeric alignment, right-aligned itemized ledgers, semantic Spa/Vet/Boarding corridor markers, and zero redundant sticker badges), seed:2fc826438ebc13d7.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
