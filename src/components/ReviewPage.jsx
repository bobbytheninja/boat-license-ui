import React from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'

export default function ReviewPage({ onNav, questions, answers }){
  const wrong = questions.filter(q=> answers[q.id] && answers[q.id] !== q.correct )
  return (
    <Page>
      <TopBar onNav={onNav} current="home" />
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Review — Wrong Answers</h2>
        <p className="text-neutral-600">See what you missed. (Explanations will appear here later.)</p>
      </div>
      {wrong.length===0 ? (
        <Card><div className="p-5">🎉 No wrong answers to review. Great job!</div></Card>
      ): (
        <div className="space-y-4">
          {wrong.map(q=> (
            <Card key={q.id}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-neutral-500">Q#{q.id}</div>
                  <div className="text-xs bg-neutral-900 text-white px-2 py-1 rounded-full">{q.weight} pt{q.weight>1? 's':''}</div>
                </div>
                <div className="font-semibold">{q.text}</div>
                {q.image && (<div className="mt-3 overflow-hidden rounded-2xl"><img src={q.image} alt="question" className="w-full h-auto"/></div>)}
                <div className="mt-3 text-sm">Your answer: <span className="font-medium uppercase">{answers[q.id]}</span></div>
                <div className="text-sm">Correct answer: <span className="font-medium uppercase">{q.correct}</span></div>
                <div className="mt-3 text-sm text-neutral-600">Explanation: <em>— (placeholder)</em></div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-4"><button onClick={()=>onNav('account')} className="px-4 py-2 rounded-full bg-neutral-900 text-white">Done</button></div>
    </Page>
  )
}
