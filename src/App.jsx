import React, { useMemo, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import Home from './components/Home.jsx'
import CategoryPage from './components/CategoryPage.jsx'
import ExamPage from './components/ExamPage.jsx'
import ResultsPage from './components/ResultsPage.jsx'
import ReviewPage from './components/ReviewPage.jsx'
import PricingPage from './components/PricingPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import AccountPage from './components/AccountPage.jsx'
import AdminPage from './components/AdminPage.jsx'
import { DEMO_QUESTIONS, composeFlexible } from './components/data.js'
import Page from './components/ui/Page.jsx'

const TIMER_SECONDS = 20 * 60
const PRICE_PER_MONTH = 5.99

export default function App(){
  const [route, setRoute] = useState('home')
  const [activeCategory, setActiveCategory] = useState(null)
  const [mode, setMode] = useState('free')
  const [examQs, setExamQs] = useState([])
  const [answers, setAnswers] = useState({})
  const [summary, setSummary] = useState(null)

  const [composition, setComposition] = useState({
    jet: { w3: 10, w2: 10, w1: 10 },
    small: { w3: 10, w2: 10, w1: 10 },
    big: { w3: 10, w2: 10, w1: 10 },
  })
  const [overallPoints, setOverallPoints] = useState({ jet: 60, small: 60, big: 60 })
  const [allowedWrongPoints, setAllowedWrongPoints] = useState({ jet: 6, small: 6, big: 6 })

  const totalFromComposition = useMemo(() => {
    const map = { jet: 0, small: 0, big: 0 }
    Object.keys(composition).forEach((k) => {
      const c = composition[k]
      map[k] = c.w3 * 3 + c.w2 * 2 + c.w1 * 1
    })
    return map
  }, [composition])

  // Helper: return questions for a category whether DEMO_QUESTIONS is an object map or an array
  function poolAllForCategory(category) {
    if (!category) return []
    if (Array.isArray(DEMO_QUESTIONS)) {
      return DEMO_QUESTIONS.filter(q => q.category === category)
    }
    if (DEMO_QUESTIONS && typeof DEMO_QUESTIONS === 'object') {
      return DEMO_QUESTIONS[category] || []
    }
    return []
  }

  function startExam(category, m) {
    setActiveCategory(category)
    setMode(m)

    // Choose question pool
    const poolAll = poolAllForCategory(category)
    const pool = m === 'free' ? poolAll.filter((q) => q.isMock) : poolAll

    // Friendly handling when there are no questions for a category
    if (!pool || pool.length === 0) {
      alert('No questions available for this category yet. Please choose another category.')
      setRoute('category')
      return

    }

    const wants = composition[category] || { w3: 10, w2: 10, w1: 10 }
    const { set, warnings } = composeFlexible(pool, wants)
    setExamQs(set)
    setAnswers({})
    setSummary(null)
    setRoute('exam')
    if (warnings && warnings.length) console.warn('Composition warnings:\n' + warnings.join('\n'))
  }

  function setRouteWithCategory(category){
    setActiveCategory(category)
    setRoute('category')
  }

  return (
    <div className="font-sans min-h-screen bg-neutral-50 text-neutral-900">
      {route==='home' && (
        <Home onNav={setRoute} onPick={(id)=>setRouteWithCategory(id)} price={PRICE_PER_MONTH} />
      )}
      {route==='category' && activeCategory && (
        <CategoryPage
          category={activeCategory}
          onNav={setRoute}
          overallPts={overallPoints[activeCategory]}
          compTotal={totalFromComposition[activeCategory]}
          allowedWrong={allowedWrongPoints[activeCategory]}
          comp={composition[activeCategory]}
          onStartFree={()=>startExam(activeCategory,'free')}
          onStartFull={()=>startExam(activeCategory,'full')}
          price={PRICE_PER_MONTH}
        />
      )}
      {route==='exam' && activeCategory && (
        <ExamPage
          onNav={setRoute}
          questions={examQs}
          mode={mode}
          overallPts={overallPoints[activeCategory]}
          mockPts={Math.floor(overallPoints[activeCategory]/2)}
          allowedWrong={allowedWrongPoints[activeCategory]}
          onAnswer={(id,k)=>setAnswers(prev=>({...prev,[id]:k}))}
          answers={answers}
          onFinish={({ total, earned, actualTotal })=>{ setSummary({ total, earned, actualTotal }); setRoute('results'); }}
          timerSeconds={TIMER_SECONDS}
        />
      )}
      {route==='results' && activeCategory && summary && (
        <ResultsPage onNav={setRoute} mode={mode}
          overallPts={overallPoints[activeCategory]}
          mockPts={Math.floor(overallPoints[activeCategory]/2)}
          allowedWrong={allowedWrongPoints[activeCategory]}
          summary={summary}
          onReview={()=>setRoute('review')}
        />
      )}
      {route==='review' && (
        <ReviewPage onNav={setRoute} questions={examQs} answers={answers} />
      )}
      {route==='pricing' && <PricingPage onNav={setRoute} price={PRICE_PER_MONTH} />}
      {route==='login' && <LoginPage onNav={setRoute} />}
      {route==='account' && <AccountPage onNav={setRoute} price={PRICE_PER_MONTH} />}
      {route==='admin' && (
        <AdminPage
          onNav={setRoute}
          composition={composition}
          onUpdateComp={(id,next)=>setComposition(m=>({...m,[id]:next}))}
          totalFromComposition={totalFromComposition}
          overallPoints={overallPoints}
          onUpdateOverall={(id,val)=>setOverallPoints(m=>({...m,[id]:val}))}
          allowedWrong={allowedWrongPoints}
          onUpdateAllowedWrong={(id,val)=>setAllowedWrongPoints(m=>({...m,[id]:val}))}
        />
      )}
      {route==='contact' && <Page><TopBar onNav={setRoute} current="contact" /><div className="p-5">Contact page stub.</div></Page>}
    </div>
  )
}
