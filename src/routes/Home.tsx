import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { profile } from '../content/profile'
import { useMeta } from '../lib/useMeta'
import { useReveal } from '../lib/useReveal'
import { useSectionViews } from '../lib/useSectionViews'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Hero } from '../sections/Hero'
import { Journey } from '../sections/Journey'
import { Services } from '../sections/Services'
import { Skills } from '../sections/Skills'
import { Work } from '../sections/Work'

export const HOME_SCROLL_KEY = 'pw-home-scroll'

export default function Home() {
  const { hash, state } = useLocation()
  useMeta(`${profile.name} · ${profile.role}`, `${profile.value} ${profile.role}, founder of ${profile.company}, ${profile.location}.`)
  useReveal('home')
  useSectionViews()

  // "Back to work" returns to the exact scroll position; a hash link scrolls to its section.
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(HOME_SCROLL_KEY)
    if ((state as { restore?: boolean } | null)?.restore && saved) {
      window.scrollTo(0, Number(saved))
      return
    }
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash, state])

  useEffect(() => {
    const save = () => sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY))
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Work />
      <Journey />
      <Skills />
      <Services />
      <Contact />
    </>
  )
}
