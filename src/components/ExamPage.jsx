import React, { useState } from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'
import ProgressBar from './ui/ProgressBar.jsx'
import { sumPoints } from './data.js'

export default function ExamPage({ onNav, questions, mode, overallPts, mockPts, allowedWrong, onFinish, onAnswer, answers, timerSeconds }){
  const [index, setIndex] = useState(0)
  const [studyMode, setStudyMode] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)
  const [overviewOpen, setOverviewOpen] = useState(true)

  if (!q) {
  return (
    <Page>
      <TopBar onNav={onNav} current="home" />
      <Card>
        <div className="p-5">No questions available. Please go back.</div>
      </Card>
    </Page>
  );
}

  const q = questions[index]
  if (!q) return (<Page><TopBar onNav={onNav} current="home" /><Card><div className="p-5">No questions available. Please go back.</div></Card></Page>)

  const progress = ((index+1)/Math.max(1,questions.length))*100
  const earnedSoFar = questions.slice(0,index+1).reduce((s,it)=> s + (answers[it.id]===it.correct ? it.weight : 0), 0)

  function next(){
    if (index < questions.length-1) setIndex(index+1)
    else {
      const actualTotal = sumPoints(questions)
      const earned = questions.reduce((s,it)=> s + (answers[it.id]===it.correct ? it.weight : 0), 0)
      const displayTotal = mode==='free' ? mockPts : overallPts
      onFinish({ total: displayTotal, earned, actualTotal })
    }
  }

  return (
    <Page>
      <TopBar onNav={onNav} current="home" />
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm text-neutral-600">Points: <span className="font-semibold">{earnedSoFar}</span> / {mode==='free'?mockPts:overallPts}</div>
        <div className="flex-1"><ProgressBar value={progress} /></div>
        <div className="text-sm bg-white border px-3 py-1 rounded-full">⏱️ Timer: {Math.floor(timerSeconds/60)}:00</div>
        {mode==='full' && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-neutral-900" checked={studyMode} onChange={(e)=>setStudyMode(e.target.checked)} />
            Study Mode
          </label>
        )}
        <button onClick={()=>setConfirmExit(true)} className="border border-red-400 text-red-600 hover:bg-red-50 font-medium rounded-full px-3 py-1">Exit Exam</button>
      </div>

      <div className="grid lg:grid-cols-[200px,1fr] gap-3">
        <Card className={overviewOpen? '':'hidden lg:block'}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Overview</div>
              <button onClick={()=>setOverviewOpen(!overviewOpen)} className="text-xs border px-2 py-1 rounded-full bg-white">{overviewOpen? 'Hide':'Show'}</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((qq,i)=>{
                const answered = !!answers[qq.id]
                const isCurrent = i===index
                return (
                  <button key={qq.id} onClick={()=>setIndex(i)} title={`Q${i+1}`} className={`aspect-square rounded-full text-xs flex items-center justify-center border ${isCurrent? 'border-neutral-900': answered? 'border-emerald-400':'border-neutral-200 hover:border-neutral-300'}`}>{i+1}</button>
                )
              })}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-neutral-500">Question {index+1} / {questions.length}</div>
              <div className="text-xs bg-neutral-900 text-white px-2 py-1 rounded-full">{q.weight} pt{q.weight>1?'s':''}</div>
            </div>
            <h2 className="text-xl font-semibold leading-tight">{q.text}</h2>
            {q.image && (<div className="mt-3 overflow-hidden rounded-2xl"><img src={q.image} alt="question" className="w-full h-auto"/></div>)}
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {q.options.map(op=>{
                const chosen = answers[q.id]
                const isChosen = chosen===op.key
                const isCorrect = op.key===q.correct
                const reveal = mode==='full' && studyMode && chosen
                return (
                  <button key={op.key} onClick={()=>onAnswer(q.id, op.key)} className={`text-left p-3 rounded-2xl border transition bg-white ${isChosen? 'border-neutral-900':'border-neutral-200 hover:border-neutral-300'} ${reveal && isCorrect ? ' ring-2 ring-emerald-400':''} ${reveal && isChosen && !isCorrect ? ' ring-2 ring-rose-400':''}`}>
                    <div className="text-xs mb-1 text-neutral-500 uppercase">Option {op.key.toUpperCase()}</div>
                    {op.image && (<div className="mb-2 overflow-hidden rounded-2xl"><img src={op.image} alt={`option ${op.key}`} className="w-full h-auto"/></div>)}
                    {op.text && <div className="text-sm">{op.text}</div>}
                  </button>
                )
              })}
            </div>
            {mode==='full' && studyMode && answers[q.id] && (
              <div className="mt-3 p-3 rounded-2xl bg-neutral-50 border text-sm">{answers[q.id]===q.correct ? '✅ Correct.' : `❌ Not quite. The correct answer is ${q.correct.toUpperCase()}.`}</div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <button onClick={()=>setConfirmExit(true)} className="px-4 py-2 rounded-full border bg-white">Back</button>
              <button onClick={()=>setIndex(Math.max(0,index-1))} className="px-4 py-2 rounded-full border bg-white">Previous</button>
              <button onClick={next} className="px-4 py-2 rounded-full bg-neutral-900 text-white">{index===questions.length-1? 'Finish':'Next'}</button>
            </div>
          </div>
        </Card>
      </div>

      {confirmExit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Exit exam?</h3>
            <p className="text-sm text-neutral-600 mb-4">Your progress will be lost. Are you sure you want to leave?</p>
            <div className="flex justify-end gap-2">
              <button onClick={()=>setConfirmExit(false)} className="px-4 py-2 rounded-full border bg-white">Cancel</button>
              <button onClick={()=>onNav('category')} className="px-4 py-2 rounded-full bg-red-600 text-white">Exit</button>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}
