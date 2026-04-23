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
// DEMO RESPONSE LIBRARY — 16 distinct scenarios, randomly selected
// ════════════════════════════════════════════════════════════════

const DEMO_RESPONSE_LIBRARY: AnalysisData[] = [
  // ── SCENARIO 1: Fresh Perishables Focus ──
  {
    is_valid: true,
    ingredients: [
      { name: "Tomatoes (4)", quantity: "4 pieces", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Water Spinach (Bag)", quantity: "1 bag", freshness: "expiring_soon", estimated_cost_rm: 2.50 },
      { name: "Leftover Roast Chicken (150g)", quantity: "150g", freshness: "expiring_soon", estimated_cost_rm: 4.00 },
      { name: "Day-Old Rice (Bowl)", quantity: "1 bowl", freshness: "expiring_soon", estimated_cost_rm: 2.00 },
      { name: "Eggs (Large, 12 pack)", quantity: "12 pieces", freshness: "fresh", estimated_cost_rm: 7.50 },
      { name: "Garlic & Shallots", quantity: "Assorted", freshness: "fresh", estimated_cost_rm: 3.50 },
    ],
    expiry_alerts: [
      { ingredient: "Tomatoes (4)", urgency: "today" },
      { ingredient: "Water Spinach (Bag)", urgency: "today" },
      { ingredient: "Leftover Roast Chicken (150g)", urgency: "today" },
      { ingredient: "Day-Old Rice (Bowl)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Village Fried Rice Rescue",
        cuisine: "Southeast Asian",
        ingredients_used: ["Day-Old Rice", "Leftover Roast Chicken", "Water Spinach", "Garlic & Shallots", "Eggs"],
        missing_ingredients: ["Shrimp Paste"],
        zai_priority_reason: "Clears ALL 4 urgent items in one 15-min wok dish. Compensated for missing shrimp paste by heavily frying garlic and shallots to build an earthy base profile.",
        waste_saved_rm: 11.50,
        image_src: "/meals/village_fried_rice.jpg",
        recipe_steps: [
          "1. Shred the leftover roast chicken.",
          "2. Fry minced garlic and shallots until golden brown.",
          "3. Toss in the day-old rice and stir vigorously to break up clumps.",
          "4. Push rice aside, scramble an egg in the pan, then mix.",
          "5. Add the shredded chicken and Water Spinach. Fry until leaves wilt.",
          "6. Serve hot with a fried egg on top."
        ]
      },
      {
        meal_name: "Quick Chicken & Tomato Stew",
        cuisine: "Southeast Asian Fusion",
        ingredients_used: ["Leftover Roast Chicken", "Tomatoes", "Garlic & Shallots"],
        missing_ingredients: ["Chicken Broth"],
        zai_priority_reason: "Saves RM 7.00 of urgent chicken and tomatoes. Boiled the tomatoes down with water and leftover chicken bones to create an instant rich base — no broth needed.",
        waste_saved_rm: 7.00,
        image_src: "/meals/chicken_stew.jpg",
        recipe_steps: [
          "1. Dice the tomatoes and garlic.",
          "2. Sauté garlic until fragrant, then add tomatoes. Cook until they break down into a sauce.",
          "3. Add water and bring to a simmer.",
          "4. Shred chicken and add to the stew.",
          "5. Let simmer for 15 minutes to allow flavors to meld. Serve with rice."
        ]
      },
      {
        meal_name: "Clear Spinach & Egg Soup",
        cuisine: "Chinese",
        ingredients_used: ["Water Spinach", "Eggs", "Garlic & Shallots"],
        missing_ingredients: ["Dried Anchovies"],
        zai_priority_reason: "Saves wilting spinach in a 10-min comfort soup. Used extra garlic and a dash of soy sauce to build the savory base instead of anchovies.",
        waste_saved_rm: 4.50,
        image_src: "/meals/spinach_soup.jpg",
        recipe_steps: [
          "1. Bring a pot of water to a boil with smashed garlic.",
          "2. Wash and roughly chop the spinach.",
          "3. Drop spinach into the boiling water for exactly 1 minute.",
          "4. Slowly pour in a beaten egg while stirring gently to create egg ribbons.",
          "5. Season with salt and white pepper."
        ]
      },
    ],
    glm_insight: "You have RM 11.50 of perishables expiring TODAY — tomatoes softening, spinach wilting, chicken from 2 days ago, and rice drying out. The Village Fried Rice clears all four in one wok session. Don't wait."
  },

  // ── SCENARIO 2: Pantry & Dried Goods Focus ──
  {
    is_valid: true,
    ingredients: [
      { name: "Garlic & Onions", quantity: "Assorted", freshness: "aging", estimated_cost_rm: 2.00 },
      { name: "Cabbage (Half)", quantity: "1/2 head", freshness: "aging", estimated_cost_rm: 3.00 },
      { name: "Red Lentils (500g)", quantity: "500g", freshness: "fresh", estimated_cost_rm: 6.80 },
      { name: "Instant Noodles (5 pack)", quantity: "5 packs", freshness: "fresh", estimated_cost_rm: 6.00 },
      { name: "Eggs (Large, 12 pack)", quantity: "12 pieces", freshness: "fresh", estimated_cost_rm: 7.50 },
      { name: "Curry Powder (Jar)", quantity: "1 jar", freshness: "fresh", estimated_cost_rm: 4.50 },
    ],
    expiry_alerts: [
      { ingredient: "Garlic & Onions", urgency: "tomorrow" },
      { ingredient: "Cabbage (Half)", urgency: "tomorrow" },
    ],
    meal_decisions: [
      {
        meal_name: "Pantry Rescue Lentil Curry",
        cuisine: "Indian",
        ingredients_used: ["Garlic & Onions", "Red Lentils", "Curry Powder"],
        missing_ingredients: ["Coconut Milk"],
        zai_priority_reason: "Uses SOON-expiring aromatics (RM 5.00 at risk) and turns pantry lentils into a hearty RM-saving curry. Lentils thicken naturally — no coconut milk needed.",
        waste_saved_rm: 8.80,
        image_src: "/meals/lentil_curry.jpg",
        recipe_steps: [
          "1. Wash and boil Red Lentils until soft (about 20 mins).",
          "2. Finely chop onions and garlic.",
          "3. Heat oil in a pan, sauté onions and garlic until golden.",
          "4. Stir in 2 tablespoons of Curry Powder.",
          "5. Pour in the boiled lentils. Simmer for 5 mins.",
          "6. Salt to taste. Serve hot."
        ]
      },
      {
        meal_name: "Street-Style Fried Noodles",
        cuisine: "Indian-Muslim",
        ingredients_used: ["Instant Noodles", "Cabbage", "Garlic & Onions", "Eggs", "Curry Powder"],
        missing_ingredients: ["Dark Soy Sauce"],
        zai_priority_reason: "Clears SOON cabbage and aromatics in a 15-min wok dish. Used half a packet of instant noodle seasoning mixed with curry powder for the signature street-stall color and taste.",
        waste_saved_rm: 5.00,
        image_src: "/meals/fried_noodles.jpg",
        recipe_steps: [
          "1. Boil instant noodles until 80% cooked. Drain immediately.",
          "2. Shred the cabbage thinly.",
          "3. Sauté onions and garlic. Add the shredded cabbage.",
          "4. Push vegetables aside, crack an egg and scramble.",
          "5. Toss in the noodles and sprinkle curry powder.",
          "6. Stir-fry on high heat for 2 minutes until dry."
        ]
      },
      {
        meal_name: "Stuffed Omelette",
        cuisine: "Southeast Asian",
        ingredients_used: ["Eggs", "Garlic & Onions", "Cabbage", "Curry Powder"],
        missing_ingredients: ["Minced Meat"],
        zai_priority_reason: "Uses SOON aromatics and cabbage in a 10-min egg dish. Finely diced cabbage and onions provide bulk and texture instead of minced meat.",
        waste_saved_rm: 5.00,
        image_src: "/meals/omelette.jpg",
        recipe_steps: [
          "1. Finely dice onions, garlic, and a small wedge of cabbage.",
          "2. Crack 3 eggs into a bowl. Add the diced vegetables.",
          "3. Add a pinch of curry powder, salt, and pepper. Beat well.",
          "4. Heat a pan with oil on medium heat.",
          "5. Pour in the egg mixture. Cook until the bottom is golden.",
          "6. Flip carefully and cook for another minute. Slice and serve."
        ]
      },
    ],
    glm_insight: "Your aromatics (garlic, onions) are starting to sprout and the cabbage is bruised — RM 5.00 at risk if not used within 2 days. The Lentil Curry and Fried Noodles both clear them while maximizing your pantry staples. Total savable: RM 24.00."
  },

  // ── SCENARIO 3: Fridge Drawer Veggie & Tofu Rescue ──
  {
    is_valid: true,
    ingredients: [
      { name: "Egg Tofu (2 Tubes)", quantity: "2 tubes", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Oyster Mushrooms", quantity: "1 pack", freshness: "expiring_soon", estimated_cost_rm: 3.50 },
      { name: "Bok Choy", quantity: "1 bunch", freshness: "expiring_soon", estimated_cost_rm: 1.50 },
      { name: "Oyster Sauce", quantity: "1 bottle", freshness: "fresh", estimated_cost_rm: 5.00 },
      { name: "Garlic", quantity: "1 bulb", freshness: "fresh", estimated_cost_rm: 1.50 },
    ],
    expiry_alerts: [
      { ingredient: "Egg Tofu (2 Tubes)", urgency: "today" },
      { ingredient: "Oyster Mushrooms", urgency: "today" },
      { ingredient: "Bok Choy", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Hotplate-Style Sizzling Tofu",
        cuisine: "Chinese",
        ingredients_used: ["Egg Tofu", "Oyster Mushrooms", "Bok Choy", "Oyster Sauce", "Garlic"],
        missing_ingredients: ["Minced Chicken & Cornstarch"],
        zai_priority_reason: "Saves all 3 URGENT items (RM 8.00 at risk) in a 20-min sizzling dish. Skipped the meat and reduced the oyster sauce rapidly to create a thick glaze without needing cornstarch.",
        waste_saved_rm: 8.00,
        image_src: "/meals/sizzling_tofu.jpg",
        recipe_steps: [
          "1. Slice the egg tofu into thick coins. Pan-fry until golden brown. Set aside.",
          "2. Roughly tear the oyster mushrooms and chop the Bok Choy.",
          "3. Sauté minced garlic until fragrant, then add the mushrooms.",
          "4. Pour in 3 tablespoons of Oyster Sauce and a splash of water.",
          "5. Add the fried tofu and Bok Choy into the bubbling sauce.",
          "6. Simmer for 2 minutes until the sauce thickens and coats the tofu."
        ]
      },
      {
        meal_name: "Clear Tofu & Mushroom Soup",
        cuisine: "Chinese",
        ingredients_used: ["Egg Tofu", "Oyster Mushrooms", "Garlic", "Oyster Sauce"],
        missing_ingredients: ["Chicken Stock"],
        zai_priority_reason: "Saves RM 6.50 of urgent tofu and mushrooms in a 15-min comfort soup. Boiled the oyster mushrooms longer with smashed garlic to extract a natural, earthy vegetarian broth.",
        waste_saved_rm: 6.50,
        image_src: "/meals/tofu_soup.jpg",
        recipe_steps: [
          "1. Boil a pot of water with 2 smashed garlic cloves.",
          "2. Add the torn oyster mushrooms and boil for 10 minutes to flavor the water.",
          "3. Gently slice the egg tofu and slide it into the soup.",
          "4. Add a tiny dash of Oyster Sauce for depth and salt to taste.",
          "5. Serve piping hot as a comforting, light meal."
        ]
      },
    ],
    glm_insight: "Your tofu expires tomorrow, the mushrooms are getting slimy, and the Bok Choy leaves are yellowing — RM 8.00 at risk. The Sizzling Tofu clears everything in one hot plate. Vegetarian and budget-friendly."
  },

  // ── SCENARIO 4: Expiring Carbs & Fruit ──
  {
    is_valid: true,
    ingredients: [
      { name: "White Bread (Half Loaf)", quantity: "1/2 loaf", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Overripe Bananas (3)", quantity: "3 pieces", freshness: "expiring_soon", estimated_cost_rm: 3.50 },
      { name: "Eggs (Large)", quantity: "6 pieces", freshness: "fresh", estimated_cost_rm: 4.00 },
      { name: "Condensed Milk", quantity: "1 tin", freshness: "fresh", estimated_cost_rm: 3.50 },
      { name: "Butter", quantity: "1 block", freshness: "fresh", estimated_cost_rm: 2.00 },
    ],
    expiry_alerts: [
      { ingredient: "White Bread (Half Loaf)", urgency: "today" },
      { ingredient: "Overripe Bananas (3)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Coffeehouse Banana French Toast",
        cuisine: "Straits Chinese",
        ingredients_used: ["White Bread", "Overripe Bananas", "Eggs", "Butter", "Condensed Milk"],
        missing_ingredients: ["Maple Syrup & Vanilla Extract"],
        zai_priority_reason: "Saves both URGENT items (RM 6.50 at risk) in a 15-min breakfast. Mashed the hyper-sweet overripe bananas directly into the batter and used Condensed Milk as a drizzle — no maple syrup needed.",
        waste_saved_rm: 6.50,
        image_src: "/meals/banana_toast.jpg",
        recipe_steps: [
          "1. Mash 1 overripe banana into a paste.",
          "2. Crack 2 eggs into the banana paste and beat together to form a sweet batter.",
          "3. Soak slices of the stale bread in the banana-egg mixture.",
          "4. Melt butter in a pan over medium heat.",
          "5. Fry the soaked bread until golden brown on both sides.",
          "6. Serve topped with extra sliced bananas and a drizzle of condensed milk."
        ]
      },
      {
        meal_name: "Quick Bread Pudding Fritters",
        cuisine: "Southeast Asian",
        ingredients_used: ["White Bread", "Overripe Bananas", "Eggs", "Condensed Milk"],
        missing_ingredients: ["Oven & Fresh Milk"],
        zai_priority_reason: "Saves both URGENT items in a 20-min afternoon snack. Bypassed baking entirely by mashing bread with condensed milk and pan-frying into crispy bite-sized fritters.",
        waste_saved_rm: 6.50,
        image_src: "/meals/bread_pudding.jpg",
        recipe_steps: [
          "1. Tear the stale bread into tiny pieces in a large bowl.",
          "2. Add 2 mashed bananas, 1 egg, and 2 tablespoons of condensed milk.",
          "3. Mix aggressively until it forms a thick, sticky dough.",
          "4. Heat oil/butter in a pan.",
          "5. Drop spoonfuls of the batter into the pan, flattening them slightly.",
          "6. Fry until crispy and dark brown. Serve as a afternoon snack."
        ]
      },
    ],
    glm_insight: "Your bread is going stale and the bananas are fully black — RM 6.50 at risk. Both are perfect for sweet dishes. The Banana French Toast and Bread Pudding Fritters transform what looks like waste into irresistible coffeehouse-style treats."
  },

  // ── SCENARIO 5: Forgotten Freezer & Limp Herbs ──
  {
    is_valid: true,
    ingredients: [
      { name: "Frozen Prawns (Box)", quantity: "1 box", freshness: "expiring_soon", estimated_cost_rm: 12.00 },
      { name: "Lemongrass", quantity: "3 stalks", freshness: "expiring_soon", estimated_cost_rm: 1.50 },
      { name: "Kaffir Lime Leaves", quantity: "6 leaves", freshness: "expiring_soon", estimated_cost_rm: 1.00 },
      { name: "Rice Vermicelli", quantity: "1 pack", freshness: "fresh", estimated_cost_rm: 3.50 },
      { name: "Tom Yum Paste (Jar)", quantity: "1 jar", freshness: "fresh", estimated_cost_rm: 6.00 },
    ],
    expiry_alerts: [
      { ingredient: "Frozen Prawns (Box)", urgency: "today" },
      { ingredient: "Lemongrass", urgency: "today" },
      { ingredient: "Kaffir Lime Leaves", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Express Tom Yum Vermicelli",
        cuisine: "Southeast Asian",
        ingredients_used: ["Frozen Prawns", "Lemongrass", "Kaffir Lime Leaves", "Rice Vermicelli", "Tom Yum Paste"],
        missing_ingredients: ["Fresh Chilis & Galangal"],
        zai_priority_reason: "Saves all 3 URGENT items (RM 14.50 at risk) in a 20-min one-pot dish. Relied entirely on the concentrated Tom Yum paste, enhanced by bruising the old lemongrass to release its remaining oils.",
        waste_saved_rm: 18.00,
        image_src: "/meals/tomyam_vermicelli.jpg",
        recipe_steps: [
          "1. Soak the rice vermicelli in warm water until soft. Drain.",
          "2. Defrost prawns quickly under cold running water.",
          "3. Smash the lemongrass stalks with the back of a knife and tear the lime leaves.",
          "4. Heat oil, fry the paste, lemongrass, and leaves until fragrant.",
          "5. Toss in the prawns until they turn pink.",
          "6. Add the soaked vermicelli and a splash of water. Toss vigorously until dry and coated."
        ]
      },
      {
        meal_name: "Clear Lemongrass Prawn Broth",
        cuisine: "Southeast Asian",
        ingredients_used: ["Frozen Prawns", "Lemongrass"],
        missing_ingredients: ["Chicken Stock"],
        zai_priority_reason: "Saves RM 14.50 of urgent prawns and lemongrass in a 15-min comfort soup. Boiled the prawn shells with smashed lemongrass for 10 minutes to create a rapid, sweet seafood stock from scratch.",
        waste_saved_rm: 14.50,
        image_src: "/meals/prawn_broth.jpg",
        recipe_steps: [
          "1. Peel the prawns. DO NOT throw away the shells.",
          "2. Boil 3 cups of water with the prawn shells and smashed lemongrass for 10 mins.",
          "3. Strain the broth and discard the shells and stalks.",
          "4. Bring the clear broth back to a boil, drop in the prawn meat.",
          "5. Turn off heat as soon as prawns curl. Season with salt and lime juice."
        ]
      },
    ],
    glm_insight: "Your frozen prawns are showing freezer burn, the lemongrass is drying out, and the lime leaves are browning — RM 14.50 at risk. The Tom Yum Vermicelli clears everything in one spicy pot. Fast and impressive."
  },

  // ── SCENARIO 6: The Takeaway Rescue ──
  {
    is_valid: true,
    ingredients: [
      { name: "Cold Fried Chicken (2 pcs)", quantity: "2 pieces", freshness: "expiring_soon", estimated_cost_rm: 10.00 },
      { name: "Takeaway Plain Rice", quantity: "1 container", freshness: "expiring_soon", estimated_cost_rm: 2.00 },
      { name: "Spring Onions", quantity: "1 bunch", freshness: "expiring_soon", estimated_cost_rm: 1.00 },
      { name: "Sweet Soy Sauce", quantity: "1 bottle", freshness: "fresh", estimated_cost_rm: 4.50 },
      { name: "Garlic", quantity: "1 bulb", freshness: "fresh", estimated_cost_rm: 1.50 },
    ],
    expiry_alerts: [
      { ingredient: "Cold Fried Chicken (2 pcs)", urgency: "today" },
      { ingredient: "Takeaway Plain Rice", urgency: "today" },
      { ingredient: "Spring Onions", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Quick Soy-Glazed Chicken",
        cuisine: "Southeast Asian",
        ingredients_used: ["Cold Fried Chicken", "Spring Onions", "Sweet Soy Sauce", "Garlic"],
        missing_ingredients: ["Raw Chicken & Marination Time"],
        zai_priority_reason: "Saves RM 11.00 of urgent chicken and spring onions. Bypassed marination completely — simmered the leftover fried chicken in soy sauce so the old crispy batter absorbs the flavor like a sponge.",
        waste_saved_rm: 11.00,
        image_src: "/meals/soy_chicken.jpg",
        recipe_steps: [
          "1. Roughly chop the cold fried chicken into smaller bite-sized chunks.",
          "2. Sauté minced garlic until golden.",
          "3. Pour in 3 tablespoons of sweet soy sauce, a splash of water, and simmer.",
          "4. Toss the fried chicken chunks into the bubbling sauce.",
          "5. Coat evenly until the chicken is hot and the sauce is sticky.",
          "6. Garnish heavily with chopped spring onions. Serve with hot rice."
        ]
      },
      {
        meal_name: "Shredded Chicken Garlic Fried Rice",
        cuisine: "Chinese",
        ingredients_used: ["Takeaway Plain Rice", "Cold Fried Chicken", "Spring Onions", "Garlic"],
        missing_ingredients: ["Fresh Meat & Veggies"],
        zai_priority_reason: "Saves ALL 3 urgent items (RM 13.00 at risk). Peeled the skin off the fried chicken to chop for crispy bits, and shredded the dry meat to provide protein for the hard rice.",
        waste_saved_rm: 13.00,
        image_src: "/meals/chicken_fried_rice.jpg",
        recipe_steps: [
          "1. Strip the meat off the fried chicken bones and shred it. Finely chop the skin.",
          "2. Fry the chopped chicken skin in a dry pan until it releases its oil.",
          "3. Add minced garlic to the chicken oil and fry until fragrant.",
          "4. Toss in the hard takeaway rice, breaking up clumps.",
          "5. Add the shredded chicken and a dash of soy sauce. Stir-fry for 2 mins on high heat.",
          "6. Stir through chopped spring onions and serve immediately."
        ]
      },
    ],
    glm_insight: "Yesterday's fried chicken and rice are on the edge — RM 13.00 at risk. The Garlic Fried Rice resurrects both with zero waste, while the Soy-Glazed Chicken turns old batter into a flavor sponge. Takeaway never had it this good."
  },

  // ── SCENARIO 7: Half-Used Canned Goods ──
  {
    is_valid: true,
    ingredients: [
      { name: "Canned Sardines (Half Open)", quantity: "1/2 can", freshness: "expiring_soon", estimated_cost_rm: 4.50 },
      { name: "Stale Bread (4 slices)", quantity: "4 slices", freshness: "expiring_soon", estimated_cost_rm: 2.00 },
      { name: "Red Onion", quantity: "1 piece", freshness: "fresh", estimated_cost_rm: 1.00 },
      { name: "Lime", quantity: "2 pieces", freshness: "aging", estimated_cost_rm: 2.00 },
    ],
    expiry_alerts: [
      { ingredient: "Canned Sardines (Half Open)", urgency: "today" },
      { ingredient: "Stale Bread (4 slices)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Spicy Sardine Toast",
        cuisine: "Southeast Asian",
        ingredients_used: ["Canned Sardines", "Stale Bread", "Red Onion", "Lime"],
        missing_ingredients: ["Fresh Chilis"],
        zai_priority_reason: "Saves both URGENT items (RM 6.50 at risk). Used the tomato sauce from the sardine can for flavor and heavily toasted the stale bread to mask its dryness.",
        waste_saved_rm: 6.50,
        image_src: "/meals/sardine_toast.jpg",
        recipe_steps: [
          "1. Mash the leftover sardines with diced red onions and a squeeze of lime juice.",
          "2. Heat a pan and lightly fry the sardine mixture to reduce the fishy smell.",
          "3. Toast the stale bread slices until completely crispy.",
          "4. Spread the hot sardine mixture generously over the toast. Serve immediately."
        ]
      },
      {
        meal_name: "Sardine & Onion Fritters",
        cuisine: "Southeast Asian",
        ingredients_used: ["Canned Sardines", "Stale Bread", "Red Onion", "Lime"],
        missing_ingredients: ["Flour"],
        zai_priority_reason: "Saves both URGENT items in a 15-min snack. Tore the stale bread into tiny crumbs and soaked them with the sardine sauce to act as the binding batter — no flour needed.",
        waste_saved_rm: 6.50,
        image_src: "/meals/sardine_fritters.jpg",
        recipe_steps: [
          "1. Mash the sardines and mix with finely chopped red onion.",
          "2. Tear the stale bread into small crumbs and fold into the sardines.",
          "3. Form the mixture into small patties.",
          "4. Pan-fry in hot oil until a crust forms on both sides. Squeeze lime over top before eating."
        ]
      },
    ],
    glm_insight: "Your opened sardines must be used within 2 days and the bread is going stale — RM 6.50 at risk. Both recipes turn the can's tomato sauce and the bread's dryness into strengths. Quick, cheap, and zero waste."
  },

  // ── SCENARIO 8: Festive Leftovers ──
  {
    is_valid: true,
    ingredients: [
      { name: "Leftover Beef Rendang (1 bowl)", quantity: "1 bowl", freshness: "expiring_soon", estimated_cost_rm: 15.00 },
      { name: "Compressed Rice (4 cubes)", quantity: "4 cubes", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Cucumber (Half)", quantity: "1/2 piece", freshness: "aging", estimated_cost_rm: 1.50 },
      { name: "Eggs", quantity: "3 pieces", freshness: "fresh", estimated_cost_rm: 2.50 },
    ],
    expiry_alerts: [
      { ingredient: "Leftover Beef Rendang (1 bowl)", urgency: "today" },
      { ingredient: "Compressed Rice (4 cubes)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Rendang Fried Rice Cubes",
        cuisine: "Southeast Asian",
        ingredients_used: ["Leftover Beef Rendang", "Compressed Rice", "Eggs", "Cucumber"],
        missing_ingredients: ["Cooking Oil & Spices"],
        zai_priority_reason: "Saves RM 18.00 of premium festive leftovers. Used the rendered fat and intense spice paste directly from the cold rendang to fry the rice cubes — no extra oil or spices needed.",
        waste_saved_rm: 18.00,
        image_src: "/meals/rendang_fried.jpg",
        recipe_steps: [
          "1. Cut the cold compressed rice into smaller bite-sized cubes.",
          "2. Shred the leftover beef rendang.",
          "3. Heat a wok and add the rendang — the fat will melt into oil.",
          "4. Toss in the rice cubes and stir-fry until they crisp up and absorb the rendang sauce.",
          "5. Push aside, scramble an egg, and mix. Serve with sliced cucumber."
        ]
      },
      {
        meal_name: "Spicy Rice Egg Muffin",
        cuisine: "Southeast Asian",
        ingredients_used: ["Compressed Rice", "Leftover Beef Rendang", "Eggs", "Cucumber"],
        missing_ingredients: ["Cheese & Milk"],
        zai_priority_reason: "Saves RM 5.50 of hardening rice. Mashed the compressed rice into an egg wash and used the rendang gravy as a flavor bomb center — no dairy needed.",
        waste_saved_rm: 5.50,
        image_src: "/meals/rice_muffin.jpg",
        recipe_steps: [
          "1. Mash the compressed rice and mix with 3 beaten eggs.",
          "2. Pour half the mixture into a greased pan or muffin tin.",
          "3. Add a small spoonful of shredded rendang beef in the middle.",
          "4. Cover with the remaining egg mixture.",
          "5. Pan-fry or bake until the egg is fully set. Garnish with cucumber."
        ]
      },
    ],
    glm_insight: "RM 18.00 of premium festive food is at risk — the rendang is 3 days old and the rice is hardening. The Fried Rice Cubes turn the rendang's own fat and spice into the cooking medium. Festive luxury, rescued."
  },

  // ── SCENARIO 9: The Sad Fruit Bowl ──
  {
    is_valid: true,
    ingredients: [
      { name: "Papaya (Overripe, half)", quantity: "1/2 piece", freshness: "expiring_soon", estimated_cost_rm: 4.50 },
      { name: "Apples (2, wrinkled)", quantity: "2 pieces", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Limes", quantity: "3 pieces", freshness: "fresh", estimated_cost_rm: 2.00 },
      { name: "Sugar & Chili Flakes", quantity: "Assorted", freshness: "fresh", estimated_cost_rm: 2.00 },
    ],
    expiry_alerts: [
      { ingredient: "Papaya (Overripe, half)", urgency: "today" },
      { ingredient: "Apples (2, wrinkled)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Spicy Smashed Papaya Salad",
        cuisine: "Southeast Asian",
        ingredients_used: ["Papaya", "Limes", "Sugar & Chili Flakes"],
        missing_ingredients: ["Green Papaya & Fish Sauce"],
        zai_priority_reason: "Saves RM 4.50 of extremely soft papaya. Used the overripe fruit for a sweeter base, cutting the sweetness sharply with extra lime juice and chili flakes for balance.",
        waste_saved_rm: 4.50,
        image_src: "/meals/papaya_salad.jpg",
        recipe_steps: [
          "1. Scoop out the soft papaya flesh into a bowl.",
          "2. Add a heavy squeeze of lime juice, a pinch of salt, and chili flakes.",
          "3. Mash roughly with a fork — do not puree, keep chunks.",
          "4. Chill in the fridge for 10 minutes and serve cold as a refreshing sweet-and-sour side dish."
        ]
      },
      {
        meal_name: "Caramelized Apple Quick Jam",
        cuisine: "Western",
        ingredients_used: ["Apples", "Sugar & Chili Flakes"],
        missing_ingredients: ["Cinnamon"],
        zai_priority_reason: "Saves RM 3.00 of mealy apples. Caramelized them slowly in their own sugars with a tiny pinch of salt to draw out deep flavor — no cinnamon needed.",
        waste_saved_rm: 3.00,
        image_src: "/meals/apple_jam.jpg",
        recipe_steps: [
          "1. Core and dice the wrinkled apples — keep the skin for texture.",
          "2. Heat a pan and add the apples with 1 tablespoon of sugar and a splash of water.",
          "3. Simmer for 10 minutes until the apples collapse into a chunky, sweet jam.",
          "4. Serve over plain toast, rice, or alongside any neutral carb you have."
        ]
      },
    ],
    glm_insight: "Your fruit bowl is giving up — RM 7.50 at risk. The papaya is extremely soft and the apples are mealy. Both are perfect for transformed dishes where texture doesn't matter. Sweet rescue, zero waste."
  },

  // ── SCENARIO 10: The Condiment Hoarder ──
  {
    is_valid: true,
    ingredients: [
      { name: "Peanut Butter (Bottom of jar)", quantity: "1 jar", freshness: "aging", estimated_cost_rm: 2.50 },
      { name: "Dried Egg Noodles (1 block)", quantity: "1 block", freshness: "fresh", estimated_cost_rm: 1.50 },
      { name: "Cucumber (Limp)", quantity: "1 piece", freshness: "expiring_soon", estimated_cost_rm: 1.50 },
      { name: "Soy Sauce & Chili Oil", quantity: "Assorted", freshness: "fresh", estimated_cost_rm: 8.50 },
    ],
    expiry_alerts: [
      { ingredient: "Cucumber (Limp)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Spicy Peanut Noodles",
        cuisine: "Chinese",
        ingredients_used: ["Peanut Butter", "Cucumber", "Dried Egg Noodles", "Soy Sauce & Chili Oil"],
        missing_ingredients: ["Sesame Paste"],
        zai_priority_reason: "Saves the drying peanut butter and limp cucumber (RM 4.00 at risk). Thinned out the old peanut butter with hot noodle water and soy sauce to create a rich, savory emulsion — no sesame paste needed.",
        waste_saved_rm: 4.00,
        image_src: "/meals/peanut_noodles.jpg",
        recipe_steps: [
          "1. Boil the egg noodles. Save 3 tablespoons of the hot noodle water.",
          "2. In the empty peanut butter jar, add the hot water, soy sauce, and chili oil. Shake vigorously to create a sauce.",
          "3. Julienne the limp cucumber — slicing it thin hides the soft texture.",
          "4. Toss the hot noodles in the peanut sauce. Top with cucumber."
        ]
      },
      {
        meal_name: "Smashed Cucumber Salad",
        cuisine: "Chinese",
        ingredients_used: ["Cucumber", "Soy Sauce & Chili Oil"],
        missing_ingredients: ["Rice Vinegar"],
        zai_priority_reason: "Saves the limp cucumber instantly. Used extreme salting to draw out moisture and crisp it up, finishing with chili oil — no vinegar needed.",
        waste_saved_rm: 1.50,
        image_src: "/meals/smashed_cucumber.jpg",
        recipe_steps: [
          "1. Place the limp cucumber on a board and smash it hard with the flat side of a knife.",
          "2. Tear the smashed cucumber into bite-sized chunks.",
          "3. Toss generously with salt and let sit for 5 mins. Drain the water.",
          "4. Dress with soy sauce and chili oil for an instant crunchy side dish."
        ]
      },
    ],
    glm_insight: "That jar of peanut butter is drying out and the cucumber has lost its crunch — RM 4.00 at risk. The Peanut Noodles turn both problems into a restaurant-quality dish. Your condiment hoarding finally pays off."
  },

  // ── SCENARIO 11: Overbought Root Veggies ──
  {
    is_valid: true,
    ingredients: [
      { name: "Potatoes (3, sprouting)", quantity: "3 pieces", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Carrots (2, bendy)", quantity: "2 pieces", freshness: "expiring_soon", estimated_cost_rm: 2.00 },
      { name: "Wheat Flour", quantity: "1 bag", freshness: "fresh", estimated_cost_rm: 2.50 },
      { name: "Onion", quantity: "1 piece", freshness: "fresh", estimated_cost_rm: 1.00 },
    ],
    expiry_alerts: [
      { ingredient: "Potatoes (3, sprouting)", urgency: "today" },
      { ingredient: "Carrots (2, bendy)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Crispy Potato Carrot Fritters",
        cuisine: "Southeast Asian",
        ingredients_used: ["Potatoes", "Carrots", "Wheat Flour", "Onion"],
        missing_ingredients: ["Eggs"],
        zai_priority_reason: "Saves both URGENT items (RM 5.00 at risk). Grated the potatoes directly into the flour — the natural potato starch and water act as a perfect egg-free binder.",
        waste_saved_rm: 5.00,
        image_src: "/meals/potato_fritters.jpg",
        recipe_steps: [
          "1. Cut away any potato sprouts. Grate the potatoes and carrots into a large bowl.",
          "2. Finely dice the onion and add to the bowl.",
          "3. Add 4 tablespoons of flour, salt, and pepper. Mix until it forms a sticky batter.",
          "4. Drop spoonfuls into a pan with shallow hot oil.",
          "5. Fry until golden and crispy. Serve with chili sauce."
        ]
      },
      {
        meal_name: "Mashed Root Veggie Hash",
        cuisine: "Western",
        ingredients_used: ["Potatoes", "Carrots"],
        missing_ingredients: ["Butter"],
        zai_priority_reason: "Saves RM 5.00 of aging root veggies. Boiled the old carrots with the potatoes to add natural sweetness and moisture to the mash without any dairy.",
        waste_saved_rm: 5.00,
        image_src: "/meals/root_hash.jpg",
        recipe_steps: [
          "1. Peel and chop potatoes and carrots into even chunks.",
          "2. Boil in salted water until very soft (about 15 mins).",
          "3. Drain completely. Mash the potatoes and carrots together.",
          "4. Heat a pan with a little oil, add the mash, and press flat.",
          "5. Cook until the bottom develops a dark, crispy crust. Flip and serve."
        ]
      },
    ],
    glm_insight: "Your potatoes are sprouting and the carrots have gone bendy — RM 5.00 at risk. Remove the sprouts and both are perfectly usable. The Fritters are crispy crowd-pleasers; the Hash is comfort food at its simplest."
  },

  // ── SCENARIO 12: Stale Snacks & Sweets ──
  {
    is_valid: true,
    ingredients: [
      { name: "Cream Crackers (Soft)", quantity: "1 pack", freshness: "expiring_soon", estimated_cost_rm: 4.50 },
      { name: "Chocolate Malt Powder (Hardened)", quantity: "1 tin", freshness: "expiring_soon", estimated_cost_rm: 4.00 },
      { name: "Condensed Milk", quantity: "1 tin", freshness: "fresh", estimated_cost_rm: 3.50 },
      { name: "Butter", quantity: "1 block", freshness: "fresh", estimated_cost_rm: 3.00 },
    ],
    expiry_alerts: [
      { ingredient: "Cream Crackers (Soft)", urgency: "today" },
      { ingredient: "Chocolate Malt Powder (Hardened)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "No-Bake Chocolate Biscuit Cake",
        cuisine: "Western",
        ingredients_used: ["Cream Crackers", "Chocolate Malt Powder", "Condensed Milk", "Butter"],
        missing_ingredients: ["Cocoa Powder"],
        zai_priority_reason: "Saves both URGENT items (RM 8.50 at risk). Chipped out the hardened chocolate malt chunks and melted them with butter to create the fudge layer — no cocoa needed.",
        waste_saved_rm: 8.50,
        image_src: "/meals/biscuit_cake.jpg",
        recipe_steps: [
          "1. Break the soft cream crackers into quarters.",
          "2. In a pan on low heat, melt the butter, then whisk in the hard chocolate malt chunks and condensed milk until smooth.",
          "3. Toss the broken crackers into the chocolate mixture until coated.",
          "4. Press the mixture firmly into a flat container.",
          "5. Chill in the fridge for 2 hours until solid. Slice and serve."
        ]
      },
      {
        meal_name: "Cracker Crust Sweet Pancakes",
        cuisine: "Western",
        ingredients_used: ["Cream Crackers", "Condensed Milk", "Butter"],
        missing_ingredients: ["Pancake Mix"],
        zai_priority_reason: "Saves the soft crackers (RM 4.50 at risk). Crushed them into a fine powder and rehydrated with condensed milk to form a sweet pancake batter — no mix needed.",
        waste_saved_rm: 4.50,
        image_src: "/meals/cracker_pancake.jpg",
        recipe_steps: [
          "1. Crush the soft crackers into powder — a blender or rolling pin works.",
          "2. Add hot water gradually until it forms a thick paste.",
          "3. Stir in 2 spoons of condensed milk.",
          "4. Pour batter onto a hot, buttered pan.",
          "5. Cook until bubbles form, flip, and serve crispy."
        ]
      },
    ],
    glm_insight: "Your crackers lost their crunch and the chocolate malt powder has solidified into rocks — RM 8.50 at risk. Both are secretly perfect for no-bake desserts where crunch doesn't matter and hardness melts away. Sweet salvation."
  },

  // ── SCENARIO 13: Leftover Flatbread & Curry ──
  {
    is_valid: true,
    ingredients: [
      { name: "Flatbread (Cold, 2 pcs)", quantity: "2 pieces", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Leftover Lentil Curry", quantity: "1 bowl", freshness: "expiring_soon", estimated_cost_rm: 3.00 },
      { name: "Eggs (2)", quantity: "2 pieces", freshness: "fresh", estimated_cost_rm: 2.00 },
      { name: "Onions & Chili", quantity: "Assorted", freshness: "fresh", estimated_cost_rm: 2.00 },
    ],
    expiry_alerts: [
      { ingredient: "Flatbread (Cold, 2 pcs)", urgency: "today" },
      { ingredient: "Leftover Lentil Curry", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Chopped Flatbread Stir-fry",
        cuisine: "Indian-Muslim",
        ingredients_used: ["Flatbread", "Leftover Lentil Curry", "Eggs", "Onions & Chili"],
        missing_ingredients: ["Meat"],
        zai_priority_reason: "Saves both URGENT items (RM 6.00 at risk). Chopped the rubbery flatbread into strips and used eggs to bind it, hydrating the dry bread with the leftover curry — no meat needed.",
        waste_saved_rm: 6.00,
        image_src: "/meals/flatbread_stirfry.jpg",
        recipe_steps: [
          "1. Chop the cold flatbread into small ribbons or squares.",
          "2. Sauté chopped onions and chili in a hot pan.",
          "3. Push onions aside, scramble 2 eggs.",
          "4. Toss in the chopped flatbread and stir-fry aggressively.",
          "5. Pour in 3 spoonfuls of leftover curry to soften the flatbread slightly while frying."
        ]
      },
      {
        meal_name: "Curry Soup with Crispy Croutons",
        cuisine: "Indian",
        ingredients_used: ["Flatbread", "Leftover Lentil Curry"],
        missing_ingredients: ["Fresh Bread"],
        zai_priority_reason: "Saves both URGENT items (RM 6.00 at risk). Cut the old flatbread into triangles and dry-fried them until crispy, then used them as croutons for the soup — no fresh bread needed.",
        waste_saved_rm: 6.00,
        image_src: "/meals/curry_soup.jpg",
        recipe_steps: [
          "1. Cut the flatbread into small triangles.",
          "2. Heat a pan (no oil) and toast the triangles until they are completely crispy.",
          "3. In a pot, reheat the leftover curry, adding a splash of water if it's too thick.",
          "4. Serve the hot soup, topped with the crispy croutons."
        ]
      },
    ],
    glm_insight: "Last night's flatbread is rubbery and the curry is sitting there — RM 6.00 at risk. The Stir-fry transforms both into a filling meal, while the Soup turns the old bread into satisfying crunch. Two rescues, zero waste."
  },

  // ── SCENARIO 14: Too Much Tempeh ──
  {
    is_valid: true,
    ingredients: [
      { name: "Tempeh (2 blocks)", quantity: "2 blocks", freshness: "expiring_soon", estimated_cost_rm: 4.00 },
      { name: "Long Beans", quantity: "1 bunch", freshness: "expiring_soon", estimated_cost_rm: 1.50 },
      { name: "Garlic & Chili", quantity: "Assorted", freshness: "fresh", estimated_cost_rm: 2.00 },
      { name: "Sweet Soy Sauce", quantity: "1 bottle", freshness: "fresh", estimated_cost_rm: 3.50 },
    ],
    expiry_alerts: [
      { ingredient: "Tempeh (2 blocks)", urgency: "today" },
      { ingredient: "Long Beans", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Sweet & Spicy Tempeh Stir-fry",
        cuisine: "Southeast Asian",
        ingredients_used: ["Tempeh", "Long Beans", "Garlic & Chili", "Sweet Soy Sauce"],
        missing_ingredients: ["Tamarind Paste"],
        zai_priority_reason: "Saves both URGENT items (RM 5.50 at risk). Deep-fried the pungent tempeh first to kill the smell, then glazed it entirely in sweet soy sauce and chili — no tamarind needed.",
        waste_saved_rm: 5.50,
        image_src: "/meals/tempeh_stirfry.jpg",
        recipe_steps: [
          "1. Dice the tempeh into small cubes. Slice long beans into 1-inch pieces.",
          "2. Deep fry or pan-fry the tempeh cubes until very crispy. Remove and drain.",
          "3. In a wok, fry minced garlic and chili.",
          "4. Add the long beans and stir-fry for 1 minute.",
          "5. Toss the crispy tempeh back in, pour over sweet soy sauce, and stir until sticky."
        ]
      },
      {
        meal_name: "Crispy Tempeh Fries",
        cuisine: "Southeast Asian",
        ingredients_used: ["Tempeh", "Garlic & Chili", "Sweet Soy Sauce"],
        missing_ingredients: ["Dipping Sauce"],
        zai_priority_reason: "Saves the pungent tempeh (RM 4.00 at risk). Fried it into crunchy sticks and mixed sweet soy sauce with raw crushed chili and garlic for an instant spicy dip.",
        waste_saved_rm: 4.00,
        image_src: "/meals/tempeh_fries.jpg",
        recipe_steps: [
          "1. Slice the tempeh into long, thin strips like French fries.",
          "2. Rub with salt and a pinch of garlic powder if you have it.",
          "3. Fry in hot oil until deeply golden and crunchy.",
          "4. Serve immediately with a side of sweet soy sauce mixed with chopped chili."
        ]
      },
    ],
    glm_insight: "Your tempeh is starting to smell pungent and the long beans are wrinkled — RM 5.50 at risk. The secret is always to fry tempeh first: it kills the smell and creates an irresistible crunch. The Stir-fry clears both items."
  },

  // ── SCENARIO 15: The Fishball Leftovers ──
  {
    is_valid: true,
    ingredients: [
      { name: "Fishballs (Half packet)", quantity: "1/2 pack", freshness: "expiring_soon", estimated_cost_rm: 4.50 },
      { name: "Cabbage (Quarter)", quantity: "1/4 head", freshness: "expiring_soon", estimated_cost_rm: 2.00 },
      { name: "White Rice", quantity: "1 bowl", freshness: "fresh", estimated_cost_rm: 2.50 },
      { name: "Garlic", quantity: "1 bulb", freshness: "fresh", estimated_cost_rm: 3.00 },
    ],
    expiry_alerts: [
      { ingredient: "Fishballs (Half packet)", urgency: "today" },
      { ingredient: "Cabbage (Quarter)", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Fishball Cabbage Stir-fry",
        cuisine: "Chinese",
        ingredients_used: ["Fishballs", "Cabbage", "Garlic"],
        missing_ingredients: ["Oyster Sauce"],
        zai_priority_reason: "Saves both URGENT items (RM 6.50 at risk). Used plain garlic, salt, and water to let the natural sweetness of the old cabbage shine through — no oyster sauce needed.",
        waste_saved_rm: 6.50,
        image_src: "/meals/fishball_cabbage.jpg",
        recipe_steps: [
          "1. Wash the cabbage and cut off any black edges. Slice thinly.",
          "2. Cut the fishballs in half.",
          "3. Fry minced garlic in oil until fragrant.",
          "4. Add fishballs and fry until lightly browned.",
          "5. Toss in the cabbage, add a splash of water, and cover for 2 mins to steam. Serve."
        ]
      },
      {
        meal_name: "Clear Fishball Rice Soup",
        cuisine: "Chinese",
        ingredients_used: ["Fishballs", "Cabbage", "White Rice", "Garlic"],
        missing_ingredients: ["Noodles"],
        zai_priority_reason: "Saves both URGENT items (RM 6.50 at risk). Dumped the leftover white rice directly into the broth to make a comforting rice soup — no noodles needed.",
        waste_saved_rm: 6.50,
        image_src: "/meals/fishball_soup.jpg",
        recipe_steps: [
          "1. Boil a pot of water with 2 smashed garlic cloves.",
          "2. Drop in the fishballs and roughly chopped cabbage.",
          "3. Season the broth with salt and pepper.",
          "4. Add a bowl of cold cooked rice directly into the soup.",
          "5. Simmer for 3 minutes until the rice warms through and absorbs the broth."
        ]
      },
    ],
    glm_insight: "Your opened fishballs and aging cabbage — RM 6.50 at risk. Both recipes are 10-15 minute comfort meals. The Stir-fry is quick and savory; the Rice Soup is pure warmth. Simple ingredients, zero waste."
  },

  // ── SCENARIO 16: Instant Noodle Crisis ──
  {
    is_valid: true,
    ingredients: [
      { name: "Curry Instant Noodles (1 pack)", quantity: "1 pack", freshness: "fresh", estimated_cost_rm: 1.50 },
      { name: "Mustard Greens", quantity: "1 bunch", freshness: "expiring_soon", estimated_cost_rm: 2.50 },
      { name: "Eggs", quantity: "2 pieces", freshness: "fresh", estimated_cost_rm: 2.00 },
      { name: "Mayonnaise", quantity: "1 bottle", freshness: "fresh", estimated_cost_rm: 2.00 },
    ],
    expiry_alerts: [
      { ingredient: "Mustard Greens", urgency: "today" },
    ],
    meal_decisions: [
      {
        meal_name: "Creamy Curry Noodles",
        cuisine: "Southeast Asian",
        ingredients_used: ["Curry Instant Noodles", "Mustard Greens", "Eggs", "Mayonnaise"],
        missing_ingredients: ["Cheese or Milk"],
        zai_priority_reason: "Saves the wilting mustard greens (RM 2.50 at risk). Used a dollop of mayonnaise mixed with the curry powder to create a hyper-creamy broth — no cheese or milk needed.",
        waste_saved_rm: 2.50,
        image_src: "/meals/creamy_noodles.jpg",
        recipe_steps: [
          "1. Boil water and cook the noodles and chopped mustard greens until soft.",
          "2. In your serving bowl, crack a raw egg, add the curry seasoning, and 1 spoon of mayonnaise.",
          "3. Mix the raw egg, mayo, and powder into a paste.",
          "4. Pour the boiling noodle water into the bowl, stirring constantly to cook the egg and create a creamy broth.",
          "5. Transfer noodles and greens into the bowl. Eat immediately."
        ]
      },
      {
        meal_name: "Crispy Noodle Omelette",
        cuisine: "Southeast Asian",
        ingredients_used: ["Curry Instant Noodles", "Mustard Greens", "Eggs"],
        missing_ingredients: ["Minced Meat"],
        zai_priority_reason: "Saves the wilting greens (RM 2.50 at risk). Used the chopped mustard greens to provide bulk and texture to the noodle pancake — no minced meat needed.",
        waste_saved_rm: 2.50,
        image_src: "/meals/noodle_omelette.jpg",
        recipe_steps: [
          "1. Boil the noodles WITHOUT the seasoning until soft. Drain well.",
          "2. Finely chop the wilted mustard greens.",
          "3. In a bowl, beat 2 eggs with half the curry seasoning packet. Add the greens and noodles. Mix well.",
          "4. Heat a pan with oil.",
          "5. Pour the noodle-egg mixture in and press flat. Fry until crispy on both sides like a pancake. Slice and serve."
        ]
      },
    ],
    glm_insight: "Your mustard greens are wilting badly — RM 2.50 at risk. Instant noodles might seem basic, but the Creamy Curry hack turns mayo into a viral-worthy broth, and the Noodle Omelette is a filling meal from almost nothing. Student genius."
  }
];

const DEMO_RATINGS: Record<string, MealFeedback> = {
  default: { rating_out_of_10: 7.5, zai_feedback: "Good effort! You used most of your at-risk ingredients. A few more seasoning tweaks and this could be a standout. Keep experimenting!", xp_gained: 120 },
  "Village Fried Rice Rescue": { rating_out_of_10: 9, zai_feedback: "Great wok technique! The garlic-shallot base compensated well for the missing shrimp paste. Solid rescue of all four urgent items.", xp_gained: 170 },
  "Quick Chicken & Tomato Stew": { rating_out_of_10: 7, zai_feedback: "The tomato broth idea was smart, but the chicken was slightly overcooked. Reduce the simmer time next time and this jumps a full point.", xp_gained: 100 },
  "Clear Spinach & Egg Soup": { rating_out_of_10: 7.5, zai_feedback: "Comforting and light. The soy-garlic base was a decent anchovy substitute, though a touch more salt would round it out. Nice weeknight option.", xp_gained: 110 },
  "Pantry Rescue Lentil Curry": { rating_out_of_10: 8, zai_feedback: "Good thickness without coconut milk — the lentils did the heavy lifting. Could use a bit more spice depth, but a reliable budget curry.", xp_gained: 130 },
  "Street-Style Fried Noodles": { rating_out_of_10: 8.5, zai_feedback: "That curry powder + seasoning combo is clever and gets close to stall flavor. A touch too salty though — halve the seasoning packet next time.", xp_gained: 150 },
  "Stuffed Omelette": { rating_out_of_10: 6.5, zai_feedback: "Decent use of aging veggies, but the omelette came out a bit flat. More filling and a crispier sear would elevate this from basic to impressive.", xp_gained: 80 },
  "Hotplate-Style Sizzling Tofu": { rating_out_of_10: 8.5, zai_feedback: "The reduced oyster sauce trick worked well for a cornstarch-free glaze. Tofu was nicely golden. A bit one-dimensional — add chili for balance.", xp_gained: 140 },
  "Clear Tofu & Mushroom Soup": { rating_out_of_10: 7, zai_feedback: "Light and earthy. The mushroom broth had good depth but the tofu was a bit bland on its own. A dash of soy at the end would help.", xp_gained: 100 },
  "Coffeehouse Banana French Toast": { rating_out_of_10: 8.5, zai_feedback: "The banana batter was a smart natural sweetener and the condensed milk drizzle worked well. Bread could be soaked a bit longer for creamier center.", xp_gained: 140 },
  "Quick Bread Pudding Fritters": { rating_out_of_10: 7.5, zai_feedback: "Creative no-oven approach! Crispy outside, soft inside, but a touch too sweet with the condensed milk. Dial it back and these shine.", xp_gained: 110 },
  "Express Tom Yum Vermicelli": { rating_out_of_10: 8.5, zai_feedback: "Impressive depth from just paste and lemongrass. Prawns were tender but slightly overcooked — pull them 30 seconds earlier next time.", xp_gained: 150 },
  "Clear Lemongrass Prawn Broth": { rating_out_of_10: 8, zai_feedback: "The prawn shell stock was a great technique — naturally sweet and clear. Needed a bit more lemongrass punch to really stand out.", xp_gained: 130 },
  "Quick Soy-Glazed Chicken": { rating_out_of_10: 7.5, zai_feedback: "Crispy and sticky, but the old batter soaked up too much soy — got quite salty toward the end. A splash of water in the glaze would fix it.", xp_gained: 110 },
  "Shredded Chicken Garlic Fried Rice": { rating_out_of_10: 8, zai_feedback: "Using chicken skin fat to fry was resourceful. Rice had good smokiness but could be drier — spread it thinner in the wok next time.", xp_gained: 130 },
  "Spicy Sardine Toast": { rating_out_of_10: 6.5, zai_feedback: "Quick and filling, but the fishy aroma was strong. Toasting the bread longer and adding more lime would help balance. Simple does not mean sloppy.", xp_gained: 80 },
  "Sardine & Onion Fritters": { rating_out_of_10: 7, zai_feedback: "The bread-crumb binder idea works. Fritters held together but were slightly mushy inside — fry at higher heat for a crisper shell.", xp_gained: 90 },
  "Rendang Fried Rice Cubes": { rating_out_of_10: 9, zai_feedback: "The rendang fat frying technique is outstanding — spice paste caramelized beautifully on every cube. A touch greasy, but flavor-wise this is top-tier.", xp_gained: 170 },
  "Spicy Rice Egg Muffin": { rating_out_of_10: 6.5, zai_feedback: "The rendang center was a nice surprise, but the rice-egg mix was a bit dense. More egg and less rice would give it a lighter, fluffier texture.", xp_gained: 80 },
  "Spicy Smashed Papaya Salad": { rating_out_of_10: 7.5, zai_feedback: "Surprisingly good for overripe papaya. The sweet-sour-spicy balance was decent but leaned too sweet — dial up the lime and chili.", xp_gained: 110 },
  "Caramelized Apple Quick Jam": { rating_out_of_10: 7, zai_feedback: "Simple and homey. The apples broke down well but the sugar was heavy. A pinch of salt earlier would draw out natural sweetness and need less added sugar.", xp_gained: 90 },
  "Spicy Peanut Noodles": { rating_out_of_10: 8, zai_feedback: "The jar-shake sauce trick is clever and the emulsion was smooth. Noodles were slightly overcooked — drain 30 seconds earlier for better chew.", xp_gained: 130 },
  "Smashed Cucumber Salad": { rating_out_of_10: 7.5, zai_feedback: "Good technique reviving limp cucumber. Crunchy and salty, but needed more acidity. A squeeze of lime or vinegar would brighten it considerably.", xp_gained: 100 },
  "Crispy Potato Carrot Fritters": { rating_out_of_10: 7.5, zai_feedback: "Crispy exterior, decent binding without eggs. The carrot made them slightly sweet which was unexpected. More seasoning in the batter would help.", xp_gained: 100 },
  "Mashed Root Veggie Hash": { rating_out_of_10: 6.5, zai_feedback: "The crispy bottom was the best part, but the mash itself was a bit bland. Salt more aggressively and add garlic next time.", xp_gained: 80 },
  "No-Bake Chocolate Biscuit Cake": { rating_out_of_10: 8.5, zai_feedback: "Impressive transformation of stale crackers and hardened powder. Rich and fudgy, though very sweet — a pinch of salt in the mix would balance it.", xp_gained: 140 },
  "Cracker Crust Sweet Pancakes": { rating_out_of_10: 6.5, zai_feedback: "Creative cracker-powder batter, but the texture was grainy. Finer crushing and an extra egg would make these much smoother.", xp_gained: 80 },
  "Chopped Flatbread Stir-fry": { rating_out_of_10: 7.5, zai_feedback: "Good use of curry to hydrate old flatbread. Flavorful but the bread got soggy quickly — stir-fry at higher heat and serve immediately.", xp_gained: 110 },
  "Curry Soup with Crispy Croutons": { rating_out_of_10: 7, zai_feedback: "The crouton contrast was nice. Soup itself was a bit thin — reduce the added water and let the curry paste do more of the talking.", xp_gained: 90 },
  "Sweet & Spicy Tempeh Stir-fry": { rating_out_of_10: 8, zai_feedback: "Frying the tempeh first was the right call — killed the pungency. The sweet soy glaze was good but could use more chili to cut through the sweetness.", xp_gained: 130 },
  "Crispy Tempeh Fries": { rating_out_of_10: 7.5, zai_feedback: "Crunchy and satisfying with the chili-soy dip. Tempeh was a bit dry inside — a quick brine before frying would add moisture and seasoning.", xp_gained: 100 },
  "Fishball Cabbage Stir-fry": { rating_out_of_10: 6.5, zai_feedback: "Simple and honest home cooking. The cabbage was nicely cooked but the dish lacked seasoning depth. A splash of soy or sesame oil would lift it.", xp_gained: 80 },
  "Clear Fishball Rice Soup": { rating_out_of_10: 7, zai_feedback: "Comforting, but the rice made it starchy and heavy. Using less rice or adding it later would keep the broth clearer and lighter.", xp_gained: 90 },
  "Creamy Curry Noodles": { rating_out_of_10: 8, zai_feedback: "The mayo-curry emulsion is creative and creamy. A bit heavy though — half the mayo and add a splash of noodle water for a lighter but still rich broth.", xp_gained: 130 },
  "Crispy Noodle Omelette": { rating_out_of_10: 7, zai_feedback: "Nice crunch from the noodles, but the curry seasoning was uneven — some bites bland, some overpowering. Mix the powder through more thoroughly.", xp_gained: 90 },
};

// ════════════════════════════════════════════════════════════════
// CONTEXT
// ════════════════════════════════════════════════════════════════

interface FridgeContextType {
  analysisData: AnalysisData | null;
  setAnalysisData: (data: AnalysisData | null) => void;
  analyzeImages: (files: File[]) => Promise<void>;
  isAnalyzing: boolean;
  scanProgress: number;
  scanStepText: string;
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
  toastMessage: string | null;
}

const FridgeContext = createContext<FridgeContextType | undefined>(undefined);

// Initialize with Scenario 0 so the app boots pre-populated
const DEFAULT_SCENARIO = DEMO_RESPONSE_LIBRARY[0];
const DEFAULT_SAVED_MEALS: SavedMeal[] = DEFAULT_SCENARIO.meal_decisions.map((m, i) => ({ ...m, id: `default-${i}`, createdAt: new Date().toISOString() }));
const DEFAULT_TOTAL_SAVED = DEFAULT_SCENARIO.meal_decisions.reduce((s, m) => s + m.waste_saved_rm, 0);

export const FridgeProvider = ({ children }: { children: ReactNode }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(DEFAULT_SCENARIO);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRatingMeal, setIsRatingMeal] = useState(false);
  const [mealFeedback, setMealFeedback] = useState<MealFeedback | null>(null);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>(DEFAULT_SAVED_MEALS);
  const [profileData, setProfileData] = useState<Profile | null>({
    xp: Math.round(DEFAULT_TOTAL_SAVED * 10),
    saved_rm: DEFAULT_TOTAL_SAVED,
    meals_rated: 18,
    recent_ratings: [
      { meal_name: "Village Fried Rice Rescue", date: "Apr 23 at 8:00 PM", rating: 9.0, feedback: "Great wok technique! The garlic-shallot base compensated well for the missing shrimp paste." },
      { meal_name: "Pantry Rescue Lentil Curry", date: "Apr 21 at 1:30 PM", rating: 8.0, feedback: "Good thickness without coconut milk. Could use more spice depth, but a reliable budget curry." },
      { meal_name: "Coffeehouse Banana French Toast", date: "Apr 19 at 9:15 AM", rating: 8.5, feedback: "Smart natural sweetener with the banana batter. Bread could be soaked longer for creamier center." },
    ]
  });
  const [apiKey, setApiKey] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updateApiKey = (key: string) => { setApiKey(key); localStorage.setItem('cookgpt_api_key', key); };

  const loadProfile = async () => {
    if (!profileData) setProfileData({
      ...EMPTY_PROFILE,
      saved_rm: DEFAULT_TOTAL_SAVED,
      xp: Math.round(DEFAULT_TOTAL_SAVED * 10),
      meals_rated: 18,
      recent_ratings: [
        { meal_name: "Village Fried Rice Rescue", date: "Apr 23 at 8:00 PM", rating: 9.0, feedback: "Great wok technique! The garlic-shallot base compensated well for the missing shrimp paste." },
        { meal_name: "Pantry Rescue Lentil Curry", date: "Apr 21 at 1:30 PM", rating: 8.0, feedback: "Good thickness without coconut milk. Could use more spice depth, but a reliable budget curry." },
        { meal_name: "Coffeehouse Banana French Toast", date: "Apr 19 at 9:15 AM", rating: 8.5, feedback: "Smart natural sweetener with the banana batter. Bread could be soaked longer for creamier center." },
      ],
    });
  };

  const loadSavedMeals = async () => { /* demo: in-memory only */ };

  // DEMO MODE: cinematic staged loading, random scenario, no API call
  const analyzeImages = async (files: File[]) => {
    setIsAnalyzing(true);
    setError(null);
    setValidationError(null);

    if (files.length === 0) {
      setScanProgress(100);
      setScanStepText("No image uploaded");
      setValidationError("No image uploaded. Please take a photo of your fridge.");
      setAnalysisData(null);
      setIsAnalyzing(false);
      return;
    }

    // Stage 1: Connecting
    setScanProgress(15);
    setScanStepText("Connecting to Z.AI Vision nodes...");

    await new Promise(r => setTimeout(r, 2500));

    // Stage 2: Identifying
    setScanProgress(35);
    setScanStepText("Isolating and identifying ingredients...");

    await new Promise(r => setTimeout(r, 2500));

    // Stage 3: Freshness diagnostics
    setScanProgress(60);
    setScanStepText("Running freshness and shelf-life diagnostics...");

    await new Promise(r => setTimeout(r, 2500));

    // Stage 4: Valuation
    setScanProgress(85);
    setScanStepText("Calculating economic RM valuation...");

    await new Promise(r => setTimeout(r, 2500));

    // Stage 5: Complete — push data
    const scenario = DEMO_RESPONSE_LIBRARY[Math.floor(Math.random() * DEMO_RESPONSE_LIBRARY.length)];
    setAnalysisData(scenario);
    const totalSaved = scenario.meal_decisions.reduce((s, m) => s + m.waste_saved_rm, 0);
    setProfileData(prev => prev ? { ...prev, saved_rm: prev.saved_rm + totalSaved } : { ...EMPTY_PROFILE, saved_rm: totalSaved });
    setSavedMeals(prev => [
      ...scenario.meal_decisions.map((m, i) => ({ ...m, id: `demo-${Date.now()}-${i}`, createdAt: new Date().toISOString() })),
      ...prev,
    ]);

    setScanProgress(100);
    setScanStepText("Finalizing adaptive recipes...");
    setIsAnalyzing(false);
  };

  const cookMeal = async (mealName: string, wasteSavedRm: number) => {
    const alreadyCooked = profileData?.recent_ratings?.some(r => r.meal_name === mealName);
    if (alreadyCooked) {
      setToastMessage(`Already logged! RM ${wasteSavedRm.toFixed(2)} was already saved.`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " at " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const rating = DEMO_RATINGS[mealName] || { rating_out_of_10: 7.5, zai_feedback: "Good effort using your available ingredients. Some seasoning adjustments would elevate this further. Keep cooking!", xp_gained: Math.round(wasteSavedRm * 10) };
    setProfileData(prev => prev ? {
      ...prev,
      saved_rm: prev.saved_rm + wasteSavedRm,
      meals_rated: prev.meals_rated + 1,
      xp: prev.xp + rating.xp_gained,
      recent_ratings: [{ meal_name: mealName, date: formattedDate, rating: rating.rating_out_of_10, feedback: rating.zai_feedback }, ...prev.recent_ratings],
    } : EMPTY_PROFILE);
    setToastMessage(`Meal Logged! RM ${wasteSavedRm.toFixed(2)} added to your Impact Profile.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // DEMO MODE: hardcoded meal rating, varies by dish name
  const rateCookedMeal = async (file: File, mealName: string, wasteSavedRm: number) => {
    const alreadyCooked = profileData?.recent_ratings?.some(r => r.meal_name === mealName);
    if (alreadyCooked) {
      setToastMessage(`Already logged! RM ${wasteSavedRm.toFixed(2)} was already saved.`);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

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
    <FridgeContext.Provider value={{ analysisData, setAnalysisData, analyzeImages, isAnalyzing, scanProgress, scanStepText, rateCookedMeal, error, validationError, isRatingMeal, mealFeedback, setMealFeedback, savedMeals, loadSavedMeals, profileData, loadProfile, cookMeal, apiKey, setApiKey: updateApiKey, toastMessage }}>
      {children}
    </FridgeContext.Provider>
  );
};

export const useFridgeContext = () => {
  const context = useContext(FridgeContext);
  if (!context) throw new Error("useFridgeContext must be used within FridgeProvider");
  return context;
};
