import React from 'react'
export default function TopBar({ onNav, current }){
  function navBtn(active){
    return `px-3 py-1.5 rounded-full text-sm ${active? 'bg-neutral-900 text-white':'bg-white border border-neutral-200 hover:border-neutral-300'}`
  }
  return (
    <div className="sticky top-0 z-20 bg-neutral-50/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/60">
      <div className="max-w-6xl mx-auto px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={()=>onNav('home')} className="w-9 h-9 rounded-full bg-neutral-900 text-white grid place-items-center">⛵</button>
          <div className="text-lg font-semibold tracking-tight">AquaSkipper</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>onNav('home')} className={navBtn(current==='home')}>Home</button>
          <button onClick={()=>onNav('pricing')} className={navBtn(current==='pricing')}>Pricing</button>
          <button onClick={()=>onNav('contact')} className={navBtn(current==='contact')}>Contact</button>
          <button onClick={()=>onNav('admin')} className={navBtn(current==='admin')}>Admin</button>
          <button onClick={()=>onNav('login')} className={navBtn(current==='login')}>Log in</button>
          <button onClick={()=>onNav('account')} className={navBtn(current==='account')}>Account</button>
        </div>
      </div>
    </div>
  )
}
