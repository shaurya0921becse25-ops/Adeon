/**
 * @file Pure Calculation Functions for WanderWise / Adeon
 */

/**
 * Calculates duration in days between two ISO date strings (YYYY-MM-DD), inclusive
 * @param {string} startDate
 * @param {string} endDate
 * @returns {number}
 */
export function durationDays(startDate, endDate) {
  if (!startDate || !endDate) return 1
  try {
    const [y1, m1, d1] = startDate.split('-').map(Number)
    const [y2, m2, d2] = endDate.split('-').map(Number)
    const t1 = Date.UTC(y1, m1 - 1, d1)
    const t2 = Date.UTC(y2, m2 - 1, d2)
    const diff = Math.round((t2 - t1) / 86400000)
    return diff >= 0 ? diff + 1 : 1
  } catch {
    return 1
  }
}

/**
 * Formats a date range into a user-friendly string
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string}
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate) return ''
  try {
    const parse = val => {
      const [y, m, d] = val.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    const d1 = parse(startDate)
    const optsMonth = { month: 'short', day: 'numeric' }
    const str1 = new Intl.DateTimeFormat('en-US', optsMonth).format(d1)
    if (!endDate || endDate === startDate) return str1
    const d2 = parse(endDate)
    const optsFull = { month: 'short', day: 'numeric', year: 'numeric' }
    const str2 = new Intl.DateTimeFormat('en-US', optsFull).format(d2)
    return `${str1} – ${str2}`
  } catch {
    return `${startDate} – ${endDate || ''}`
  }
}

/**
 * Generates an array of date strings between start and end date inclusive
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string[]}
 */
export function getDatesBetween(startDate, endDate) {
  if (!startDate) return []
  if (!endDate) return [startDate]
  const dates = []
  const [y1, m1, d1] = startDate.split('-').map(Number)
  const [y2, m2, d2] = endDate.split('-').map(Number)
  const current = new Date(Date.UTC(y1, m1 - 1, d1))
  const end = new Date(Date.UTC(y2, m2 - 1, d2))

  while (current <= end) {
    const y = current.getUTCFullYear()
    const m = String(current.getUTCMonth() + 1).padStart(2, '0')
    const d = String(current.getUTCDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${d}`)
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return dates.length > 0 ? dates : [startDate]
}

/**
 * Sums all expenses
 * @param {import('./types.js').Expense[]} expenses
 * @returns {number}
 */
export function sumExpenses(expenses) {
  if (!Array.isArray(expenses)) return 0
  return expenses.reduce((total, exp) => total + (Number(exp.amount) || 0), 0)
}

/**
 * Group expenses by category
 * @param {import('./types.js').Expense[]} expenses
 * @returns {Record<import('./types.js').ExpenseCategory, number>}
 */
export function expensesByCategory(expenses) {
  const result = {
    transport: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
    other: 0,
  }
  if (!Array.isArray(expenses)) return result
  for (const exp of expenses) {
    const cat = exp.category || 'other'
    if (typeof result[cat] === 'number') {
      result[cat] += Number(exp.amount) || 0
    } else {
      result.other += Number(exp.amount) || 0
    }
  }
  return result
}

/**
 * Calculates remaining budget
 * @param {number} budget
 * @param {import('./types.js').Expense[]} expenses
 * @returns {number}
 */
export function remainingBudget(budget, expenses) {
  const total = sumExpenses(expenses)
  return (Number(budget) || 0) - total
}

/**
 * Calculates daily totals across days
 * @param {import('./types.js').Expense[]} expenses
 * @param {number} daysCount
 * @returns {number[]}
 */
export function dailyTotals(expenses, daysCount) {
  const count = Math.max(1, daysCount || 1)
  const totals = new Array(count).fill(0)
  if (!Array.isArray(expenses)) return totals

  for (const exp of expenses) {
    const amt = Number(exp.amount) || 0
    if (Array.isArray(exp.dayIndices) && exp.dayIndices.length > 0) {
      const share = Math.round(amt / exp.dayIndices.length)
      for (const idx of exp.dayIndices) {
        if (idx >= 0 && idx < count) {
          totals[idx] += share
        }
      }
    } else {
      // If no day specified, spread or put on first day
      totals[0] += amt
    }
  }
  return totals
}

/**
 * Packing list progress
 * @param {import('./types.js').PackingItem[]} items
 * @returns {{ completed: number, total: number, pct: number }}
 */
export function packingProgress(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { completed: 0, total: 0, pct: 0 }
  }
  const completed = items.filter(i => Boolean(i.checked)).length
  const total = items.length
  const pct = Math.round((completed / total) * 100)
  return { completed, total, pct }
}

/**
 * To-do list progress
 * @param {import('./types.js').TodoItem[]} items
 * @returns {{ completed: number, total: number, pct: number }}
 */
export function todoProgress(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { completed: 0, total: 0, pct: 0 }
  }
  const completed = items.filter(i => Boolean(i.done)).length
  const total = items.length
  const pct = Math.round((completed / total) * 100)
  return { completed, total, pct }
}

/**
 * Formats money with appropriate currency symbol and precision
 * @param {number} amount
 * @param {string} currencyCode
 * @returns {string}
 */
export function formatMoney(amount, currencyCode = 'USD') {
  const val = Number(amount) || 0
  const cur = currencyCode.toUpperCase()
  try {
    // Currencies like JPY, ISK usually have 0 decimals
    const zeroDecimals = ['JPY', 'ISK', 'KRW', 'VND'].includes(cur)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      minimumFractionDigits: zeroDecimals ? 0 : 2,
      maximumFractionDigits: zeroDecimals ? 0 : 2,
    }).format(val)
  } catch {
    return `${cur} ${val.toLocaleString('en-US')}`
  }
}

/**
 * MOCK FX Rates relative to 1 USD for offline currency converter
 * Clearly marked as mock demo data
 */
export const MOCK_EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.0,
  ISK: 138.0,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.91,
}

/**
 * Mock currency conversion function
 * @param {number} amount
 * @param {string} fromCurrency
 * @param {string} toCurrency
 * @returns {{ result: number, rate: number, isMock: true }}
 */
export function convertCurrencyMock(amount, fromCurrency, toCurrency) {
  const from = (fromCurrency || 'USD').toUpperCase()
  const to = (toCurrency || 'JPY').toUpperCase()
  const num = Math.max(0, Number(amount) || 0)

  const fromRate = MOCK_EXCHANGE_RATES[from] || 1.0
  const toRate = MOCK_EXCHANGE_RATES[to] || 1.0

  // 1 from = (toRate / fromRate) to
  const rate = toRate / fromRate
  const result = Math.round(num * rate * 100) / 100

  return {
    result,
    rate: Math.round(rate * 10000) / 10000,
    isMock: true,
  }
}
