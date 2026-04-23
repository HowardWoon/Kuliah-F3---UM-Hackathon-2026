<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/58639fe6-b20e-4c5f-beb2-67f784862ef4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a [.env](.env) file from [.env.example](.env.example) and set `VITE_ZAI_API_KEY`, `VITE_ZAI_MODEL`, plus your Firebase `VITE_FIREBASE_*` values
3. If your API account does not allow `nemo-super`, keep `VITE_ZAI_MODEL` on the default `ilmu-glm-5.1` or switch it to a model your provider dashboard allows
4. Run the app:
   `npm run dev`
