

# SOCIETY.EXE — Agentic Reality System Upgrade

## Overview

Evolve SOCIETY.EXE from a behavior simulator into an **Agentic Reality System** that observes, predicts, and simulates systemic interventions. All changes are additive — preserving the existing clean UI, privacy-first philosophy, and minimal aesthetic.

---

## Architecture

```text
Current Flow:
  Hero → Simulator → Results (4 cards) → Perspective Shift → Balance Sheet → Daily Signal

New Flow:
  Hero (updated tagline) → Simulator → Results + System Response + Intervention → Perspective Shift → Balance Sheet + Society Health → Daily Signal

New Nav:
  Explore | Simulate | Interventions | Insights (smooth-scroll anchors)
```

---

## Changes by File

### 1. Header Navigation Upgrade
**File:** `src/components/DynamicHeader.tsx`

Replace the current 3-item nav with 4 items:
- **Explore** → scrolls to `#hero`
- **Simulate** → scrolls to `#simulator`
- **Interventions** → scrolls to `#interventions` (new section)
- **Insights** → scrolls to `#balance`

Add subtle glow underline on active/hover states. Improve typography with slightly larger text and better spacing.

### 2. Hero Section Polish
**File:** `src/components/HeroSection.tsx`

- Update subtitle: "A system that understands society and responds to it."
- Add a subtle pulsing system status badge: "SYSTEM ACTIVE" with a small green dot
- Improve spacing and font weight hierarchy

### 3. Simulator Results + System Response Layer (Core Feature)
**File:** `src/components/NormalizationSimulator.tsx`

After the existing 4-card result grid, add a new **System Response** sequence that appears with staggered animation:

**Step A — Risk Detection Banner:**
- Animated reveal: "SYSTEM RESPONSE ACTIVATED"
- Risk level badge (Low/Medium/High) derived from the `pressure` field content using keyword analysis
- Brief explanation of why this pattern is concerning at scale

**Step B — System Action Sequence:**
- Label: "System is responding to this pattern"
- 3 animated status lines that appear sequentially (e.g. "Spending pressure increasing", "Savings rate declining", "Economic stress building") — these are generated from the AI response content, not hardcoded
- Uses subtle glow and pulse animations

**Step C — Correction Projection:**
- Two-column comparison:
  - "If pattern continues → [negative projection]"
  - "If 10% shift behavior → [positive projection]"
- Derived from existing `collective` and `lever` fields

This requires **no backend changes** — all derived from existing simulation result fields via client-side text analysis.

### 4. New Edge Function: System Response Generator
**File:** `supabase/functions/system-response/index.ts`

New edge function that takes the simulation result and generates:
- Risk level (low/medium/high)
- 3 system action indicators
- Two scenario projections (continue vs. shift)

Uses `google/gemini-3-flash-preview` for speed. Structured output via tool calling. Called automatically after simulation completes.

### 5. New Section: Intervention Simulation
**File:** `src/components/InterventionSimulator.tsx` (new)

A new section between Perspective Shift and Balance Sheet:
- Header: "What if the system intervenes?"
- Two side-by-side cards:
  - **Scenario A (No Change):** Shows negative trajectory
  - **Scenario B (Small Intervention):** Shows improved outcome
- 3 rotating intervention examples displayed below (savings nudges, credit reduction, financial awareness)
- Preloaded with static content, with option to generate via AI for the current simulation context
- Section id: `#interventions`

### 6. Society Health Indicator
**File:** `src/components/SocietyHealthIndicator.tsx` (new)

A compact visual widget added to the Balance Sheet section:
- Three states: **Stable** (green), **Under Pressure** (amber), **Critical** (red)
- Animated ring/arc indicator with subtle glow
- Updates dynamically when a simulation runs (based on risk level)
- Default state: "Under Pressure" (reflecting current global data)
- Uses CSS animations only — no charts or heavy libraries

### 7. Archivist Chat Upgrade
**File:** `supabase/functions/archivist-chat/index.ts`

Update the system prompt to emphasize:
- Pattern explanation over advice
- "Why this happens" framing
- Calmer, more institutional tone
- Context-providing, not prescriptive

No UI changes needed — the existing chat interface is clean and appropriate.

### 8. Demo Mode
**File:** `src/components/DemoMode.tsx` (new)

A toggle button in the header area:
- "Demo Scenario" pill/toggle
- When activated:
  - Auto-scrolls to simulator
  - Selects a preset behavior (e.g. "Buying on EMI")
  - Triggers simulation automatically
  - After results load, triggers System Response sequence
  - Smooth, hands-free walkthrough
- No dependency on user input
- Can be triggered from Command Palette as well

### 9. Index Page Updates
**File:** `src/pages/Index.tsx`

- Add `InterventionSimulator` section between PerspectiveShift and PublicBalanceSheet
- Add `SocietyHealthIndicator` inside PublicBalanceSheet area
- Wire Demo Mode toggle
- Add state management for society health level (shared between simulator and indicator)

### 10. Premium UI Polish
**Files:** `src/index.css`, `tailwind.config.ts`

- Add subtle `glow-primary` and `glow-accent` box-shadow utilities
- Add `text-shadow-glow` utility for headings
- Improve base font size and letter-spacing slightly
- Add animation for sequential status line reveals (`animate-typewriter-line`)
- Ensure all new animations are GPU-accelerated and lightweight

---

## What Does NOT Change
- Project name: SOCIETY.EXE
- Core layout: single column, one idea per screen
- Privacy: no data collection, no tracking
- Existing components: PerspectiveShift, DailySignal, PublicBalanceSheet, WorldFinancialMap all preserved
- No gamification, no dashboards, no heavy charts
- No financial advice language

---

## Technical Notes
- New edge function uses `google/gemini-3-flash-preview` for fast response times
- System response data derived via structured output (tool calling) for reliability
- All animations use CSS transitions and GSAP — no new heavy libraries
- Society health state managed via React context or lifted state in Index.tsx
- Demo mode uses `setTimeout` chains for sequencing, not complex state machines

---

## Estimated Scope
- 1 new edge function
- 3 new components
- 5 modified files
- 0 database changes

