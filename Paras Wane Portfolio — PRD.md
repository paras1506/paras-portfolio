# Paras Wane Portfolio — PRD

Nov 1, 2026 · @Paras

## Overview and goals

Build a frontend-only, single-page portfolio for Paras Wane, with a three.js 3D centrepiece. In under 60 seconds it should prove two things: he ships real, working products, and he can engineer both web and AI systems.

**Problem.** Paras's best evidence is spread out. His resume is a static PDF. Three live client sites sit on separate links, and two of them need login details to see the real depth. Nobody browsing a resume will find the gym's admin panel or the restaurant's WhatsApp ordering flow.

**Concept: "Precision Parts".** The hero is a procedurally built ball bearing, rendered in three.js. Each ball in the race stands for one project. The bearing ties Paras's current ML work on bearing defects to an engineer's identity: small, precise parts that keep a business turning. It also fits the Grovanta line, "AI-powered Business Growth".

**Goals**

1. Convert visitors. Each visit should end in a recruiter contact, a client enquiry (WhatsApp or email), or a resume download.
2. Show live proof. Each client project links to its working site, with a guided demo path for the gym portal.
3. Signal craft. The 3D scene and motion show front-end skill without slowing the site: content is readable before any 3D loads.
4. Serve as the personal front door for Grovanta, with a clear path from "who is Paras" to "hire his agency".

**Non-goals (v1):** no backend, CMS, blog engine, user accounts or database. Content lives in typed JSON/TS files in the repo.

## Audiences and personas

The site serves three audiences, ranked. The order sets what the first screen says and which call to action is primary.

| # | Persona | Arrives from | Wants within 60 s | Primary CTA |
| --- | --- | --- | --- | --- |
| 1 | Recruiter / hiring manager (Riya, tech recruiter) | LinkedIn, resume link, job portal | Role fit, stack, education, proof of shipped work | Download resume, email |
| 2 | Small-business owner (Sandeep, runs a gym or salon in Pune) | Grovanta referral, WhatsApp, Instagram | "Has he built something like my business? What did it do?" | WhatsApp enquiry |
| 3 | Peer developer / judge | GitHub, hackathon, three.js community | Code quality, the 3D build, repos | GitHub, source link |

**Design implication.** The hero states the role in plain words for persona 1. The client projects (gym, salon, restaurant) are written as business outcomes for persona 2. The 3D scene and a "How this site is built" note reward persona 3.

## Benchmark: reference 3D portfolios

The best 3D portfolios use one memorable scene tied to the person. The weak ones add 3D as decoration and hide the content behind it. This site keeps the 3D in one scene and leaves the content readable and fast.

