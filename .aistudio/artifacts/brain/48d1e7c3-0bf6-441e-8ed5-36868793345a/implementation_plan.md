# Minimalist Navigation: Categorized Studios & Problems Architecture

Streamline the top navigation bar from a crowded multi-item layout into a clean, minimalist 3-zone structure by consolidating all data generation tools and schema actions under a single "Studios" dropdown, paired with the "Problems" walkthrough dropdown and the theme toggle.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions have been confirmed:
> - **Categorized Studios Dropdown**: Group all 4 data tools (Tabular Studio, Relational Links, Financial Documents, AI Schema Prompt) under a single **"Studios"** dropdown instead of individual top-level items.
> - **Schema JSON Integration**: Move the "Schema JSON" action into the Studios dropdown as a utility action, removing secondary button clutter from the top bar.
> - **Problems Dropdown Preserved**: Keep the "Problems" dropdown next to "Studios" so users can still jump directly into any of the 4 problem walkthroughs.
> - **Ultra-Clean Navbar Baseline**: The visible navigation is simplified to just: `Overview` | `Studios ▾` | `Problems ▾` on the left/center, and the tactile `Theme Switch` on the right.

- **Confirmed Decision 1**: Structure the "Studios" dropdown with descriptive labels, subtle badges/indicators for the active tool, and clean category separation.
- **Confirmed Decision 2**: Ensure mobile responsiveness collapses both dropdowns into a unified, clean mobile sheet.
- **Confirmed Decision 3**: Retain fast keyboard navigation (`Escape` to close, arrow key focus) and click-outside handling for both dropdowns.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the navigation experience from visual overload to an intentional, high-contrast, uncluttered interface. The user sees a clean header with only three navigation targets: the core product **Overview**, the categorized **Studios** menu (containing all synthesis tools and schema configuration), and the **Problems** menu (interactive problem tours).
- **Target Audience / Persona**: Developers, QA engineers, and data architects who appreciate focused, uncluttered SaaS consoles that prioritize workspace canvas over header noise.
- **Key Value**: Delivers the clean, organized aesthetic requested by the user, eradicating horizontal crowding and establishing an intuitive information architecture.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Switching Studios**: User clicks or hovers "Studios ▾" $\rightarrow$ elegant panel drops down showing:
    - *Tabular Studio* (Distributions, seed control, CSV/SQL export)
    - *Relational Links* (Foreign key mapping, parent-child cascades)
    - *Financial Documents* (Invoices, tax calculations, balance ledgers)
    - *AI Schema Prompt* (Natural language schema synthesizer)
    - Hairline divider
    - *Schema JSON Manager* (Reusable schema import/export modal trigger)
  - **Inspecting Problems**: User clicks "Problems ▾" $\rightarrow$ picks any of the 4 core problems $\rightarrow$ walkthrough opens directly at that step.
  - **Overview Landing**: Clicking "Overview" or the "Synthora" brand wordmark immediately returns to the clean hero and architectural overview.
- **Visual Identity & Theme**:
  - *Aesthetic*: Minimalist, high-contrast B2B SaaS interface.
  - *Palette*: Slate-950 dark mode / Crisp white light mode, cobalt blue active indicators (`#2563EB`), hairline borders (`border-slate-200 dark:border-slate-800`), soft floating dropdown shadows.
  - *Typography*: Single-line labels with subtle muted subtext for clarity inside the dropdown panels.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Moving Schema JSON Inside Studios Dropdown**:
  - *Chosen Approach*: Place "Schema JSON" at the bottom of the "Studios" dropdown separated by a subtle divider.
  - *Why*: Eliminates redundant buttons in the header action zone, creating breathing room for the brand and theme switch.
  - *Alternatives Considered*: Keeping it as a separate header button (rejected as it causes horizontal crowding).

- **Decision 2: Dedicated Dropdown State Management**:
  - *Chosen Approach*: Single active dropdown state (`activeDropdown: 'studios' | 'problems' | null`) to prevent both dropdowns from ever opening simultaneously.
  - *Why*: Smooth, bug-free transition between menus on hover/click.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 Navbar.tsx                                  │
│                                                                             │
│  [Zone 1: Brand]       [Zone 2: Categorized Navigation]   [Zone 3: Actions] │
│  ┌───────────────┐     ┌──────────┐ ┌─────────┐ ┌──────────┐   ┌─────────┐  │
│  │ Synthora  ●   │     │ Overview │ │ Studios▾│ │ Problems▾│   │ ☼ ─── ☾ │  │
│  └───────────────┘     └──────────┘ └────┬────┘ └────┬─────┘   └─────────┘  │
└──────────────────────────────────────────┼───────────┼──────────────────────┘
                                           │           │
                    ┌──────────────────────┘           └──────────────────────┐
                    ▼                                                         ▼
       ┌────────────────────────────┐                            ┌────────────────────────────┐
       │     Studios Dropdown       │                            │     Problems Dropdown      │
       ├────────────────────────────┤                            ├────────────────────────────┤
       │ ⊞ Tabular Studio           │                            │ 01. Privacy & Compliance   │
       │ ⚯ Relational Links         │                            │ 02. Rigid Mock Schemas     │
       │ ▤ Financial Documents      │                            │ 03. Edge Cases & Nulls     │
       │ ✦ AI Schema Prompt         │                            │ 04. Portability & Drift    │
       ├────────────────────────────┤                            └────────────────────────────┘
       │ ⎘ Schema JSON Manager      │
       └────────────────────────────┘
```

### Component Structure
- **`Navbar.tsx`**:
  - State: `activeDropdown: 'studios' | 'problems' | null`.
  - Close handlers: click outside, `Escape` key, view selection.
  - Active indicator on "Studios" if `currentView` is `'tabular' | 'relational' | 'documents' | 'ai_prompt'`.
  - Active indicator on "Overview" if `currentView === 'landing'`.
