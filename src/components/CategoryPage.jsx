import React from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'
import { loadCategories } from './data.js'

export default function CategoryPage({
  category,
  onStartFree,
  onStartFull,
  overallPts,
  compTotal,
  allowedWrong,
  comp,
  onNav,
  price
}) {
  const cats = loadCategories()
  const cat = cats.find((c) => c.id === category) || { id: category, title: category }

  return (
    <Page>
      <TopBar onNav={onNav} current="home" />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Card>
            <div className="p-5">
              <h2 className="text-2xl font-bold">{cat.title} — Exams</h2>
              <p className="text-neutral-600 mt-1">
                Composition: <strong>{comp.w3}</strong>×3-pt, <strong>{comp.w2}</strong>×2-pt, <strong>{comp.w1}</strong>×1-pt.
                Derived points: <strong>{compTotal}</strong>.
                <br/>Configured overall points: <strong>{overallPts}</strong> (Mock shows half = <strong>{Math.floor(overallPts/2)}</strong>). Allowed wrong: <strong>{allowedWrong}</strong> points.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <div className="p-4 border rounded-2xl">
                  <div className="text-lg font-semibold">Free Mock Exam</div>
                  <p className="text-sm text-neutral-600">
                    No pass/fail. Review your wrong answers at the end. Scored out of {Math.floor(overallPts/2)} pts.
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-3">
                    <Badge>Timer</Badge><Badge>Mock subset</Badge><Badge>Overview nav</Badge>
                  </div>
                  <button onClick={onStartFree} className="mt-4 w-full bg-neutral-900 text-white py-2 rounded-full">
                    Start Free Mock
                  </button>
                </div>

                <div className="p-4 border rounded-2xl">
                  <div className="text-lg font-semibold">Full Exam</div>
                  <p className="text-sm text-neutral-600">
                    Score shown out of {overallPts} points. Pass if wrong ≤ {allowedWrong} pts.
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-3">
                    <Badge>Timer</Badge><Badge>Study Mode</Badge><Badge>Overview nav</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={()=>onNav('pricing')} className="bg-emerald-600 text-white py-2 rounded-full">
                      Subscribe €{price}/mo
                    </button>
                    <button onClick={()=>onNav('login')} className="bg-white border border-neutral-300 py-2 rounded-full">
                      Log in
                    </button>
                  </div>
                  <button onClick={onStartFull} className="mt-2 w-full bg-neutral-900 text-white py-2 rounded-full">
                    Start Full (demo)
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-[400px]">
          <Card>
            <div className="p-5">
              <h3 className="font-semibold">What you’ll get</h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 list-disc ml-5">
                <li>Randomized composition per your settings</li>
                <li>Flexible fill if a weight is short (warns admin)</li>
                <li>Question Overview to jump anywhere</li>
                <li>Free Mock uses only mock-flagged questions</li>
                <li>Pass rule in Full: wrong ≤ {allowedWrong} pts</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}