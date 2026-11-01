import { useMemo } from 'react'

const KEY = 'pw-ref'

/** The `?ref=` campaign tag (e.g. `wa`), kept for the session so later clicks can report it. */
export function getReferrer(): string {
  try {
    const q = new URLSearchParams(window.location.search).get('ref')
    if (q) sessionStorage.setItem(KEY, q)
    return q ?? sessionStorage.getItem(KEY) ?? 'direct'
  } catch {
    return 'direct'
  }
}

export const useReferrer = () => useMemo(getReferrer, [])
