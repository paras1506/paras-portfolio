export const profile = {
  name: 'Paras Wane',
  role: 'Full-stack and AI developer',
  company: 'Grovanta',
  companyLine: 'AI-powered Business Growth',
  value: 'I build websites and AI tools that small businesses use daily.',
  location: 'Pune',
  email: 'paraswane15@gmail.com',
  // The phone number is never rendered as text, only used inside wa.me links (PRD § Privacy).
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) || '919322578270',
  linkedin: 'https://www.linkedin.com/in/paras-wane-67041a229/',
  github: 'https://github.com/paras1506',
  // TODO: point at this site's repo once it is pushed.
  siteRepo: 'https://github.com/paras1506',
  resume: '/Paras_Wane_CV_2026.pdf',
  bio: [
    'I am a full-stack and AI developer from Pune, with a B.Tech in Computer Science and Engineering from Walchand College of Engineering, Sangli.',
    'After graduating I founded Grovanta and shipped real sites for local businesses: a gym that runs memberships from a phone, a salon and a restaurant that take bookings on WhatsApp. I then joined Emergys as a Salesforce developer, and since April 2026 I build SAP Digital Manufacturing integrations at TCS.',
  ],
  education: {
    degree: 'B.Tech, Computer Science and Engineering',
    school: 'Walchand College of Engineering, Sangli',
    year: '2025',
    cgpa: '8.05',
  },
  focus: [
    { label: 'Now', text: 'SAP Digital Manufacturing developer at TCS.' },
    { label: 'Building', text: 'ML that detects bearing defects from camera images.' },
    { label: 'Studio', text: 'Grovanta: websites, WhatsApp booking and AI automation for local businesses.' },
  ],
}

export const skills: { group: string; items: string[] }[] = [
  { group: 'Web', items: ['JavaScript', 'TypeScript', 'React', 'Node', 'Express', 'MongoDB', 'Tailwind', 'three.js', 'Vite'] },
  { group: 'Enterprise', items: ['SAP DM', 'SAP S/4HANA', 'SAP CAP', 'SAPUI5', 'Salesforce', 'Apex', 'LWC', 'Flows'] },
  { group: 'AI / ML', items: ['Python', 'Deep learning', 'Decision trees', 'Random Forest', 'KNN', 'Computer vision', 'LLM integration'] },
  { group: 'Security and tools', items: ['Wireshark', 'Nagios Core', 'AMASS', 'C++', 'SQL', 'Git', 'Postman', 'Jira', 'Vercel'] },
]

export const services = [
  {
    id: 'website',
    title: 'Business website',
    text: 'A fast website that shows your prices, timings and photos, and opens on any phone.',
    example: 'Like the FIT-SUM GYM site',
    category: 'gym' as const,
    seeLabel: 'See a gym',
  },
  {
    id: 'whatsapp',
    title: 'Booking and orders on WhatsApp',
    text: 'Customers book or order in a few taps, and the details arrive in your WhatsApp.',
    example: "Like Hair Fort's booking",
    category: 'salon' as const,
    seeLabel: 'See a salon',
  },
  {
    id: 'ai',
    title: 'AI automation',
    text: 'Replies, reminders and reports that run on their own, so you spend less time on your phone.',
    example: "Like the restaurant's order flow",
    category: 'restaurant' as const,
    seeLabel: 'See a restaurant',
  },
]

export function waLink(text: string) {
  const n = profile.whatsapp?.replace(/\D/g, '')
  const q = `?text=${encodeURIComponent(text)}`
  return n ? `https://wa.me/${n}${q}` : `https://wa.me/${q}`
}
