import { useId } from 'react'

type PosterState = 'assembled' | 'exploded' | 'focus'

/**
 * Static bearing drawn in SVG: the Poster tier and the placeholder while the scene loads.
 * TODO: swap for the pre-rendered AVIF/WebP posters from the live scene (UI Guidelines § Assets).
 */
export function Poster({ state }: { state: PosterState }) {
  const id = useId().replace(/:/g, '')
  const balls = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2 + Math.PI / 6)
  return (
    <div className="relative size-full" aria-hidden>
      {(['assembled', 'exploded', 'focus'] as PosterState[]).map((s) => (
        <svg
          key={s}
          viewBox="-200 -200 400 400"
          className="absolute inset-0 size-full transition-opacity duration-200"
          style={{ opacity: s === state ? 1 : 0 }}
        >
          <defs>
            <radialGradient id={`${id}-ball`} cx="35%" cy="30%" r="70%">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.35" stopColor="var(--ball)" />
              <stop offset="1" stopColor="#4a5058" />
            </radialGradient>
            <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--ball)" />
              <stop offset="0.5" stopColor="var(--steel)" />
              <stop offset="1" stopColor="#3b4047" />
            </linearGradient>
          </defs>
          {s === 'focus' ? (
            <circle r="70" fill={`url(#${id}-ball)`} />
          ) : (
            <g transform={`scale(1 ${s === 'exploded' ? 0.62 : 0.92})`}>
              <circle r="186" fill="none" stroke="var(--text)" strokeOpacity="0.18" strokeDasharray="2 6" />
              {s === 'exploded' ? (
                <>
                  <g transform="translate(-26 -40)">
                    <circle r="155" fill="none" stroke={`url(#${id}-steel)`} strokeWidth="34" />
                  </g>
                  <g transform="translate(26 40)">
                    <circle r="77" fill="none" stroke={`url(#${id}-steel)`} strokeWidth="34" />
                  </g>
                  {balls.map((a, i) => (
                    <circle key={i} cx={Math.cos(a) * 175} cy={Math.sin(a) * 175} r="18" fill={`url(#${id}-ball)`} />
                  ))}
                </>
              ) : (
                <>
                  <circle r="142" fill="none" stroke={`url(#${id}-steel)`} strokeWidth="34" />
                  <circle r="77" fill="none" stroke={`url(#${id}-steel)`} strokeWidth="34" />
                  <circle r="110" fill="none" stroke="var(--cage)" strokeWidth="4" />
                  {balls.map((a, i) => (
                    <circle key={i} cx={Math.cos(a) * 110} cy={Math.sin(a) * 110} r="18" fill={`url(#${id}-ball)`} />
                  ))}
                </>
              )}
            </g>
          )}
        </svg>
      ))}
    </div>
  )
}
