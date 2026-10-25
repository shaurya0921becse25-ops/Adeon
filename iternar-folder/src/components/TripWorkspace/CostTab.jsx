/**
 * @file CostTab.jsx - Native React Cost & Budget Dashboard
 * Faithfully restored from final/costs-tab.html with User's Enhanced Expense Row Design
 */

import React, { useState, useMemo, useRef } from 'react'
import './CostTab.css'

// Categories matching final/costs-tab.html
const CATS = {
  transport: { label: 'Transport', color: '#2563eb', bgTint: 'rgba(37, 99, 235, 0.133)', icon: 'bus', share: 0.50 },
  accommodation: { label: 'Accommodation', color: '#16a34a', bgTint: 'rgba(22, 163, 74, 0.133)', icon: 'hotel', share: 0.20 },
  food: { label: 'Food & drink', color: '#ea580c', bgTint: 'rgba(234, 88, 12, 0.133)', icon: 'utensils', share: 0.1625 },
  activities: { label: 'Activities', color: '#9333ea', bgTint: 'rgba(147, 51, 234, 0.133)', icon: 'ticket', share: 0.075 },
  other: { label: 'Other', color: '#6b7280', bgTint: 'rgba(107, 114, 128, 0.133)', icon: 'more-horizontal', share: 0.0625 },
}

function CategoryIcon({ icon, size = 18, strokeWidth = 2 }) {
  switch (icon) {
    case 'bus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6v6"></path>
          <path d="M15 6v6"></path>
          <path d="M2 12h19.6"></path>
          <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
          <circle cx="7" cy="18" r="2"></circle>
          <path d="M9 18h5"></path>
          <circle cx="16" cy="18" r="2"></circle>
        </svg>
      )
    case 'hotel':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 22v-6.57" />
          <path d="M12 11h.01" />
          <path d="M12 7h.01" />
          <path d="M14 15.43V22" />
          <path d="M15 11h.01" />
          <path d="M15 7h.01" />
          <path d="M16 16h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          <path d="M9 11h.01" />
          <path d="M9 7h.01" />
        </svg>
      )
    case 'utensils':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
          <path d="M21 2v10a3 3 0 0 1-3 3v7" />
          <path d="M12 12v10" />
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
        </svg>
      )
    case 'ticket':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      )
  }
}

