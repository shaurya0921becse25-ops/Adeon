/**
 * @file Image Service for WanderWise / Adeon
 * Provides cached image retrieval with graceful offline fallbacks
 */

const LOCAL_FALLBACKS = [
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&auto=format&fit=crop&q=80',
]

const memoryCache = new Map()

export const ImageService = {
  /**
   * Retrieves an image URL for a destination or place name
   * @param {string} query
   * @returns {Promise<string>}
   */
  async searchImage(query) {
    const q = (query || 'japan').trim().toLowerCase()
    if (memoryCache.has(q)) {
      return memoryCache.get(q)
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2500)

      const res = await fetch(`http://localhost:3001/api/images/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (res.ok) {
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          const url = data.results[0].url
          memoryCache.set(q, url)
          return url
        }
      }
    } catch {
      // Backend not running or offline; safely ignore and use fallback
    }

    // Deterministic selection from curated list
    let hash = 0
    for (let i = 0; i < q.length; i++) hash = (hash << 5) - hash + q.charCodeAt(i)
    const selected = LOCAL_FALLBACKS[Math.abs(hash) % LOCAL_FALLBACKS.length]
    memoryCache.set(q, selected)
    return selected
  },

  /**
   * Synchronous fallback getter
   * @param {string} query
   * @returns {string}
   */
  getFallbackImage(query) {
    const q = (query || '').toLowerCase()
    let hash = 0
    for (let i = 0; i < q.length; i++) hash = (hash << 5) - hash + q.charCodeAt(i)
    return LOCAL_FALLBACKS[Math.abs(hash) % LOCAL_FALLBACKS.length]
  },
}
