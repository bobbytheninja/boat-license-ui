// src/App.jsx
import React, { useMemo, useState } from "react";

import Page from "./components/ui/Page.jsx";
import Card from "./components/ui/Card.jsx";
import TopBar from "./components/TopBar.jsx";
import Home from "./components/Home.jsx";
import CategoryPage from "./components/CategoryPage.jsx";
import ExamPage from "./components/ExamPage.jsx";
import ResultsPage from "./components/ResultsPage.jsx";
import ReviewPage from "./components/ReviewPage.jsx";
import PricingPage from "./components/PricingPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import AccountPage from "./components/AccountPage.jsx";
import AdminPage from "./components/AdminPage.jsx";

import {
  questionsByCategory,
  composeFlexible,
} from "./components/data.js";

const PRICE_PER_MONTH = 5.99;

export default function App() {
  const [route, setRoute] = useState("home");
  const [activeCategory, setActiveCategory] = useState(null);
  const [mode, setMode] = useState("free");
  const [examQs, setExamQs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [summary, setSummary] = useState(null);

  const [composition, setComposition] = useState({
    jet: { w3: 10, w2: 10, w1: 10 },
    small: { w3: 10, w2: 10, w1: 10 },
    big: { w3: 10, w2: 10, w1: 10 },
    nav: { w3: 10, w2: 10, w1: 10 },
  });
  const [overallPoints, setOverallPoints] = useState({
    jet: 60,
    small: 60,
    big: 60,
    nav: 60,
  });
  const [allowedWrongPoints, setAllowedWrongPoints] = useState({
    jet: 6,
    small: 6,
    big: 6,
    nav: 6,
  });

  const totalFromComposition = useMemo(() => {
    const map = { jet: 0, small: 0, big: 0, nav: 0 };
    Object.keys(composition).forEach((k) => {
      const c = composition[k];
      map[k] = c.w3 * 3 + c.w2 * 2 + c.w1 * 1;
    });
    return map;
  }, [composition]);

  function startExam(category, m) {
    setActiveCategory(category);
    setMode(m);

    const all = questionsByCategory(category);
    const pool = m === "free" ? all.filter((q) => q.isMock) : all;

    // Graceful handling when a category has no questions
    if (!pool.length) {
      alert("No questions available for this category yet. Please choose another category.");
      setRoute("category");
      return;
    }

    const wants = composition[category] || { w3: 10, w2: 10, w1: 10 };
    const { set, warnings } = composeFlexible(pool, wants);
    setExamQs(set);
    setAnswers({});
    setSummary(null);
    setRoute("exam");
    if (warnings.length)
      console.warn("Composition warnings:\n" + warnings.join("\n"));
  }

  function setRouteWithCategory(category) {
    setActiveCategory(category);
    setRoute("category");
  }

  return (
    <div className="font-sans">
      {route === "home" && (
        <Home
          onNav={setRoute}
          onPick={(id) => setRouteWithCategory(id)}
          price={PRICE_PER_MONTH}
        />
      )}

      {route === "category" && activeCategory && (
        <CategoryPage
          category={activeCategory}
          onNav={setRoute}
          overallPts={overallPoints[activeCategory]}
          compTotal={totalFromComposition[activeCategory]}
          allowedWrong={allowedWrongPoints[activeCategory]}
          comp={composition[activeCategory]}
          onStartFree={() => startExam(activeCategory, "free")}
          onStartFull={() => startExam(activeCategory, "full")}
          price={PRICE_PER_MONTH}
        />
      )}

      {route === "exam" && activeCategory && (
        <ExamPage
          onNav={setRoute}
          questions={examQs}
          mode={mode}
          overallPts={overallPoints[activeCategory]}
          mockPts={Math.floor(overallPoints[activeCategory] / 2)}
          allowedWrong={allowedWrongPoints[activeCategory]}
          onAnswer={(id, k) => setAnswers((prev) => ({ ...prev, [id]: k }))}
          answers={answers}
          onFinish={({ total, earned, actualTotal }) => {
            setSummary({ total, earned, actualTotal });
            setRoute("results");
          }}
        />
      )}

      {route === "results" && activeCategory && summary && (
        <ResultsPage
          onNav={setRoute}
          mode={mode}
          overallPts={overallPoints[activeCategory]}
          mockPts={Math.floor(overallPoints[activeCategory] / 2)}
          allowedWrong={allowedWrongPoints[activeCategory]}
          summary={summary}
          onReview={() => setRoute("review")}
        />
      )}

      {route === "review" && (
        <ReviewPage onNav={setRoute} questions={examQs} answers={answers} />
      )}

      {route === "pricing" && <PricingPage onNav={setRoute} price={PRICE_PER_MONTH} />}
      {route === "login" && <LoginPage onNav={setRoute} />}
      {route === "account" && <AccountPage onNav={setRoute} />}
      {route === "admin" && <AdminPage onNav={setRoute} />}
    </div>
  );
}