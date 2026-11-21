# SUSAMBIL | Discover Uzbekistan. Your Journey, One Platform.

> **Slogan:** *“Discover Uzbekistan. Your Journey, One Platform.”*  
> **O‘zbekcha:** *“O‘zbekistonni kashf eting. Yagona platformada barcha sayohat.”*  
> **Русский:** *“Откройте Узбекистан. Всё путешествие на одной платформе.”*

---

## 🏛 1. PROJECT CONCEPT
**SUSAMBIL** is a unified, premium digital travel ecosystem built for local and international tourists visiting Uzbekistan. It brings together transportation, boutique accommodation, Silk Road tours, certified local guides, and authentic hidden gems into a single, cohesive web platform.

---

## 🎨 2. BRANDING & DESIGN SYSTEM
- **Deep Emerald Green:** `#124C3A` (Primary background, luxury Silk Road ambiance)
- **Warm Sand:** `#E9DCC5` (Neutral accents, secondary text, desert tones)
- **Gold Accents:** `#C8A66A` (Highlights, stars, badges, primary CTA gradients)
- **Pure Crisp White:** `#FFFFFF` (Content cards, typography contrast)
- **Typography:** *Playfair Display* (Editorial serif) + *Plus Jakarta Sans* (High-legibility sans-serif)

---

## 🚀 3. CORE MODULES & FEATURES

### 1. 🧭 Smart Travel Planner
- Interactive 5-step custom itinerary builder (Destinations, Duration, Travel Style, Interests, Guide mode).
- Dynamically generates day-by-day morning/afternoon/evening schedules.
- Suggests boutique madrassahs, Afrosiyob trains, and estimated costs.
- Save to profile or request full package booking in 1 click.

### 2. 🚆 Nationwide Transport Booking
- **High-Speed Trains:** Afrosiyob #762, #764 (Tashkent → Samarkand → Bukhara → Khiva) with Economy, Business, and VIP classes.
- **Domestic Flights:** Silk Avia and Uzbekistan Airways (Tashkent ⇄ Urgench/Khiva, Bukhara, Fergana).
- **Private Silk Road Transfers:** AC comfort sedans and VIP minivans with scenic stops at Amu Darya and ancient fortresses.
- **Car Rental & 4x4:** Compact SUVs and mountain/desert 4WDs with unlimited mileage.
- *API Integration Ready:* Structured for direct connector to `railway.uz` and airline GDS APIs.

### 3. 🏨 Handpicked Stays & Boutique Madrassahs
- Authentic 19th-century Madrassah cells (e.g. *Orient Star Khiva* at Kalta Minor).
- Traditional Bukharian townhouses with Suzani embroidery (*Minzifa Boutique*).
- Nomadic desert yurt camps at Aidarkul Lake.
- Centuries-old stone family guesthouses in the Nuratau Mountains (Sentob Village).

### 4. ✨ Tours & Experiences
- **Historical & Silk Road:** 7-Day Golden Triangle Odyssey.
- **Gastronomic:** Master Chef Plov Secrets & Tandir Somsa masterclasses.
- **Adventure:** Kyzylkum camel safari, stargazing, and Aidarkul lake swim.
- **Artisan Workshops:** Rishtan ceramic pottery and Margilan handmade Ikat silk weaving.

### 5. 🎙 Verified Certified Local Guides
- Government-licensed historians with official badge verification.
- Multilingual storytellers: English, French, German, Russian, Uzbek, Turkish, Tajik.
- Transparent daily and hourly rates in USD and UZS.

### 6. 💰 Smart Budget Calculator
- Real-time sliders for trip duration (1-21 days) and travelers (1-10).
- Accommodation style selector (Budget / Comfort / Luxury).
- Itemized visual breakdown: Stays, transport, food, museum entries, and guides.
- Dual-currency display: USD, UZS (Uzbekistan Som), and EUR.

### 7. 🌄 Hidden Uzbekistan
- Promotes off-the-beaten-path regional destinations:
  - **Sentob & Tersak:** Ancient mountain villages with family homestays.
  - **Boysun & Surkhandarya:** UNESCO intangible cultural heritage and Derbent canyons.
  - **Zaamin National Park:** The "Uzbek Switzerland" with alpine meadows and glass bridge.
  - **Aral Sea & Muynak:** The historic desert ship graveyard and dramatic Ustyurt cliffs.

### 8. 📊 Comprehensive Dashboards & Multi-Role Switching
- **Traveler Dashboard:** Active booking tracker with real-time status (`pending`, `confirmed`), saved favorites, and custom itineraries.
- **Admin Console:** High-level executive KPIs, gross booking turnover, and one-click booking moderation (`Approve` / `Reject`).
- **Partner Portal:** Direct registration form for hotels, transport fleets, and guides, with commission management.
- **One-Click Perspective Switcher:** Switch seamlessly in the top utility ribbon between *Traveler*, *Guide*, *Partner*, and *Admin*.

---

## 🌐 4. TRILINGUAL SUPPORT (i18n)
Full translation dictionary with instant header switcher:
- 🇺🇿 **O‘zbekcha** (Lotin)
- 🇬🇧 **English**
- 🇷🇺 **Русский**

---

## 🗄 5. DATABASE ARCHITECTURE (Supabase)
The database schema is fully defined in [`supabase/schema.sql`](supabase/schema.sql):
- `profiles` (Traveler, Guide, Partner, Admin roles)
- `destinations` (Silk Road capitals, hidden gems, coordinates, culinary specialties)
- `accommodations` (Boutique madrassahs, hotels, guesthouses, yurts)
- `transport_routes` (Trains, flights, transfers, rentals, class tiers)
- `tours` (Silk Road journeys, masterclasses, itineraries, inclusions)
- `guides` (Verified licenses, spoken languages, daily rates)
- `bookings` (Status tracking, customer details, demo flag)
- `saved_itineraries` (Smart Planner output)
- `favorites` (User bookmarked items)
- `partners` (Business listing applications)
- Complete Row Level Security (RLS) policies and performance indexes.

---

## 💻 6. HOW TO RUN THE PLATFORM

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛡 7. DEMO ENVIRONMENT NOTE
In compliance with the project guidelines, real-time ticket availability, seat confirmation, and card payments are simulated. If external APIs (Uzbekistan Railways, Silk Avia) are not yet connected, demo notices are prominently displayed throughout the UI.
