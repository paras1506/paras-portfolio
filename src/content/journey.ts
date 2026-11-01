export interface Experience {
  company: string
  role?: string
  start: string
  end: string
  current?: boolean
  points: string[]
  tags: string[]
}

/** Oldest first, so the timeline reads as a path: C-DAC → Grovanta → Emergys → TCS. */
export const experience: Experience[] = [
  {
    company: 'C-DAC Noida',
    role: 'Ethical Hacking and Penetration Testing Intern',
    start: 'Oct 2024',
    end: 'Nov 2024',
    points: [
      'Built real-time monitoring with Nagios Core for 5+ applications, and ran Wireshark and AMASS recon to surface vulnerabilities early.',
      'Automated threat-intelligence gathering with Google Dork scripts, cutting manual research time by 60%.',
    ],
    tags: ['Nagios', 'Wireshark', 'AMASS'],
  },
  {
    company: 'Grovanta',
    role: 'Founder',
    start: 'Jun 2025',
    end: 'Dec 2025',
    points: [
      'Started my own studio after graduating.',
      'Built and shipped websites with WhatsApp booking and ordering for a gym, a salon and a restaurant in Pune.',
    ],
    tags: ['Client work', 'React', 'WhatsApp flows'],
  },
  {
    company: 'Emergys',
    role: 'Salesforce Developer, Trainee Engineer',
    start: 'Jan 2026',
    end: 'Mar 2026',
    points: [
      'Developed Apex classes, triggers and Lightning Web Components, following bulkification and governor-limit best practices.',
      'Automated business processes with Flows, approval processes and validation rules, reducing manual work.',
      'Implemented record-level security with OWD, role hierarchy, sharing rules and permission sets.',
    ],
    tags: ['Salesforce', 'Apex', 'LWC', 'Flows'],
  },
  {
    company: 'TCS',
    role: 'Developer, SAP Digital Manufacturing',
    start: 'Apr 2026',
    end: 'Present',
    current: true,
    points: [
      'Develop and maintain integrations between SAP Digital Manufacturing and SAP S/4HANA, keeping shop-floor execution in sync with ERP data.',
      'Build custom DM plugins and services with SAP CAP, and SAPUI5 front ends for production users.',
      'Building an ML model that detects faulty bearings from production-line camera images, feeding results into SAP DM with an LLM layer for defect analysis.',
    ],
    tags: ['SAP DM', 'S/4HANA', 'SAP CAP', 'SAPUI5', 'ML'],
  },
]

export interface Achievement {
  year: string
  kind: 'Award' | 'Scholarship' | 'Leadership' | 'Sport'
  title: string
  detail: string
}

export const achievements: Achievement[] = [
  { year: '2024', kind: 'Award', title: 'Winner, VSM Hackathon', detail: 'Ahead of 15+ teams' },
  { year: '2024', kind: 'Award', title: 'Best Research Paper', detail: 'ICCIPC 2024, skin disease diagnosis' },
  { year: '2024', kind: 'Award', title: 'Finalist, Impulse 2024', detail: 'Out of 300+ entrants' },
  { year: '2023', kind: 'Award', title: '1st runner-up, Webnatic', detail: 'Techumen 2023' },
  {
    year: '2024',
    kind: 'Leadership',
    title: 'Blood donation camps',
    detail: '2 camps, 210+ donors; AI-tools session for 80+ students',
  },
  { year: '2021', kind: 'Scholarship', title: 'Foundation For Excellence scholar', detail: 'Merit scholarship' },
  { year: '—', kind: 'Sport', title: '5th place, state yoga championship', detail: 'State level' },
]

export const certificates = [
  { title: 'Fundamentals of Deep Learning', org: 'NVIDIA' },
  { title: 'API Fundamentals Student Expert', org: 'Postman' },
  { title: 'Jira Agile', org: 'Atlassian' },
]

export const stats = [
  { value: '3', label: 'live client sites' },
  { value: '3,700+', label: 'organisations on one platform' },
  { value: '97%', label: 'model accuracy, Best Paper' },
  { value: '400+', label: 'DSA problems solved' },
]
