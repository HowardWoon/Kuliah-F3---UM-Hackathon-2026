<div align="center">
<img width="1200" height="475" alt="Cook.GPT banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🍳 Cook.GPT
### AI-Powered Economic Decision Intelligence for the Malaysian Kitchen

[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)](https://vitejs.dev)
[![Z.AI](https://img.shields.io/badge/AI-Z.AI%20GLM-00C896?style=flat)](https://console.ilmu.ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live Website:** https://cookgpt-cda67.web.app

> **Snap your fridge. Stop wasting food. Save money every week.**

*Built for UMHackathon 2026 — Domain 2: AI for Economic Empowerment & Decision Intelligence*

</div>

---

## 🛑 The Problem

Malaysian households lose **RM 200–400 every month** by letting groceries expire unnoticed. This happens for two reasons: a lack of inventory visibility, and a lack of culinary creativity.

Standard recipe apps fail because they act as rigid search engines — if you are missing a single ingredient like oyster sauce, the app tells you the meal is impossible to cook. This leads directly to food waste and financial loss.

---

## 💡 The Solution

Cook.GPT does not just list recipes. It acts as a **financial risk manager for your kitchen**.

By using Z.AI's multimodal vision model (ILMU-GLM-5.1), it visually audits your available food, calculates the exact Ringgit value at risk of expiring, and dynamically generates adaptive Malaysian recipes to rescue that value — all from a single photo. User stats, meals, and XP then sync to the Firebase project in real time.

> If you remove the Z.AI GLM engine, the app completely breaks. It cannot validate fridge photos, invent recipes on the fly, adapt to missing ingredients, or calculate financial loss. Z.AI is the absolute core of the product.

---

## 👨‍💻 Team — KuliahF3

| Name | Role |
|---|---|
| **Howard Woon Hao Zhe** | Project Lead, App Implementation, Code Repository Management |
| **Yim Zi Hao** | Product Requirement Document, System Analysis, QA Testing Document |
| **Sanjay Mukojima Ravindran** | 10-Minute Pitching Video with Prototype Demonstration |
| **Kingston Nuing Scott** | Preliminary Round Presentation Pitch Deck |

---

## ✨ Core Features

### 📸 1. Visual Ingestion (Home Tab)
- Upload one or multiple photos of your fridge shelves or pantry
- Z.AI GLM validates the image — non-food uploads (keyboards, pets) are immediately rejected to save compute and ensure data purity
- Images are converted to Base64 and processed through a strict Economic Kitchen Manager system prompt

### 📉 2. Economic & Freshness Analysis (Inventory Tab)
- AI identifies individual ingredients, packaged goods, and leftovers from the photo
- Items are categorized by expiry urgency:
  - 🔴 **URGENT** — 1–2 days remaining (wilting spinach, leftover chicken)
  - 🟡 **SOON** — 3–5 days remaining
  - 🟢 **OK** — Pantry stable (dal, instant noodles)
- Each at-risk item is assigned an estimated Malaysian Ringgit (RM) market value
- Engine calculates the exact **Total Savable RM** sitting in your fridge right now

### 🧑‍🍳 3. Dynamic Culinary Generation (Recipes Tab)
- **Zero-database architecture** — no hardcoded recipe lookup, every dish is invented on the fly based strictly on what Z.AI sees in your photo
- Generates 2–3 culturally authentic Malaysian dishes (Nasi Goreng Kampung, Mamak-Style Maggi Goreng, Curry Ayam Kampung) prioritizing URGENT ingredients first
- **Smart Substitution Engine** — if a standard recipe needs coconut milk but only water and extra spices are visible, Z.AI adapts the recipe and explains the swap (e.g. *"Substituted missing Oyster Sauce with Soy Sauce and Sugar"*)
- Every generated meal displays exactly how much RM the user saves by cooking it

### 🏆 4. Gamified Impact Tracking (Impact & Rank Tab)
- Total RM Saved and Total Meals Cooked tracked persistently in the Firebase project
- **Chef Rank System** — users earn XP for rescuing food, progressing through titles:
  - Novice Scraper → Kitchen Alchemist → Master of Leftovers
- XP progress bar and level display updated in real time
- Z.AI Recent Ratings history with star scores per meal
- Habit-forming loop that rewards continuous waste reduction

---

## 🧠 Technical Architecture

```
User uploads fridge photo
        ↓
React frontend converts image → Base64
        ↓
fetch() → Vite proxy → https://api.ilmu.ai/v1/chat/completions
        ↓
ILMU-GLM-5.1 (multimodal vision model by YTL AI Labs)
        ↓
Strict JSON output forced via system prompt:
{ valid, insight, expiring[], meals[], totalSavableRM }
        ↓
Frontend parses JSON → updates React state
        ↓
Firebase Firestore persists stats, meals, XP
        ↓
UI re-renders with localized economic insights
```

**Why Z.AI is non-removable:** The entire decision pipeline — image validation, ingredient recognition, shelf-life assessment, RM valuation, adaptive recipe generation, and smart substitution — is performed exclusively by ILMU-GLM-5.1. Remove the model and the app returns zero meaningful output.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript / JavaScript (ES6+) |
| Styling | Tailwind CSS + inline styles |
| Icons | Lucide React |
| State Management | React Hooks (useState, useEffect, useRef) |
| AI Decision Engine | Z.AI Vision API — ILMU-GLM-5.1 (YTL AI Labs) |
| Database | Firebase Firestore |
| Dev Environment | Visual Studio Code + Claude Code |
| Version Control | Git + GitHub |

---

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

**1. Clone the repository**
```bash
git clone https://github.com/HowardWoon/Kuliah-F3---UM-Hackathon-2026.git
cd cook-gpt
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root by copying `.env.example`:
```bash
cp .env.example .env
```

Fill in your values:
```env
# Z.AI GLM API (get from https://console.ilmu.ai)
VITE_ZAI_API_KEY=your_ilmu_api_key_here

# Firebase (connects to the Cook.GPT Firebase project)
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=cookgpt-cda67.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cookgpt-cda67
VITE_FIREBASE_STORAGE_BUCKET=cookgpt-cda67.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=651715979467
VITE_FIREBASE_APP_ID=1:651715979467:web:8d529d2b1fa6bb5dc9934e
```

**4. Start the development server**
```bash
npm run dev
```

**5. Open the app**

Navigate to `http://localhost:3000` in your browser.

**6. Hosting note**

The live website is hosted on Firebase Hosting at `https://cookgpt-cda67.web.app`. Your local app runs the same codebase and Firebase project configuration, so the only difference is the URL.

---

## 📁 Project Structure

```
cook-gpt/
├── src/
│   ├── App.tsx          # Main app — all tabs, state, API logic
│   ├── firebase.ts      # Firebase initialization
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── .env                 # API keys (never commit this)
├── .env.example         # Template for environment variables
├── vite.config.ts       # Vite + proxy config for Z.AI API
└── package.json
```

---

## 🔮 Future Roadmap

- **Receipt Scanning** — scan grocery receipts to cross-reference with fridge data for hyper-accurate RM tracking
- **Push Notifications** — alerts when high-value items (meat, dairy) hit the 24-hour expiry window
- **Community Leaderboards** — social tier where university students compete on least food wasted per semester
- **Restock ROI Calculator** — before buying groceries, Z.AI predicts which items will actually get used vs wasted

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for **UMHackathon 2026**

*Powered by Z.AI GLM — Decision Intelligence for Every Malaysian Kitchen*

</div>