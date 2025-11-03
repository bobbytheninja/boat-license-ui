import React from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'
import { categories } from './data.js'

export default function PricingPage({ onNav, price }){
  return (
    <Page>
      <TopBar onNav={onNav} current="pricing" />
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map(c=> (
          <Card key={c.id}>
            <div className="p-5">
              <div className="text-sm text-neutral-500">{c.title}</div>
              <div className="text-2xl font-bold">Full Exam Access</div>
              <div className="text-3xl font-extrabold mt-2">€{price}<span className="text-base font-medium text-neutral-500">/mo</span></div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 list-disc ml-5">
                <li>All questions (randomized composition)</li>
                <li>Study Mode + Review</li>
                <li>Images & explanations</li>
              </ul>
              <button onClick={()=>onNav('login')} className="mt-4 w-full py-2 rounded-full bg-neutral-900 text-white">Subscribe</button>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  )
}
