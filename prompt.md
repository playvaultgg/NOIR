# 🖤 MAISON NOIR: Technical Blueprint & Manifest (Phase 8.8+)

## 1. 🌌 Overview
**MAISON NOIR** is a hyper-premium, ₹1 Crore ultra-luxury fashion e-commerce platform. It leverages **Next.js 16 (App Router)**, **Three.js**, and **Tailwind CSS** to create a cinematic shopping experience that bridges the gap between high-end digital art and global commerce.

---

## 2. 🏗️ Tech Stack (The Architecture)
- **Frontend Core**: Next.js 15+ (React 19), App Router, Server Components.
- **Visuals & 3D**: Three.js, React Three Fiber (R3F), `@react-three/drei`.
- **Aesthetics**: Tailwind CSS v4, Framer Motion (Ceremonial Transitions).
- **Backend / Database**: Prisma ORM, PostgreSQL (Hosted on Vercel/Supabase).
- **Authentication**: NextAuth.js (JWT Strategy, Google OAuth + Credentials).
- **State Management**: Zustand (Cart & Wishlist persistence).
- **Commerce**: Razorpay (Localized Payment Gateway Integration Ready).

---

## 3. 🗄️ Database Architecture (Prisma)
The database is structured to support high-fidelity user profiles and complex commerce relationships.

### Key Models:
- **User**: Stores identity, role (USER/ADMIN), and relations to orders/wishlist.
- **Product**: Technical specs, image arrays, stock management, and branding categories.
- **Order / OrderItem**: Immutable records of luxury acquisitions.
- **UserAvatar**: **(Phase 8.6)** Stores digital measurements, body type, skin tone, and 3D model URLs for the Try-On system.
- **Address**: Multiple shipping destinations for global logistics.

---

## 4. 🎨 Design System (The Aesthetic Noir)
- **Color Palette**:
  - `Noir Black`: `#0A0A0A` (Deepest Void)
  - `Maison Gold`: `#C6A972` (Artisanal Metallic)
  - `Luxury White`: `#F5F5F5` (Soft Canvas)
- **Visual Language**:
  - **Glassmorphism**: High-blur, low-opacity overlays (`backdrop-blur-xl`).
  - **Cinematic Motion**: Spring-based entry animations for all page transitions.
  - **Minimalist UX**: Ultra-clean navigation with no placeholders; only high-res assets.

---

## 5. 🗺️ Frontend Map (Routes & Pages)

### 🛍️ Public Experience:
- `/`: **Masterpiece Hub** (Homepage). Features the AI Stylist, Showroom Teasers, and Brand Story.
- `/collections`: **The Archive**. Enterprise-grade product grid with 3D tilt interaction cards.
- `/product/[id]`: **Inspection Layer**. 360 viewer (placeholder logic), variant selection, and AR entry.
- `/showroom`: **3D Digital Reality**. A full-screen canvas to inspect garments in a spatial void.
- `/runway`: **Cinematic Loop**. An interactive 3D fashion show experience.

### 🔐 Private Requisitions:
- `/cart`: **Requisition Archive**. Dynamic price calculation, luxury motion, and glassmorphism styling.
- `/checkout`: **Secure Protocol**. Multi-step accordion flow with AES-256 bit encryption markers.
- `/account`: **Client Portal**. Order history, Avatar Management, and verified settings.
- `/login` / `/register`: **Maison Entry**. Secure authentication with smooth feedback.

### 🛡️ Management (Admin):
- `/admin`: **Commerce Intelligence Dashboard**. Real-time sales trajectory, stock sentinel, and inventory audit.
- `/admin/products`: CRUD interface for the Maison Catalog.
- `/admin/orders`: Logistics management and status orchestration.

---

## 6. 🧠 Feature Logic Deep Dives

### 🤖 AI Stylist Concierge
- **Component**: `AIStylistChat.jsx`.
- **Logic**: A floating interface that simulates neural processing. It provides personalized look recommendations based on user history and collection tags.

### 👤 Avatar Try-On System (Phase 8.6)
- **Component**: `AvatarViewer.jsx` & `GarmentTryOn.jsx`.
- **Logic**: Bridges the `UserAvatar` data with R3F. Users input their body type (Slim, Athletic, Curvy), and high-resolution shaders adjust the virtual silhouette to match.

### 📱 AR Try-On (Phase 8.8)
- **Component**: `ARTryOn.jsx`.
- **Logic**: Orchestrates the `navigator.mediaDevices` camera stream. It projects a spatial mesh over the camera feed, allowing users to "wear" the digital garment in their physical space.

### 🛒 Global Cart Logic
- **Store**: `cartStore.js` (Zustand).
- **Logic**: Persistent storage using `localStorage`. It handles quantity increments, price formatting, and "Quick Purchase" actions from the Archive.

---

## 7. 🚀 Performance Optimization
- **Remote Caching**: configured in `next.config.mjs` for Unsplash and Google assets.
- **SWC Minification**: Enabled for ultra-fast production bundle generation.
- **Lazy Loading**: 3D scenes use `dynamic` imports with `<Suspense>` to ensure the LCP remains under 2 seconds.

---

## 8. 🛠️ Development & Deployment
- **Local Dev**: `npm run dev`.
- **Database Push**: `npx prisma db push`.
- **Seed Logic**: `node prisma/seed.js` to populate the catalog with elite mockups if the DB is empty.

---

**© 2026 MAISON NOIR. Engineered for the 1%.**
