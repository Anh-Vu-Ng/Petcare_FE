# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Vietnamese pet owners (dog, cat, and small-pet parents) seeking trustworthy everyday pet-care answers, transparent grooming/boarding/vet pricing, and fast online appointment booking and status tracking on desktop and mobile web.

## Product Purpose

Petcare (*Phòng Khám & Spa Thú Cưng*) combines a RAG-powered Vietnamese pet-care advisor (*Tư Vấn AI*), a real-time appointment booking workflow (*Đặt Lịch Hẹn*) for spa grooming, veterinary examinations, and 24-hour pet hotel boarding, and a self-service appointment lookup (*Tra Cứu*) with printable QR check-in passes. Success means a pet owner can get clear guidance, understand weight-based pricing up front, book a real time slot without friction, and track their booking ticket in one streamlined workspace.

## Positioning

Unlike disconnected clinic hotlines or generic chatbots, Petcare pairs clinic-grounded RAG consultation with instant weight-tiered service estimation, live slot scheduling, boarding stay-duration discounts, and QR check-in passes in one continuous Vietnamese web workspace.

## Operating Context

- Single streamlined web workspace with three directly accessible task workflows: AI Consultation (*Tư Vấn AI*), Appointment Booking (*Đặt Lịch Hẹn*), and Booking Lookup (*Tra Cứu*).
- Primary users are real pet owners first; technical RAG inspection data (intent badge, standalone query, retrieved documents with RRF/Rerank scores, and pipeline timing breakdown) should stay accessible behind an optional, subtle inspector toggle rather than cluttering normal pet-owner conversations.
- Supports printing or saving the digital booking confirmation ticket (`#printable-ticket`) with a check-in QR code (`PETCARE-CHECKIN:<code>`).

## Capabilities and Constraints

- Existing Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TanStack Query + React Hook Form + Zod frontend.
- Must preserve existing backend API contracts and offline/fallback behavior:
  - Chat: `POST /api/chat/send`, `GET /api/chat/history/{sessionId}` (`src/services/api.ts`, `src/hooks/useChat.ts`).
  - Booking: `POST /api/v1/bookings/estimate-price`, `GET /api/v1/bookings/available-slots`, `POST /api/v1/bookings`, `GET /api/v1/bookings/{code}`, `GET /api/v1/bookings?phone=...` (`src/services/bookingApi.ts`, `src/hooks/usePriceEstimate.ts`).
- Must preserve all 7 service definitions (`bath`, `trim`, `nail`, `ear`, `anal_glands`, `medical`, `boarding`), weight-tier pricing logic, boarding stay-duration discount tiers (4–5 days -5%, 6–10 days -10%, >=11 days -15% + free Spa Bath gift), Vietnamese mobile phone validation (`^(03|05|07|08|09)\d{8}$`), and print ticket support.
- Fix the broken fourth chat suggestion prompt in `src/components/chat/ChatBox.tsx` (currently sends `"xin chào"` instead of a grooming pricing question matching its label).
- Undecided / unverified clinic facts (physical clinic address, real hotline number, doctor roster, customer testimonials) must NOT be fabricated in the UI.

## Brand Commitments

- Brand name: **Petcare** (*Phòng Khám & Spa Thú Cưng*).
- Language: Vietnamese (`lang="vi"`) throughout all user-facing flows.
- Tone & feel requested by user: professional, modern, and familiar to pet owners.

## Evidence on Hand

- Existing frontend implementation in `src/app/` and `src/components/` (`chat/`, `booking/`, `ui/`), service catalog and pricing rules in `src/types/booking.ts` and `src/services/bookingApi.ts`.
- No bespoke clinic photography, logo SVG files, or verified testimonials are committed in `public/`; do not fabricate customer reviews, ratings, addresses, or phone numbers.

## Product Principles

- **Pet-owner clarity first:** Surface everyday care answers, weight-based pricing, and available appointment slots immediately; keep AI/RAG diagnostics tucked behind an opt-in inspector.
- **Calm clinical warmth:** Balance veterinary professionalism with genuine familiarity for people who treat pets as family—never gimmicky tech effects or sterile hospital coldness.
- **Zero-surprise booking:** Every change in pet weight, service selection, or boarding duration updates pricing and eligibility transparently before submission.
- **One continuous workspace:** Moving between asking a question, booking a service, and checking a QR pass feels cohesive and effortless on both mobile and desktop.
