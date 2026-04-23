# Cook.GPT
### AI-Powered Economic Decision Intelligence for the Malaysian Kitchen

**Snap your fridge. Stop wasting food. Save money every week.**

[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react)](https://vitejs.dev)
[![Z.AI](https://img.shields.io/badge/AI-Z.AI%20GLM-00C896?style=flat)](https://console.ilmu.ai)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)


[Live Demo](https://cookgpt-cda67.web.app) · [Report Bug](../../issues) · [Request Feature](../../issues)

# 🍳 Click Me : [Cook.GPT](https://cookgpt-cda67.web.app)

</div>

---

## The Problem

Malaysian households waste **RM 1,000+ per year** on food that expires before it's used. The cycle is familiar:

- You buy groceries, forget what's in the fridge
- Items expire silently — no warnings, no reminders
- You order takeout instead of cooking what you already have
- Good food (and Ringgit) goes straight to the bin

**There's no intelligent system that connects what you own to what you should cook — before it's too late.**

---

## Our Solution

**Cook.GPT** uses AI vision to turn your fridge into a decision engine:

| | Step | What Happens |
|---|---|---|
| 1 | **Snap** | Take a photo of your fridge or pantry |
| 2 | **Identify** | Z.AI Vision recognizes every ingredient |
| 3 | **Alert** | Flags items near expiry with RM value at risk |
| 4 | **Suggest** | Generates Malaysian recipes using what you already have |
| 5 | **Track** | Logs meals cooked, RM saved, and your progress over time |

---

## How It Works

```
Phone Camera ──► Z.AI Vision API ──► Ingredient List
                                          │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                        Expiry Alert  Recipe Gen   Savings Est.
                              │           │           │
                              └───────────┼───────────┘
                                          ▼
                                    Firebase Firestore
                                          │
                                          ▼
                                    Profile & History
```


## Getting Started

### Prerequisites

| Requirement | Install |
|---|---|
| Node.js 18+ | [Download](https://nodejs.org) |
| Firebase CLI | `npm install -g firebase-tools` |
| Z.AI API Key | [Get one here](https://console.ilmu.ai) |
| Firebase Project | [Create one](https://console.firebase.google.com) with Firestore enabled |

### Installation

```bash
# 1. Clone
git clone https://github.com/USER/Cook.GPT.git
cd Cook.GPT

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
```

Open `.env` and fill in your credentials:

| Variable | Description |
|---|---|
| `VITE_ZAI_API_KEY` | Your Z.AI (ILMU) API key |
| `VITE_ZAI_MODEL` | Model name, e.g. `ilmu-glm-5.1` |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_*` | Remaining Firebase config values |

### Run

```bash
npm run dev
```

Open **http://localhost:3000** and start scanning!

### Deploy

```bash
npm run build
firebase deploy --only hosting --project cookgpt-cda67
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | Fast SPA with HMR |
| Styling | Tailwind CSS | Utility-first responsive design |
| Icons | Material Symbols Outlined | Ligature-based icon system |
| AI Engine | Z.AI Vision API (ILMU-GLM-5.1) | Image recognition & recipe generation |
| Database | Firebase Firestore | Real-time cloud storage |
| Hosting | Firebase Hosting | SSL + global CDN |

---

## Project Structure

```
Cook.GPT/
├── src/
│   ├── components/
│   │   └── layout/         # BottomNav, Layout shell
│   ├── pages/
│   │   ├── Home.tsx        # Dashboard + scan entry
│   │   ├── Scanning.tsx    # Camera + AI analysis
│   │   ├── Inventory.tsx   # Tracked ingredients
│   │   ├── Recipes.tsx     # Recipe list
│   │   ├── Recipe.tsx      # Single recipe detail
│   │   ├── Profile.tsx     # Stats, XP, ratings
│   │   └── Report.tsx      # AI feedback report
│   ├── context/
│   │   └── FridgeContext.tsx  # Global state (analysis, profile)
│   ├── App.tsx             # Routes
│   ├── firebase.ts         # Firebase config
│   ├── main.tsx            # Entry point
│   └── index.css           # Design tokens + Tailwind
├── index.html              # Font imports (Public Sans, Material Symbols)
├── firebase.json           # Hosting + rewrite rules
├── .env.example            # Env template
└── package.json
```

---

## Team — KuliahF3

| Name | Role |
|---|---|
| **Howard Woon Hao Zhe** | Project Lead · App Implementation · Repo Management |
| **Yim Zi Hao** | PRD · System Analysis · QA Testing |
| **Sanjay Mukojima Ravindran** | Pitch Video & Prototype Demo |
| **Kingston Nuing Scott** | Presentation Pitch Deck |

---

<div align="center">

Built for **UMHackathon 2026**
Domain 2: AI for Economic Empowerment & Decision Intelligence

Powered by **Z.AI GLM**

</div>
