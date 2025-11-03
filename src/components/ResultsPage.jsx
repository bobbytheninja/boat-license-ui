import React from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'

export default function ResultsPage({ onNav, mode, overallPts, mockPts, allowedWrong, summary, onReview }){
  const { total, earned, actualTotal } = summary
  const passCut = overallPts - allowedWrong
  const passed = mode==='full' ? earned >= passCut : false
  return (
    <Page>
      <TopBar onNav={onNav} current="home" />
      <Card>
        <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold">Your Result</h2>
            <div className="mt-1.5 text-neutral-700">Score: <span className="font-semibold">{earned}</span> / {total} points</div>
            <div className="mt-1 text-xs text-neutral-500">(Actual points from chosen questions: {actualTotal})</div>
            {mode==='full' ? (
              <>
                <div className="mt-2 text-sm text-neutral-600">Pass rule: wrong ≤ {allowedWrong} pts (pass if ≥ {passCut})</div>
                <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${passed? 'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700'}`}>{passed? 'PASSED':'NOT PASSED'}</div>
              </>
            ) : (
              <div className="mt-2 text-sm text-neutral-600">Free Mock: no pass/fail. Review your mistakes below.</div>
            )}
          </div>
          <div className="w-full sm:w-[340px] grid grid-cols-1 gap-2">
            <button onClick={onReview} className="w-full bg-white border border-neutral-300 py-2 rounded-full">Review wrong answers</button>
            {mode==='free' && (<button onClick={()=>onNav('pricing')} className="w-full bg-neutral-900 text-white py-2 rounded-full">Unlock Full Exam</button>)}
          </div>
        </div>
      </Card>
    </Page>
  )
}
