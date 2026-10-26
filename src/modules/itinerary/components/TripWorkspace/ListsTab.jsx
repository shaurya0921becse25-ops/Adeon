/**
 * @file ListsTab.jsx - Native React Packing & To-Do Lists Manager
 * Faithfully restored from final/lists-tab.html
 */

import React, { useState, useMemo, useEffect } from 'react'
import { packingProgress, todoProgress } from '../../../itinerary/index.js'
import { INITIAL_PACKING_CATEGORIES } from '../../data/japanShopAndListsData.js'
import './ListsTab.css'

// SVGs extracted from final/lists-tab.html
const ICONS = {
  box: 'm16 16 2 2 4-4 M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14 M7.5 4.27 9 5.15 M3.29 7 12 12 20.71 7 M12 12v9',
  todo: 'M13 6h8 M13 12h8 M13 18h8 M3 17l2 2 4-4',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  user: 'M20 21a8 8 0 0 0-16 0 M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  plus: 'M12 5v14 M5 12h14',
  trash: 'M3 6h18 M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6 M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2 M10 11v6 M14 11v6',
  chevDown: 'm6 9 6 6 6-6',
  chevRight: 'm9 18 6-6-6-6',
  dots: 'M12 12h.01 M19 12h.01 M5 12h.01',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M21 4H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  checkSquare: 'm9 11 3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  square: 'M3 3h18v18H3z',
  x: 'M18 6 6 18 M6 6l12 12',
}

function SvgIcon({ name, size = 16, strokeWidth = 2, className = '' }) {
  const path = ICONS[name]
  if (!path) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {path.split(' M').map((d, i) => (
        <path key={i} d={(i ? 'M' : '') + d} />
      ))}
    </svg>
  )
}

// Category color mappings
const CATEGORY_COLORS = {
  CLOTHING: '#3b82f6',
  Clothing: '#3b82f6',
  ELECTRONICS: '#a855f7',
  Electronics: '#a855f7',
  DOCUMENTS: '#22c55e',
  Documents: '#22c55e',
  'OTHER & ACCESSORIES': '#ec4899',
  'Other & Accessories': '#ec4899',
  OTHER: '#ec4899',
  Other: '#ec4899',
  ACCESSORIES: '#ec4899',
  Accessories: '#ec4899',
  TOILETRIES: '#06b6d4',
  Toiletries: '#06b6d4',
  GENERAL: '#64748b',
  General: '#64748b',
}

const DEFAULT_DEMO_TODOS = [
  {
    id: 'demo-todo-1',
    title: 'Book the rental car with gravel protection',
    description: 'Ensure comprehensive insurance coverage and GPS navigation included.',
    done: true,
    priority: 'p1',
    dueDate: '2027-03-05',
    assignee: 'Jonas Weber',
  },
  {
    id: 'demo-todo-2',
    title: 'Add digital Suica / Pasmo transit card to phone wallet',
    description: 'Enables contactless tapping on all Tokyo subways, buses, and convenience stores.',
    done: true,
    priority: 'p1',
    dueDate: '2026-10-15',
    assignee: 'Jonas Weber',
  },
  {
    id: 'demo-todo-3',
    title: 'Confirm teamLab Planets timed entry reservation',
    description: 'Pre-booked for Day 5 at 14:00. Save ticket barcodes.',
    done: false,
    priority: 'p1',
    dueDate: '2026-10-16',
    assignee: 'Jonas Weber',
  },
  {
    id: 'demo-todo-4',
    title: 'Notify bank of international travel and withdraw initial Yen cash',
    description: 'Many traditional food stalls in Asakusa and Tsukiji remain cash-only.',
    done: false,
    priority: 'p2',
    dueDate: '2026-10-17',
    assignee: 'Jonas Weber',
  },
  {
    id: 'demo-todo-5',
    title: 'Download Tokyo offline maps on phone',
    description: 'Save offline area in Google Maps for Central Tokyo, Asakusa, and Shibuya.',
    done: false,
    priority: 'p3',
    dueDate: '2026-10-18',
    assignee: 'Jonas Weber',
  },
]

const INITIAL_PACKING_ITEMS = INITIAL_PACKING_CATEGORIES.flatMap((c) =>
  c.items.map((it) => ({
    id: `pack-${it.id}`,
    tripId: 'japan-demo-trip-2026',
    text: it.text,
    category: c.title,
    quantity: it.qty || 1,
    checked: Boolean(it.checked),
    user: it.user || 'Demo User',
  }))
)

