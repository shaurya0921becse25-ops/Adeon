/**
 * @file ShopTab.jsx - Native React Food & Shopping Guide
 * Faithfully restored from final/Shop-tab.html
 */

import React, { useState, useMemo, useEffect } from 'react'
import { formatMoney } from '../../../itinerary/index.js'
import {
  JAPAN_EXTRA_SHOP_ITEMS,
  JAPAN_ACCORDION_GUIDE,
} from '../../data/japanShopAndListsData.js'
import { getFoodGuideForDestination } from '../../data/foodGuideData.js'
import './ShopTab.css'

// SVGs extracted from final/Shop-tab.html
const ICONS = {
  bag: 'M6 7h12l1 14H5z M9 7a3 3 0 0 1 6 0',
  utensils: 'M5 3v8a2 2 0 0 0 4 0V3 M7 11v10 M17 21V3c-3 2-4 5-4 9h4',
  chev: 'M6 9l6 6 6-6',
  pin: 'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 11v5 M12 8h.01',
  check: 'M5 13l4 4L19 7',
  x: 'M18 6L6 18 M6 6l12 12',
  tip: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
}

function SvgIcon({ name, size = 16, strokeWidth = 2, fill = 'none' }) {
  const path = ICONS[name]
  if (!path) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {path.split(' M').map((d, i) => (
        <path key={i} d={(i ? 'M' : '') + d} />
      ))}
    </svg>
  )
}

function getItemFallbackPhoto(name = '', category = '') {
  const n = String(name).toLowerCase()
  if (n.includes('ramen') || n.includes('noodle')) return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80'
  if (n.includes('sushi') || n.includes('nigiri')) return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80'
  if (n.includes('takoyaki') || n.includes('yakitori') || n.includes('street')) return 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&auto=format&fit=crop&q=80'
  if (n.includes('matcha') || n.includes('wagashi') || n.includes('tea')) return 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80'
  if (n.includes('knife') || n.includes('cutlery')) return 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80'
  if (n.includes('chopsticks') || n.includes('ceramic')) return 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
  if (n.includes('fan') || n.includes('sensu')) return 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=600&auto=format&fit=crop&q=80'
  if (n.includes('chime') || n.includes('furin')) return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80'
  if (n.includes('kitkat') || n.includes('sweet') || n.includes('chocolate')) return 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80'
  if (n.includes('tenugui') || n.includes('cloth') || n.includes('textile')) return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'
  if (n.includes('glass') || n.includes('kiriko')) return 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80'
  if (n.includes('washi') || n.includes('paper') || n.includes('stationery')) return 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'
  if (n.includes('ghibli') || n.includes('anime') || n.includes('figure')) return 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80'
  if (n.includes('incense') || n.includes('aromatic')) return 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&auto=format&fit=crop&q=80'
  if (n.includes('daruma') || n.includes('doll') || n.includes('craft')) return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
  return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80'
}

