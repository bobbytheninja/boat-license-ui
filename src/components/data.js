// src/components/data.js

// ---------- Categories (with localStorage override) ----------
const DEFAULT_CATEGORIES = [
  { id: "jet",   title: "Jet Ski",    image: "https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=1600&auto=format&fit=crop" },
  { id: "small", title: "Small Boat", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop" },
  { id: "big",   title: "Yacht",      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop" },
  { id: "nav",   title: "Navigation", image: "https://images.unsplash.com/photo-1539015110319-5f8eefd0d79c?q=80&w=1600&auto=format&fit=crop" },
];

export function loadCategories() {
  try {
    const stored = JSON.parse(localStorage.getItem("categories"));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {}
  return DEFAULT_CATEGORIES;
}

// ---------- Small demo fallback (so app loads even without CSV) ----------
function makeOptions(seed) {
  return [
    { key: "a", text: `Option A (${seed})` },
    { key: "b", text: `Option B (${seed})` },
    { key: "c", text: `Option C (${seed})` },
    { key: "d", text: `Option D (${seed})` },
  ];
}
function genFew(cat) {
  const out = [];
  [3, 2, 1].forEach((w) => {
    for (let i = 1; i <= 3; i++) {
      const id = `${cat}-${w}-demo${i}`;
      out.push({
        id,
        category: cat,
        text: `(${cat.toUpperCase()}) Demo Q${i} — Weight ${w}`,
        weight: w,
        correct: "abcd"[(i + w) % 4],
        isMock: i <= 2,
        image: "",
        options: makeOptions(`${cat}-${w}-${i}`),
        language: "en",
      });
    }
  });
  return out;
}
const DEMO_QUESTIONS = [
  ...genFew("small"),
  // Intentionally not filling other categories so "no questions" path is exercised
];

// ---------- Imported CSV storage ----------
const IMPORT_KEY = "importedQuestions:v1";

export function setImportedQuestions(rows) {
  try {
    const norm = (rows || [])
      .filter(Boolean)
      .map((r) => {
        const weightNum = Number(r.weight);
        const correctKey = String(r.correct || "").trim().toLowerCase(); // a|b|c|d
        const isMock =
          String(r.isMock || "").toLowerCase() === "true" || r.isMock === true;
        const q = {
          id: String(r.id || "").trim(),
          category: String(r.category || "").trim(),
          text: String(r.text || "").trim(),
          weight: [1, 2, 3].includes(weightNum) ? weightNum : 1,
          correct: ["a", "b", "c", "d"].includes(correctKey) ? correctKey : "a",
          isMock: !!isMock,
          image: r.image ? String(r.image).trim() : undefined,
          options: [
            { key: "a", text: r.optionA || "", image: undefined },
            { key: "b", text: r.optionB || "", image: undefined },
            { key: "c", text: r.optionC || "", image: undefined },
            { key: "d", text: r.optionD || "", image: undefined },
          ],
          language: r.language ? String(r.language).trim() : "en",
        };
        return q.id && q.category && q.text ? q : null;
      })
      .filter(Boolean);

    localStorage.setItem(IMPORT_KEY, JSON.stringify(norm));
    return norm.length;
  } catch (e) {
    console.error("Failed to persist imported questions", e);
    return 0;
  }
}

export function getImportedQuestions() {
  try {
    const raw = localStorage.getItem(IMPORT_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function getAllQuestions() {
  const imp = getImportedQuestions();
  return imp.length ? imp : DEMO_QUESTIONS;
}

export function questionsByCategory(catId) {
  return getAllQuestions().filter((q) => q.category === catId);
}

// ---------- Composition helpers ----------
export function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function takeFromPool(pool, n) {
  const sh = shuffle(pool);
  return {
    taken: sh.slice(0, Math.min(n, sh.length)),
    rest: sh.slice(Math.min(n, sh.length)),
  };
}
export function composeFlexible(src, desired) {
  const warnings = [];
  let pool3 = src.filter((q) => q.weight === 3);
  let pool2 = src.filter((q) => q.weight === 2);
  let pool1 = src.filter((q) => q.weight === 1);

  let { taken: t3, rest: r3 } = takeFromPool(pool3, desired.w3);
  pool3 = r3;
  if (t3.length < desired.w3) {
    const deficit = desired.w3 - t3.length;
    const borrow = takeFromPool(pool2, deficit);
    t3 = [...t3, ...borrow.taken];
    pool2 = borrow.rest;
    if (borrow.taken.length < deficit) {
      const deficit2 = deficit - borrow.taken.length;
      const borrow1 = takeFromPool(pool1, deficit2);
      t3 = [...t3, ...borrow1.taken];
      pool1 = borrow1.rest;
      if (borrow1.taken.length < deficit2)
        warnings.push("Not enough questions to fully satisfy 3-pt quota.");
    }
    warnings.push("Filled missing 3-pt with lower weights.");
  }

  let { taken: t2, rest: r2 } = takeFromPool(pool2, desired.w2);
  pool2 = r2;
  if (t2.length < desired.w2) {
    const deficit = desired.w2 - t2.length;
    const borrow = takeFromPool(pool1, deficit);
    t2 = [...t2, ...borrow.taken];
    pool1 = borrow.rest;
    if (borrow.taken.length < deficit)
      warnings.push("Not enough questions to fully satisfy 2-pt quota.");
    warnings.push("Filled missing 2-pt with 1-pt.");
  }

  const { taken: t1 } = takeFromPool(pool1, desired.w1);
  if (t1.length < desired.w1)
    warnings.push("Not enough questions to fully satisfy 1-pt quota.");

  const set = shuffle([...t3, ...t2, ...t1]);
  return { set, warnings };
}

export function sumPoints(questions) {
  return questions.reduce((s, q) => s + q.weight, 0);
}