import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// In-memory image query cache
const imageCache = new Map()

// Curated fallbacks for offline / missing key situations
const FALLBACK_IMAGES = {
  tokyo: [
    {
      id: 'img-tokyo-1',
      url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      description: 'Tokyo Pagoda and city skyline at twilight',
      photographer: 'Susann Schuster',
    },
    {
      id: 'img-tokyo-2',
      url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
      description: 'Shibuya Crossing Tokyo at night',
      photographer: 'Jezael Melgoza',
    },
    {
      id: 'img-tokyo-3',
      url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80',
      description: 'Senso-ji Temple Asakusa Tokyo',
      photographer: 'Sora Sagano',
    },
  ],
  japan: [
    {
      id: 'img-japan-1',
      url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80',
      description: 'Mount Fuji and Chureito Pagoda cherry blossoms',
      photographer: 'Manuel Cosentino',
    },
  ],
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WanderWise API Proxy',
    timestamp: new Date().toISOString(),
    hasUnsplashKey: Boolean(process.env.UNSPLASH_ACCESS_KEY),
    hasWeatherKey: Boolean(process.env.OPENWEATHER_API_KEY),
  })
})

/**
 * Image search proxy endpoint (caches results and falls back safely)
 */
app.get('/api/images/search', async (req, res) => {
  const query = (req.query.q || '').toString().trim().toLowerCase()
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' })
  }

  // Check cache first
  if (imageCache.has(query)) {
    return res.json({ source: 'cache', results: imageCache.get(query) })
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey || accessKey.includes('replace')) {
    const fallbackKey = Object.keys(FALLBACK_IMAGES).find(k => query.includes(k)) || 'tokyo'
    const fallbackResults = FALLBACK_IMAGES[fallbackKey] || FALLBACK_IMAGES.tokyo
    return res.json({ source: 'fallback', results: fallbackResults })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
        signal: controller.signal,
      }
    )
    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Unsplash returned ${response.status}`)
    }

    const data = await response.json()
    const results = (data.results || []).map(photo => ({
      id: photo.id,
      url: photo.urls?.regular || photo.urls?.small,
      thumb: photo.urls?.thumb,
      description: photo.description || photo.alt_description || query,
      photographer: photo.user?.name || 'Unsplash',
      link: photo.links?.html,
    }))

    imageCache.set(query, results)
    res.json({ source: 'unsplash', results })
  } catch (error) {
    // Fail gracefully with fallback images
    const fallbackKey = Object.keys(FALLBACK_IMAGES).find(k => query.includes(k)) || 'tokyo'
    const fallbackResults = FALLBACK_IMAGES[fallbackKey] || FALLBACK_IMAGES.tokyo
    res.json({ source: 'fallback', results: fallbackResults, note: 'Network or key limitation' })
  }
})

/**
 * Weather endpoint proxy
 */
app.get('/api/weather', async (req, res) => {
  const lat = req.query.lat
  const lon = req.query.lon
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!lat || !lon || !apiKey || apiKey.includes('replace')) {
    return res.json({
      source: 'mock',
      temp: '20°C',
      description: 'Clear Sky',
      icon: 'sun',
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!response.ok) throw new Error('Weather API error')
    const data = await response.json()
    res.json({
      source: 'live',
      temp: `${Math.round(data.main?.temp || 20)}°C`,
      description: data.weather?.[0]?.description || 'Clear Sky',
      icon: data.weather?.[0]?.main?.toLowerCase() || 'sun',
    })
  } catch {
    res.json({
      source: 'fallback',
      temp: '20°C',
      description: 'Partly Cloudy',
      icon: 'cloud-sun',
    })
  }
})

app.listen(PORT, () => {
  console.log(`WanderWise API Proxy running on http://localhost:${PORT}`)
})