export default function ShopTab({ store, toggleFoodTried, toggleShopBought }) {
  const trip = store?.trip
  const tripId = trip?.id || 'japan-demo-trip-2026'
  const destFoodFallback = useMemo(() => {
    return getFoodGuideForDestination(trip?.destination)
  }, [trip?.destination])

  const baseFoodGuide = useMemo(() => {
    if (store?.foodGuide && store.foodGuide.length > 0) {
      return store.foodGuide
    }
    return destFoodFallback
  }, [store?.foodGuide, destFoodFallback])

  // Food items persistent tried state
  const [foodTriedMap, setFoodTriedMap] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip-food-tried-${tripId}`)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Food items with merged tried status
  const foodItems = useMemo(() => {
    return baseFoodGuide.map((item) => ({
      ...item,
      tried:
        foodTriedMap[item.id] !== undefined
          ? Boolean(foodTriedMap[item.id])
          : Boolean(item.tried),
    }))
  }, [baseFoodGuide, foodTriedMap])

  const handleToggleFoodTried = (itemId) => {
    const it = foodItems.find((f) => f.id === itemId)
    const nextVal = it ? !it.tried : true
    setFoodTriedMap((prev) => {
      const updated = { ...prev, [itemId]: nextVal }
      try {
        localStorage.setItem(`trip-food-tried-${tripId}`, JSON.stringify(updated))
      } catch {}
      return updated
    })
    if (toggleFoodTried) {
      try {
        toggleFoodTried(itemId)
      } catch {}
    }
  }

  const rawShopGuide = store?.shopGuide || []

  // Extra items persistent bought state
  const [extraBoughtMap, setExtraBoughtMap] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip-shop-extra-bought-${tripId}`)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Favorites persistent state
  const [favoritesMap, setFavoritesMap] = useState(() => {
    try {
      const stored = localStorage.getItem(`trip-shop-favorites-${tripId}`)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // Accordion open states
  const [openAccs, setOpenAccs] = useState({
    food0: false,
    food1: false,
    shop0: false,
    shop1: false,
  })

  // Search & Filter state for shopping items
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('all') // 'all' | 'to-buy' | 'bought' | 'favorites'
  const [sortOption, setSortOption] = useState('default') // 'default' | 'price-asc' | 'price-desc' | 'name-asc'

  // Modal item: { type: 'food' | 'shop', data: entry }
  const [activeModalItem, setActiveModalItem] = useState(null)

  // Sync extra items state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        `trip-shop-extra-bought-${tripId}`,
        JSON.stringify(extraBoughtMap)
      )
    } catch {}
  }, [extraBoughtMap, tripId])

  useEffect(() => {
    try {
      localStorage.setItem(
        `trip-shop-favorites-${tripId}`,
        JSON.stringify(favoritesMap)
      )
    } catch {}
  }, [favoritesMap, tripId])

  // Merge store shop items with extra items to provide at least 12 rich entries
  const allShopItems = useMemo(() => {
    const existingIds = new Set(rawShopGuide.map((s) => s.id))
    const extras = JAPAN_EXTRA_SHOP_ITEMS.filter((item) => !existingIds.has(item.id)).map(
      (item) => ({
        ...item,
        bought: Boolean(extraBoughtMap[item.id]),
        isFavorite: Boolean(favoritesMap[item.id]),
      })
    )

    const normalizedStoreItems = rawShopGuide.map((item) => ({
      ...item,
      category: item.category || 'Traditional Crafts',
      estimatedPrice: item.estimatedPrice || 3500,
      tags: item.tags || ['souvenir', 'craft', 'japan'],
      isFavorite: Boolean(favoritesMap[item.id]),
    }))

    return [...normalizedStoreItems, ...extras]
  }, [rawShopGuide, extraBoughtMap, favoritesMap])

  // Filter & sort shopping items
  const filteredShopItems = useMemo(() => {
    let list = [...allShopItems]

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((i) => i.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus === 'to-buy') {
      list = list.filter((i) => !i.bought)
    } else if (selectedStatus === 'bought') {
      list = list.filter((i) => i.bought)
    } else if (selectedStatus === 'favorites') {
      list = list.filter((i) => i.isFavorite)
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q) ||
          i.story?.toLowerCase().includes(q) ||
          i.tip?.toLowerCase().includes(q) ||
          i.whereToBuy?.toLowerCase().includes(q) ||
          (i.tags && i.tags.some((t) => t.toLowerCase().includes(q)))
      )
    }

    // Sorting
    if (sortOption === 'price-asc') {
      list.sort((a, b) => (a.estimatedPrice || 0) - (b.estimatedPrice || 0))
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => (b.estimatedPrice || 0) - (a.estimatedPrice || 0))
    } else if (sortOption === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [allShopItems, selectedCategory, selectedStatus, searchQuery, sortOption])

  // Progress metrics
  const foodTriedCount = foodItems.filter((f) => f.tried).length
  const foodTotalCount = foodItems.length
  const foodPct = foodTotalCount > 0 ? (foodTriedCount / foodTotalCount) * 100 : 0

  const shopBoughtCount = allShopItems.filter((s) => s.bought).length
  const shopTotalCount = allShopItems.length
  const shopPct = shopTotalCount > 0 ? (shopBoughtCount / shopTotalCount) * 100 : 0

  // Derived budget from store
  const shoppingBudget = Math.round((Number(trip?.budget) || 300000) * 0.2)

  // Toggle bought item handler
  const handleToggleShopItem = (itemId) => {
    const isStoreItem = rawShopGuide.some((s) => s.id === itemId)
    if (isStoreItem && toggleShopBought) {
      toggleShopBought(itemId)
    } else {
      setExtraBoughtMap((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }))
    }
  }

  // Toggle favorite
  const handleToggleFavorite = (itemId, e) => {
    if (e) e.stopPropagation()
    setFavoritesMap((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  // Toggle accordion
  const toggleAccordion = (key) => {
    setOpenAccs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const destinationName = trip?.destination?.split(',')[0] || 'Japan'

  const categories = [
    'All',
    'Traditional Crafts',
    'Kitchenware',
    'Stationery',
    'Ceramics',
    'Tea & Snacks',
    'Glassware',
    'Pop Culture',
  ]

  return (
    <div className="shop-page-wrapper">
      {/* Top Header Card */}
      <div className="shop-head">
        <div>
          <h1>Food &amp; Shopping</h1>
          <p>What to eat and what to bring home from {destinationName}.</p>
        </div>

        <div className="shop-chips">
          <span className="shop-chip" id="chipFood">
            <SvgIcon name="utensils" size={14} />
            <b>
              {foodTriedCount}/{foodTotalCount}
            </b>{' '}
            dishes tried
          </span>
          <span className="shop-chip" id="chipShop">
            <SvgIcon name="bag" size={14} />
            <b>
              {shopBoughtCount}/{shopTotalCount}
            </b>{' '}
            items bought
          </span>
          <span className="shop-chip">
            Shopping budget <b>{formatMoney(shoppingBudget, trip?.currency || 'JPY')}</b>
          </span>
        </div>
      </div>

      {/* 1. FOOD GUIDE SECTION */}
      <section className="shop-sec" id="food">
        <div className="shop-sec-h">
          <span className="shop-sec-ico">
            <SvgIcon name="utensils" size={18} />
          </span>
          <h2>Food guide</h2>
          <span className="shop-prog" id="pFood">
            {foodTriedCount} of {foodTotalCount} tried
          </span>
        </div>

        <p className="shop-sub">Top traditional dishes to experience. Tap a card for the story and where to find it.</p>

        <div className="shop-bar">
          <span id="bFood" style={{ width: `${foodPct}%` }} />
        </div>

        <div className="shop-grid g4" id="gFood">
          {foodItems.map((item) => {
            const grad =
              item.gradientColors && item.gradientColors.length >= 2
                ? `linear-gradient(135deg, ${item.gradientColors[0]}, ${item.gradientColors[1]})`
                : 'linear-gradient(135deg, #c2410c, #7c2d12)'

            const isFav = Boolean(favoritesMap[item.id])
            const photoUrl = item.imageUrl || item.image || getItemFallbackPhoto(item.name, item.category)

            return (
              <button
                key={item.id}
                type="button"
                className={`shop-tile ${item.tried ? 'done' : ''}`}
                style={{ background: grad }}
                onClick={() => setActiveModalItem({ type: 'food', data: { ...item, imageUrl: photoUrl } })}
                aria-label={`${item.name}: open details`}
              >
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt={item.name}
                    className="shop-tile-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}

                <button
                  type="button"
                  className={`fav-btn ${isFav ? 'is-fav' : ''}`}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={(e) => handleToggleFavorite(item.id, e)}
                >
                  <SvgIcon name="heart" size={13} fill={isFav ? '#ef4444' : 'none'} />
                </button>

                <span className="em" style={{ opacity: photoUrl ? 0.3 : 1 }}>{item.emoji || '🍲'}</span>

                <span className="cap">
                  {item.name}
                  <small>{item.tagLine}</small>
                </span>

                <span
                  className="got"
                  role="checkbox"
                  aria-checked={Boolean(item.tried)}
                  aria-label={`Mark ${item.name} tried`}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFoodTried(item.id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      handleToggleFoodTried(item.id)
                    }
                  }}
                >
                  <SvgIcon
                    name="check"
                    size={15}
                    strokeWidth={3}
                    style={{ opacity: item.tried ? 1 : 0 }}
                  />
                </span>
              </button>
            )
          })}
        </div>

        {/* Food Accordion Row */}
        <div className="shop-acc-row">
          {JAPAN_ACCORDION_GUIDE.food.map((acc, index) => {
            const accKey = `food${index}`
            const isOpen = openAccs[accKey]
            return (
              <div key={accKey} className={`shop-acc ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleAccordion(accKey)}
                >
                  <span className="i">
                    <SvgIcon name={acc.i} size={16} />
                  </span>
                  {acc.t}
                  <span className="sm">{acc.s}</span>
                  <span className="ch">
                    <SvgIcon name="chev" size={15} />
                  </span>
                </button>
                <div className="shop-pan">
                  <div>
                    <ul>
                      {acc.items.map((item, i) =>
                        acc.type === 'kv' ? (
                          <li key={i} className="k">
                            <b>{item[0]}</b>
                            <span>{item[1]}</span>
                          </li>
                        ) : (
                          <li key={i}>
                            <SvgIcon name="pin" size={14} />
                            <span>
                              <b>{item[0]}</b>
                              <br />
                              {item[1]}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. SHOPPING GUIDE SECTION */}
      <section className="shop-sec" id="shop">
        <div className="shop-sec-h">
          <span className="shop-sec-ico">
            <SvgIcon name="bag" size={18} />
          </span>
          <h2>Shopping guide</h2>
          <span className="shop-prog" id="pShop">
            {shopBoughtCount} of {shopTotalCount} bought
          </span>
        </div>

        <p className="shop-sub">Top artisan crafts and souvenirs to buy. Mark each one as you collect it.</p>

        <div className="shop-bar">
          <span id="bShop" style={{ width: `${shopPct}%` }} />
        </div>

        {/* Shopping Controls: Search, Category Filters, Status, Sorting */}
        <div className="shop-toolbar">
          <div className="shop-search-row">
            <div className="shop-search-input-wrap">
              <span className="shop-search-icon">
                <SvgIcon name="search" size={15} />
              </span>
              <input
                type="text"
                className="shop-search-input"
                placeholder="Search souvenirs, crafts, knife, washi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="shop-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            <select
              className="shop-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort souvenirs"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>

          <div className="shop-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`shop-cat-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}

            <span style={{ width: 1, height: 16, background: '#D8BDA6', margin: '0 4px' }} />

            <button
              type="button"
              className={`shop-cat-pill ${selectedStatus === 'favorites' ? 'is-active' : ''}`}
              onClick={() => setSelectedStatus(selectedStatus === 'favorites' ? 'all' : 'favorites')}
              title="Show only favorites"
            >
              ❤️ Favorites ({allShopItems.filter((i) => i.isFavorite).length})
            </button>
          </div>
        </div>

        {/* Souvenir Cards Grid */}
        {filteredShopItems.length === 0 ? (
          <div style={{ padding: '36px 18px', textAlign: 'center', color: '#765F53' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>No souvenirs matched your filter.</p>
            <button
              type="button"
              className="shop-cat-pill"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedStatus('all')
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="shop-grid g6" id="gShop">
            {filteredShopItems.map((item) => {
              const grad =
                item.gradientColors && item.gradientColors.length >= 2
                  ? `linear-gradient(135deg, ${item.gradientColors[0]}, ${item.gradientColors[1]})`
                  : 'linear-gradient(135deg, #7c3aed, #4c1d95)'

              const photoUrl = item.imageUrl || item.image || getItemFallbackPhoto(item.name, item.category)

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`shop-tile ${item.bought ? 'done' : ''}`}
                  style={{ background: grad }}
                  onClick={() => setActiveModalItem({ type: 'shop', data: { ...item, imageUrl: photoUrl } })}
                  aria-label={`${item.name}: open details`}
                >
                  {photoUrl && (
                    <img
                      src={photoUrl}
                      alt={item.name}
                      className="shop-tile-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}

                  <button
                    type="button"
                    className={`fav-btn ${item.isFavorite ? 'is-fav' : ''}`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={(e) => handleToggleFavorite(item.id, e)}
                  >
                    <SvgIcon
                      name="heart"
                      size={13}
                      fill={item.isFavorite ? '#ef4444' : 'none'}
                    />
                  </button>

                  <span className="em" style={{ opacity: photoUrl ? 0.3 : 1 }}>{item.emoji || '🎁'}</span>

                  <span className="cap">
                    {item.name}
                    <small>{item.tagLine}</small>
                  </span>

                  <span
                    className="got"
                    role="checkbox"
                    aria-checked={Boolean(item.bought)}
                    aria-label={`Mark ${item.name} bought`}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleShopItem(item.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleToggleShopItem(item.id)
                      }
                    }}
                  >
                    <SvgIcon
                      name="check"
                      size={15}
                      strokeWidth={3}
                      style={{ opacity: item.bought ? 1 : 0 }}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Shopping Accordion Row */}
        <div className="shop-acc-row">
          {JAPAN_ACCORDION_GUIDE.shop.map((acc, index) => {
            const accKey = `shop${index}`
            const isOpen = openAccs[accKey]
            return (
              <div key={accKey} className={`shop-acc ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleAccordion(accKey)}
                >
                  <span className="i">
                    <SvgIcon name={acc.i} size={16} />
                  </span>
                  {acc.t}
                  <span className="sm">{acc.s}</span>
                  <span className="ch">
                    <SvgIcon name="chev" size={15} />
                  </span>
                </button>
                <div className="shop-pan">
                  <div>
                    <ul>
                      {acc.items.map((item, i) =>
                        acc.type === 'kv' ? (
                          <li key={i} className="k">
                            <b>{item[0]}</b>
                            <span>{item[1]}</span>
                          </li>
                        ) : (
                          <li key={i}>
                            <SvgIcon name="pin" size={14} />
                            <span>
                              <b>{item[0]}</b>
                              <br />
                              {item[1]}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <p className="shop-note">
        Prices are rough guides in {trip?.currency || 'JPY'}. Check operating hours and stock before visiting.
      </p>

      {/* DETAIL MODAL */}
      {activeModalItem && (
        <div
          className="shop-backdrop"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="shop-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="m-art"
              style={{
                background:
                  activeModalItem.data.gradientColors &&
                  activeModalItem.data.gradientColors.length >= 2
                    ? `linear-gradient(135deg, ${activeModalItem.data.gradientColors[0]}, ${activeModalItem.data.gradientColors[1]})`
                    : 'linear-gradient(135deg, #765F53, #4A3B32)',
              }}
            >
              <button
                type="button"
                className="m-x"
                aria-label="Close"
                onClick={() => setActiveModalItem(null)}
              >
                <SvgIcon name="x" size={15} />
              </button>

              <button
                type="button"
                className={`m-fav-toggle ${
                  favoritesMap[activeModalItem.data.id] ? 'is-fav' : ''
                }`}
                aria-label="Toggle favorite"
                onClick={(e) => handleToggleFavorite(activeModalItem.data.id, e)}
              >
                <SvgIcon
                  name="heart"
                  size={15}
                  fill={favoritesMap[activeModalItem.data.id] ? '#ef4444' : 'none'}
                />
              </button>

              <span>{activeModalItem.data.emoji || '✨'}</span>
            </div>

            <div className="m-b">
              <h3>{activeModalItem.data.name}</h3>
              <span className="m-tag">{activeModalItem.data.tagLine}</span>
              <p>{activeModalItem.data.story}</p>

              {(activeModalItem.data.whereToFind || activeModalItem.data.whereToBuy) && (
                <div className="m-row">
                  <SvgIcon name="pin" size={16} />
                  <span>
                    <b>{activeModalItem.type === 'food' ? 'Find it:' : 'Buy it:'}</b>{' '}
                    {activeModalItem.data.whereToFind || activeModalItem.data.whereToBuy}
                  </span>
                </div>
              )}

              {activeModalItem.data.tip && (
                <div className="m-row">
                  <SvgIcon name="tip" size={16} />
                  <span>
                    <b>Tip:</b> {activeModalItem.data.tip}
                  </span>
                </div>
              )}

              <button
                type="button"
                className="m-btn"
                onClick={() => {
                  if (activeModalItem.type === 'food') {
                    handleToggleFoodTried(activeModalItem.data.id)
                    setActiveModalItem({
                      ...activeModalItem,
                      data: {
                        ...activeModalItem.data,
                        tried: !activeModalItem.data.tried,
                      },
                    })
                  } else {
                    handleToggleShopItem(activeModalItem.data.id)
                    setActiveModalItem({
                      ...activeModalItem,
                      data: {
                        ...activeModalItem.data,
                        bought: !activeModalItem.data.bought,
                      },
                    })
                  }
                }}
              >
                {activeModalItem.type === 'food'
                  ? activeModalItem.data.tried
                    ? 'Tried it ✓ (tap to undo)'
                    : 'Mark as tried'
                  : activeModalItem.data.bought
                  ? 'Bought ✓ (tap to undo)'
                  : 'Mark as bought'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
