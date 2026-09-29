# Synthora — Synthetic Data Studio

[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![PapaParse](https://img.shields.io/badge/CSV-PapaParse-orange?style=flat-square)](https://www.papaparse.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Zero-leak, browser-native synthetic data studio.**  
> Generate production-grade mock datasets with granular null distributions, mathematical noise, multi-table referential integrity, and reconciled financial documents.

---

## 🚀 Live Demo

**[👉 Try Synthora Online (Free)](https://ais-pre-d57sywdtdjqnmlqexg6w3q-173257453422.asia-southeast1.run.app)**

---

## 🎯 Problems Synthora Solves

| # | Challenge | The Problem | How Synthora Solves It |
|---|---|---|---|
| **01** | **Privacy & Compliance** | Using real customer PII in dev or QA breaks GDPR, HIPAA, and CCPA regulations. | Generates realistic, fully synthetic fake names, emails, credit cards, and addresses entirely in-browser. Zero real PII leaves your device. |
| **02** | **Rigid Mock Schemas** | Static mock fixtures and simple dummy generators fail real business validation rules. | Flexible custom schema builder with support for regex, ranges, categorical enums, seed reproducibility, and domain-specific rules. |
| **03** | **Missing Edge Cases** | Services and analytics crash in production because dev tests only used "happy path" clean data. | Inject configurable null probabilities (0% - 100%), statistical outliers, formatting noise, and dirty data. |
| **04** | **Schema Portability & Drift** | Teams waste sprint hours rewriting disposable seed scripts that fall out of sync. | Export and import schemas as standardized JSON definitions; export data directly to PapaParse CSV, JSON, and SQL `INSERT` statements. |

---

## 🧩 Studios & Features

### 1. 📊 Tabular Studio
- **Granular Column Customization**: Define column types including UUIDs, Full Names, Emails, Phone Numbers, Addresses, IP Addresses, Integers, Floats, Dates, and Booleans.
- **Statistical Noise & Null Probability**: Set individual null percentage sliders per column to stress-test dirty data handling.
- **PapaParse Fast CSV Export**: High-performance streaming CSV generation with automated quoting and column alignment.
- **Export Formats**: One-click download for **CSV (via PapaParse)**, **JSON array**, and **SQL `INSERT` DDL**.

### 2. 🔗 Relational Links Studio
- **Multi-Table Referential Integrity**: Models relational hierarchies like `Customers` ➔ `Orders` ➔ `Order Items`.
- **Foreign Key Preservation**: Every generated order links back to a valid customer UUID; order items reference valid parent order IDs.
- **Cross-Table Summary Metrics**: Immediate aggregate validation across tables.

### 3. 🧾 Financial Documents Studio
- **Business Document Synthesis**: Generate realistic invoices, receipts, and account statements.
- **Mathematical Reconciliation**: Line items, discounts, VAT/sales tax rates, and subtotal/total calculations are mathematically consistent down to the cent.
- **Drift Simulation**: Simulate seasonal revenue drift and currency conversion variance.

### 4. 🤖 AI Schema Prompt
- **Natural Language Schema Generation**: Describe your desired domain (e.g. *"SaaS subscription billing system with plan tiers, monthly MRR, and churn reasons"*).
- Instant translation into production-ready Synthora schemas.

### 5. ⚙️ Schema JSON Manager
- Save, export, and import schema blueprints as clean `.json` configs.
- Re-use and share schema configurations across your team.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence & version migrations
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Serialization**: [PapaParse](https://www.papaparse.com/)
- **Animations**: [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/synthora-studio.git
   cd synthora-studio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Type check & lint:**
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Minimalist categorized nav with Studios & Problems
│   │   ├── landing/               # Overview landing page with interactive demos
│   │   ├── tabular/               # Tabular Studio & PapaParse CSV exporter
│   │   ├── relational/            # Multi-table foreign key relational studio
│   │   ├── documents/             # Invoices & financial documents generator
│   │   ├── ai/                    # AI natural language schema prompt
│   │   ├── schema/                # Schema JSON import/export modal
│   │   └── walkthrough/           # Interactive 4-step problem solver guide
│   ├── lib/
│   │   ├── generators/            # In-browser deterministic mock data generators
│   │   ├── presets.ts             # Default problem presets and schema definitions
│   │   └── exportUtils.ts         # PapaParse CSV, JSON, and SQL formatters
│   ├── store/
│   │   └── studioStore.ts         # Central Zustand state with v2 migration
│   ├── types/
│   │   └── schema.ts              # TypeScript interfaces for schema and fields
│   ├── App.tsx                    # Root layout & view router
│   └── main.tsx                   # React 19 entry point
├── metadata.json                  # AI Studio deployment metadata
├── vite.config.ts                 # Vite bundler configuration
└── package.json                   # Scripts & dependencies
```

---

## 🔒 Privacy & Security

Synthora runs entirely inside the client's browser session:
- **No telemetry** or analytics tracking.
- **Zero data sent to remote servers** during dataset synthesis.
- Suitable for air-gapped or HIPAA/GDPR sensitive environments.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
