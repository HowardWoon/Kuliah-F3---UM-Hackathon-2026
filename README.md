<div align="center">
<img width="1200" height="475" alt="Cook.GPT banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🍳 Cook.GPT

**Cook.GPT** is an AI-powered kitchen companion that turns fridge and pantry photos into useful ingredient insights, Malaysian meal ideas, and waste-saving suggestions. It helps users spot what to cook next, estimate savings, and track their culinary progress.

## ✨ Key Features

- **📸 Visual Ingestion:** Upload photos of ingredients to identify available food items.
- **📉 Economic Analysis:** Highlights expiry risk and estimates the Ringgit value saved by using ingredients before they go bad.
- **🧑‍🍳 Dynamic Recipes:** Generates Malaysian-style recipes with smart substitutions based on what is available.
- **🏆 Impact Tracking:** Tracks total savings, meals cooked, and progress over time.

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data:** Firebase
- **Model Integration:** Z.AI API

## 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create a [.env](.env) file from [.env.example](.env.example) and set `VITE_ZAI_API_KEY`, `VITE_ZAI_MODEL`, plus your Firebase `VITE_FIREBASE_*` values.
3. Start the development server:
   `npm run dev`
4. Open the app in your browser at the local address shown in the terminal.

## 👨‍💻 Team

Built by **KuliahF3** for the UM Hackathon 2026.

Team members:
- Howard Woon Hao Zhe - Project lead, app implementation, and code repository management
- Yim Zi Hao - Product Requirement Document, System Analysis Document, and Quality Assurance Testing Document
- Sanjay Mukojima Ravindran - 10-Minute Pitching Video with Prototype Demonstration
- Kingston Nuing Scott - Preliminary Round Presentation Pitch Deck
