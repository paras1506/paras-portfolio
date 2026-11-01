# Paras Wane Portfolio — UI Guidelines

Nov 1, 2026 · @Paras

## Design concept: Precision Parts

The site looks like an engineering datasheet brought to life. It has a graphite background, machined-steel greys and one hot accent: the orange of metal fresh off the lathe. The 3D centrepiece is a ball bearing built in three.js. Every interface detail repeats its language: part numbers, tolerances, spec labels.

**Why a bearing.** It is personal: Paras is building ML to detect bearing defects. It is a metaphor: the small, precise parts that keep a business running, which is what Grovanta sells. It is practical: torus rings and spheres are built in code, with no 3D model file to download.

**Principles**

1. **Content first, 3D second.** Every fact is in HTML. The canvas is decoration that can be removed without losing information.
2. **One accent, used rarely.** Orange marks only the next action or the active state. If everything glows, nothing does.
3. **Engineered, not decorated.** Use spec labels (`SPEC 03 / WORK`), hairline rules and mono numerals instead of gradients, blobs or glassmorphism.
4. **Motion with a purpose.** Every animation explains a change of state (assemble, explode, focus). Nothing loops for attention except the hero's slow idle spin.
5. **Local and human.** Copy is plain English, with Hindi/Marathi where business owners read it. Client outcomes come before technology names.

## Color tokens

Dark "Graphite" is the default theme; "Paper" is the light theme. Every text pair below passes WCAG AA (4.5:1). Text on the orange accent is always dark, because white on `#FF6A1A` is only 2.87:1.

| Token | Graphite (dark) | Paper (light) | Use | Contrast on bg |
| --- | --- | --- | --- | --- |
| `--bg` | `#0B0C0E` | `#F4F2EE` | Page background, canvas clear color | — |
| `--surface` | `#141619` | `#FFFFFF` | Cards, nav bar | — |
| `--surface-2` | `#1C1F23` | `#ECE9E3` | Hover, inputs | — |
| `--line` | `#2A2E34` | `#D8D4CC` | Hairline rules, card borders (decorative only) | 1.43:1 (not for text) |
| `--text` | `#EDEEF0` | `#111315` | Body and headings | 16.9 / 16.7:1 |
| `--text-muted` | `#9AA3AE` | `#5B636D` | Captions, spec labels | 7.7 / 5.4:1 |
| `--text-faint` | `#6B7380` | — | Large decorative numerals only (≥ 24 px) | 4.1:1 |
| `--accent` ("Spark") | `#FF6A1A` | `#B83A0A` | Primary CTA fill, active state, focused ball | 6.8 / 5.2:1 |
| `--on-accent` | `#0B0C0E` | `#FFFFFF` | Text on accent buttons | 6.8:1 |
| `--success` | `#4ADE80` | `#15803D` | Form sent, "Live" badge | 11.2:1 dark |
| `--danger` | `#F87171` | `#B91C1C` | Form errors | 7.1:1 dark |

**3D material colors** (shared with CSS through the same tokens, read in the scene via `getComputedStyle`)

| Part | Color | Material (three.js `MeshPhysicalMaterial`) |
| --- | --- | --- |
| Outer + inner race | `#B8C0CA` | metalness 1, roughness 0.28, clearcoat 0.3 |
| Balls | `#E6EAEE` | metalness 1, roughness 0.12 |
| Cage | `#2A2E34` | metalness 0.4, roughness 0.6 |
| Active ball | `--accent` | emissive `--accent`, emissiveIntensity 0.6 (Bloom on the High tier only) |
| Environment | drei `<Environment preset="warehouse">` | Reflections only, not shown as the background |

**Usage rule.** The accent covers at most about 5% of any viewport: one CTA, one active ball, one underline.

## Typography

Three families, all free and self-hosted as Latin-subset WOFF2: a tight display grotesk for headlines, a neutral sans for reading, and a mono for the datasheet labels.

| Role | Family | Weights | Source |
| --- | --- | --- | --- |
| Display | Clash Display | 500, 600 | Fontshare (free licence) |
| Body / UI | General Sans | 400, 500 | Fontshare |
| Spec labels, numbers, code | JetBrains Mono | 400, 500 | Google Fonts / JetBrains (OFL) |
| Hindi / Marathi | Mukta | 400, 600 | Google Fonts (OFL), loaded only when that language is on |

**Type scale** (fluid, `clamp(min, preferred, max)`, 360 to 1440 px viewport)

