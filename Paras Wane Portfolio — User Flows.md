# Paras Wane Portfolio — User Flows

Nov 1, 2026 · @Paras

## Entry points and site map

Visitors arrive from four places and land on either the home page or a shared project link. Every path is designed to end at one of four conversions: resume download, live demo, WhatsApp enquiry, or contact form/email.

| Source | Typical visitor | Lands on | First thing they need |
| --- | --- | --- | --- |
| LinkedIn profile, resume link, job portal | Recruiter | `/` | Role, stack, proof in one screen |
| WhatsApp, Instagram, Grovanta referral | Business owner | `/` or `/#services` (`?ref=wa`) | "Has he built something like my business?" |
| GitHub, three.js forum, hackathon page | Peer developer | `/` | The 3D scene, then the code |
| Google search "Paras Wane" / shared project link | Any | `/` or `/work/:slug` | The fact they searched for |

&#91;embedded content: site map · 1 page, 7 sections, 1 detail route, 4 conversions\]

The Work section is the hub: every project card links straight to its live demo and its case study, and the persistent Resume button and nav reach the other conversions from anywhere.

## Flow A: Recruiter screening a candidate

**Goal:** decide in under 60 seconds whether to shortlist Paras. **Success:** resume downloaded or email sent. **Entry:** LinkedIn → `/`.

1. **Hero (0 to 5 s).** Reads "Paras Wane · Full-stack and AI developer · Founder, Grovanta". The text is there before the bearing loads.
   - Fast path: clicks **\[Resume PDF\]** → the PDF opens in a new tab → `resume_download`. Flow ends successfully.
2. **Scrolls to About (5 to 15 s).** Scans the 3-line bio and the education line (Walchand, B.Tech CSE, 2025, CGPA 8.05).
3. **Work (15 to 40 s).** The bearing explodes into 6 balls. The recruiter scans the stat blocks on the cards ("3,700+ organisations in 7 days", "97% accuracy").
   - Clicks a card → `/work/:slug` → reads the problem, role and outcome → **\[Back to work\]** returns to the same scroll position.
4. **Journey (40 to 50 s).** Sees the C-DAC internship, VSM Hackathon win, Best Paper award and certificates as a timeline.
5. **Converts.** Either the \[Resume\] button in the sticky nav, or Contact → enquiry type **Job** → form sent → success toast + "I reply within 24 hours" → `contact_submit{type: job}`.

**Design checks for this flow**

- The Resume button is visible in every scroll position (sticky nav) and is a real link to `/resume.pdf`, not a JavaScript download.
- The project pages put Paras's role first ("Sole developer, design to deploy").
- No step needs the 3D: on the poster tier, the flow is identical.

## Flow B: Business owner looking for a website

**Goal:** see work for a business like theirs, then start a conversation. **Success:** a WhatsApp chat opened with a prefilled message. **Entry:** a WhatsApp or Instagram link → `/?ref=wa#services`, usually on a phone.

1. **Lands on Services** (deep link skips the hero). The page reads "Websites and AI tools for local businesses", with an optional **हिंदी / मराठी** toggle.
2. **Sees three offers** as cards: Business website · Booking and orders on WhatsApp · AI automation. Each card names a real example ("like Hair Fort's booking").
3. **Taps "See a gym / salon / restaurant"** → scrolls up to the Work section with that project card highlighted (and its ball glowing on the High/Mid tiers).
4. **Opens the live site** → `project_live_click` → a new tab opens; the portfolio stays in the first tab.
   - Gym only: opens the **Try the demo** panel first (Flow D).
5. **Returns to the portfolio tab** → a small sticky bar appears after the visitor comes back: "Want one like this? Chat on WhatsApp".
6. **Taps \[Chat on WhatsApp\]** → `wa.me/91XXXXXXXXXX?text=Hi Paras, I saw your gym website. I run a ___ in ___.` → `whatsapp_click{ref: wa, project: gym}`.

**Design checks for this flow**

- Services copy is outcome-first and free of jargon (no "React", "API" or "three.js").
- On mobile, the 3D is faint background only; the cards and the WhatsApp button are reachable with a thumb.
- The prefilled WhatsApp text names the project the visitor last viewed.

## Flow C: Peer developer exploring the 3D

**Goal:** play with the scene and judge the engineering. **Success:** GitHub opened or the "How this site is built" note read. **Entry:** GitHub or the three.js forum → `/`, on desktop.

1. **Hero:** moves the cursor; the bearing tilts toward it. Drags the bearing: it spins and snaps back on release.
2. **Scrolls slowly** through About → Work and watches the parts separate. Scrolling back up reverses it exactly.
3. **In the exploded state, hovers balls** → each glows and its card highlights; the cursor changes to a pointer. Clicks one → the camera zooms to that ball → `/work/:slug`.
4. **Footer → "How this site is built"** (an expandable note): stack, tier system, frame budget, a link to the source repo → `github_click`.
5. **Optional:** presses **Ctrl/⌘ K** (P2) to jump anywhere or copy the email.

