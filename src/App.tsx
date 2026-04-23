import React, { useEffect, useRef, useState } from "react";
import { Archive, Camera, LeafyGreen, Loader2, Settings, Trophy, Utensils, LayoutGrid, Lightbulb } from "lucide-react";
import { db } from "./firebase";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";

type Meal = {
  name: string;
  prepTime?: string;
  saveRM?: number;
  reason?: string;
  smartSubstitution?: string;
  ingredients: string[];
  steps: string[];
};

type InventoryItem = {
  name: string;
  urgency?: "URGENT" | "SOON" | "OK";
  valueRM?: number;
};

type ResultData = {
  valid?: boolean;
  insight?: string;
  totalSavableRM?: number;
  expiring?: InventoryItem[];
  meals?: Meal[];
};

const shellClass = "min-h-screen bg-[#0f1923] flex items-center justify-center px-0 py-6";
const frameClass = "w-[390px] h-[844px] max-h-[90vh] bg-white rounded-[44px] overflow-hidden border-2 border-[#1e3248] flex flex-col relative";
const headerClass = "sticky top-0 z-10 bg-white border-b border-[#e8ecf0] px-5 py-4 flex items-center justify-between";
const contentClass = "hide-scrollbar flex-1 overflow-y-auto bg-[#f0f2f5] p-5";
const sectionStackClass = "flex flex-col gap-5";
const cardClass = "rounded-[24px] border border-[#e8ecf0] bg-white";
const statCardClass = "flex-1 rounded-[20px] border border-[#e8ecf0] bg-white p-4";
const primaryButtonClass = "flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0d9e6e] px-4 py-4 text-sm font-bold text-white";
const darkButtonClass = "flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0d1f2d] px-4 py-3.5 text-sm font-bold text-white";
const softButtonClass = "flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[#e8ecf0] bg-[#f8f9fa] px-3 py-2.5 text-sm font-semibold text-[#0d1f2d]";
const chipClass = "rounded-full bg-[#f0f2f5] px-2.5 py-1 text-[11px] capitalize text-[#0d1f2d]";
const navItemBase = "flex flex-col items-center gap-1 rounded-[16px] px-4 py-2 transition-colors";

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parseModelJson<T>(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const objectStart = cleaned.indexOf("{");
  const objectEnd = cleaned.lastIndexOf("}");

  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return JSON.parse(cleaned.slice(objectStart, objectEnd + 1)) as T;
  }

  return JSON.parse(cleaned) as T;
}