export default function CostTab({ store, createExpense, deleteExpense, updateTrip }) {
  const trip = store?.trip || {}
  const rawExpenses = store?.expenses || []
  const days = store?.days || []
  const daysCount = Math.max(1, days.length || 7)

  const currency = trip.currency || 'USD'

  // Helper number formatter
  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('en-IN')
  const curFmt = (n) => `${currency}\u00A0${fmt(n)}`

  // Budget state & editing
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetVal, setBudgetVal] = useState(trip.budget || 250000)

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpId, setEditingExpId] = useState(null)
  const [formName, setFormName] = useState('')
  const [formAmt, setFormAmt] = useState('')
  const [formCat, setFormCat] = useState('transport')
  const [formDay, setFormDay] = useState('all')

  // Line chart interactive hover state
  const [hoverDayIndex, setHoverDayIndex] = useState(null)
  const chartRef = useRef(null)

  // Pie chart active hover category
  const [hoverCategory, setHoverCategory] = useState(null)

  // Normalized expenses
  const expenses = useMemo(() => {
    return rawExpenses.map((e, idx) => ({
      id: e.id || `exp-${idx + 1}`,
      name: e.name || e.title || 'Expense',
      cat: e.cat || e.category || 'other',
      amount: Number(e.amount) || 0,
      days: Array.isArray(e.days) ? e.days : [0],
      date: e.date || '',
      isUnfinished: Boolean(e.isUnfinished)
    }))
  }, [rawExpenses])

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses])
  const budget = Number(trip.budget) > 0 ? Number(trip.budget) : (Number(budgetVal) || 250000)
  const saved = budget - totalSpent
  const pct = budget > 0 ? (totalSpent / budget) * 100 : 0

  // Status indicator
  const stateInfo = useMemo(() => {
    if (pct > 100) return { label: 'Over budget', color: '#dc2626' }
    if (pct >= 85) return { label: 'Near limit', color: '#d97706' }
    return { label: 'On track', color: '#16a34a' }
  }, [pct])

  // Category sums
  const byCat = useMemo(() => {
    const map = {}
    Object.keys(CATS).forEach((k) => (map[k] = 0))
    expenses.forEach((e) => {
      const c = map[e.cat] !== undefined ? e.cat : 'other'
      map[c] += e.amount
    })
    return map
  }, [expenses])

  // Daily distribution for cumulative line chart
  const dailySpend = useMemo(() => {
    const arr = Array(daysCount).fill(0)
    expenses.forEach((e) => {
      const eDays = e.days && e.days.length > 0 ? e.days : [0]
      const perDay = Math.floor(e.amount / eDays.length)
      const rem = e.amount - perDay * eDays.length
      eDays.forEach((dIdx, idx) => {
        if (dIdx < daysCount) {
          arr[dIdx] += perDay + (idx === 0 ? rem : 0)
        }
      })
    })
    return arr
  }, [expenses, daysCount])

  // Cumulative spend
  const cumSpend = useMemo(() => {
    let run = 0
    return dailySpend.map((v) => {
      run += v
      return run
    })
  }, [dailySpend])

  // Date label generator
  const getDayLabel = (idx) => {
    if (days[idx]?.date) {
      try {
        const d = new Date(days[idx].date)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } catch {
        // fallback
      }
    }
    return `Day ${idx + 1}`
  }

  // Handle Commit Budget
  const handleCommitBudget = () => {
    const v = parseFloat(String(budgetVal).replace(/[^0-9.]/g, ''))
    if (v > 0 && updateTrip) {
      updateTrip({ budget: v })
    }
    setEditingBudget(false)
  }

  // Handle Add/Edit Expense
  const handleOpenAdd = () => {
    setEditingExpId(null)
    setFormName('')
    setFormAmt('')
    setFormCat('transport')
    setFormDay('all')
    setIsModalOpen(true)
  }

  const handleEditExpense = (exp) => {
    setEditingExpId(exp.id)
    setFormName(exp.name)
    setFormAmt(exp.amount)
    setFormCat(exp.cat)
    setFormDay(exp.days.length === daysCount ? 'all' : String(exp.days[0] || 0))
    setIsModalOpen(true)
  }

  const handleDeleteExpense = (expId) => {
    if (deleteExpense) {
      deleteExpense(expId)
    }
  }

  const handleSaveModal = (e) => {
    e.preventDefault()
    const amtNum = parseFloat(String(formAmt).replace(/[^0-9.]/g, ''))
    if (!formName.trim() || !(amtNum > 0)) return

    const assignedDays =
      formDay === 'all'
        ? Array.from({ length: daysCount }, (_, i) => i)
        : [parseInt(formDay, 10) || 0]

    if (editingExpId && deleteExpense && createExpense) {
      deleteExpense(editingExpId)
    }

    if (createExpense) {
      createExpense({
        name: formName.trim(),
        amount: amtNum,
        category: formCat,
        days: assignedDays,
        date: formDay === 'all' ? 'Whole trip' : getDayLabel(parseInt(formDay, 10) || 0),
        currency,
      })
    }

    setIsModalOpen(false)
  }

  // Handle CSV Export
  const handleExportCSV = () => {
    const rows = [
      ['Name', 'Category', `Amount (${currency})`, 'Days', 'Date'],
      ...expenses.map((e) => [
        `"${e.name.replace(/"/g, '""')}"`,
        CATS[e.cat]?.label || e.cat,
        e.amount,
        e.days.length === daysCount ? 'Whole trip' : e.days.map((d) => `Day ${d + 1}`).join('; '),
        e.date || '',
      ]),
    ]
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trip-budget-${currency.toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ================= SVG LINE CHART COMPUTATIONS =================
  const W = 700
  const H = 300
  const m = { l: 60, r: 24, t: 20, b: 36 }
  const iw = W - m.l - m.r
  const ih = H - m.t - m.b

  const maxVal = Math.max(budget, cumSpend[cumSpend.length - 1] || 0, 1)
  const yMax = Math.ceil(maxVal * 1.15)

  const getX = (i) => m.l + (iw * i) / Math.max(1, daysCount - 1)
  const getY = (v) => m.t + ih * (1 - v / yMax)

  const linePoints = cumSpend.map((v, i) => [getX(i), getY(v)])
  const linePath = linePoints.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const areaPath = linePath + ` L${getX(daysCount - 1)} ${getY(0)} L${getX(0)} ${getY(0)} Z`

  const pacePoints = Array.from({ length: daysCount }, (_, i) => [
    getX(i),
    getY((budget * (i + 1)) / daysCount),
  ])
  const pacePath = pacePoints.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')

  // ================= SVG PIE CHART COMPUTATIONS =================
  const cx = 110
  const cy = 110
  const r = 94
  const polar = (px, py, pr, a) => [px + pr * Math.cos(a), py + pr * Math.sin(a)]

  const activePieItems = useMemo(() => {
    return Object.keys(CATS)
      .filter((k) => byCat[k] > 0)
      .map((k) => ({
        key: k,
        val: byCat[k],
        ...CATS[k],
      }))
  }, [byCat])

  let currentAngle = -Math.PI / 2
  const pieSlices = activePieItems.map((it) => {
    const fraction = totalSpent > 0 ? it.val / totalSpent : 0
    const startAngle = currentAngle
    const endAngle = currentAngle + fraction * 2 * Math.PI
    const midAngle = (startAngle + endAngle) / 2
    currentAngle = endAngle

    let d = ''
    if (activePieItems.length === 1) {
      d = `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0`
    } else {
      const [x1, y1] = polar(cx, cy, r, startAngle)
      const [x2, y2] = polar(cx, cy, r, endAngle)
      const largeArc = fraction > 0.5 ? 1 : 0
      d = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
    }

    return {
      ...it,
      d,
      midAngle,
      fraction,
    }
  })

  return (
    <div className="costs-page-wrapper">
      <div className="costs-container">
        {/* Header */}
        <header className="costs-head">
          <div>
            <h1>Trip Costs &amp; Budget</h1>
            <p>Track spending against your planned travel budget in {currency}.</p>
          </div>
          <div className="costs-head-actions">
            <span className="costs-chip">
              {days[0]?.date ? `${getDayLabel(0)} – ${getDayLabel(daysCount - 1)} · ` : ''}
              <b>{daysCount} days</b>
            </span>
            <button type="button" className="costs-btn ghost" onClick={handleExportCSV}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
            <button type="button" className="costs-btn" onClick={handleOpenAdd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add expense
            </button>
          </div>
        </header>

        {/* Stat Cards */}
        <section className="grid3" aria-label="Budget Overview Metrics">
          {/* Card 1: Total Budget */}
          <div className="cost-card" id="cBudget">
            <div className="stat-top">
              <span className="ico" style={{ background: 'rgba(145, 184, 199, 0.2)', color: '#91B8C7' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <div>
                <div className="t">Total budget</div>
                <div className="s">What you planned to spend</div>
              </div>
              <button
                type="button"
                className="edit"
                title={editingBudget ? 'Save budget' : 'Edit budget'}
                onClick={() => {
                  if (editingBudget) {
                    handleCommitBudget()
                  } else {
                    setEditingBudget(true)
                  }
                }}
              >
                {editingBudget ? '✓' : '✎'}
              </button>
            </div>
            <div className="big" style={{ color: '#4A3B32' }}>
              <span className="cur">{currency}</span>
              {editingBudget ? (
                <input
                  autoFocus
                  type="number"
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCommitBudget()
                    if (e.key === 'Escape') setEditingBudget(false)
                  }}
                  onBlur={handleCommitBudget}
                />
              ) : (
                <span>{fmt(budget)}</span>
              )}
            </div>
            <div className="stat-foot">
              <span>{curFmt(budget / daysCount)} per day · {daysCount} days</span>
            </div>
          </div>

          {/* Card 2: Total Spent (Dark Gradient Card) */}
          <div className="cost-card dark" id="cSpent">
            <div className="stat-top">
              <span className="ico" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </span>
              <div>
                <div className="t">Total expenses</div>
                <div className="s">{expenses.length} expenses logged</div>
              </div>
            </div>
            <div className="big">
              <span className="cur">{currency}</span>
              <span>{fmt(totalSpent)}</span>
            </div>
            <div className="bar">
              <span
                style={{
                  width: `${Math.min(100, pct)}%`,
                  background: pct > 100 ? '#f87171' : pct >= 85 ? '#fbbf24' : '#ffffff',
                }}
              />
            </div>
            <div className="stat-foot">
              <span><b>{pct.toFixed(1)}%</b> of budget used</span>
              <span>·</span>
              <span>{curFmt(totalSpent / daysCount)} per day</span>
            </div>
          </div>

          {/* Card 3: Saved / Over Budget */}
          <div className="cost-card" id="cSaved">
            <div className="stat-top">
              <span
                className="ico"
                style={{
                  background: saved >= 0 ? 'rgba(22, 163, 74, 0.13)' : 'rgba(220, 38, 38, 0.13)',
                  color: saved >= 0 ? '#16a34a' : '#dc2626',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {saved >= 0 ? (
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  ) : (
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  )}
                </svg>
              </span>
              <div>
                <div className="t">{saved >= 0 ? 'Saved' : 'Over budget'}</div>
                <div className="s">{saved >= 0 ? 'Budget still available' : 'You are over the limit'}</div>
              </div>
              <span
                className="status-pill"
                style={{
                  marginLeft: 'auto',
                  background: saved >= 0 ? 'rgba(22, 163, 74, 0.14)' : 'rgba(220, 38, 38, 0.14)',
                  color: stateInfo.color,
                }}
              >
                {stateInfo.label}
              </span>
            </div>
            <div className="big" style={{ color: saved >= 0 ? '#16a34a' : '#dc2626' }}>
              <span className="cur">{currency}</span>
              <span>{saved >= 0 ? '' : '-'}{fmt(Math.abs(saved))}</span>
            </div>
            <div className="stat-foot">
              <span>
                {saved >= 0
                  ? `${Math.max(0, 100 - pct).toFixed(1)}% of your budget is left`
                  : `${(pct - 100).toFixed(1)}% above your budget`}
              </span>
            </div>
          </div>
        </section>

        {/* Line Chart + Pie Chart */}
        <section className="grid2 g-main">
          {/* Spending Over Time Line Chart */}
          <div className="cost-card">
            <div className="c-head">
              <h2>Spending over time</h2>
              <div className="chart-legend">
                <span><i style={{ borderColor: '#765F53' }}></i>Cumulative spend</span>
                <span><i className="d" style={{ borderColor: '#91B8C7' }}></i>Budget pace</span>
                <span><i className="d" style={{ borderColor: '#dc2626' }}></i>Budget limit</span>
              </div>
            </div>

            <div className="chart-container" ref={chartRef}>
              <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative spending over trip">
                <defs>
                  <linearGradient id="costAg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#765F53" stopOpacity="0.16" />
                    <stop offset="1" stopColor="#765F53" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0, 1, 2, 3, 4].map((k) => {
                  const val = (yMax * k) / 4
                  const yy = getY(val)
                  return (
                    <g key={k}>
                      <line
                        x1={m.l}
                        x2={W - m.r}
                        y1={yy}
                        y2={yy}
                        stroke="#D8BDA6"
                        strokeDasharray={k > 0 ? '3 4' : undefined}
                      />
                      <text x={m.l - 10} y={yy + 4} textAnchor="end">
                        {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                      </text>
                    </g>
                  )
                })}

                {/* Day labels along X-axis */}
                {Array.from({ length: daysCount }).map((_, i) => (
                  <text key={i} x={getX(i)} y={H - 12} textAnchor="middle">
                    {getDayLabel(i)}
                  </text>
                ))}

                {/* Red Budget Limit Line */}
                <line
                  x1={m.l}
                  x2={W - m.r}
                  y1={getY(budget)}
                  y2={getY(budget)}
                  stroke="#dc2626"
                  strokeWidth="1.5"
                  strokeDasharray="6 5"
                />

                {/* Aegean Budget Pace Line */}
                <path d={pacePath} fill="none" stroke="#91B8C7" strokeWidth="2" strokeDasharray="6 5" />

                {/* Area Gradient under Cumulative Line */}
                <path d={areaPath} fill="url(#costAg)" />

                {/* Solid Cumulative Spend Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#765F53"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Dots along line */}
                {linePoints.map((p, i) => (
                  <circle
                    key={i}
                    cx={p[0]}
                    cy={p[1]}
                    r="4"
                    fill="#ffffff"
                    stroke="#765F53"
                    strokeWidth="2"
                  />
                ))}

                {/* Vertical hover guide and point */}
                {hoverDayIndex !== null && (
                  <>
                    <line
                      x1={getX(hoverDayIndex)}
                      x2={getX(hoverDayIndex)}
                      y1={m.t}
                      y2={m.t + ih}
                      stroke="#94a3b8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={getX(hoverDayIndex)}
                      cy={getY(cumSpend[hoverDayIndex] || 0)}
                      r="6"
                      fill="#765F53"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  </>
                )}

                {/* Transparent hit columns for hover */}
                {Array.from({ length: daysCount }).map((_, i) => {
                  const colW = iw / Math.max(1, daysCount - 1)
                  return (
                    <rect
                      key={i}
                      x={getX(i) - colW / 2}
                      y={m.t}
                      width={colW}
                      height={ih}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoverDayIndex(i)}
                      onMouseLeave={() => setHoverDayIndex(null)}
                    />
                  )
                })}
              </svg>

              {/* Tooltip */}
              {hoverDayIndex !== null && (
                <div
                  className="chart-tip"
                  style={{
                    left: `${(getX(hoverDayIndex) / W) * 100}%`,
                    top: `${(getY(cumSpend[hoverDayIndex] || 0) / H) * 100}%`,
                    opacity: 1,
                  }}
                >
                  <b>{getDayLabel(hoverDayIndex)} · Day {hoverDayIndex + 1}</b>
                  <div>Spent that day: {curFmt(dailySpend[hoverDayIndex] || 0)}</div>
                  <div>Total so far: {curFmt(cumSpend[hoverDayIndex] || 0)}</div>
                  <small>
                    {(budget * (hoverDayIndex + 1)) / daysCount >= (cumSpend[hoverDayIndex] || 0)
                      ? `${curFmt((budget * (hoverDayIndex + 1)) / daysCount - (cumSpend[hoverDayIndex] || 0))} under pace`
                      : `${curFmt((cumSpend[hoverDayIndex] || 0) - (budget * (hoverDayIndex + 1)) / daysCount)} over pace`}
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* By Category Pie Chart */}
          <div className="cost-card">
            <div className="c-head">
              <h2>By category</h2>
            </div>
            <div className="pie-wrap">
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 220 220" role="img" aria-label="Spending by category">
                  {pieSlices.map((slice) => {
                    const isHovered = hoverCategory === slice.key
                    const translateStyle =
                      isHovered && pieSlices.length > 1
                        ? `translate(${Math.cos(slice.midAngle) * 7}px, ${Math.sin(slice.midAngle) * 7}px)`
                        : 'none'
                    const opacity = hoverCategory && !isHovered ? 0.45 : 1

                    return (
                      <path
                        key={slice.key}
                        className="pie-slice"
                        d={slice.d}
                        fill={slice.color}
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        style={{
                          transform: translateStyle,
                          opacity,
                        }}
                        onMouseEnter={() => setHoverCategory(slice.key)}
                        onMouseLeave={() => setHoverCategory(null)}
                      />
                    )
                  })}
                </svg>
              </div>

              {/* Pie center / hover caption */}
              <div className="pie-cap">
                {hoverCategory && CATS[hoverCategory] ? (
                  <>
                    <b>{curFmt(byCat[hoverCategory])}</b>
                    <span>
                      {CATS[hoverCategory].label} ·{' '}
                      {totalSpent > 0 ? ((byCat[hoverCategory] / totalSpent) * 100).toFixed(1) : 0}%
                    </span>
                  </>
                ) : (
                  <>
                    <b>{curFmt(totalSpent)}</b>
                    <span>Total spent · hover a slice</span>
                  </>
                )}
              </div>

              {/* Legend List */}
              <div className="leg-list">
                {pieSlices.map((s) => (
                  <div
                    key={s.key}
                    className={`leg-row ${hoverCategory === s.key ? 'on' : ''}`}
                    onMouseEnter={() => setHoverCategory(s.key)}
                    onMouseLeave={() => setHoverCategory(null)}
                  >
                    <i style={{ background: s.color }} />
                    <span>{s.label}</span>
                    <span className="a">{curFmt(s.val)}</span>
                    <span className="p">{(s.fraction * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category Budgets + Biggest Expenses */}
        <section className="grid2 g-half" style={{ marginTop: 16 }}>
          {/* Category Budgets Breakdown */}
          <div className="cost-card">
            <div className="c-head">
              <h2>Category budgets</h2>
              <span className="c-label">Split of {curFmt(budget)}</span>
            </div>
            <div className="cat-list">
              {Object.keys(CATS).map((k) => {
                const c = CATS[k]
                const catBudget = budget * c.share
                const sp = byCat[k] || 0
                const catPct = catBudget > 0 ? (sp / catBudget) * 100 : 0
                const left = catBudget - sp

                return (
                  <div key={k} className="cat-row">
                    <div className="top">
                      <span className="cat-ico" style={{ background: c.bgTint, color: c.color }}>
                        <CategoryIcon icon={c.icon} size={17} />
                      </span>
                      <div>
                        <div className="n">{c.label}</div>
                        <div className="m">{curFmt(sp)} of {curFmt(catBudget)}</div>
                      </div>
                      <div className="r">
                        <b>{catPct.toFixed(0)}%</b>
                        <span style={{ color: left >= 0 ? '#16a34a' : '#dc2626' }}>
                          {left >= 0 ? `${curFmt(left)} left` : `${curFmt(-left)} over`}
                        </span>
                      </div>
                    </div>
                    <div className="bar">
                      <span
                        style={{
                          width: `${Math.min(100, catPct)}%`,
                          background: catPct > 100 ? '#dc2626' : c.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Biggest Expenses (User's Exact HTML Structure) */}
          <div className="cost-card">
            <div className="c-head">
              <h2>Biggest expenses</h2>
              <span className="c-label">Top {Math.min(6, expenses.length)} of {expenses.length}</span>
            </div>

            <div className="exp-list">
              {expenses.length === 0 ? (
                <p style={{ color: '#765F53', fontSize: 13.5, margin: '16px 0' }}>
                  No expenses logged yet. Tap &ldquo;Add expense&rdquo; to start tracking.
                </p>
              ) : (
                [...expenses]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 6)
                  .map((exp) => {
                    const c = CATS[exp.cat] || CATS.other

                    return (
                      <div key={exp.id} style={{ display: 'flex', alignItems: 'stretch', gap: '8px' }}>
                        <div
                          className="bg-surface-card border border-edge exp-row"
                          style={{
                            position: 'relative',
                            flex: '1 1 0%',
                            minWidth: '0px',
                            display: 'grid',
                            gridTemplateColumns: '46px minmax(200px, 1fr) minmax(0px, 1.5fr) auto',
                            gap: '18px',
                            alignItems: 'center',
                            borderRadius: '18px',
                            padding: '20px 20px 16px',
                            border: '1px solid #D8BDA6',
                          }}
                        >
                          {/* Corner Category Ribbon */}
                          <span
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              left: '-1px',
                              top: '-1px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 11px 4px 10px',
                              borderRadius: '17px 0px 12px',
                              background: c.color,
                              color: 'rgb(255, 255, 255)',
                              fontSize: 'calc(9.5px * var(--fs-scale-caption, 1))',
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              lineHeight: 1.2,
                            }}
                          >
                            <CategoryIcon icon={c.icon} size={10} strokeWidth={2.4} />
                            {c.label}
                          </span>

                          {/* 46x46 Category Icon */}
                          <span
                            style={{
                              position: 'relative',
                              width: '46px',
                              height: '46px',
                              borderRadius: '13px',
                              display: 'grid',
                              placeItems: 'center',
                              background: c.bgTint,
                              color: c.color,
                            }}
                          >
                            <CategoryIcon icon={c.icon} size={21} strokeWidth={2} />
                          </span>

                          {/* Name and Optional Pill */}
                          <div style={{ minWidth: '0px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: '0px' }}>
                              <span
                                className="text-content"
                                style={{
                                  fontSize: 'calc(15px * var(--fs-scale-subtitle, 1))',
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {exp.name}
                              </span>
                              {exp.isUnfinished && (
                                <span
                                  title="Total only — not settled yet"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '2px 8px 2px 6px',
                                    borderRadius: '999px',
                                    background: 'rgba(217, 119, 6, 0.14)',
                                    color: 'rgb(217, 119, 6)',
                                    fontSize: 'calc(11px * var(--fs-scale-caption, 1))',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      borderRadius: '50%',
                                      background: 'rgb(217, 119, 6)',
                                      color: 'rgb(255, 255, 255)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      fontSize: 'calc(10px * var(--fs-scale-caption, 1))',
                                      fontWeight: 800,
                                    }}
                                  >
                                    !
                                  </span>
                                  Unfinished
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Details / Day */}
                          <span style={{ fontSize: '13px', color: '#765F53' }}>
                            {exp.days.length === daysCount
                              ? 'Whole trip'
                              : exp.days.length > 1
                              ? `${exp.days.length} days`
                              : getDayLabel(exp.days[0] || 0)}
                          </span>

                          {/* Amount Pill */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', whiteSpace: 'nowrap' }}>
                              <span
                                className="bg-surface-secondary border border-edge text-content"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '6px 13px',
                                  borderRadius: '999px',
                                  fontSize: 'calc(15px * var(--fs-scale-subtitle, 1))',
                                  fontWeight: 700,
                                  fontVariantNumeric: 'tabular-nums',
                                  border: '1px solid #D8BDA6',
                                }}
                              >
                                {curFmt(exp.amount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Separate Action Pill: Edit & Delete */}
                        <div
                          className="exp-actions bg-surface-card border border-edge"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '3px',
                            flexShrink: 0,
                            borderRadius: '999px',
                            padding: '5px',
                            border: '1px solid #D8BDA6',
                          }}
                        >
                          <button
                            type="button"
                            title="Edit"
                            className="text-content-muted transition-colors"
                            onClick={() => handleEditExpense(exp)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '30px',
                              height: '30px',
                              borderRadius: '999px',
                              border: '0px',
                              cursor: 'pointer',
                              padding: '0px',
                              background: 'transparent',
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                              <path d="m15 5 4 4"></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            className="exp-action-danger transition-colors"
                            onClick={() => handleDeleteExpense(exp.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '30px',
                              height: '30px',
                              borderRadius: '999px',
                              border: '0px',
                              cursor: 'pointer',
                              padding: '0px',
                              color: 'rgb(220, 38, 38)',
                              background: 'transparent',
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" x2="10" y1="11" y2="17"></line>
                              <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Add / Edit Expense Modal */}
      <div className={`cost-modal-backdrop ${isModalOpen ? 'show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
        <div className="cost-modal" role="dialog" aria-modal="true">
          <header>
            <h3>{editingExpId ? 'Edit expense' : 'Add expense'}</h3>
            <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
          <form onSubmit={handleSaveModal}>
            <div>
              <label>What was it for?</label>
              <input
                autoFocus
                placeholder="e.g. Dinner, souvenirs, taxi..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div className="row2">
              <div>
                <label>Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formAmt}
                  onChange={(e) => setFormAmt(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Day</label>
                <select value={formDay} onChange={(e) => setFormDay(e.target.value)}>
                  <option value="all">Spread over trip</option>
                  {Array.from({ length: daysCount }).map((_, i) => (
                    <option key={i} value={i}>
                      Day {i + 1} · {getDayLabel(i)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label>Category</label>
              <select value={formCat} onChange={(e) => setFormCat(e.target.value)}>
                {Object.keys(CATS).map((k) => (
                  <option key={k} value={k}>
                    {CATS[k].label}
                  </option>
                ))}
              </select>
            </div>
            <footer>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="ok">
                {editingExpId ? 'Save changes' : 'Add expense'}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  )
}
