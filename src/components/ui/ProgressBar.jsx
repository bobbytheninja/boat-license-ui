import React from 'react'
export default function ProgressBar({ value=0 }){
  return (
    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
      <div className="h-full bg-neutral-900" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}
