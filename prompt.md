# 🖤 MAISON NOIR: Enterprise Technical Blueprint (₹1 Crore Standard)

## 🌌 Overview
MAISON NOIR is an elite, ₹1 Crore ultra-luxury fashion e-commerce ecosystem. It bridges haute couture and high-technology using **Next.js 16**, **Three.js**, and an **AI-First architecture**.

---

## 🚀 1. Core Enterprise Stack
- **Framework**: Next.js 16 (App Router), React 19.
- **Visual Reality**: Three.js, React Three Fiber, `@react-three/drei`.
- **Intelligent Layer**: Maison AI Hub (Custom Recommendation Engine + Semantic Search).
- **Commerce Hub**: Prisma, PostgreSQL, Razorpay/Stripe Integration.
- **Identity**: NextAuth.js (Secure JWT), Ready Player Me Integration.
- **Aesthetics**: Tailwind CSS v4, Framer Motion (Ceremonial Interactions).

---

## 🧠 2. Intelligent Commerce (Phase 9 & 10)

### AI Recommendation Engine
- **Service**: `lib/ai/recommendationEngine.js`
- **Features**: 
  - **Neural Curation**: Analyzes behavior to provide a personalized homepage flow.
  - **Complete the Look**: Intelligent cross-sell logic matching complimentary garments (e.g., Silk Trench → Elite Boots).

### Smart Search Module
- **Component**: `SmartSearch.jsx`
- **Logic**: Semantic interaction layer for high-fidelity discovery. Understands intent (e.g., "minimalist formalwear") beyond simple keywords.

### Personal Outfit Builder
- **Component**: `OutfitBuilder.jsx`
- **Logic**: A digital studio allowing collectors to synthesize complete ensembles from the archive and acquire them in a single requisition.

---

## 🎨 3. Sovereign Design System
- **Omni-Luxury Palette**:
  - `Noir Black`: `#0A0A0A`
  - `Maison Gold`: `#C6A972`
  - `Midnight Blue`: `#0F172A` (New Depth layer)
  - `Soft Platinum`: `#E5E5E5` (High-fidelity texture)
- **Glassmorphism**: 32px Gaussian blur on all navigation and modal layers for a "frosted obsidian" effect.

### 💫 UI Interactions & Animations
- **Navbar & Header**: 
  - *Liquid Wobble*: Glassmorphic tabs (`backdrop-blur-md`) utilize Framer Motion spring variants to create a subtle wobble/pop off the Z-axis when hovered. 
  - *State Shift*: Elements morph from `text-white/40` transparency to solid `text-[#C6A972]` (Maison Gold).
- **Hero & DZ (Display Zone) Section**: 
  - *Primary Buttons*: Solid Maison Gold (`bg-[#C6A972]`) boxes.
  - *Hover Pop*: Transition into Luxury White (`hover:bg-white`) creating an immediate visual contrast flash and `scale-105` 3D structural expansion.
- **Product Modules & 3D Interactive Panels**:
  - *Quick Purchase Rings*: Dark transparent glass cards (`bg-black/80`). 
  - *Golden Lighting Effect*: Upon hover, the background aggressively switches to solid `#C6A972`, the text turns pitch-black, and borders illuminate. This fixes the optical illusion of text disappearing into a white background.
- **Footer Section**:
  - *Minimalist Fades*: Muted links (`text-white/40`) that gracefully fade into bright white or pure gold upon interaction with a slow `<div />` bottom-border expansion curve.

---

## 👤 4. Advanced Avatar System
The Maison now supports **Surgical Fit Analysis**.
- **Measurements**: Chest, Waist, Hips, Shoulder Width.
- **Fitting Accuracy**: Virtual fitting is adjusted based on user-provided metrics in the `UserAvatar` model.

---

## 📊 5. Commerce Intelligence (Admin)
The Executive Dashboard provides:
- **Sales Trajectory**: (Recharts/Chart.js integration).
- **Stock Sentinel**: Real-time inventory alerting.
- **Performance Metrics**: Conversion rate and retention tracking.

---

## 🏁 6. Future Roadmap
- **Phase 10**: Metaverse Visual Studio (Full Outfit Synthesis).
- **Phase 11**: AI Generative Fashion (Collector-designed garments).
- **Phase 12**: NFT Digital Ownership (On-chain authenticity for archival pieces).

**© 2026 MAISON NOIR. Engineered for the 1%.**
