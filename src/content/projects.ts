export type ProjectStatus = 'live' | 'in-progress' | 'archived' | 'offline'

export type ProjectType = 'Client' | 'Client demo' | 'Full-stack' | 'ML + industry' | 'ML research' | 'Hackathon'

export interface Stat {
  value: string
  label: string
}

export interface Shot {
  src: string
  /** Smaller variant for srcset (800 w). */
  small?: string
  alt: string
  kind: 'desktop' | 'mobile'
  width: number
  height: number
}

const desktop = (slug: string, alt: string, height: number): Shot => ({
  src: `/projects/${slug}/desktop-1600.webp`,
  small: `/projects/${slug}/desktop-800.webp`,
  alt,
  kind: 'desktop',
  width: 1600,
  height,
})

export interface Project {
  slug: string
  ball: string
  title: string
  type: ProjectType
  status: ProjectStatus
  /** Business outcome, one line. Shown on cards and as the detail sub-head. */
  outcome: string
  stat?: Stat
  stack: string[]
  role: string
  timeline: string
  client: string
  problem: string
  built: string
  result: string
  live?: string
  repo?: string
  /** Optional 30-second walkthrough video, used when the live site is down. */
  video?: string
  shots: Shot[]
  /** Business category, used by the Services "see a gym / salon / restaurant" links. */
  category?: 'gym' | 'salon' | 'restaurant'
  hasDemo?: boolean
}

