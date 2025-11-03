import React from 'react'

export default function Card({ children, className='' }) {
  // Tighter shadow, softer border, slightly smaller rounding for compact look
  return (
    <div
      className={
        `bg-white rounded-2xl shadow-sm border border-neutral-200/60 ` +
        `hover:shadow-md transition-shadow ${className}`
      }
    >
      {children}
    </div>
  )
}
