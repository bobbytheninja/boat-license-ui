import React from 'react'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'
import { categories } from './data.js'

export default function Home({ onNav, onPick, price }){
  return (
    <div className="min-h-dvh">
      <div className="relative h-[42vh] w-full overflow-hidden rounded-b-2xl">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop" alt="Water" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={()=>onNav('home')} className="w-10 h-10 rounded-full bg-white/95 text-neutral-900 grid place-items-center">⛵</button>
            <div className="text-2xl font-semibold">AquaSkipper</div>
          </div>
          <h1 className="text-4xl font-extrabold">Master your Boat License</h1>
          <p className="text-white/90 mt-2 max-w-2xl">Practice realistic, weighted exams with images, instant feedback, and a smart review system.</p>
          <div className="mt-4 flex gap-3">
            <button onClick={()=>onNav('pricing')} className="bg-white text-neutral-900 px-4 py-2 rounded-full">Subscribe €{price}/mo</button>
            <button onClick={()=>onNav('contact')} className="bg-white/10 border border-white/40 text-white px-4 py-2 rounded-full">Contact</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-7">
        <TopBar onNav={onNav} current="home" />
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight">Choose your category</h2>
          <p className="text-neutral-600">Click a card to open its exam options.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c)=>(
            <button key={c.id} onClick={()=>onPick(c.id)} className="group text-left">
              <Card>
                <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-lg font-semibold">{c.title}</div>
                  <div className="text-xs bg-neutral-900 text-white px-2 py-1 rounded-full">Open</div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-3 py-5 text-sm text-neutral-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} AquaSkipper</div>
          <div className="flex gap-4">
            <a href="#" onClick={(e)=>{e.preventDefault(); onNav('contact')}} className="hover:underline">Contact</a>
            <a href={`mailto:hello@aquaskipper.example?subject=Careers%20at%20AquaSkipper`} className="hover:underline">Careers</a>
            <a href={`mailto:hello@aquaskipper.example?subject=Partnership%20Inquiry`} className="hover:underline">Partnerships</a>
            <a href={`mailto:hello@aquaskipper.example?subject=Training%20with%20AquaSkipper`} className="hover:underline">Training</a>
            <a href={`mailto:hello@aquaskipper.example?subject=FAQ`} className="hover:underline">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
