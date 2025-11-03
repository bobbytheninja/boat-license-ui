import React, { useMemo, useState } from 'react'
import Page from './ui/Page.jsx'
import TopBar from './TopBar.jsx'
import Card from './ui/Card.jsx'
import { categories } from './data.js'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

const REQUIRED_COLUMNS = [
  'id', 'category', 'text', 'correct', 'weight', 'isMock',
]
const OPTION_KEYS = ['optionA','optionB','optionC','optionD']
const OPTIONAL_COLUMNS = ['image', 'explanation', 'language']

function normalizeRow(raw) {
  const row = {}
  for (const k in raw) {
    const nk = String(k || '').trim()
    const v = raw[k]
    row[nk] = typeof v === 'string' ? v.trim() : v
  }
  if (row.weight != null) row.weight = Number(row.weight)
  if (row.isMock != null) {
    const s = String(row.isMock).toLowerCase()
    row.isMock = (s === 'true' || s === '1' || s === 'yes' || s === 'y')
  }
  if (row.language == null || row.language === '') row.language = 'en'
  return row
}

function validateRow(row) {
  const issues = []
  for (const col of REQUIRED_COLUMNS) {
    if (row[col] === undefined || row[col] === null || row[col] === '') {
      issues.push(`Missing required column: ${col}`)
    }
  }
  const known = categories.map(c => c.id)
  if (!known.includes(row.category)) {
    issues.push(`Unknown category "${row.category}" (must be one of: ${known.join(', ')})`)
  }
  if (![1,2,3].includes(Number(row.weight))) {
    issues.push(`Invalid weight "${row.weight}" (must be 1, 2, or 3)`)
  }
  const c = String(row.correct || '').toLowerCase()
  if (!['a','b','c','d'].includes(c)) {
    issues.push(`Invalid correct option "${row.correct}" (must be A/B/C/D)`)
  }
  const hasAllOptions = OPTION_KEYS.every(k => row[k] != null && String(row[k]).length > 0)
  if (!hasAllOptions) {
    issues.push(`Options must include ${OPTION_KEYS.join(', ')}`)
  }
  if (row.image && !/^https?:\/\//i.test(row.image)) {
    issues.push(`image must be a URL (got "${row.image}")`)
  }
  return issues
}

