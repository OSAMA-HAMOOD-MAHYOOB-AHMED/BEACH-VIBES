import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'beach-vibes-wishlist'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

let listeners = new Set()
let cache = null

function getCache() {
  if (!cache) cache = readStored()
  return cache
}

function notify() {
  const snapshot = new Set(cache)
  listeners.forEach((fn) => fn(snapshot))
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cache]))
  notify()
}

export function useWishlist() {
  const [ids, setIds] = useState(getCache)

  useEffect(() => {
    listeners.add(setIds)
    return () => listeners.delete(setIds)
  }, [])

  const toggle = useCallback((id) => {
    const next = new Set(getCache())
    if (next.has(id)) next.delete(id)
    else next.add(id)
    cache = next
    persist()
  }, [])

  const isWishlisted = useCallback((id) => ids.has(id), [ids])

  return { ids, toggle, isWishlisted, count: ids.size }
}