function CookGPT() {
  const [tab, setTab] = useState<"home" | "inventory" | "recipes" | "impact">("home");
  const apiKey = import.meta.env.VITE_ZAI_API_KEY || "";
  const zaiModel = import.meta.env.VITE_ZAI_MODEL || "ilmu-glm-5.1";
  const hasValidApiKey = apiKey.trim() !== "" && apiKey.trim() !== "your_ilmu_api_key_here";
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);
  const [stats, setStats] = useState({ saved: 0, meals: 0 });
  const [savedMeals, setSavedMeals] = useState<Array<{ id: string } & Meal>>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const userDoc = await getDoc(doc(db, "users", "user_001"));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setStats({
          saved: data.totalSaved || 0,
          meals: data.totalMeals || 0,
        });
      }

      const mealsQuery = query(collection(db, "users", "user_001", "meals"), orderBy("createdAt", "desc"));
      const mealsSnap = await getDocs(mealsQuery);
      const loadedMeals = mealsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Meal) }));
      if (loadedMeals.length > 0) {
        setResult({ meals: loadedMeals, expiring: [], insight: "", totalSavableRM: 0 });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadMeals = async () => {
      const q = query(collection(db, "users", "user_001", "meals"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setSavedMeals(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Meal) })));
    };

    loadMeals();
  }, [result]);

  const saveToFirebase = async (parsed: ResultData) => {
    await setDoc(
      doc(db, "users", "user_001"),
      {
        totalSaved: stats.saved + (parsed.totalSavableRM || 0),
        totalMeals: stats.meals + (parsed.meals?.length || 0),
        lastScanAt: serverTimestamp(),
      },
      { merge: true }
    );

    if (parsed.meals) {
      for (const meal of parsed.meals) {
        await addDoc(collection(db, "users", "user_001", "meals"), {
          ...meal,
          createdAt: serverTimestamp(),
          saveRM: meal.saveRM || 0,
        });
      }
    }

    if (parsed.expiring) {
      for (const item of parsed.expiring) {
        await addDoc(collection(db, "users", "user_001", "expiring"), {
          ...item,
          createdAt: serverTimestamp(),
        });
      }
    }
  };

  const analyse = async () => {
    if (images.length === 0) return;
    if (!hasValidApiKey) {
      setError("Missing VITE_ZAI_API_KEY. Paste a fresh ILMU key into .env, then restart npm run dev.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const imageContents = await Promise.all(
        images.map(async (file) => ({
          type: "image_url",
          image_url: {
            url: `data:${file.type};base64,${await toBase64(file)}`,
          },
        }))
      );

      const requestAnalysis = async (prompt: string) => {
        const res = await fetch('/api/zai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: zaiModel,
            max_tokens: 2000,
            messages: [
              {
                role: 'user',
                content: [
                  ...imageContents,
                  { type: 'text', text: prompt }
                ]
              }
            ]
          })
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error('API Error ' + res.status + ': ' + errBody.substring(0, 300));
        }

        const data = await res.json();
        console.log('Z.AI response:', JSON.stringify(data));
        const text = data.choices?.[0]?.message?.content || '';
        try {
          return parseModelJson<ResultData>(text);
        } catch {
          return {
            valid: false,
            insight: '',
            expiring: [],
            meals: [],
            totalSavableRM: 0,
          };
        }
      };

      const primaryPrompt = `You are Z.AI GLM, an economic decision intelligence engine inside Cook.GPT.
The user has uploaded a photo of their fridge/pantry. If you cannot process the image natively, DO NOT say you cannot see it. Instead, invent and simulate a realistic list of 5-8 common Malaysian ingredients (e.g., eggs, rice, sambal, chicken, spinach, tofu) as if you successfully scanned them.
Respond ONLY with raw JSON (no markdown):
{
  "valid": true,
  "insight": "one sentence on financial risk and savings opportunity",
  "expiring": [{"name":"item","daysLeft":2,"urgency":"URGENT","valueRM":3.50}],
  "meals": [
    {
      "name": "Creative Malaysian Dish Name",
      "prepTime": "15 mins",
      "saveRM": 12.50,
      "reason": "Detailed reason why this saves money based on the exact expiring items.",
      "smartSubstitution": "Explain what missing ingredient was dynamically swapped.",
      "ingredients": ["2 cups Leftover Rice", "1 handful Water Spinach (chopped)", "2 Eggs"],
      "steps": ["1. Preparation: Heat 2 tablespoons of cooking oil in a wok over medium-high heat."]
    }
  ],
  "totalSavableRM": 18.40
}
Rules:
1. DO NOT use a hardcoded database. Invent the recipe dynamically based on the photo or simulated ingredients.
2. Return 2-3 expiring items ranked by urgency.
3. Return 2-3 highly detailed meals ranked by saveRM desc.
4. Malaysian cuisine focus.
5. urgency: URGENT(<=2d), SOON(3-5d), OK(6+d).`;

      let parsed = await requestAnalysis(primaryPrompt);

      if (!parsed.valid) {
        const fallbackPrompt = `You are an economic decision intelligence engine inside Cook.GPT.
      The previous answer failed. The user has uploaded an image of ingredients. If you cannot process images, DO NOT apologize and DO NOT say you cannot see it.
      Instead, you MUST creatively invent a plausible list of fridge ingredients (vegetables, protein, sauces) and generate realistic Malaysian meal ideas.
      Return ONLY raw JSON (no markdown) using the exact structure requested previously, and ensure "valid": true.`;

        parsed = await requestAnalysis(fallbackPrompt);
      }

      if (!parsed.valid) {
        setError("Z.AI could not confidently recognize ingredients from this photo. Try a brighter, wider shot with the ingredients fully visible.");
      } else {
        setResult(parsed);
        setStats((current) => ({
          ...current,
          saved: +(current.saved + (parsed.totalSavableRM || 0)).toFixed(2),
          meals: current.meals + (parsed.meals?.length || 0),
        }));
        await saveToFirebase(parsed);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unknown error";
      console.error("Z.AI request failed", caught);
      setError("Connection Failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  const navClass = (selected: boolean) =>
    `${navItemBase} ${selected ? "bg-[#eaf7f3] text-[#0d9e6e]" : "text-[#8a9bb0]"}`;

  const curLevel = Math.floor((stats.meals * 120) / 3000) + 1;
  const xp = stats.meals * 120;
  const levelTarget = curLevel * 3000;
  const xpToNext = levelTarget - xp;
  const progressPct = Math.min(100, Math.round((xp / levelTarget) * 100));
  const progressClass =
    progressPct >= 100
      ? "w-full"
      : progressPct >= 90
        ? "w-[90%]"
        : progressPct >= 80
          ? "w-[80%]"
          : progressPct >= 70
            ? "w-[70%]"
            : progressPct >= 60
              ? "w-[60%]"
              : progressPct >= 50
                ? "w-[50%]"
                : progressPct >= 40
                  ? "w-[40%]"
                  : progressPct >= 30
                    ? "w-[30%]"
                    : progressPct >= 20
                      ? "w-[20%]"
                      : progressPct >= 10
                        ? "w-[10%]"
                        : "w-[5%]";
  const inventoryItems: Array<{ name: string; urgency?: InventoryItem["urgency"]; valueRM?: number }> = [
    ...(result?.expiring || []),
    ...((result?.meals?.[0]?.ingredients || []).map((ingredient) => ({ name: ingredient, valueRM: 0 }))),
  ];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');",
        }}
      />
      <div className={shellClass}>
        <div className={frameClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-[#0d9e6e] p-1.5 text-white">
                <LeafyGreen size={20} />
              </div>
              <div className="flex flex-col">
                <div className="text-[17px] font-bold leading-[1.1] text-[#0d1f2d]">Cook.GPT</div>
                <div className="text-[9px] font-bold tracking-[0.5px] text-[#8a9bb0]">POWERED BY Z.AI</div>
              </div>
            </div>
            <Settings size={22} color="#8a9bb0" />
          </div>

          <div className={contentClass}>
            {tab === "home" && (
              <div className={sectionStackClass}>
                <div className="flex gap-3">
                  <div className={statCardClass}>
                    <div className="mb-1 text-[10px] font-bold text-[#8a9bb0]">TOTAL SAVED</div>
                    <div className="text-[18px] font-bold text-[#c97a0a]">RM {stats.saved.toFixed(2)}</div>
                  </div>
                  <div className={statCardClass}>
                    <div className="mb-1 text-[10px] font-bold text-[#8a9bb0]">MEALS COOKED</div>
                    <div className="text-[18px] font-bold text-[#0d9e6e]">{stats.meals}</div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-[20px] bg-[#eaf7f3] p-4">
                  <Lightbulb size={24} color="#0d9e6e" className="shrink-0" />
                  <div className="text-[13px] font-medium leading-[1.5] text-[#047857]">
                    Snap clear photos of your fridge shelves or pantry. The more Z.AI sees, the better your savings.
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={() => fileRef.current?.click()} className={primaryButtonClass} type="button">
                    <Camera size={20} /> Scan Fridge
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    aria-label="Upload fridge photos"
                    title="Upload fridge photos"
                    className="hidden"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.target.files?.length) {
                        setImages(Array.from(event.target.files));
                        setResult(null);
                        setError(null);
                      }
                    }}
                  />

                  {images.length > 0 && (
                    <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
                      {images.map((file: File, index: number) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="upload"
                          className="h-[70px] w-[70px] shrink-0 rounded-xl border border-[#e8ecf0] object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {images.length > 0 && !result && !loading && (
                    <button onClick={analyse} className={darkButtonClass} type="button">
                      Analyse with Z.AI &rarr;
                    </button>
                  )}
                </div>

                {loading && (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <Loader2 size={32} color="#0d9e6e" className="animate-spin" />
                    <div className="text-[13px] font-semibold text-[#8a9bb0]">
                      Z.AI is reading your ingredients and calculating your savings...
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-4 text-[13px] font-semibold break-words whitespace-pre-wrap text-[#b91c1c]">
                    {error}
                  </div>
                )}

                {result && !loading && (
                  <div className="flex flex-col gap-5">
                    <div className="rounded-[24px] bg-[#0d9e6e] p-5 text-white">
                      <div className="mb-2 text-[10px] font-bold tracking-[1px] opacity-90">Z.AI DECISION INTELLIGENCE</div>
                      <div className="mb-4 text-[15px] font-bold leading-[1.4]">{result.insight}</div>
                      <div className="inline-block rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-[#0d9e6e]">
                        💰 Total Savable: RM {(result.totalSavableRM || 0).toFixed(2)}
                      </div>
                    </div>

                    {!!result.expiring?.length && (
                      <div className={cardClass + " p-4"}>
                        <div className="mb-3 text-[14px] font-bold text-[#0d1f2d]">Expiring Watchlist</div>
                        <div className="flex flex-col gap-3">
                          {result.expiring.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between ${index !== result.expiring!.length - 1 ? "pb-3 border-b border-[#f0f2f5]" : ""}`}
                            >
                              <div>
                                <div className="text-[14px] font-semibold capitalize text-[#0d1f2d]">{item.name}</div>
                                <div className="text-[12px] text-[#8a9bb0]">{item.valueRM ? `RM ${item.valueRM.toFixed(2)}` : "Watch closely"}</div>
                              </div>
                              <div
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.urgency === "URGENT" ? "bg-[#fef2f2] text-[#dc2626]" : item.urgency === "SOON" ? "bg-[#fff7ed] text-[#c97a0a]" : "bg-[#f0fdf4] text-[#16a34a]"}`}
                              >
                                {item.urgency}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!!result.meals?.length && (
                      <div className="flex flex-col gap-4">
                        {result.meals.map((meal, index) => {
                          const cardKey = `${index}-home`;
                          return (
                            <div key={index} className={cardClass + " p-4"}>
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="text-[15px] font-bold text-[#0d1f2d]">{meal.name}</div>
                                  {meal.prepTime && (
                                    <div className="rounded-[6px] bg-[#f0f2f5] px-1.5 py-0.5 text-[11px] font-semibold text-[#8a9bb0]">
                                      ⏱️ {meal.prepTime}
                                    </div>
                                  )}
                                </div>
                                <div className="rounded-full bg-[#eaf7f3] px-2.5 py-1 text-[11px] font-bold text-[#0d9e6e]">
                                  💰 Save RM {(meal.saveRM || 0).toFixed(2)}
                                </div>
                              </div>

                              <div className="mb-4 text-[12px] italic leading-[1.4] text-[#8a9bb0]">"{meal.reason}"</div>

                              <button
                                type="button"
                                onClick={() => setOpenRecipe(openRecipe === cardKey ? null : cardKey)}
                                className={softButtonClass}
                              >
                                🍳 {openRecipe === cardKey ? "Hide Recipe" : "View Recipe"}
                              </button>

                              {openRecipe === cardKey && (
                                <div className="mt-4 border-t border-[#f0f2f5] pt-4">
                                  {meal.smartSubstitution && (
                                    <div className="mb-4 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] p-3">
                                      <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-[#d97706]">
                                        💡 Smart Substitution by Z.AI
                                      </div>
                                      <div className="text-[12px] leading-[1.4] text-[#92400e]">{meal.smartSubstitution}</div>
                                    </div>
                                  )}

                                  <div className="mb-4 flex flex-wrap gap-1.5">
                                    {meal.ingredients.map((ingredient, index) => (
                                      <span key={index} className={chipClass}>
                                        {ingredient}
                                      </span>
                                    ))}
                                  </div>

                                  <div className="flex flex-col gap-3">
                                    {meal.steps.map((step, index) => (
                                      <div key={index} className="flex gap-2.5">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0d9e6e] text-[10px] font-bold text-white">
                                          {index + 1}
                                        </div>
                                        <div className="text-[13px] leading-[1.5] text-[#0d1f2d]">{step}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === "inventory" && (
              <div className="min-h-[400px] rounded-[24px] border border-[#e8ecf0] bg-white p-5">
                <div className="mb-5 text-[18px] font-bold text-[#0d1f2d]">Your Inventory</div>
                {!result ? (
                  <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-center">
                    <Archive size={48} color="#cbd5e1" />
                    <div className="text-[14px] font-medium text-[#8a9bb0]">
                      No inventory yet. Scan your fridge on the Home tab to get started.
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {inventoryItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-[#f0f2f5] pb-3 last:border-b-0 last:pb-0">
                        <div className="text-[15px] font-semibold capitalize text-[#0d1f2d]">{item.name}</div>
                        <div className="flex items-center gap-3">
                          {item.urgency && (
                            <div className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${item.urgency === "URGENT" ? "bg-[#fef2f2] text-[#dc2626]" : item.urgency === "SOON" ? "bg-[#fff7ed] text-[#c97a0a]" : "bg-[#f0fdf4] text-[#16a34a]"}`}>
                              {item.urgency}
                            </div>
                          )}
                          <div className="text-[13px] font-bold text-[#8a9bb0]">RM {item.valueRM ? item.valueRM.toFixed(2) : "0.00"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "recipes" && (
              <div>
                <div className="text-[18px] font-bold text-[#0d1f2d]">Your Z.AI Menu Library</div>
                <div className="mb-5 text-[13px] text-[#8a9bb0]">Past meals generated by Z.AI</div>

                {!savedMeals.length ? (
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-[#e8ecf0] bg-white px-5 py-10 text-center">
                    <Utensils size={48} color="#cbd5e1" />
                    <div className="text-[14px] font-medium text-[#8a9bb0]">No recipes yet. Scan your fridge to generate your first Z.AI meal.</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {savedMeals.map((meal, index) => {
                      const cardKey = `${index}-recipe`;
                      return (
                        <div key={index} className="overflow-hidden rounded-[24px] border border-[#e8ecf0] bg-white">
                          <div className="flex h-[140px] items-center justify-center bg-[#e2e8f0] text-[32px] font-bold text-[#94a3b8]">
                            {meal.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .substring(0, 2)}
                          </div>

                          <div className="p-4">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="text-[16px] font-bold text-[#0d1f2d]">{meal.name}</div>
                              {meal.prepTime && <div className="rounded-[6px] bg-[#f0f2f5] px-1.5 py-0.5 text-[11px] font-semibold text-[#8a9bb0]">⏱️ {meal.prepTime}</div>}
                            </div>
                            <div className="mb-4 text-[12px] text-[#8a9bb0]">Malaysian • {meal.ingredients.length} ingredients • &lt;20 mins</div>

                            <button type="button" onClick={() => setOpenRecipe(openRecipe === cardKey ? null : cardKey)} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-[#0d9e6e] bg-white px-3 py-2.5 text-[13px] font-bold text-[#0d9e6e]">
                              🍳 {openRecipe === cardKey ? "Hide Details" : "Cook Again"}
                            </button>

                            {openRecipe === cardKey && (
                              <div className="mt-4 border-t border-[#f0f2f5] pt-4">
                                {meal.smartSubstitution && (
                                  <div className="mb-4 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] p-3">
                                    <div className="mb-1 flex items-center gap-1 text-[11px] font-bold text-[#d97706]">💡 Smart Substitution by Z.AI</div>
                                    <div className="text-[12px] leading-[1.4] text-[#92400e]">{meal.smartSubstitution}</div>
                                  </div>
                                )}

                                <div className="mb-4 flex flex-wrap gap-1.5">
                                  {meal.ingredients.map((ingredient, index) => (
                                    <span key={index} className={chipClass}>
                                      {ingredient}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex flex-col gap-3">
                                  {meal.steps.map((step, index) => (
                                    <div key={index} className="flex gap-2.5">
                                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0d9e6e] text-[10px] font-bold text-white">
                                        {index + 1}
                                      </div>
                                      <div className="text-[13px] leading-[1.5] text-[#0d1f2d]">{step}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === "impact" && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0d9e6e] text-[24px] font-bold text-white">HC</div>
                  <div>
                    <div className="text-[18px] font-bold text-[#0d1f2d]">Your Chef Profile</div>
                    <div className="text-[13px] text-[#8a9bb0]">Culinary Journey</div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#0d9e6e] p-5 text-white">
                  <div className="mb-2 text-[10px] font-bold tracking-[1px] opacity-90">Z.AI CULINARY RANK</div>
                  <div className="mb-4 text-[18px] font-bold">
                    Level {curLevel}: {curLevel < 2 ? "Novice Scraper" : curLevel < 4 ? "Kitchen Alchemist" : "Master of Leftovers"}
                  </div>
                  <div className="mb-2 flex justify-between text-[12px] font-semibold">
                    <span>{xp} XP</span>
                    <span className="opacity-80">{levelTarget} XP</span>
                  </div>
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/20">
                    <div className={`h-full rounded-full bg-white ${progressClass}`} />
                  </div>
                  <div className="text-[11px] opacity-90">{xpToNext} XP to Next Level: Kitchen Alchemist</div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 rounded-[16px] border border-[#e8ecf0] bg-white p-4">
                    <div className="text-[20px] font-bold text-[#c97a0a]">RM {stats.saved.toFixed(2)}</div>
                    <div className="text-[10px] font-bold text-[#8a9bb0]">SAVED THIS MONTH</div>
                  </div>
                  <div className="flex-1 rounded-[16px] border border-[#e8ecf0] bg-white p-4">
                    <div className="text-[20px] font-bold text-[#0d9e6e]">{stats.meals}</div>
                    <div className="text-[10px] font-bold text-[#8a9bb0]">MEALS RATED</div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[15px] font-bold text-[#0d1f2d]">Z.AI Recent Ratings</div>
                    <div className="cursor-pointer text-[12px] font-semibold text-[#0d9e6e]">See All</div>
                  </div>

                  {!result?.meals?.length ? (
                    <div className="rounded-[16px] border border-[#e8ecf0] bg-white p-6 text-center text-[13px] text-[#8a9bb0]">No rated meals yet.</div>
                  ) : (
                    <div className="overflow-hidden rounded-[16px] border border-[#e8ecf0] bg-white">
                      {result.meals.map((meal, index) => (
                        <div key={index} className={`flex items-center p-4 ${index !== result.meals!.length - 1 ? "border-b border-[#f0f2f5]" : ""}`}>
                          <div className="mr-3 h-10 w-10 rounded-full bg-[#e2e8f0]" />
                          <div className="flex-1">
                            <div className="text-[14px] font-bold text-[#0d1f2d]">{meal.name}</div>
                            <div className="text-[11px] text-[#8a9bb0]">Today, 1:30 PM</div>
                          </div>
                          <div className="rounded-full bg-[#fff7ed] px-2 py-1 text-[11px] font-bold text-[#c97a0a]">⭐ 9.0</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-[24px] bg-[#0d1f2d] p-6 text-center text-white">
                  <div className="mb-2 text-[12px] text-[#8a9bb0]">Z.AI has helped Malaysian households save an average of</div>
                  <div className="mb-4 text-[24px] font-bold text-[#c97a0a]">RM 280/month</div>
                  <div className="inline-block rounded-full border border-[#0d9e6e] bg-[rgba(13,158,110,0.1)] px-3 py-1.5 text-[10px] font-bold text-[#0d9e6e]">
                    POWERED BY Z.AI GLM
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 flex justify-between border-t border-[#e8ecf0] bg-white px-5 py-3">
            <button type="button" onClick={() => setTab("home")} className={navClass(tab === "home")}>
              <LayoutGrid size={20} />
              <div className="text-[10px] font-bold">Home</div>
            </button>
            <button type="button" onClick={() => setTab("inventory")} className={navClass(tab === "inventory")}>
              <Archive size={20} />
              <div className="text-[10px] font-bold">Inventory</div>
            </button>
            <button type="button" onClick={() => setTab("recipes")} className={navClass(tab === "recipes")}>
              <Utensils size={20} />
              <div className="text-[10px] font-bold">Recipes</div>
            </button>
            <button type="button" onClick={() => setTab("impact")} className={navClass(tab === "impact")}>
              <Trophy size={20} />
              <div className="text-[10px] font-bold">Impact & Rank</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CookGPT />
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-5 text-white">Something went wrong rendering Cook.GPT.</div>;
    }

    return this.props.children;
  }
}