| Token | Size | Line height | Tracking | Use |
| --- | --- | --- | --- | --- |
| `display-xl` | clamp(48px, 9vw, 128px) | 0.95 | -0.03em | Hero name only |
| `display-l` | clamp(36px, 5vw, 72px) | 1.0 | -0.02em | Section titles |
| `h3` | clamp(22px, 2vw, 28px) | 1.2 | -0.01em | Card and project titles |
| `body-l` | 18px | 1.6 | 0 | Hero sub-line, About |
| `body` | 16px | 1.6 | 0 | Default |
| `small` | 14px | 1.5 | 0 | Captions, form help |
| `spec` | 12px mono, uppercase | 1.4 | 0.12em | `SPEC 03 / WORK`, tags, part numbers |

**Rules**

- Headlines are set in sentence case, never all caps; only `spec` labels are uppercase.
- Keep line length to 60 to 72 characters (`max-width: 68ch`).
- Numbers in stats use mono with `font-variant-numeric: tabular-nums` (for example `3,700+`, `97%`).
- Preload only Clash Display 600 and General Sans 400; load the rest after first paint.

## Layout, grid and spacing

A 12-column grid with a fixed full-screen canvas behind it. On desktop, content sits in columns 1 to 7 and the bearing owns columns 7 to 12. On mobile, the bearing sits above the text, then fades to 15% opacity as the reader scrolls.

| Breakpoint | Width | Columns | Gutter | Side margin | Bearing position |
| --- | --- | --- | --- | --- | --- |
| `sm` | 360 to 639 px | 4 | 16 px | 20 px | Top 45vh of the hero, then a faint background |
| `md` | 640 to 1023 px | 8 | 24 px | 32 px | Right half, 70% scale |
| `lg` | 1024 to 1439 px | 12 | 24 px | 64 px | Columns 7 to 12 |
| `xl` | ≥ 1440 px | 12, max 1320 px | 32 px | auto | Columns 7 to 12 |