**Design checks for this flow**

- Interactions feel physical (damped, snap-back), not floaty.
- The repo is public with a clear README, or the note says why it is private.

## Flow D: Project deep dive and the gym live demo

Every project page follows the same order, so a visitor who has read one knows where to look on the next. The gym page adds a guided demo, because its best features sit behind a login.

**Project page layout (`/work/:slug`)**

1. Spec label + title + Live badge + \[Open live site ↗\]
2. One-line outcome ("A gym in Pune now runs memberships from a phone")
3. Facts row: Role · Timeline · Stack · Client
4. Problem → What I built → Result (3 short blocks)
5. Screenshots / 30-second video (desktop + mobile)
6. Try the demo (gym only)
7. Next project → (cycles through the 6 balls) · \[Back to work\]

**Gym demo sub-flow**

1. The visitor opens **Try the demo**. The panel shows two tabs: **Member** and **Staff**.
2. **Member tab:** demo phone `9876500001`, PIN `2580`, with \[Copy\] buttons, and steps: "Open the site → Member login → paste → see your plan and attendance". The visitor clicks \[Open member demo ↗\] → `demo_open{role: member}`.
3. **Staff tab:** points to `/admin` on the **demo copy** with a read-only demo staff account (to be created). Until that copy exists, the tab shows the 30-second admin video instead of credentials.
4. On return, the panel asks "Did the demo load?" \[Yes\] \[No\]. No → shows the video and logs `demo_failed`.

**Rule:** the real owner ID and password never appear on the portfolio, in its repo, or in its analytics. Anyone holding them could edit the gym's live member data.

## 3D loading, interaction states and fallbacks

The visitor never waits for the 3D. The page is usable at first paint, and the scene joins later or is replaced by a poster.

**Load sequence**

1. HTML + CSS paint the hero text and CTAs, with the poster image of the Assembled state behind them.
2. `capability.ts` checks WebGL2, GPU tier, `prefers-reduced-motion`, `saveData` and the site motion toggle, and picks **High**, **Mid** or **Poster**.
3. High/Mid: once the browser is idle, the scene chunk is imported. When the first frame renders, the canvas crossfades over the poster (300 ms).
4. While running, a frame rate under 24 fps for 2 s drops one tier (High → Mid → Poster) without a visible jump.

| Situation | What the visitor sees | What they can still do |
| --- | --- | --- |
| Scene chunk loading | Poster image; no spinner | Everything |
| WebGL missing / context lost | Poster; on context loss, one silent retry, then poster | Everything |
| Reduced motion on | Poster per state, 200 ms crossfades | Everything |
| Touch device, Exploded state | Faint balls in background, no tap targets | Use the HTML cards |
| Hover ball (desktop) | Ball glows, card highlights, pointer cursor | Click → project |
| Keyboard focus on card | Matching ball glows (no camera move) | Enter → project |
| Tab hidden / canvas offscreen | Rendering paused (`frameloop="demand"`) | — |
| Theme switched | Materials re-read the CSS tokens; scene background follows `--bg` | — |

## Edge cases and analytics events

Each edge case below has a defined screen, so no flow ends on a dead end. Each event in the second table maps to a PRD success metric.

| Edge case | Behaviour |
| --- | --- |
| Unknown route | 404 page: a single ball rolling to a stop, "This part isn't in stock", links to Work and Home |
| Unknown `/work/:slug` | Redirect to `/#work` with a toast "Project not found" |
| A client's live site is down | Card badge switches to "Demo offline"; the link goes to the video instead (checked by a weekly uptime job, or by hand) |
| Contact form service fails | Error toast + a visible `mailto:` fallback; the message text stays in the field |
| Form spam | Honeypot field + Formspree/EmailJS rate limit; no CAPTCHA unless spam appears |
| JavaScript disabled | Pre-rendered HTML shows all content and links; the form falls back to `mailto:` |
| Visitor returns later | Theme, motion and language choices are restored from localStorage (wrapped in try/catch) |
| Shared link preview | Each route has its own OG title, description and image |

**Analytics events** (cookieless)

| Event | Fired when | Properties |
| --- | --- | --- |
| `section_view` | A section is 50% visible for 1 s | `section` |
| `resume_download` | Resume link clicked | `from: nav / hero / journey` |
| `project_open` | Detail page opened | `slug`, `from: card / ball / next` |
| `project_live_click` | Live site link clicked | `slug` |
| `demo_open` / `demo_failed` | Gym demo panel actions | `role` |
| `whatsapp_click` | Any WhatsApp CTA | `ref`, `project` |
| `contact_submit` | Form sent successfully | `type: job / project / other` |
| `scene_tier` | Tier chosen or dropped | `tier`, `reason` |
| `github_click` | GitHub link clicked | `from` |
