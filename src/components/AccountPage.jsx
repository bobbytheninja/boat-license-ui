import React from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'

export default function AccountPage({ onNav, price }){
  return (
    <Page>
      <TopBar onNav={onNav} current="account" />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="p-5">
            <h3 className="text-xl font-bold">Subscription</h3>
            <p className="text-neutral-600 text-sm">Manage your plan, invoices and payment method.</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-sm">Current plan</div>
                <div className="font-semibold">Monthly — €{price}</div>
              </div>
              <button className="bg-white border px-3 py-2 rounded-full">Change</button>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-xl font-bold">History</h3>
            <p className="text-neutral-600 text-sm">Recent exams and scores.</p>
            <div className="mt-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b"><span>Jet — Free mock</span><span className="font-medium">(no pass/fail)</span></div>
              <div className="flex items-center justify-between py-2 border-b"><span>Small Boat — Full exam</span><span className="font-medium">42 / 60</span></div>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  )
}