**Spacing scale (4 px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 160. Sections use 160 px vertical padding on desktop and 96 px on mobile. Card padding is 24 px.

**Radius:** 4 px on chips and inputs, 12 px on cards, full on round buttons. **Borders:** 1 px `--line`. **Shadows:** none; depth comes from `--surface` steps and the 3D scene.

**Hero wireframe (lg)**

```
+--------------------------------------------------------------------+
| PW-01            Work  About  Journey  Services  Contact  [Resume] |
+--------------------------------------------------------------------+
| SPEC 00 / INTRO                  |                                  |
|                                  |         ( 3D BEARING )           |
| Paras Wane                       |       slow spin, follows         |
| Full-stack and AI developer.     |          the cursor              |
| Founder, Grovanta.               |                                  |
|                                  |                                  |
| I build websites and AI tools    |                                  |
| that small businesses use daily. |  TOL ±0.01  ·  6 PARTS  ·  PUNE  |
| [View work ->]  [Resume PDF]     |                                  |
+--------------------------------------------------------------------+
| scroll ↓                                     Bearing ref. 6204-PW  |
```

## 3D scene specification (three.js)

One fixed `<Canvas>` behind the page renders a deep-groove ball bearing with 6 balls, one per featured project. Scroll moves it through five states; clicking a ball opens that project.

&#91;embedded content: 3D scene states · 5 scroll states + 1 focus state\]

Each state is a set of target transforms. GSAP ScrollTrigger tweens between them, scrubbed to scroll position (`scrub: 0.6`), so scrolling backward reverses the animation exactly.

**Geometry (scene units, built in code, no GLB)**

| Part | three.js build | Dimensions |
| --- | --- | --- |
| Outer race | `LatheGeometry` from a 2D profile with the ball groove | inner radius 1.25, outer 1.60, width 0.55, 96 segments |
| Inner race | `LatheGeometry`, mirrored groove | bore 0.60, outer 0.95, width 0.55 |
| Balls (6) | `InstancedMesh` of `SphereGeometry(0.16, 48, 32)` | pitch radius 1.10, 60° apart |
| Cage | `TorusGeometry(1.10, 0.025)` × 2 + 6 small bridges | sits between balls |
| Spec ring (decor) | `RingGeometry` + mono text texture "6204-PW · TOL ±0.01" | radius 1.9, opacity 0.25 |

**State transforms**

| State | Bearing group | Outer race | Inner race | Balls | Camera (pos / FOV) |
| --- | --- | --- | --- | --- | --- |
| Assembled | rot.x 0.35, idle rot.z +0.15 rad/s | 0 | 0 | on pitch circle | (0, 0, 6) / 35° |
| Tilted | rot.y 0.6, x +1.2 | 0 | 0 | on pitch circle | (0, 0.4, 6) |
| Exploded | rot.x 0.9 | z −1.2 | z +1.2 | radius 2.4, z 0, 72° arc spread on mobile | (0, 0, 7.5) |
| Ball focus | other parts fade to 0.15 | — | — | selected ball scales ×3 to centre | (0, 0, 3) / 28° |
| Settled | rot.x 0.35, spin eases to 0 | 0 | 0 | on pitch circle; cage emissive accent | (0, 0, 6) |

**Lighting.** A key `DirectionalLight` (intensity 2.2) from top-left, a `RectAreaLight` rim from behind-right in `--accent` at 0.6, and an `Environment` map for reflections. Shadows are off; use drei `ContactShadows` (opacity 0.35) on High only.

**Interaction**

- Cursor parallax: group rotation follows the pointer up to ±0.15 rad, damped (`lerp 0.08`). It is off on touch.
- Exploded state: hovering or keyboard-focusing a project card makes its ball glow, and hovering a ball highlights its card (one shared `activeProject` store, Zustand).
- Clicking a ball calls `navigate('/work/' + slug)`. Balls also have HTML twin buttons, so the 3D is never the only way in.
- Drag-to-spin is allowed in Assembled only (drei `PresentationControls`, snap back on release).

**Render rules.** `frameloop="demand"` when the canvas is offscreen or the tab is hidden. `dpr={[1, 1.5]}`. `gl={{ antialias: true, powerPreference: 'high-performance' }}`. The canvas has `aria-hidden="true"` and `pointer-events: none` except while in the Exploded state.

```tsx
// scene/Bearing.tsx (shape of the component)
export function Bearing({ state }: { state: BearingState }) {
  const outer = useMemo(() => latheRing(1.25, 1.6, 0.55, 'outer'), [])
  const inner = useMemo(() => latheRing(0.6, 0.95, 0.55, 'inner'), [])
  useScrollState(groupRef, state) // GSAP timeline per state
  return (
    <group ref={groupRef}>
      <mesh geometry={outer} material={steel} />
      <mesh geometry={inner} material={steel} />
      <Balls count={projects.length} />
      <Cage />
    </group>
  )
}
```

## Motion system

Motion should feel mechanical: quick, decisive starts with a soft landing, like a part seating into a housing. Four durations and two easings cover everything.

| Token | Value | Use |
| --- | --- | --- |
| `dur-micro` | 120 ms | Hover color, focus ring, chip press |
| `dur-ui` | 240 ms | Buttons, menus, card lift |
| `dur-section` | 600 ms | Text reveals, section entry |
| `dur-scene` | scroll-scrubbed (`scrub: 0.6`) | Bearing state changes |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entries, reveals |
| `ease-seat` | `cubic-bezier(0.65, 0, 0.35, 1)` | 3D parts moving into place |

**Patterns**

- **Page load:** the spec label types in (mono, 12 characters at 20 ms each), then the name rises 24 px and fades in, then the CTAs appear. The bearing fades in once its chunk is ready. The total is ≤ 1.2 s, and nothing ever waits on the 3D.
- **Section entry:** the heading slides up 16 px with opacity 0 to 1; children stagger by 60 ms (max 6 items).
- **Card hover:** lift 4 px, border goes from `--line` to `--accent`, and the matching ball glows. No scale, no tilt.
- **Buttons:** the primary arrow nudges 4 px right on hover; on press, scale to 0.98.
- **Route change to a project:** the ball zooms in (600 ms), then the detail content fades in. Back reverses it.
- **Smooth scroll:** Lenis with `lerp: 0.1`; off under reduced motion and on touch devices that already scroll smoothly.

**Reduced motion** (`prefers-reduced-motion: reduce` or the site toggle): no Lenis, no parallax, no idle spin, and reveals become opacity-only fades at 120 ms. The bearing jumps between states with a 200 ms crossfade, or shows the static poster.

## Components

Twelve components build the whole site. Each lists the states it must support; anything not listed here should be built from these.

| Component | Anatomy | States | Notes |
| --- | --- | --- | --- |
| **Nav bar** | Logo mark `PW-01`, 5 links, \[Resume\], theme toggle | default, scrolled (surface bg + hairline), mobile sheet open | Sticky; the link for the section in view gets an accent underline |
| **Button: primary** | Label + → | default, hover, focus, pressed, loading, disabled | Accent fill, `--on-accent` text, 48 px tall, radius full |
| **Button: secondary** | Label + icon | same | 1 px `--text` outline, transparent fill |
| **Spec label** | `SPEC 03 / WORK` in mono 12 px | — | Opens every section; the number matches the nav order |
| **Project card** | Ball number, title (h3), type tag, 1-line outcome, 3 stack chips, \[Live\] \[Case study\] | default, hover/active (linked to its ball), focus | Whole card clickable; the inner links stay separate tab stops |
| **Stat block** | Mono number + label | — | For example "3,700+ organisations", "97% accuracy", "7-day build" |
| **Chip** | Text, optional icon | default, selected | Skills and stack; 4 px radius, `--surface-2` |
| **Live badge** | Green dot + "Live" | live, in progress (amber), archived (muted) | Shows on project cards |
| **Demo guide panel** | Steps 1 to 3, credential rows with \[Copy\], \[Open demo ↗\] | collapsed, open, copied | Gym project only; demo credentials only |
| **Timeline item** | Date (mono), title, org, 1 to 2 lines | — | Journey section; newest first |
| **Contact form** | Name, email, enquiry type (segmented: Job / Project / Other), message, \[Send\] | idle, field error, sending, sent, failed (with fallback email link) | Inline validation on blur; never clears the user's text on error |
| **Toast** | Icon + 1 line | success, error | Bottom-centre, 4 s, `aria-live="polite"` |

**Focus style everywhere:** 2 px `--accent` outline with a 3 px offset, never removed. Touch targets are at least 44 × 44 px.

## Performance tiers and accessibility

The device chooses one of three tiers on first load (`lib/capability.ts`). The tier can drop at runtime if the frame rate falls, but never rises again in that session.

| Tier | Chosen when | What renders |
| --- | --- | --- |
| **High** | WebGL2, GPU tier ≥ 2 (`detect-gpu`), not on battery saver, desktop or high-end phone | Full scene, 96-segment lathe, Bloom, ContactShadows, DPR up to 1.5 |
| **Mid** | WebGL available, GPU tier 1, or a mid-range phone | Scene without post-processing or shadows, 48 segments, DPR 1, no cursor parallax on touch |
| **Poster** | No WebGL, reduced motion on, `navigator.connection.saveData`, or the frame rate < 24 for 2 s | One pre-rendered image per state (AVIF + WebP, ≤ 60 KB each), crossfaded on scroll |

**Mobile rules.** The bearing is never interactive on a touchscreen in the Exploded state; the HTML cards do the work. Balls are not tap targets because they are too small.

**Accessibility checklist**

- [ ] All text in semantic HTML (`header`, `nav`, `main`, `section` with `aria-labelledby`, `footer`)
- [ ] Canvas `aria-hidden="true"`; every 3D action has an HTML equivalent
- [ ] Skip link to `#main`; logical tab order; visible focus
- [ ] Contrast pairs from the Color tokens table only
- [ ] Site motion toggle, plus `prefers-reduced-motion` respected
- [ ] Form labels visible (not placeholders), errors linked with `aria-describedby`
- [ ] Images have alt text that states what the screenshot proves ("Gym admin dashboard listing active members")
- [ ] `lang` attribute switches with Hindi/Marathi; Devanagari text uses Mukta
- [ ] Tested with keyboard only, VoiceOver (iOS) and TalkBack (Android)

## Assets checklist and do / don't

No stock 3D models or illustrations are needed: the bearing is code, and the rest is screenshots and text.

**Assets to produce**

- [ ] Screenshots per project: 1 desktop (1440 × 900) + 1 mobile (390 × 844), WebP, shown in a minimal device frame drawn in CSS
- [ ] Gym: member dashboard, admin dashboard (from the demo copy, with no real member data)
- [ ] 30-second screen recordings (MP4/WebM, ≤ 2 MB, muted, with poster frame) for the gym and restaurant flows
- [ ] 5 bearing poster images (one per state), rendered from the live scene at 2×
- [ ] Open Graph image 1200 × 630: bearing + name + role
- [ ] Favicon: `PW` monogram in a ring, SVG + 180 px PNG
- [ ] Updated resume PDF (≤ 300 KB)

| Do | Don't |
| --- | --- |
| One accent color, used for the next action | Neon gradients, glassmorphism, glow on everything |
| Show outcomes: "Owners take bookings on WhatsApp" | List technologies as the headline |
| Keep facts in HTML, decorate with 3D | Put text inside the canvas (unreadable, unindexed) |
| Spec labels and mono numerals for an engineering feel | Skill percentage bars ("React 90%") |
| Real screenshots of live work | Stock laptop mock-ups or AI-generated device photos |
| Poster fallback that looks finished | A spinner or a blank box while three.js loads |
| Blur or replace client data in screenshots | Show real member names, phone numbers or credentials |