export default function AdminPage({
  onNav,
  composition,
  onUpdateComp,
  totalFromComposition,
  overallPoints,
  onUpdateOverall,
  allowedWrong,
  onUpdateAllowedWrong,
}) {
  const [fileIssues, setFileIssues] = useState([])
  const [hasErrors, setHasErrors] = useState(false)

  const [previewRows, setPreviewRows] = useState([])
  const [badRowIndexes, setBadRowIndexes] = useState([])
  const [columns, setColumns] = useState([])

  function parseCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => resolve(res.data || []),
        error: (err) => reject(err),
      })
    })
  }
  async function parseXLSX(file) {
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    return XLSX.utils.sheet_to_json(ws, { defval: '' })
  }

  async function onUploadFile(evt) {
    const file = evt.target.files?.[0]
    if (!file) return

    const ext = file.name.toLowerCase().split('.').pop()
    let rawRows = []
    try {
      if (ext === 'csv') rawRows = await parseCSV(file)
      else if (ext === 'xlsx' || ext === 'xls') rawRows = await parseXLSX(file)
      else {
        setFileIssues([`Unsupported file type ".${ext}". Please upload .csv or .xlsx`])
        setHasErrors(true)
        setPreviewRows([]); setBadRowIndexes([]); setColumns([])
        return
      }
    } catch (e) {
      setFileIssues([`Failed to parse file: ${e?.message || e}`])
      setHasErrors(true)
      setPreviewRows([]); setBadRowIndexes([]); setColumns([])
      return
    }

    const normalized = rawRows.map(normalizeRow)
    const problems = []
    const badIdx = []
    normalized.forEach((row, idx) => {
      const rowIssues = validateRow(row)
      if (rowIssues.length) {
        badIdx.push(idx)
        problems.push(`Row ${idx + 2}: ${rowIssues.join(' | ')}`)
      }
    })
    const colSet = new Set()
    normalized.forEach(r => Object.keys(r).forEach(k => colSet.add(k)))
    const ordered = [
      ...REQUIRED_COLUMNS,
      ...OPTION_KEYS,
      ...OPTIONAL_COLUMNS,
      ...Array.from(colSet).filter(k => !REQUIRED_COLUMNS.includes(k) && !OPTION_KEYS.includes(k) && !OPTIONAL_COLUMNS.includes(k))
    ]

    setPreviewRows(normalized)
    setBadRowIndexes(badIdx)
    setColumns(ordered)
    setFileIssues(problems)
    setHasErrors(problems.some(p => /Missing required|Invalid weight|Unknown category|Invalid correct/i.test(p)))
  }

  const canProceed = true

  return (
    <Page>
      <TopBar onNav={onNav} current="admin" />

      <Card className={hasErrors? 'border-red-400':''}>
        <div className="p-5">
          <h2 className="text-2xl font-bold">Admin — Upload Questions (CSV/XLSX)</h2>
          <p className="text-neutral-600 text-sm mt-1">
            Upload your Excel/CSV. We’ll validate columns, types, and simple URLs. Problem rows will be
            <span className="text-red-600 font-medium"> outlined in red</span> — but you can still proceed (flexible fill for missing weights).
          </p>
          <div className="mt-3">
            <input type="file" accept=".csv,.xlsx" onChange={onUploadFile} className="block" />
          </div>

          {fileIssues.length > 0 && (
            <div className="mt-3 p-3 rounded-2xl bg-red-50 border border-red-300 text-sm">
              <div className="font-semibold mb-1">Validation warnings</div>
              <ul className="list-disc ml-5 space-y-1">
                {fileIssues.map((x,i)=>(<li key={i}>{x}</li>))}
              </ul>
              <div className="mt-2 text-xs text-red-700">
                You may continue — missing 3-pt questions will be filled by 2-pt, then 1-pt automatically.
              </div>
            </div>
          )}

          {previewRows.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Preview ({previewRows.length} rows)</div>
              <div className="overflow-auto border rounded-2xl">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      {columns.map(col => (
                        <th key={col} className="text-left px-3 py-2 border-b">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={(badRowIndexes.includes(idx) ? 'ring-1 ring-red-400 bg-red-50/40' : '') + ' align-top'}
                      >
                        {columns.map(col => (
                          <td key={col} className="px-3 py-2 border-b">
                            {String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex gap-2">
                <button className="px-3 py-2 rounded-full border bg-white">Cancel</button>
                <button
                  disabled={!canProceed}
                  className={`px-3 py-2 rounded-full ${canProceed ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'}`}
                  onClick={() => {
                    alert('Proceeding with import (demo). In real app, we would write to Supabase here.')
                  }}
                >
                  Proceed & Import
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="mt-5">
        <div className="p-5">
          <h3 className="text-xl font-bold">Exam Composition & Rules</h3>
          <p className="text-neutral-600 text-sm">
            Adjust how many of each question type (3/2/1-pt) are included for each category.
            <strong> Overall points</strong> and pass rule use the configured overall points (mock uses half).
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            {categories.map(c=> (
              <div key={c.id} className="p-4 border rounded-2xl">
                <div className="text-sm font-semibold mb-2">{c.title}</div>
                <label className="text-xs">3-pt questions</label>
                <input
                  type="number" min={0}
                  className="w-full border rounded-xl px-3 py-2 mb-2"
                  onChange={(e)=> onUpdateComp(c.id, { ...composition[c.id], w3: Number(e.target.value)||0 })}
                  value={composition[c.id].w3}
                />
                <label className="text-xs">2-pt questions</label>
                <input
                  type="number" min={0}
                  className="w-full border rounded-xl px-3 py-2 mb-2"
                  onChange={(e)=> onUpdateComp(c.id, { ...composition[c.id], w2: Number(e.target.value)||0 })}
                  value={composition[c.id].w2}
                />
                <label className="text-xs">1-pt questions</label>
                <input
                  type="number" min={0}
                  className="w-full border rounded-xl px-3 py-2 mb-2"
                  onChange={(e)=> onUpdateComp(c.id, { ...composition[c.id], w1: Number(e.target.value)||0 })}
                  value={composition[c.id].w1}
                />
                <div className="text-xs mt-1">
                  Derived from composition: <span className="font-medium">{totalFromComposition[c.id]}</span> pts
                </div>
                <div className="mt-3">
                  <label className="text-xs">Configured overall points (display + pass rule)</label>
                  <input
                    type="number" min={0}
                    className="w-full border rounded-xl px-3 py-2"
                    value={overallPoints[c.id]}
                    onChange={(e)=> onUpdateOverall(c.id, Number(e.target.value)||0)}
                  />
                  <div className="text-xs text-neutral-500 mt-1">
                    Mock shows half: {Math.floor(overallPoints[c.id]/2)} pts
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs">Allowed wrong points</label>
                  <input
                    type="number" min={0}
                    className="w-full border rounded-xl px-3 py-2"
                    value={allowedWrong[c.id]}
                    onChange={(e)=> onUpdateAllowedWrong(c.id, Number(e.target.value)||0)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Page>
  )
}