| Pattern | Seen in | What works | What to avoid | Our decision |
| --- | --- | --- | --- | --- |
| Full game-world portfolio | [Bruno Simon](https://bruno-simon.com) (driving world) | Unforgettable; the portfolio *is* the skill | A recruiter has to play to find facts; heavy on mobile | Not copied. One scene, content stays in normal HTML |
| Hero 3D model + scrolling sections | [JS Mastery 3D portfolio](https://github.com/adrianhajdin/project_3D_developer_portfolio) (React, three.js, Tailwind) | Familiar, quick to build, readable | Thousands of near-identical clones (same desk, same planet, same timeline) | Same structure, but an original model (the bearing) and our own layout |
| Neon "deep space" dark theme | [Superdesign 3D portfolio pattern](https://superdesign.dev/library/hyper-interactive-3d-developer-portfolio-with-threejs) | Dramatic first impression | Cyan-purple-pink neon now reads as a template | Dark graphite + one warm accent (see UI Guidelines) |
| Community R3F showcases | [three.js forum: portfolio tag](https://discourse.threejs.org/tag/portfolio-website/653) | Themed scenes (night drive, camera, card game) give each person a story | Many skip mobile fallbacks and reduced motion | A static poster fallback and a reduced-motion setting are required |

**Strengths already in Paras's own client sites.** The restaurant and salon demos already ship Light/Dark/System themes, a "Reduce motion" toggle, English/Hindi/Marathi switching and WhatsApp deep links. The portfolio should show the same care, because a client will compare.

## Content inventory

Eight projects are available. Six are featured, so the bearing has six balls; the other two go in an "Archive" list.

| Ball | Project | Type | Stack / method | Proof point to show | Link |
| --- | --- | --- | --- | --- | --- |
| 01 | FIT-SUM GYM website + member portal | Client, live | React, Vite, Tailwind, Google Sheets backend | Member login + owner/staff admin; dark black-and-gold UI | [Live](https://fit-sum-gym-pearl.vercel.app) |
| 02 | Hair Fort unisex salon | Client demo, live | Static site on Cloudflare Workers | WhatsApp booking, before/after slider, queue page, 3 languages | [Live](https://hair-fort-demo.paraswane0.workers.dev/) |
| 03 | Paras Restaurant | Client demo, live | Static site on Vercel, offline-capable | WhatsApp ordering, table booking, offer codes, 3 languages, themes | [Live](https://paras-restaurant-demo.vercel.app/) |
| 04 | Government donation platform | Full-stack | MERN, JWT, Nodemailer | 3,700+ organisations, 5 departments, 4 role dashboards, built in 7 days | Repo / screenshots |
| 05 | Bearing defect detection (in progress) | ML + industry | Camera images, ML model, SAP Digital Manufacturing, LLM analysis | Badge "In progress, Oct 2026" | Write-up |
| 06 | Skin disease diagnosis | ML research | GrabCut segmentation, GLCM features, DT/RF/KNN | 97% accuracy on ISIC 2019 + HAM10000 | Paper / repo |
| Archive | QR museum ticketing | Full-stack | EmailJS, PDF tickets, predictive model | 24/7 booking; 90% model accuracy | Repo |
| Archive | Travel agency site | Hackathon | Web | 1st runner-up, Webnatic Techumen 2023 | Repo |

**Other content blocks (from the resume)**

- **Identity:** Paras Wane, B.Tech Computer Science and Engineering, Walchand College of Engineering, Sangli (2025, CGPA 8.05). Founder of Grovanta.
- **Experience:** C-DAC Noida, Ethical Hacking and Penetration Testing Intern (Oct to Nov 2024): Nagios Core monitoring for 5+ apps, Google Dork automation that cut research time by 60%, Wireshark and AMASS recon.
- **Achievements:** VSM Hackathon 2024 winner (15+ teams), Best Research Paper at ICCIPC 2024, Impulse 2024 finalist (300+ entrants), 400+ LeetCode/CodeChef problems, Foundation For Excellence scholar 2021, 5th place at the state-level yoga championship.
- **Certificates:** NVIDIA Fundamentals of Deep Learning, Postman API Fundamentals Student Expert, Atlassian Jira Agile.
- **Leadership:** 2 blood donation camps (210+ donors), AI-tools session for 80+ students, sponsor relations with 6 stakeholders.
- **Skills:** C++, Python, C, JavaScript, React, Node, Express, MongoDB, Tailwind, ML (regression, deep learning, trees), security tooling.

**Content to write before build:** a one-line problem/outcome statement per project, 2 to 3 screenshots per project (desktop + mobile), and permission from FIT-SUM GYM to feature their brand.

## Information architecture

One long scrolling page with anchored sections, plus a project detail route per featured project. The bearing stays fixed in the background and changes state as each section scrolls into view.

1. **Hero** (`/#home`): name, role line "Full-stack and AI developer · Founder, Grovanta", one-sentence value, CTAs \[View work\] \[Download resume\]. 3D: the assembled bearing turns slowly and follows the cursor.
2. **About** (`/#about`): a short bio, education, current focus (bearing ML at the factory, Grovanta). 3D: the bearing moves aside and tilts.
3. **Work** (`/#work`): the six featured projects. 3D: the bearing "explodes" into its parts; each ball links to a project card. An HTML grid of the same cards sits underneath for accessibility and mobile.
4. **Project detail** (`/work/:slug`): problem, role, stack, outcome, screenshots, live link, demo guide (gym). 3D: one ball, close-up.
5. **Experience and achievements** (`/#journey`): C-DAC internship, awards, certificates, leadership, as a vertical timeline.
6. **Skills** (`/#skills`): grouped chips (Web, AI/ML, Security, Tools). No percentage bars.
7. **Services (Grovanta)** (`/#services`): three offers for businesses: website, booking/ordering on WhatsApp, AI automation. CTA \[Chat on WhatsApp\].
8. **Contact** (`/#contact`): form (sent via EmailJS or Formspree), email, phone/WhatsApp, LinkedIn, GitHub, resume. 3D: the bearing reassembles and settles.
9. **404** and an **error fallback** page.

Primary nav: Work · About · Journey · Services · Contact, with a persistent \[Resume\] button and a theme toggle.

## Functional requirements

The P0 set is the launch scope: content plus one 3D scene with a working fallback. P1 adds polish, and P2 is for after launch.

| ID | Requirement | Acceptance criteria | Priority |
| --- | --- | --- | --- |
| FR-01 | Hero with name, role, value line, 2 CTAs | Text is visible and the CTAs work before the 3D canvas loads (LCP is text, not canvas) | P0 must |
| FR-02 | 3D bearing scene (three.js) | Procedural model, no GLB needed; turns slowly, reacts to the cursor, changes state on scroll for Hero, Work and Contact | P0 must |
| FR-03 | 3D fallback | With no WebGL, `prefers-reduced-motion`, or a low-power device, a static rendered poster (WebP/AVIF) shows instead; no blank areas | P0 must |
| FR-04 | Work grid + project cards | 6 cards from `projects.ts`; each shows title, type tag, a 1-line outcome, stack chips, and Live / Case study links | P0 must |
| FR-05 | Project detail route | `/work/:slug` with problem, role, stack, outcome, 2 to 4 images, links; deep-linkable and shareable | P0 must |
| FR-06 | Gym demo guide | A "Try the demo" panel with steps and **demo-only** credentials; owner credentials are never shown publicly (see Risks) | P0 must |
| FR-07 | Resume download | PDF served from `/resume.pdf`; the button is in the nav and the hero; the click is tracked | P0 must |
| FR-08 | Contact | Form with name, email, type (Job / Project / Other) and message, sent via EmailJS/Formspree; WhatsApp deep link with a prefilled message; success and error states | P0 must |
| FR-09 | Ball-to-project link | Hovering or tapping a ball in the exploded view highlights the matching card; a click opens the project | P1 should |
| FR-10 | Theme + reduced-motion toggles | Dark (default) / Light; the motion toggle is remembered in localStorage (wrapped in try/catch) | P1 should |
| FR-11 | Journey timeline | Experience, awards and certificates in date order, newest first | P1 should |
| FR-12 | SEO + share cards | Per-route title/description, Open Graph image, JSON-LD `Person`, sitemap.xml | P1 should |
| FR-13 | Hindi / Marathi toggle for the Services section | Matches the client sites for local business owners | P2 later |
| FR-14 | Command palette (Ctrl/⌘ K) | Jump to any section or project, copy email | P2 later |
| FR-15 | Blog / notes | Static MDX posts (bearing-ML build log) | P2 later |

## Tech stack and architecture

A static React + three.js build on Vercel, the same host as the gym and restaurant sites. There is no server code. The contact form and analytics are the only third-party calls.

&#91;embedded content: architecture · static build, 4 runtime parts\]

The page shell renders and is usable before the 3D chunk downloads. The scene loads only when the device passes the WebGL and motion checks.

| Layer | Choice | Why |
| --- | --- | --- |
| Build | Vite + React + TypeScript | Paras already ships React/Vite (gym site); fast HMR, code-splitting |
| 3D | three.js via @react-three/fiber + @react-three/drei | three.js does the rendering; R3F lets the scene share React state with the scroll and cards. A plain three.js module also works if preferred |
| Post-processing | @react-three/postprocessing (Bloom, subtle) | Only on the High tier |
| Motion | GSAP + ScrollTrigger; Lenis smooth scroll | Scroll-linked bearing states; Lenis off under reduced motion |
| Styling | Tailwind CSS with CSS variables as design tokens | Tokens are shared by the HTML and the 3D materials |
| Routing | React Router (2 routes + 404) | `/` and `/work/:slug` |
| Content | `src/content/projects.ts`, `profile.ts`, `journey.ts` | Typed, no CMS; add a project by adding one object |
| Forms | EmailJS or Formspree | Frontend-only, free tier |
| Analytics | Vercel Web Analytics or Umami | Cookieless, so no consent banner needed |
| Quality | ESLint, Prettier, Lighthouse CI, r3f-perf (dev only) | Enforce the performance budget on every PR |

```
src/
  content/      projects.ts  profile.ts  journey.ts
  scene/        Bearing.tsx  Balls.tsx  Lights.tsx  useScrollState.ts  Poster.tsx
  sections/     Hero  About  Work  Journey  Skills  Services  Contact
  components/   Button  Chip  ProjectCard  SpecLabel  Nav  ThemeToggle
  routes/       Home.tsx  ProjectDetail.tsx  NotFound.tsx
  lib/          capability.ts (WebGL/GPU tier)  analytics.ts
public/         resume.pdf  og.png  posters/  projects/<slug>/*.webp
```

## Non-functional requirements

The 3D scene must never cost the content: on a mid-range Android phone over 4G, text and CTAs appear in under 2.5 s, and the 3D loads after that.

| Area | Target | How |
| --- | --- | --- |
| LCP (mobile, 4G, mid-range Android) | < 2.5 s | Hero text is the LCP element; fonts preloaded with `font-display: swap`; 3D lazy-loaded after `requestIdleCallback` |
| Initial JS (gzip) | ≤ 120 KB without 3D; 3D chunk ≤ 250 KB | Dynamic `import()` for the scene; only the three.js modules used |
| CLS | < 0.05 | Canvas has a fixed-size container; images have width and height set |
| INP | < 200 ms | No main-thread work on scroll; GSAP drives transforms only |
| 3D frame rate | 60 fps desktop, ≥ 30 fps mobile | DPR clamped to 1.5 (mobile 1.25); instanced balls; adaptive quality (drei `PerformanceMonitor`) |
| Lighthouse | ≥ 90 Performance, ≥ 95 Accessibility, Best Practices, SEO | Lighthouse CI fails a PR under the threshold |
| Accessibility | WCAG 2.2 AA | Canvas is `aria-hidden`; all content is in HTML; keyboard focus order; skip link; 4.5:1 contrast; `prefers-reduced-motion` honoured |
| Browsers | Last 2 versions of Chrome, Safari (iOS 16+), Firefox, Edge, Samsung Internet | WebGL2 with a WebGL1 or poster fallback |
| SEO | Indexed for "Paras Wane" and "web developer Pune" | Pre-rendered HTML for `/` and each `/work/:slug` (vite-plugin-prerender or `vite-ssg`), JSON-LD `Person` + `CreativeWork` |
| Privacy | No cookies | Cookieless analytics; the phone number is shown only as a WhatsApp link, never in plain page text |

## Success metrics, milestones and risks

Success means at least 1 qualified contact (job or client) per 100 unique visitors within 60 days of launch.

| Metric | Target (first 60 days) | Event |
| --- | --- | --- |
| Contact conversion (form + WhatsApp + email) | ≥ 1% of unique visitors | `contact_submit`, `whatsapp_click` |
| Resume downloads | ≥ 5% of visitors from LinkedIn | `resume_download` |
| Live-demo clicks | ≥ 15% of Work-section viewers | `project_live_click`, `demo_open` |
| Scroll depth to Work | ≥ 60% of sessions | `section_view (work)` |
| 3D fallback rate | Tracked, no target; used to tune tiers | `scene_tier:high/mid/poster` |

&#91;embedded content: roadmap · 4 phases, 4 gates\]

The 3D work starts only once the full site works as plain HTML. If week 3 slips, the site can launch on the poster fallback.

**Risks**

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Publishing the gym **owner** login | Anyone could edit the real gym's member data in Google Sheets | Never show owner credentials. Deploy a demo copy (separate sheet + URL) with a demo member and a read-only demo staff account, reset nightly; otherwise show the admin side as a 30-second video |
| Client permission | Using the FIT-SUM brand without consent | Get written OK; otherwise blur the logo and call it "Gym client, Pune" |
| 3D slows phones | Bounce before content | Tiered rendering + poster fallback (UI Guidelines § Performance tiers) |
| Looks like a template | Weak signal to peers and judges | Original bearing model, no stock desk/planet/laptop scenes |
| Resume out of date | Credibility hit when recruiters compare | Change "Expected May 2025" to graduated; fix "Telwind" to Tailwind; add the client projects and Grovanta |

**Open questions**

- [ ] Which comes first: full-time job offers or Grovanta clients? (This PRD assumes recruiters first, clients a close second.)
- [ ] The resume file is named "Salesforce". Is Salesforce a target role, and should Salesforce skills appear here?
- [ ] Can the current factory/bearing work name the employer, or stay generic?
- [ ] Domain: `paraswane.dev`, `paraswane.in` or a Grovanta subdomain?
- [ ] Are the donation-platform and skin-disease repos public, or should they show screenshots only?
- [ ] Include a personal photo, or keep the bearing as the only visual identity?
