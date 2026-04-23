import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Ingredient = { name: string; quantity: string; freshness: "fresh"|"aging"|"expiring_soon"; estimated_cost_rm: number; };
export type ExpiryAlert = { ingredient: string; urgency: "today"|"tomorrow"; };
export type MealDecision = { meal_name: string; cuisine: string; ingredients_used: string[]; missing_ingredients: string[]; zai_priority_reason: string; waste_saved_rm: number; recipe_steps: string[]; image_src: string; };
export type AnalysisData = { is_valid: boolean; rejection_message?: string; ingredients: Ingredient[]; expiry_alerts: ExpiryAlert[]; meal_decisions: MealDecision[]; glm_insight: string; };

export type MealFeedback = { rating_out_of_10: number; zai_feedback: string; xp_gained: number; };

export type SavedMeal = MealDecision & { id: string; createdAt: string; };

type Profile = { xp: number; saved_rm: number; meals_rated: number; recent_ratings: any[] };

const EMPTY_PROFILE: Profile = { xp: 0, saved_rm: 0, meals_rated: 0, recent_ratings: [] };

// ════════════════════════════════════════════════════════════════
// DEMO RESPONSE LIBRARY — Two distinct scenarios, randomly selected
// ════════════════════════════════════════════════════════════════

const DEMO_RESPONSE_LIBRARY: AnalysisData[] = [
  // ── SCENARIO 1: Focus on Perishables (tomatoes, spinach, chicken) ──
  {
    is_valid: true,
    ingredients: [
      { name: "Tomatoes (4 pcs)", quantity: "4 pieces", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Spinach / Bayam (Bag)", quantity: "1 bag", freshness: "expiring_soon", estimated_cost_rm: 2.50 },
      { name: "Leftover Chicken (150g)", quantity: "150g", freshness: "expiring_soon", estimated_cost_rm: 2.00 },
      { name: "Pasta (500g)", quantity: "500g", freshness: "fresh", estimated_cost_rm: 6.00 },
      { name: "Garlic (1 bulb)", quantity: "1 bulb", freshness: "fresh", estimated_cost_rm: 1.00 },
      { name: "Olive Oil (Bottle)", quantity: "1 bottle", freshness: "fresh", estimated_cost_rm: 4.00 },
    ],
    expiry_alerts: [
      { ingredient: "Tomatoes (4 pcs)", urgency: "today" },
      { ingredient: "Spinach / Bayam (Bag)", urgency: "today" },
      { ingredient: "Leftover Chicken (150g)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Perishable Pasta Pesto",
        cuisine: "Malaysian Fusion",
        ingredients_used: ["Tomatoes", "Spinach", "Leftover Chicken", "Pasta", "Garlic", "Olive Oil"],
        missing_ingredients: ["Oyster Sauce"],
        zai_priority_reason: "Saves all 3 URGENT perishables (RM 7.50 at risk) in one 20-min dish. Spinach replaces basil in a fresh pesto — zero waste, maximum flavour.",
        waste_saved_rm: 11.50,
        image_src: "/meals/pasta_pesto.jpg",
        recipe_steps: [
          "1. Boil pasta in salted water until al dente. Drain, reserving 1 cup of pasta water.",
          "2. While pasta cooks, blend spinach, olive oil, garlic, and a pinch of salt into a vibrant green pesto.",
          "3. Dice the leftover chicken and tomatoes into bite-sized pieces.",
          "4. Heat a pan with a drizzle of oil. Sauté the chicken until lightly golden. Add diced tomatoes and cook 2 mins.",
          "5. Pour in your fresh spinach pesto. Stir, adding pasta water to reach a silky consistency.",
          "6. Toss in the drained pasta. Mix well, plate, and serve immediately."
        ]
      },
      {
        meal_name: "Bayam Telur Goreng (Spinach Egg Stir-fry)",
        cuisine: "Malaysian Chinese",
        ingredients_used: ["Spinach", "Tomatoes", "Garlic", "Olive Oil"],
        missing_ingredients: ["Oyster Sauce", "Sesame Oil"],
        zai_priority_reason: "Saves wilting spinach and softening tomatoes with a 10-min stir-fry. Substituted oyster sauce with soy sauce + sugar for umami.",
        waste_saved_rm: 7.00,
        image_src: "/meals/bayam_telur_goreng.jpg",
        recipe_steps: [
          "1. Wash and cut spinach into 2-inch segments. Slice tomatoes into wedges. Mince garlic.",
          "2. Heat oil in a wok over high heat. Sauté garlic until golden (30 secs).",
          "3. Add tomato wedges — stir-fry 1 min until they start to soften.",
          "4. Push veggies aside, crack 2 eggs directly into the wok and scramble quickly.",
          "5. Add spinach and a splash of soy sauce + pinch of sugar (smart sub for oyster sauce). Toss 1 min until just wilted.",
          "6. Serve hot with steamed rice."
        ]
      },
    ],
    glm_insight: "You have RM 7.50 of perishables expiring TODAY. The spinach is wilting fast and the chicken has been cooked 2 days ago — both must be used immediately. The Pasta Pesto clears everything in one go."
  },

  // ── SCENARIO 2: Focus on Pantry Items (lentils, noodles, eggs, spices) ──
  {
    is_valid: true,
    ingredients: [
      { name: "Garlic & Onions (Assorted)", quantity: "Assorted", freshness: "aging", estimated_cost_rm: 2.00 },
      { name: "Ginger (Aromatics)", quantity: "1 thumb", freshness: "aging", estimated_cost_rm: 3.00 },
      { name: "Red Lentils / Dal (500g)", quantity: "500g", freshness: "fresh", estimated_cost_rm: 6.80 },
      { name: "Instant Noodles (5 pack)", quantity: "5 packs", freshness: "fresh", estimated_cost_rm: 6.00 },
      { name: "Eggs (Large, 12 pack)", quantity: "12 pieces", freshness: "fresh", estimated_cost_rm: 7.50 },
      { name: "Turmeric Powder (Jar)", quantity: "1 jar", freshness: "fresh", estimated_cost_rm: 4.50 },
      { name: "Chili Powder (Jar)", quantity: "1 jar", freshness: "fresh", estimated_cost_rm: 4.50 },
      { name: "Sugar (Pantry staple)", quantity: "1 bag", freshness: "fresh", estimated_cost_rm: 1.20 },
    ],
    expiry_alerts: [
      { ingredient: "Garlic & Onions (Assorted)", urgency: "tomorrow" },
      { ingredient: "Ginger (Aromatics)", urgency: "tomorrow" },
    ],
    meal_decisions: [
      {
        meal_name: "Pantry Rescue Dal Curry",
        cuisine: "Malaysian Indian",
        ingredients_used: ["Garlic & Onions", "Ginger", "Red Lentils", "Turmeric Powder", "Chili Powder"],
        missing_ingredients: ["Coconut Milk"],
        zai_priority_reason: "Uses SOON-expiring aromatics (RM 5.00 at risk) and turns pantry dal into a hearty RM-saving curry. Coconut milk subbed with natural lentil thickness.",
        waste_saved_rm: 11.80,
        image_src: "/meals/dal_curry.jpg",
        recipe_steps: [
          "1. Soak 1 cup of red lentils for 10 minutes. Boil in salted water until soft and creamy (about 15 mins).",
          "2. Finely chop garlic, ginger, and onion. Heat 2 tbsp oil in a deep pan and sauté until fragrant (2 mins).",
          "3. Add turmeric powder and chili powder. Stir 30 seconds until the spices bloom.",
          "4. Pour in the boiled lentils. Simmer on low heat for 5 minutes — the dal thickens naturally (no coconut milk needed).",
          "5. Add salt to taste and a splash of water if too thick.",
          "6. Serve hot with steamed rice or roti. Garnish with a pinch of extra chili if desired."
        ]
      },
      {
        meal_name: "Spicy Mee Goreng Mamak",
        cuisine: "Malaysian Mamak",
        ingredients_used: ["Instant Noodles", "Eggs", "Garlic & Onions", "Ginger", "Chili Powder", "Sugar"],
        missing_ingredients: ["Oyster Sauce", "Bean Sprouts"],
        zai_priority_reason: "Clears SOON aromatics plus eggs in a 15-min wok dish. Sugar + soy sauce replaces oyster sauce for that classic Mamak sweetness.",
        waste_saved_rm: 12.20,
        image_src: "/meals/mee_goreng.jpg",
        recipe_steps: [
          "1. Boil instant noodles for 2 mins until just softened. Drain and set aside.",
          "2. Mince garlic and ginger. Slice onion thinly.",
          "3. Heat 2 tbsp oil in a wok over high heat. Sauté garlic, ginger, and onion until fragrant (1 min). Add chili powder and stir.",
          "4. Push aromatics aside. Crack 2 eggs into the wok and scramble until just set.",
          "5. Add drained noodles, soy sauce (smart sub for oyster sauce), and a pinch of sugar. Toss over high heat for 2 mins.",
          "6. Plate and serve immediately — the smoky wok flavour is the secret."
        ]
      },
      {
        meal_name: "Telur Dadar Berempah (Spiced Omelette)",
        cuisine: "Malaysian",
        ingredients_used: ["Eggs", "Garlic & Onions", "Ginger", "Turmeric Powder", "Chili Powder"],
        missing_ingredients: ["Cooking Oil"],
        zai_priority_reason: "Uses SOON aromatics in a 10-min breakfast dish. Zero waste, maximum ingredient coverage with minimal effort.",
        waste_saved_rm: 8.50,
        image_src: "/meals/telur_dadar.jpg",
        recipe_steps: [
          "1. Crack 4 eggs into a bowl. Add a pinch of turmeric, chili powder, minced garlic, and grated ginger. Whisk well.",
          "2. Dice onion and fold into the egg mixture with a pinch of salt.",
          "3. Heat a non-stick pan with a drizzle of oil over medium heat. Pour in the mixture and let it spread flat.",
          "4. Cook undisturbed for 3 minutes until the bottom is golden. Carefully flip (or finish under a broiler).",
          "5. Slide onto a plate and serve with steamed rice or bread."
        ]
      }
    ],
    glm_insight: "Your aromatics (garlic, ginger) are starting to age — RM 5.00 at risk if not used within 2 days. The Dal Curry and Mee Goreng both clear them while maximizing your pantry staples. Total savable: RM 24.00."
  }
];

const DEMO_RATINGS: Record<string, MealFeedback> = {
  default: { rating_out_of_10: 9, zai_feedback: "Excellent presentation! Your waste prevention instincts are sharp — using every perishable item before expiry is exactly what Z.AI recommends. Keep building that culinary intuition!", xp_gained: 150 },
  "Perishable Pasta Pesto": { rating_out_of_10: 8, zai_feedback: "Great creative substitution with the spinach pesto! The dish looks vibrant and uses every urgent item. A touch more seasoning would make it perfect.", xp_gained: 120 },
  "Bayam Telur Goreng (Spinach Egg Stir-fry)": { rating_out_of_10: 9, zai_feedback: "Classic Malaysian home cooking at its finest. The smart sauce substitution worked perfectly — you saved RM 7 from the bin!", xp_gained: 140 },
  "Pantry Rescue Dal Curry": { rating_out_of_10: 9, zai_feedback: "A beautifully thick, aromatic dal! Skipping the coconut milk was a genius move — the lentils provided all the creaminess needed. Authentic and economical.", xp_gained: 150 },
  "Spicy Mee Goreng Mamak": { rating_out_of_10: 10, zai_feedback: "Perfect wok hei! The sugar-soy substitution for oyster sauce is indistinguishable. This is exactly the kind of smart cooking Z.AI was built to inspire.", xp_gained: 200 },
  "Telur Dadar Berempah (Spiced Omelette)": { rating_out_of_10: 8, zai_feedback: "Golden and fragrant! The turmeric gives it a beautiful colour. A quick and effective way to use up aging aromatics — well done!", xp_gained: 120 },
};

// ════════════════════════════════════════════════════════════════
// CONTEXT
// ════════════════════════════════════════════════════════════════

interface FridgeContextType {
  analysisData: AnalysisData | null;
  setAnalysisData: (data: AnalysisData | null) => void;
  analyzeImages: (files: File[]) => Promise<void>;
  isAnalyzing: boolean;
  error: string | null;
  validationError: string | null;
  rateCookedMeal: (file: File, mealName: string, wasteSavedRm: number) => Promise<void>;
  isRatingMeal: boolean;
  mealFeedback: MealFeedback | null;
  setMealFeedback: (data: MealFeedback | null) => void;
  savedMeals: SavedMeal[];
  loadSavedMeals: () => Promise<void>;
  profileData: Profile | null;
  loadProfile: () => Promise<void>;
  cookMeal: (mealName: string, wasteSavedRm: number) => Promise<void>;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const FridgeContext = createContext<FridgeContextType | undefined>(undefined);

export const FridgeProvider = ({ children }: { children: ReactNode }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRatingMeal, setIsRatingMeal] = useState(false);
  const [mealFeedback, setMealFeedback] = useState<MealFeedback | null>(null);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [apiKey, setApiKey] = useState('');

  const updateApiKey = (key: string) => { setApiKey(key); localStorage.setItem('cookgpt_api_key', key); };

  const loadProfile = async () => {
    if (!profileData) setProfileData(EMPTY_PROFILE);
  };

  const loadSavedMeals = async () => { /* demo: in-memory only */ };

  // DEMO MODE: instant response, random scenario, no API call
  const analyzeImages = async (files: File[]) => {
    setIsAnalyzing(true);
    setError(null);
    setValidationError(null);

    // Brief scanning animation (2s) for realism
    await new Promise(r => setTimeout(r, 2000));

    if (files.length === 0) {
      setValidationError("No image uploaded. Please take a photo of your fridge.");
      setAnalysisData(null);
    } else {
      // Pick a random scenario for variety
      const scenario = DEMO_RESPONSE_LIBRARY[Math.floor(Math.random() * DEMO_RESPONSE_LIBRARY.length)];
      setAnalysisData(scenario);
      const totalSaved = scenario.meal_decisions.reduce((s, m) => s + m.waste_saved_rm, 0);
      setProfileData(prev => prev ? { ...prev, saved_rm: prev.saved_rm + totalSaved } : { ...EMPTY_PROFILE, saved_rm: totalSaved });
      setSavedMeals(prev => [
        ...scenario.meal_decisions.map((m, i) => ({ ...m, id: `demo-${Date.now()}-${i}`, createdAt: new Date().toISOString() })),
        ...prev,
      ]);
    }

    setIsAnalyzing(false);
  };

  const cookMeal = async (mealName: string, wasteSavedRm: number) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setProfileData(prev => prev ? {
      ...prev,
      saved_rm: prev.saved_rm + wasteSavedRm,
      meals_rated: prev.meals_rated + 1,
      xp: prev.xp + Math.round(wasteSavedRm * 10),
      recent_ratings: [{ meal_name: mealName, date: formattedDate, rating: 0, feedback: "Cooked this meal to prevent food waste!" }, ...prev.recent_ratings],
    } : EMPTY_PROFILE);
  };

  // DEMO MODE: hardcoded meal rating, varies by dish name
  const rateCookedMeal = async (file: File, mealName: string, wasteSavedRm: number) => {
    setIsRatingMeal(true);
    setMealFeedback(null);

    await new Promise(r => setTimeout(r, 1200));

    const rating = DEMO_RATINGS[mealName] || DEMO_RATINGS.default;
    setMealFeedback(rating);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setProfileData(prev => prev ? {
      ...prev,
      xp: prev.xp + rating.xp_gained,
      saved_rm: prev.saved_rm + wasteSavedRm,
      meals_rated: prev.meals_rated + 1,
      recent_ratings: [{ meal_name: mealName, date: formattedDate, rating: rating.rating_out_of_10, feedback: rating.zai_feedback }, ...prev.recent_ratings],
    } : EMPTY_PROFILE);

    setIsRatingMeal(false);
  };

  return (
    <FridgeContext.Provider value={{ analysisData, setAnalysisData, analyzeImages, rateCookedMeal, isAnalyzing, error, validationError, isRatingMeal, mealFeedback, setMealFeedback, savedMeals, loadSavedMeals, profileData, loadProfile, cookMeal, apiKey, setApiKey: updateApiKey }}>
      {children}
    </FridgeContext.Provider>
  );
};

export const useFridgeContext = () => {
  const context = useContext(FridgeContext);
  if (!context) throw new Error("useFridgeContext must be used within FridgeProvider");
  return context;
};
