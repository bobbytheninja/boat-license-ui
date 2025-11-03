import React from 'react'
export default function Page({ children }){
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <div className="max-w-6xl mx-auto px-3 py-5">{children}</div>
    </div>
  )
}