export const projects: Project[] = [
  {
    slug: 'fit-sum-gym',
    ball: '01',
    title: 'FIT-SUM GYM website and member portal',
    type: 'Client',
    status: 'live',
    outcome: 'A gym in Pune now runs memberships from a phone.',
    stat: { value: '2', label: 'portals: member + staff' },
    stack: ['React', 'Vite', 'Tailwind', 'Google Sheets'],
    role: 'Sole developer, design to deploy',
    timeline: '2026',
    client: 'FIT-SUM GYM, Pune',
    problem:
      'Memberships, renewals and attendance lived in a paper register and WhatsApp chats. The owner could not see who was due for renewal without flipping pages.',
    built:
      'A public website plus a member portal (plan, expiry, attendance) and an owner/staff admin panel. Google Sheets is the backend, so the owner edits data in a tool he already knows.',
    result:
      'Members check their plan and attendance on their phone; staff add members and record renewals in seconds. Dark black-and-gold UI matches the gym brand.',
    live: 'https://fit-sum-gym-pearl.vercel.app',
    shots: [desktop('fit-sum-gym', 'FIT-SUM GYM home page: "Build strength" hero with free-trial and plans buttons', 731)],
    category: 'gym',
    hasDemo: true,
  },
  {
    slug: 'hair-fort-salon',
    ball: '02',
    title: 'Hair Fort unisex salon',
    type: 'Client demo',
    status: 'live',
    outcome: 'Customers book a chair on WhatsApp in three languages.',
    stat: { value: '3', label: 'languages: EN · हिं · मरा' },
    stack: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Workers'],
    role: 'Sole developer, design to deploy',
    timeline: '2026',
    client: 'Hair Fort, Pune (demo)',
    problem:
      'Walk-in customers waited without knowing the queue, and bookings arrived as scattered calls and messages.',
    built:
      'A fast static site with WhatsApp booking, a before/after slider, a live queue page and English/Hindi/Marathi switching, served from Cloudflare Workers.',
    result:
      'Bookings arrive as structured WhatsApp messages the owner can reply to directly. The site loads instantly on budget phones.',
    live: 'https://hair-fort-demo.paraswane0.workers.dev/',
    shots: [desktop('hair-fort-salon', 'Hair Fort home page with a "Book on WhatsApp" button and a 3D scissors animation', 736)],
    category: 'salon',
  },
  {
    slug: 'paras-restaurant',
    ball: '03',
    title: 'Paras Restaurant',
    type: 'Client demo',
    status: 'live',
    outcome: 'Diners order and book tables on WhatsApp, even on weak signal.',
    stat: { value: 'Offline', label: 'capable, 3 languages' },
    stack: ['HTML', 'CSS', 'JavaScript', 'Service Worker'],
    role: 'Sole developer, design to deploy',
    timeline: '2026',
    client: 'Restaurant demo, Pune',
    problem:
      'Small restaurants pay heavy commissions to delivery apps and lose the direct relationship with regulars.',
    built:
      'A menu site with WhatsApp ordering, table booking, offer codes, Light/Dark/System themes, a reduce-motion toggle and three languages. It keeps working offline.',
    result:
      'Orders go straight to the owner on WhatsApp with no commission, and the menu still opens when the network drops.',
    live: 'https://paras-restaurant-demo.vercel.app/',
    shots: [desktop('paras-restaurant', 'Paras Restaurant home page with Order now, Book a table, and language and theme switches', 719)],
    category: 'restaurant',
  },
  {
    slug: 'donation-platform',
    ball: '04',
    title: 'Government donation platform',
    type: 'Full-stack',
    status: 'archived',
    outcome: 'One portal connecting 3,700+ organisations across 5 departments.',
    stat: { value: '3,700+', label: 'organisations in 7 days' },
    stack: ['MongoDB', 'Express', 'React', 'Node', 'JWT', 'Nodemailer'],
    role: 'Full-stack developer',
    timeline: '7-day build',
    client: 'Government department (academic project)',
    problem:
      'Donation requests between departments and organisations were tracked by email and spreadsheets, with no single view of status.',
    built:
      'A MERN platform with JWT auth, four role-based dashboards and email notifications via Nodemailer.',
    result:
      'Covered 3,700+ organisations and 5 departments, and was built end to end in 7 days.',
    shots: [],
  },
  {
    slug: 'bearing-defect-detection',
    ball: '05',
    title: 'Bearing defect detection',
    type: 'ML + industry',
    status: 'in-progress',
    outcome: 'Catching bearing defects on the line before they ship.',
    stat: { value: 'Oct 2026', label: 'in progress' },
    stack: ['Python', 'Computer vision', 'SAP DM', 'LLM'],
    role: 'ML developer',
    timeline: 'Oct 2026 – present',
    client: 'TCS, manufacturing client',
    problem:
      'Manual visual inspection of bearings is slow and inconsistent between shifts, and defect data never reaches the planning system.',
    built:
      'A camera image pipeline and ML model that classify defects, connected to SAP Digital Manufacturing, with an LLM that summarises defect trends for supervisors.',
    result: 'In progress. A build log will follow here.',
    shots: [],
  },
  {
    slug: 'skin-disease-diagnosis',
    ball: '06',
    title: 'Skin disease diagnosis',
    type: 'ML research',
    status: 'archived',
    outcome: 'Classifying skin lesions with 97% accuracy. Best Paper at ICCIPC 2024.',
    stat: { value: '97%', label: 'accuracy on ISIC + HAM10000' },
    stack: ['Python', 'GrabCut', 'GLCM', 'Random Forest', 'KNN'],
    role: 'Researcher and developer',
    timeline: '2024',
    client: 'Research, ICCIPC 2024',
    problem: 'Early screening for skin disease needs a reliable, low-cost first opinion.',
    built:
      'GrabCut segmentation to isolate the lesion, GLCM texture features, and Decision Tree / Random Forest / KNN classifiers compared on ISIC 2019 and HAM10000.',
    result: '97% accuracy, and the paper won Best Research Paper at ICCIPC 2024.',
    shots: [],
  },
]

export interface ArchiveItem {
  title: string
  type: ProjectType
  note: string
  repo?: string
}

export const archive: ArchiveItem[] = [
  {
    title: 'QR museum ticketing',
    type: 'Full-stack',
    note: '24/7 booking with PDF tickets via EmailJS; visitor prediction model at 90% accuracy.',
  },
  {
    title: 'Travel agency site',
    type: 'Hackathon',
    note: '1st runner-up, Webnatic Techumen 2023.',
  },
]

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug)
