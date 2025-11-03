import React from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'

export default function LoginPage({ onNav }){
  return (
    <Page>
      <TopBar onNav={onNav} current="login" />
      <div className="max-w-md mx-auto">
        <Card>
          <div className="p-5">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-neutral-600 text-sm">Sign in to access your full exams and history.</p>
            <div className="mt-3 space-y-3">
              <input placeholder="Email" className="w-full border rounded-2xl px-3 py-2" />
              <input placeholder="Password" type="password" className="w-full border rounded-2xl px-3 py-2" />
              <button onClick={()=>onNav('account')} className="w-full bg-neutral-900 text-white py-2 rounded-full">Log in</button>
              <button className="w-full bg-white border py-2 rounded-full">Continue with Google</button>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  )
}
