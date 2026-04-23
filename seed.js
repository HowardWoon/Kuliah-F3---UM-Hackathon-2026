import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBo8rGVjg3L9w1wZRVCxvbYr1by16A7WTg",
  authDomain: "cookgpt-cda67.firebaseapp.com",
  projectId: "cookgpt-cda67",
  storageBucket: "cookgpt-cda67.firebasestorage.app",
  messagingSenderId: "651715979467",
  appId: "1:651715979467:web:8d529d2b1fa6bb5dc9934e",
  measurementId: "G-0XNMMJF77P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = async () => {
  try {
    const docRef = doc(db, "users", "currentUser");
    await setDoc(docRef, {
      xp: 2850,
      rank_title: "Level 4: Master of Leftovers",
      saved_rm: 320,
      meals_rated: 42,
      recent_ratings: [
        {
          meal_name: "Kampung Fried Rice",
          date: "Today, 1:30 PM",
          rating: 9.0,
          feedback: "Great use of those aging onions. You really elevated a simple dish with perfect heat control today."
        },
        {
          meal_name: "Stir-Fried Bayam",
          date: "2 Days Ago",
          rating: 8.5,
          feedback: "Saved RM 3.50 from the trash! The garlic substitution added great aroma, but next time chop it slightly finer."
        }
      ]
    });
    console.log("Successfully seeded Firestore!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
};

seedData();