export default function ListsTab({
  store,
  createPackingItem,
  togglePackingItem,
  updatePackingItem,
  deletePackingItem,
  createTodoItem,
  toggleTodoItem,
  updateTodoItem,
  deleteTodoItem,
}) {
  const trip = store?.trip
  const tripId = trip?.id || 'japan-demo-trip-2026'

  const rawPackingItems = store?.packingItems || []
  const rawTodoItems = store?.todoItems || []

  // Main Mode: 'packing' | 'todo'
  const [currentMode, setCurrentMode] = useState('packing')

  // Packing Filters: 'shared' | 'my'
  const [packingFilter, setPackingFilter] = useState('shared')
  // Packing Status: 'all' | 'open' | 'done'
  const [packingStatus, setPackingStatus] = useState('all')

  // Inline Add Item: active category ID being edited
  const [activeInlineCat, setActiveInlineCat] = useState(null)
  const [inlineItemText, setInlineItemText] = useState('')

  // Collapsed categories map
  const [collapsedCats, setCollapsedCats] = useState({})

  // Custom user categories added via "+ Add list"
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip-custom-categories-${tripId}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // List addition input state
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Unified Packing Items State (synced to localStorage)
  const [packingItems, setPackingItems] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip-packing-items-${tripId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PACKING_ITEMS.length) {
          return parsed
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p) => p.id))
          const missing = INITIAL_PACKING_ITEMS.filter((p) => !existingIds.has(p.id))
          return [...parsed, ...missing]
        }
      }
    } catch {}

    if (rawPackingItems && rawPackingItems.length >= INITIAL_PACKING_ITEMS.length) {
      return rawPackingItems
    }
    return INITIAL_PACKING_ITEMS
  })

  // Synchronize packing items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`trip-packing-items-${tripId}`, JSON.stringify(packingItems))
    } catch {}
  }, [packingItems, tripId])

  // Unified To-Do Tasks State (synced to localStorage)
  const [todoTasks, setTodoTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip-todo-items-${tripId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length >= DEFAULT_DEMO_TODOS.length) {
          return parsed
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((t) => t.id))
          const missing = DEFAULT_DEMO_TODOS.filter((t) => !existingIds.has(t.id))
          return [...parsed, ...missing]
        }
      }
    } catch {}

    if (rawTodoItems && rawTodoItems.length >= DEFAULT_DEMO_TODOS.length) {
      return rawTodoItems
    }
    return DEFAULT_DEMO_TODOS
  })

  // Synchronize todo tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`trip-todo-items-${tripId}`, JSON.stringify(todoTasks))
    } catch {}
  }, [todoTasks, tripId])

  // Reactively synchronize local state when store updates
  useEffect(() => {
    if (rawPackingItems && rawPackingItems.length > 0) {
      setPackingItems(rawPackingItems)
    }
  }, [rawPackingItems])

  useEffect(() => {
    if (rawTodoItems && rawTodoItems.length > 0) {
      setTodoTasks(rawTodoItems)
    }
  }, [rawTodoItems])

  // To-Do Sidebar Filter: 'all' | 'my' | 'overdue' | 'done'
  const [todoFilter, setTodoFilter] = useState('all')
  // To-Do Sort: 'priority' | 'date' | 'default'
  const [todoSort, setTodoSort] = useState('default')

  // To-Do Selected Task for Detail Drawer
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [detailTitle, setDetailTitle] = useState('')
  const [detailDesc, setDetailDesc] = useState('')
  const [detailPriority, setDetailPriority] = useState('none')
  const [detailDueDate, setDetailDueDate] = useState('')
  const [isDetailDirty, setIsDetailDirty] = useState(false)

  // New Task Modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('none')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  // Import Dialog State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  // Helper: toggle packing item
  const handleTogglePacking = (itemId) => {
    setPackingItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    )
    if (togglePackingItem) {
      try {
        togglePackingItem(itemId)
      } catch {}
    }
  }

  // Helper: update packing item quantity
  const handleQtyChange = (itemId, newQty) => {
    const val = parseInt(newQty, 10)
    if (isNaN(val) || val < 1) return
    setPackingItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: val } : item
      )
    )
    if (updatePackingItem) {
      try {
        updatePackingItem(itemId, { quantity: val })
      } catch {}
    }
  }

  // Helper: delete packing item
  const handleDeletePacking = (itemId) => {
    setPackingItems((prev) => prev.filter((item) => item.id !== itemId))
    if (deletePackingItem) {
      try {
        deletePackingItem(itemId)
      } catch {}
    }
  }

  // Helper: submit inline packing item
  const handleInlineItemSubmit = (catName) => {
    if (!inlineItemText.trim()) return
    const newItem = {
      id: `pack-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tripId,
      text: inlineItemText.trim(),
      category: catName,
      quantity: 1,
      checked: false,
      user: 'Demo User',
    }
    setPackingItems((prev) => [...prev, newItem])
    setInlineItemText('')
    setActiveInlineCat(null)
    if (createPackingItem) {
      try {
        createPackingItem(newItem)
      } catch {}
    }
  }

  // Helper: toggle todo task
  const handleToggleTodo = (taskId) => {
    setTodoTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    )
    if (toggleTodoItem) {
      try {
        toggleTodoItem(taskId)
      } catch {}
    }
  }

  // Helper: format due date
  const formatTaskDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Handle adding new list category
  const handleAddCategorySubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!newCategoryName || !newCategoryName.trim()) return
    const formatted = newCategoryName.trim().toUpperCase()
    if (!customCategories.includes(formatted)) {
      const next = [...customCategories, formatted]
      setCustomCategories(next)
      try {
        localStorage.setItem(`trip-custom-categories-${tripId}`, JSON.stringify(next))
      } catch {}
    }
    setNewCategoryName('')
    setIsAddingCategory(false)
  }

  // Group items into categories
  const categoriesMap = useMemo(() => {
    const map = {}

    // Initialize with standard categories + user custom categories
    const baseNames = ['CLOTHING', 'ELECTRONICS', 'DOCUMENTS', 'OTHER & ACCESSORIES', ...customCategories]
    baseNames.forEach((cat) => {
      map[cat] = []
    })

    packingItems.forEach((item) => {
      let cat = (item.category || 'OTHER & ACCESSORIES').toUpperCase()
      if (cat === 'OTHER' || cat === 'ACCESSORIES') cat = 'OTHER & ACCESSORIES'
      if (!map[cat]) {
        map[cat] = []
      }
      map[cat].push(item)
    })

    return map
  }, [packingItems, customCategories])

  // Progress metrics for Packing
  const packingStats = useMemo(() => {
    const total = packingItems.length
    const completed = packingItems.filter((i) => i.checked).length
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, pct }
  }, [packingItems])

  // Progress metrics for To-Do
  const todoStats = useMemo(() => {
    const total = todoTasks.length
    const completed = todoTasks.filter((t) => t.done).length
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, pct }
  }, [todoTasks])

  // Filtered & Sorted To-Do Tasks
  const filteredTodoTasks = useMemo(() => {
    let tasks = [...todoTasks]

    if (todoFilter === 'done') {
      tasks = tasks.filter((t) => t.done)
    } else if (todoFilter === 'my') {
      tasks = tasks.filter((t) => !t.done)
    } else if (todoFilter === 'overdue') {
      const today = new Date().toISOString().slice(0, 10)
      tasks = tasks.filter((t) => t.dueDate && t.dueDate < today && !t.done)
    }

    if (todoSort === 'priority') {
      const prioScore = { p1: 1, p2: 2, p3: 3, none: 4 }
      tasks.sort((a, b) => (prioScore[a.priority] || 4) - (prioScore[b.priority] || 4))
    } else if (todoSort === 'date') {
      tasks.sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
    }

    return tasks
  }, [todoTasks, todoFilter, todoSort])

  // Selected task object
  const selectedTask = useMemo(() => {
    return todoTasks.find((t) => t.id === selectedTaskId) || null
  }, [todoTasks, selectedTaskId])

  // Handle task selection
  const handleSelectTask = (task) => {
    if (selectedTaskId === task.id) {
      setSelectedTaskId(null)
      return
    }
    setSelectedTaskId(task.id)
    setDetailTitle(task.title)
    setDetailDesc(task.description || '')
    setDetailPriority(task.priority || 'none')
    setDetailDueDate(task.dueDate || '')
    setIsDetailDirty(false)
  }

  // Handle saving task detail changes
  const handleSaveTaskDetail = () => {
    if (!selectedTaskId) return
    setTodoTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? {
              ...t,
              title: detailTitle.trim() || t.title,
              description: detailDesc.trim(),
              priority: detailPriority,
              dueDate: detailDueDate,
            }
          : t
      )
    )
    if (updateTodoItem) {
      try {
        updateTodoItem(selectedTaskId, {
          title: detailTitle.trim() || selectedTask.title,
          description: detailDesc.trim(),
          priority: detailPriority,
          dueDate: detailDueDate,
        })
      } catch {}
    }
    setIsDetailDirty(false)
  }

  // Handle task deletion
  const handleDeleteSelectedTask = () => {
    if (!selectedTaskId) return
    setTodoTasks((prev) => prev.filter((t) => t.id !== selectedTaskId))
    if (deleteTodoItem) {
      try {
        deleteTodoItem(selectedTaskId)
      } catch {}
    }
    setSelectedTaskId(null)
  }

  // Handle new task modal creation
  const handleCreateNewTask = (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask = {
      id: `todo-${Date.now()}`,
      tripId,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      done: false,
      assignee: 'Jonas Weber',
    }

    setTodoTasks((prev) => [newTask, ...prev])
    if (createTodoItem) {
      try {
        createTodoItem(newTask)
      } catch {}
    }

    setNewTaskTitle('')
    setNewTaskDesc('')
    setNewTaskPriority('none')
    setNewTaskDueDate('')
    setIsNewTaskModalOpen(false)
  }

  return (
    <div className="lists-page-wrapper">
      {/* 1. SUB HEADER TOOLBAR */}
      <div className="lists-sub-header">
        <h2>Lists</h2>
        <div className="lists-header-divider" />

        {/* Mode Switcher Tabs */}
        <div className="lists-mode-switcher">
          <button
            type="button"
            className={`lists-mode-btn ${currentMode === 'packing' ? 'is-active' : ''}`}
            onClick={() => setCurrentMode('packing')}
          >
            <SvgIcon name="box" size={14} />
            <span>Packing List</span>
            <span className="lists-mode-badge">{packingStats.total}</span>
          </button>

          <button
            type="button"
            className={`lists-mode-btn ${currentMode === 'todo' ? 'is-active' : ''}`}
            onClick={() => setCurrentMode('todo')}
          >
            <SvgIcon name="todo" size={14} />
            <span>To-Do</span>
            <span className="lists-mode-badge">{todoStats.total}</span>
          </button>
        </div>

        {/* Main Action Button */}
        <div className="lists-main-action-wrap">
          {currentMode === 'packing' ? (
            <button
              type="button"
              className="lists-main-action-btn"
              onClick={() => setIsImportModalOpen(true)}
            >
              <SvgIcon name="plus" size={14} strokeWidth={2.5} />
              <span>Import</span>
            </button>
          ) : (
            <button
              type="button"
              className="lists-main-action-btn"
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              <SvgIcon name="plus" size={14} strokeWidth={2.5} />
              <span>Add new task</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. PACKING LIST DASHBOARD VIEW */}
      {currentMode === 'packing' && (
        <div className="packing-view-container">
          {/* Progress Bar Section */}
          <div className="packing-progress-section">
            <div className="packing-progress-bar-row">
              <div className="packing-progress-counts">
                <span className="packing-count-completed">{packingStats.completed}</span>
                <span className="packing-count-total">/{packingStats.total}</span>
                <span className="packing-percent-pill">{packingStats.pct}%</span>
              </div>

              <div className="packing-track">
                <div
                  className="packing-track-fill"
                  style={{ width: `${packingStats.pct}%` }}
                />
              </div>
            </div>

            {isAddingCategory ? (
              <form
                onSubmit={handleAddCategorySubmit}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: '1 1 280px',
                  maxWidth: '380px',
                }}
              >
                <input
                  placeholder="List name (e.g. Clothing)"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  autoFocus
                  style={{
                    flex: '1 1 0%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-primary)',
                    fontSize: 'calc(13.5px * var(--fs-scale-body, 1))',
                    fontFamily: 'inherit',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-card, #ffffff)',
                  }}
                />
                <button
                  type="submit"
                  className="packing-add-category-btn"
                  disabled={!newCategoryName.trim()}
                  style={{ padding: '8px 14px' }}
                >
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  className="packing-inline-add-cancel"
                  onClick={() => {
                    setIsAddingCategory(false)
                    setNewCategoryName('')
                  }}
                  title="Cancel"
                >
                  <SvgIcon name="x" size={14} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="packing-add-category-btn"
                onClick={() => setIsAddingCategory(true)}
              >
                <SvgIcon name="plus" size={14} />
                <span>Add list</span>
              </button>
            )}
          </div>

          {/* Packing Filters Toolbar */}
          <div className="packing-filters-toolbar">
            <button
              type="button"
              className={`packing-filter-pill ${packingFilter === 'shared' ? 'is-active' : ''}`}
              onClick={() => setPackingFilter('shared')}
            >
              <SvgIcon name="users" size={14} />
              <span>Shared</span>
              <span className="pill-badge">{packingStats.total}</span>
            </button>

            <button
              type="button"
              className={`packing-filter-pill ${packingFilter === 'my' ? 'is-active' : ''}`}
              onClick={() => setPackingFilter('my')}
            >
              <SvgIcon name="user" size={14} />
              <span>My list</span>
              <span className="pill-badge">{packingStats.total}</span>
            </button>

            <div className="packing-filters-divider" />

            <button
              type="button"
              className={`packing-filter-pill ${packingStatus === 'all' ? 'is-active' : ''}`}
              onClick={() => setPackingStatus('all')}
            >
              <span>All</span>
              <span className="pill-badge">{packingStats.total}</span>
            </button>

            <button
              type="button"
              className={`packing-filter-pill ${packingStatus === 'open' ? 'is-active' : ''}`}
              onClick={() => setPackingStatus('open')}
            >
              <span>Open</span>
              <span className="pill-badge">{packingStats.total - packingStats.completed}</span>
            </button>

            <button
              type="button"
              className={`packing-filter-pill ${packingStatus === 'done' ? 'is-active' : ''}`}
              onClick={() => setPackingStatus('done')}
            >
              <span>Done</span>
              <span className="pill-badge">{packingStats.completed}</span>
            </button>
          </div>

          {/* Category Cards Grid */}
          <div className="packing-grid">
            {Object.keys(categoriesMap).map((catName) => {
              const allItems = categoriesMap[catName] || []
              let visibleItems = allItems

              if (packingStatus === 'open') {
                visibleItems = allItems.filter((i) => !i.checked)
              } else if (packingStatus === 'done') {
                visibleItems = allItems.filter((i) => i.checked)
              }

              const catDone = allItems.filter((i) => i.checked).length
              const catTotal = allItems.length
              const isCollapsed = Boolean(collapsedCats[catName])
              const dotColor = CATEGORY_COLORS[catName] || '#6366f1'

              return (
                <div key={catName} className="packing-cat-card">
                  {/* Category Header */}
                  <div className="packing-cat-header">
                    <button
                      type="button"
                      className={`packing-cat-collapse-btn ${isCollapsed ? 'is-collapsed' : ''}`}
                      onClick={() =>
                        setCollapsedCats((prev) => ({
                          ...prev,
                          [catName]: !prev[catName],
                        }))
                      }
                      aria-label="Toggle category"
                    >
                      <SvgIcon name="chevDown" size={14} />
                    </button>

                    <span
                      className="packing-cat-dot"
                      style={{ backgroundColor: dotColor }}
                    />

                    <span className="packing-cat-title">{catName}</span>

                    <span className="packing-cat-prog-pill">
                      {catDone}/{catTotal}
                    </span>

                    <button
                      type="button"
                      className="packing-cat-more-btn"
                      title="Category options"
                    >
                      <SvgIcon name="dots" size={14} />
                    </button>
                  </div>

                  {/* Category Body */}
                  {!isCollapsed && (
                    <div className="packing-cat-body">
                      {visibleItems.length === 0 && (
                        <div style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-faint)', fontStyle: 'italic' }}>
                          {packingStatus === 'done'
                            ? 'No packed items in this list yet.'
                            : packingStatus === 'open'
                            ? 'All items in this list are packed! 🎉'
                            : 'No items in this list yet.'}
                        </div>
                      )}

                      {visibleItems.map((item) => (
                        <div
                          key={item.id}
                          className="packing-item-row"
                          onClick={() => handleTogglePacking(item.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* 6-dot drag handle */}
                          <div className="packing-drag-handle" title="Reorder item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
                              <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
                            </svg>
                          </div>

                          {/* Dual SVG Interactive Checkbox Button */}
                          <button
                            type="button"
                            className="packing-checkbox-btn"
                            aria-label={item.checked ? 'Mark as unpacked' : 'Mark as packed'}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePacking(item.id)
                            }}
                          >
                            <svg
                              className="packing-checkbox-svg-box"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{
                                opacity: item.checked ? 0 : 1,
                                transform: item.checked ? 'scale(0.5)' : 'scale(1)',
                              }}
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                            </svg>
                            <svg
                              className="packing-checkbox-svg-box"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{
                                opacity: item.checked ? 1 : 0,
                                transform: item.checked ? 'scale(1)' : 'scale(0.5)',
                                color: '#059669',
                              }}
                            >
                              <path d="m9 11 3 3L22 4" />
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                          </button>

                          {/* Item text */}
                          <span
                            className={`packing-item-text ${item.checked ? 'is-done' : ''}`}
                            title={item.text}
                          >
                            {item.text}
                          </span>

                          {/* User badge */}
                          <span className="packing-user-badge">
                            <SvgIcon name="user" size={10} />
                            <span>Demo User</span>
                          </span>

                          {/* Quantity pill */}
                          <div className="packing-qty-wrap">
                            <input
                              type="text"
                              value={item.quantity || 1}
                              className="packing-qty-input"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            />
                            <span className="packing-qty-x">x</span>
                          </div>

                          {/* Hover Action Buttons */}
                          <div className="packing-row-actions">
                            <button
                              type="button"
                              className="packing-icon-btn"
                              title="Move to list"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                            </button>
                            <button
                              type="button"
                              className="packing-icon-btn is-delete"
                              title="Delete item"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeletePacking(item.id)
                              }}
                            >
                              <SvgIcon name="trash" size={13} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Inline Add Item Control */}
                      {activeInlineCat === catName ? (
                        <div className="packing-inline-add-row">
                          <input
                            type="text"
                            className="packing-inline-add-input"
                            placeholder="Item name..."
                            value={inlineItemText}
                            onChange={(e) => setInlineItemText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleInlineItemSubmit(catName)
                              if (e.key === 'Escape') setActiveInlineCat(null)
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="packing-inline-add-submit"
                            disabled={!inlineItemText.trim()}
                            onClick={() => handleInlineItemSubmit(catName)}
                          >
                            <SvgIcon name="plus" size={14} />
                          </button>
                          <button
                            type="button"
                            className="packing-inline-add-cancel"
                            onClick={() => setActiveInlineCat(null)}
                          >
                            <SvgIcon name="x" size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="packing-show-add-btn"
                          onClick={() => {
                            setActiveInlineCat(catName)
                            setInlineItemText('')
                          }}
                        >
                          <SvgIcon name="plus" size={12} />
                          <span>Add item</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. TO-DO DASHBOARD VIEW */}
      {currentMode === 'todo' && (
        <div className="todo-view-container">
          {/* Left Sidebar */}
          <div className="todo-sidebar">
            {/* Progress Widget */}
            <div className="todo-progress-widget">
              <div className="todo-prog-percent">{todoStats.pct}%</div>
              <div className="todo-prog-track">
                <div
                  className="todo-prog-fill"
                  style={{ width: `${todoStats.pct}%` }}
                />
              </div>
              <div className="todo-prog-text">
                {todoStats.completed} / {todoStats.total} completed
              </div>
            </div>

            <div className="todo-nav-header">Tasks</div>

            <button
              type="button"
              className={`todo-nav-btn ${todoFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setTodoFilter('all')}
            >
              <SvgIcon name="todo" size={14} />
              <span>All</span>
              <span className="nav-count">{todoStats.total}</span>
            </button>

            <button
              type="button"
              className={`todo-nav-btn ${todoFilter === 'my' ? 'is-active' : ''}`}
              onClick={() => setTodoFilter('my')}
            >
              <SvgIcon name="user" size={14} />
              <span>My Tasks</span>
              <span className="nav-count">{todoStats.total}</span>
            </button>

            <button
              type="button"
              className={`todo-nav-btn ${todoFilter === 'overdue' ? 'is-active' : ''}`}
              onClick={() => setTodoFilter('overdue')}
            >
              <SvgIcon name="clock" size={14} />
              <span>Overdue</span>
              <span className="nav-count">0</span>
            </button>

            <button
              type="button"
              className={`todo-nav-btn ${todoFilter === 'done' ? 'is-active' : ''}`}
              onClick={() => setTodoFilter('done')}
            >
              <SvgIcon name="checkSquare" size={14} />
              <span>Done</span>
              <span className="nav-count">{todoStats.completed}</span>
            </button>

            <div className="todo-nav-header">Sort by</div>

            <button
              type="button"
              className={`todo-nav-btn ${todoSort === 'priority' ? 'is-active' : ''}`}
              onClick={() => setTodoSort(todoSort === 'priority' ? 'default' : 'priority')}
            >
              <SvgIcon name="flag" size={14} />
              <span>Priority</span>
            </button>

            <button
              type="button"
              className={`todo-nav-btn ${todoSort === 'date' ? 'is-active' : ''}`}
              onClick={() => setTodoSort(todoSort === 'date' ? 'default' : 'date')}
            >
              <SvgIcon name="calendar" size={14} />
              <span>Due date</span>
            </button>

            <div className="todo-nav-header">Actions</div>

            <button
              type="button"
              className="todo-nav-btn"
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              <SvgIcon name="plus" size={14} />
              <span>Add task</span>
            </button>
          </div>

          {/* Center Pane: Task Items List */}
          <div className="todo-center-pane">
            <div className="todo-center-header">
              <h2>{todoFilter === 'all' ? 'All Tasks' : todoFilter.toUpperCase()}</h2>
              <span className="todo-center-count">{filteredTodoTasks.length}</span>
            </div>

            <div className="todo-tasks-scroll">
              {filteredTodoTasks.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ margin: 0, fontSize: 14 }}>
                    {todoFilter === 'overdue'
                      ? "No overdue tasks — you're all caught up! ✨"
                      : todoFilter === 'done'
                      ? 'No completed tasks yet. Check off items as you complete them!'
                      : 'No tasks in this view.'}
                  </p>
                </div>
              ) : (
                filteredTodoTasks.map((task) => {
                  const isSelected = selectedTaskId === task.id
                  return (
                    <div
                      key={task.id}
                      role="button"
                      data-no-press="true"
                      tabIndex={0}
                      className={`todo-task-row ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSelectTask(task)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 20px',
                        borderBottom: '1px solid var(--border-faint)',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(217, 231, 235, 0.45)' : 'transparent',
                        opacity: 1,
                        boxShadow: 'none',
                        transition: 'background 0.1s, opacity 0.15s',
                      }}
                    >
                      <div
                        role="presentation"
                        draggable="true"
                        style={{
                          cursor: 'grab',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--text-faint)',
                          flexShrink: 0,
                          marginLeft: '-6px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-grip-vertical "
                        >
                          <circle cx="9" cy="12" r="1"></circle>
                          <circle cx="9" cy="5" r="1"></circle>
                          <circle cx="9" cy="19" r="1"></circle>
                          <circle cx="15" cy="12" r="1"></circle>
                          <circle cx="15" cy="5" r="1"></circle>
                          <circle cx="15" cy="19" r="1"></circle>
                        </svg>
                      </div>

                      <button
                        type="button"
                        style={{
                          background: 'none',
                          borderWidth: 'medium',
                          borderStyle: 'none',
                          borderColor: 'currentcolor',
                          borderImage: 'none',
                          cursor: 'pointer',
                          padding: '0px',
                          flexShrink: 0,
                          color: task.done ? 'rgb(34, 197, 94)' : 'var(--text-faint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        aria-label={task.done ? 'Mark task incomplete' : 'Mark task complete'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleTodo(task.id)
                        }}
                      >
                        {task.done ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-check-square "
                          >
                            <path d="m9 11 3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-square"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                          </svg>
                        )}
                      </button>

                      <div style={{ flex: '1 1 0%', minWidth: '0px' }}>
                        <div
                          style={{
                            fontSize: 'calc(14px * var(--fs-scale-body, 1))',
                            color: task.done ? 'var(--text-faint)' : 'var(--text-primary)',
                            textDecoration: task.done ? 'line-through' : 'none',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {task.title}
                        </div>

                        <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
                          {task.priority && task.priority !== 'none' && (
                            <span
                              style={{
                                fontSize: 'calc(10px * var(--fs-scale-caption, 1))',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                fontWeight: 600,
                                color:
                                  task.priority === 'p1'
                                    ? 'rgb(239, 68, 68)'
                                    : task.priority === 'p2'
                                    ? 'rgb(245, 158, 11)'
                                    : 'rgb(59, 130, 246)',
                                background:
                                  task.priority === 'p1'
                                    ? 'rgba(239, 68, 68, 0.063)'
                                    : task.priority === 'p2'
                                    ? 'rgba(245, 158, 11, 0.08)'
                                    : 'rgba(59, 130, 246, 0.08)',
                                border:
                                  task.priority === 'p1'
                                    ? '1px solid rgba(239, 68, 68, 0.145)'
                                    : task.priority === 'p2'
                                    ? '1px solid rgba(245, 158, 11, 0.2)'
                                    : '1px solid rgba(59, 130, 246, 0.2)',
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="9"
                                height="9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-flag "
                              >
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" x2="4" y1="22" y2="15"></line>
                              </svg>
                              {task.priority.toUpperCase()}
                            </span>
                          )}

                          {task.dueDate && (
                            <span
                              style={{
                                fontSize: 'calc(10px * var(--fs-scale-caption, 1))',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 7px',
                                borderRadius: '5px',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-hover)',
                                border: '1px solid var(--border-faint)',
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="9"
                                height="9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-calendar "
                              >
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                              </svg>
                              {formatTaskDate(task.dueDate)}
                            </span>
                          )}

                          <span
                            style={{
                              fontSize: 'calc(10px * var(--fs-scale-caption, 1))',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 7px',
                              borderRadius: '5px',
                              fontWeight: 500,
                              color: 'var(--text-secondary)',
                              background: 'var(--bg-hover)',
                              border: '1px solid var(--border-faint)',
                            }}
                          >
                            <span
                              style={{
                                width: '13px',
                                height: '13px',
                                borderRadius: '50%',
                                background: 'var(--border-primary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'calc(7px * var(--fs-scale-caption, 1))',
                                color: 'var(--text-faint)',
                                fontWeight: 700,
                              }}
                            >
                              {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'J'}
                            </span>
                            {task.assignee || 'Jonas Weber'}
                          </span>
                        </div>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-faint)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right "
                        style={{ flexShrink: 0, opacity: 0.4 }}
                      >
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Side Detail Drawer */}
          {selectedTask && (
            <div className="todo-detail-pane">
              <div className="todo-detail-header">
                <span>Task</span>
                <button
                  type="button"
                  className="packing-icon-btn"
                  onClick={() => setSelectedTaskId(null)}
                >
                  <SvgIcon name="x" size={14} />
                </button>
              </div>

              <div className="todo-detail-body">
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    className="todo-title-input"
                    value={detailTitle}
                    onChange={(e) => {
                      setDetailTitle(e.target.value)
                      setIsDetailDirty(true)
                    }}
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    rows={4}
                    className="todo-desc-textarea"
                    placeholder="Description (optional)"
                    value={detailDesc}
                    onChange={(e) => {
                      setDetailDesc(e.target.value)
                      setIsDetailDirty(true)
                    }}
                  />
                </div>

                <div>
                  <label>Priority</label>
                  <div className="todo-prio-buttons">
                    {['none', 'p1', 'p2', 'p3'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`todo-prio-btn ${detailPriority === p ? 'is-active' : ''}`}
                        onClick={() => {
                          setDetailPriority(p)
                          setIsDetailDirty(true)
                        }}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label>Due date</label>
                  <input
                    type="date"
                    className="todo-select-btn"
                    value={detailDueDate}
                    onChange={(e) => {
                      setDetailDueDate(e.target.value)
                      setIsDetailDirty(true)
                    }}
                  />
                </div>
              </div>

              <div className="todo-detail-footer">
                <button
                  type="button"
                  className="todo-delete-btn"
                  onClick={handleDeleteSelectedTask}
                >
                  <SvgIcon name="trash" size={14} />
                  <span>Delete</span>
                </button>

                <button
                  type="button"
                  className={`todo-save-btn ${isDetailDirty ? 'is-dirty' : ''}`}
                  disabled={!isDetailDirty}
                  onClick={handleSaveTaskDetail}
                >
                  Save changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL: ADD NEW TASK */}
      {isNewTaskModalOpen && (
        <div
          className="lists-modal-backdrop"
          onClick={() => setIsNewTaskModalOpen(false)}
        >
          <div
            className="lists-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lists-modal-header">
              <span>New task</span>
              <button
                type="button"
                className="lists-modal-close-btn"
                onClick={() => setIsNewTaskModalOpen(false)}
              >
                <SvgIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask}>
              <div className="lists-modal-body">
                <div>
                  <input
                    type="text"
                    className="todo-title-input"
                    placeholder="Task name"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    rows={4}
                    className="todo-desc-textarea"
                    placeholder="Description (optional)"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label>Priority</label>
                  <div className="todo-prio-buttons">
                    {['none', 'p1', 'p2', 'p3'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`todo-prio-btn ${newTaskPriority === p ? 'is-active' : ''}`}
                        onClick={() => setNewTaskPriority(p)}
                      >
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label>Due date</label>
                  <input
                    type="date"
                    className="todo-select-btn"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="lists-modal-footer">
                <button
                  type="submit"
                  className="lists-modal-submit-btn"
                  disabled={!newTaskTitle.trim()}
                >
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: IMPORT CONFIRMATION */}
      {isImportModalOpen && (
        <div
          className="lists-modal-backdrop"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div
            className="lists-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440 }}
          >
            <div className="lists-modal-header">
              <span>Import Checklist</span>
              <button
                type="button"
                className="lists-modal-close-btn"
                onClick={() => setIsImportModalOpen(false)}
              >
                <SvgIcon name="x" size={16} />
              </button>
            </div>

            <div className="lists-modal-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <span style={{ fontSize: 42, display: 'block', marginBottom: 10 }}>📦</span>
              <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>
                Japan Trip Essentials Loaded
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                Your packing checklist is already pre-populated with standard Japan travel essentials (clothing, electronics, passport, adapters, toiletries).
              </p>
            </div>

            <div className="lists-modal-footer">
              <button
                type="button"
                className="lists-modal-submit-btn"
                onClick={() => setIsImportModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
