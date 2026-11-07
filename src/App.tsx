import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  FileText,
  IndianRupee,
  Info,
  Link2,
  Mail,
  MessageCircle,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import './App.css'

type AppType = 'Mobile app' | 'Web app' | 'Both'
type PackageLevel = 'Basic' | 'Standard' | 'Premium'

type Feature = {
  id: string
  label: string
  detail: string
  price: number
  weeks: number
}

type TeamRole = {
  role: string
  count: number
  short: string
}

type ScopeNotes = {
  included: string[]
  excluded: string[]
}

type Category = {
  id: string
  name: string
  emoji: string
  description: string
  base: number
  weeks: number
  features: Feature[]
}

const categories: Category[] = [
  {
    id: 'business',
    name: 'Business services',
    emoji: '◈',
    description: 'Lead capture, service catalogue and customer communication.',
    base: 115000,
    weeks: 5,
    features: [
      { id: 'profiles', label: 'Customer & staff profiles', detail: 'Secure role-based access', price: 18000, weeks: 0.6 },
      { id: 'catalogue', label: 'Service catalogue', detail: 'Categories, pricing and availability', price: 16000, weeks: 0.5 },
      { id: 'leads', label: 'Lead & enquiry management', detail: 'Track and follow up on leads', price: 22000, weeks: 0.7 },
      { id: 'notifications', label: 'Push notifications', detail: 'Keep customers in the loop', price: 12000, weeks: 0.3 },
      { id: 'ai-assistant', label: 'AI enquiry assistant', detail: 'Answer FAQs and qualify inbound leads', price: 45000, weeks: 1.1 },
      { id: 'ai-insights', label: 'AI lead insights', detail: 'Summaries, scoring and next-best actions', price: 35000, weeks: 0.9 },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    emoji: '▱',
    description: 'A focused storefront with catalogues, checkout and order tracking.',
    base: 175000,
    weeks: 7,
    features: [
      { id: 'catalogue', label: 'Product catalogue', detail: 'Variants, filters and search', price: 28000, weeks: 0.8 },
      { id: 'cart', label: 'Cart & checkout', detail: 'Coupons, addresses and tax', price: 36000, weeks: 1.1 },
      { id: 'orders', label: 'Order management', detail: 'Status updates and history', price: 24000, weeks: 0.7 },
      { id: 'reviews', label: 'Ratings & reviews', detail: 'Social proof for products', price: 16000, weeks: 0.5 },
      { id: 'inventory', label: 'Inventory dashboard', detail: 'Stock and low-stock alerts', price: 25000, weeks: 0.7 },
    ],
  },
  {
    id: 'food',
    name: 'Food delivery',
    emoji: '✦',
    description: 'Menus, live order status and a smoother delivery experience.',
    base: 195000,
    weeks: 8,
    features: [
      { id: 'menu', label: 'Restaurant & menu listing', detail: 'Menus, add-ons and availability', price: 27000, weeks: 0.8 },
      { id: 'cart', label: 'Cart & checkout', detail: 'Coupons, addresses and tax', price: 36000, weeks: 1.1 },
      { id: 'tracking', label: 'Live order tracking', detail: 'Status and delivery updates', price: 42000, weeks: 1.2 },
      { id: 'dispatch', label: 'Delivery partner panel', detail: 'Assign and manage deliveries', price: 44000, weeks: 1.2 },
      { id: 'reviews', label: 'Ratings & reviews', detail: 'Feedback for restaurants', price: 16000, weeks: 0.5 },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    emoji: '⌁',
    description: 'Course discovery, learning journeys and progress tracking.',
    base: 165000,
    weeks: 7,
    features: [
      { id: 'courses', label: 'Course catalogue', detail: 'Browse by level and subject', price: 24000, weeks: 0.7 },
      { id: 'lessons', label: 'Video lessons', detail: 'Organised learning content', price: 30000, weeks: 0.8 },
      { id: 'progress', label: 'Progress tracking', detail: 'Continue where you left off', price: 22000, weeks: 0.6 },
      { id: 'quiz', label: 'Quizzes & certificates', detail: 'Assessments and completion proof', price: 32000, weeks: 0.9 },
      { id: 'instructor', label: 'Instructor dashboard', detail: 'Manage content and learners', price: 34000, weeks: 0.9 },
    ],
  },
  {
    id: 'booking',
    name: 'Booking & appointments',
    emoji: '○',
    description: 'Availability, booking flow and automated reminders.',
    base: 135000,
    weeks: 6,
    features: [
      { id: 'calendar', label: 'Availability calendar', detail: 'Manage slots and working hours', price: 26000, weeks: 0.8 },
      { id: 'booking', label: 'Booking flow', detail: 'Simple customer scheduling', price: 24000, weeks: 0.7 },
      { id: 'reminders', label: 'Email / SMS reminders', detail: 'Reduce no-shows', price: 18000, weeks: 0.5 },
      { id: 'staff', label: 'Staff & resource management', detail: 'Assign people and rooms', price: 28000, weeks: 0.8 },
      { id: 'history', label: 'Booking history', detail: 'Customer and admin records', price: 16000, weeks: 0.4 },
    ],
  },
]

const integrations = [
  { id: 'payment', label: 'Payment gateway', price: 18000, weeks: 0.5 },
  { id: 'whatsapp', label: 'WhatsApp messaging', price: 22000, weeks: 0.6 },
  { id: 'sms', label: 'SMS / OTP', price: 12000, weeks: 0.35 },
  { id: 'maps', label: 'Maps & location', price: 24000, weeks: 0.7 },
  { id: 'api', label: 'Third-party API', price: 28000, weeks: 0.8 },
]

const packages: Record<PackageLevel, { multiplier: number; label: string; caption: string }> = {
  Basic: { multiplier: 0.82, label: 'A focused launch', caption: 'Core journeys, one user role and a clean handoff.' },
  Standard: { multiplier: 1, label: 'Most chosen', caption: 'A balanced first release for serious customer validation.' },
  Premium: { multiplier: 1.34, label: 'Built to scale', caption: 'Advanced workflows, dashboards and launch support.' },
}

const teamByLevel: Record<PackageLevel, TeamRole[]> = {
  Basic: [
    { role: 'Project manager', count: 1, short: 'PM' },
    { role: 'Product / UX designer', count: 1, short: 'UX' },
    { role: 'Full-stack developer', count: 1, short: 'FS' },
    { role: 'QA engineer', count: 1, short: 'QA' },
  ],
  Standard: [
    { role: 'Project manager', count: 1, short: 'PM' },
    { role: 'Product / UX designer', count: 1, short: 'UX' },
    { role: 'Frontend developer', count: 1, short: 'FE' },
    { role: 'Backend developer', count: 1, short: 'BE' },
    { role: 'QA engineer', count: 1, short: 'QA' },
  ],
  Premium: [
    { role: 'Project manager', count: 1, short: 'PM' },
    { role: 'Product / UX designer', count: 1, short: 'UX' },
    { role: 'Frontend developers', count: 2, short: 'FE' },
    { role: 'Backend developer', count: 1, short: 'BE' },
    { role: 'QA engineer', count: 1, short: 'QA' },
    { role: 'DevOps / cloud engineer', count: 1, short: 'DO' },
  ],
}

const scopeByCategory: Record<string, ScopeNotes> = {
  business: {
    included: ['Responsive customer and admin experience', 'Basic enquiry and service workflows', 'Role-based access for agreed user types', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
    excluded: ['Cloud hosting, database, backups, DNS, domain and SSL renewal charges', 'CRM or ERP licence and usage fees', 'Bulk data migration and data cleansing', 'Copywriting, photography and ongoing content entry', 'Third-party AI model usage and training costs'],
  },
  ecommerce: {
    included: ['Product, cart, checkout and order flows selected above', 'Basic admin catalogue and order controls', 'Payment gateway integration to the provider API', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
    excluded: ['Cloud hosting, database, backups, DNS, domain and SSL renewal charges', 'Payment gateway transaction fees and settlements', 'Product data entry, photography and catalogue enrichment', 'Courier, tax, ERP or inventory platform charges', 'Refunds, chargebacks and marketplace commissions'],
  },
  food: {
    included: ['Customer ordering flow and agreed restaurant/admin workflows', 'Delivery status flow where selected', 'Maps or messaging integration where selected', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
    excluded: ['Cloud hosting, database, backups, DNS, domain and SSL renewal charges', 'Maps, SMS, WhatsApp and payment usage charges', 'Restaurant onboarding and menu data entry', 'Courier fleet operations and delivery partner payouts', 'Live dispatch operations outside the agreed application scope'],
  },
  education: {
    included: ['Learner, instructor and admin journeys selected above', 'Course structure and progress logic', 'Basic content protection and access controls', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
    excluded: ['Cloud hosting, database, backups, DNS, domain and SSL renewal charges', 'Video hosting, transcoding and bandwidth charges', 'Course production, recording and content migration', 'Accreditation, proctoring and external examination fees', 'Ongoing moderation and learner support operations'],
  },
  booking: {
    included: ['Availability, booking and history flows selected above', 'Basic staff/resource scheduling rules', 'Reminder integration where selected', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
    excluded: ['Cloud hosting, database, backups, DNS, domain and SSL renewal charges', 'Calendar, SMS, WhatsApp and payment provider charges', 'Appointment operations and customer support', 'Complex healthcare, legal or industry compliance work', 'Historical data migration from legacy systems'],
  },
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

function App() {
  const [appType, setAppType] = useState<AppType>('Both')
  const [categoryId, setCategoryId] = useState('ecommerce')
  const [level, setLevel] = useState<PackageLevel>('Standard')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['catalogue', 'cart', 'orders'])
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(['payment'])
  const [scale, setScale] = useState(1)
  const [deliveryWeeks, setDeliveryWeeks] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState<'estimator' | 'admin'>(() => window.location.pathname === '/admin' ? 'admin' : 'estimator')
  const [adminCategoryId, setAdminCategoryId] = useState('ecommerce')
  const [adminBase, setAdminBase] = useState(categories[1].base)
  const [adminSaved, setAdminSaved] = useState(false)

  const category = categories.find((item) => item.id === categoryId) ?? categories[1]
  const adminCategory = categories.find((item) => item.id === adminCategoryId) ?? categories[1]

  const estimate = useMemo(() => {
    const typeMultiplier = appType === 'Mobile app' ? 0.8 : appType === 'Web app' ? 0.76 : 1
    const selected = category.features.filter((feature) => selectedFeatures.includes(feature.id))
    const chosenIntegrations = integrations.filter((item) => selectedIntegrations.includes(item.id))
    const featureTotal = selected.reduce((total, feature) => total + feature.price, 0)
    const integrationTotal = chosenIntegrations.reduce((total, item) => total + item.price, 0)
    const raw = (category.base + featureTotal + integrationTotal) * typeMultiplier * packages[level].multiplier * scale
    const minWeeks = Math.max(2, Math.ceil((category.weeks + selected.reduce((total, feature) => total + feature.weeks, 0) + chosenIntegrations.reduce((total, item) => total + item.weeks, 0)) * (appType === 'Both' ? 1.18 : 1) * (level === 'Premium' ? 1.12 : 1)))
    const maxWeeks = Math.max(minWeeks + 2, Math.ceil(minWeeks * (scale > 1 ? 1.3 : 1.22)))
    const guardedWeeks = Math.min(maxWeeks, Math.max(minWeeks, deliveryWeeks || minWeeks))
    const team = teamByLevel[level].reduce((total, role) => total + role.count, 0)
    const lower = Math.round(raw * 0.9 / 5000) * 5000
    const upper = Math.round(raw * 1.12 / 5000) * 5000
    return { selected, chosenIntegrations, lower, upper, minWeeks, maxWeeks, weeks: guardedWeeks, team, roles: teamByLevel[level], scope: scopeByCategory[category.id] }
  }, [appType, category, deliveryWeeks, level, scale, selectedFeatures, selectedIntegrations])

  const toggle = (id: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(id) ? values.filter((item) => item !== id) : [...values, id])
  }

  const reset = () => {
    setAppType('Both')
    setCategoryId('ecommerce')
    setLevel('Standard')
    setSelectedFeatures(['catalogue', 'cart', 'orders'])
    setSelectedIntegrations(['payment'])
    setScale(1)
    setDeliveryWeeks(0)
  }

  const summary = `Project estimate for ${category.name} (${appType}) — ${formatCurrency(estimate.lower)} to ${formatCurrency(estimate.upper)}, ${estimate.weeks} weeks (guardrail ${estimate.minWeeks}–${estimate.maxWeeks} weeks).`

  const copySummary = async () => {
    await navigator.clipboard?.writeText(`${summary}\nPackage: ${level}\nSuggested team: ${estimate.roles.map((role) => `${role.role} (${role.count})`).join(', ')}\nFeatures: ${estimate.selected.map((feature) => feature.label).join(', ')}\nIncluded: ${estimate.scope.included.join('; ')}\nExcluded / client-paid: ${estimate.scope.excluded.join('; ')}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer')
  }

  const emailEstimate = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`Project estimate · ${category.name}`)}&body=${encodeURIComponent(`${summary}\n\nPackage: ${level}\nSuggested team: ${estimate.roles.map((role) => `${role.role} (${role.count})`).join(', ')}\nFeatures: ${estimate.selected.map((feature) => feature.label).join(', ')}\n\nIncluded: ${estimate.scope.included.join('; ')}\nExcluded / client-paid: ${estimate.scope.excluded.join('; ')}`)}`
  }

  const saveAdminDraft = () => {
    setAdminSaved(true)
    window.setTimeout(() => setAdminSaved(false), 2200)
  }

  const navigate = (nextPage: 'estimator' | 'admin') => {
    window.history.pushState({}, '', nextPage === 'admin' ? '/admin' : '/')
    setPage(nextPage)
  }

  if (page === 'admin') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Failure Folks Academy home" onClick={(event) => { event.preventDefault(); navigate('estimator') }}>
            <span className="brand-mark">FF</span>
            <span><strong>Failure Folks</strong><small>Academy</small></span>
          </a>
          <div className="topbar-actions"><span className="admin-demo-badge">ADMIN DEMO · NOT SECURED</span><button className="ghost-button" onClick={() => navigate('estimator')}><ArrowRight data-icon="inline-start" /> Back to estimator</button></div>
        </header>
        <main className="admin-page">
          <div className="admin-heading"><div><p className="eyebrow"><ShieldCheck data-icon="inline-start" /> Pricing control centre</p><h1>Keep your ranges<br /><em>easy to tune.</em></h1><p>Adjust indicative pricing for each category. These controls are local to this browser in the UI-only version.</p></div><div className="admin-lock-mark"><ShieldCheck /></div></div>
          <div className="admin-warning"><Info /><span><strong>Demo-only admin page.</strong> There is no real login, encryption, or persistence here. Do not publish this route as a protected admin tool. For Cloudflare Pages, use Cloudflare Access plus Pages Functions and D1/KV before adding real pricing data.</span></div>
          <section className="admin-card">
            <div className="admin-card-header"><div><p className="step-label">Pricing catalogue</p><h2>Category configuration</h2></div><span className="progress-pill">Local draft</span></div>
            <div className="admin-field"><label htmlFor="admin-category">Business category</label><div className="select-wrap"><select id="admin-category" value={adminCategoryId} onChange={(event) => { setAdminCategoryId(event.target.value); setAdminBase(categories.find((item) => item.id === event.target.value)?.base ?? 0) }}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown /></div></div>
            <div className="admin-field"><label htmlFor="admin-base">Starting price (INR)</label><div className="admin-input-wrap"><IndianRupee /><input id="admin-base" type="number" value={adminBase} onChange={(event) => setAdminBase(Number(event.target.value))} /></div><small>Used before package, feature and integration adjustments.</small></div>
            <div className="admin-features"><div className="admin-table-head"><span>Feature</span><span>Indicative add-on</span></div>{adminCategory.features.map((feature) => <div className="admin-table-row" key={feature.id}><span><strong>{feature.label}</strong><small>{feature.detail}</small></span><b>{formatCurrency(feature.price)}</b></div>)}</div>
            <div className="admin-actions"><button className="secondary-button" onClick={() => { setAdminBase(adminCategory.base); setAdminSaved(false) }}><RotateCcw data-icon="inline-start" /> Discard changes</button><button className="primary-button" onClick={saveAdminDraft}>{adminSaved ? <Check data-icon="inline-start" /> : <Check data-icon="inline-start" />}{adminSaved ? 'Draft saved locally' : 'Save pricing draft'}</button></div>
          </section>
        </main>
        <footer><span>© 2025 Failure Folks Academy</span><span>Admin UI prototype</span><span>Requires server-side protection before production.</span></footer>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Failure Folks Academy home">
          <span className="brand-mark">FF</span>
          <span><strong>Failure Folks</strong><small>Academy</small></span>
        </a>
        <div className="topbar-actions">
          <span className="saved-badge"><span className="live-dot" /> No sign-in required</span>
          <button className="ghost-button" onClick={reset}><RotateCcw data-icon="inline-start" /> Reset</button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles data-icon="inline-start" /> Project estimator · India market benchmark</p>
            <h1>Turn a rough idea into a <em>clear next step.</em></h1>
            <p className="hero-intro">Shape your project in a few minutes. Get a transparent starting range, delivery window and the team it takes to bring it to life.</p>
            <div className="trust-row">
              <span><ShieldCheck data-icon="inline-start" /> Indicative, not binding</span>
              <span><Clock3 data-icon="inline-start" /> Takes 3 minutes</span>
            </div>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" />
            <div className="orbit-card"><span className="orbit-icon"><IndianRupee /></span><strong>₹ 3.0L–4.5L</strong><small>sample estimate</small></div>
            <div className="orbit-pip pip-one">01</div><div className="orbit-pip pip-two">₹</div><div className="orbit-pip pip-three">✦</div>
          </div>
        </section>

        <div className="estimator-layout">
          <section className="builder-panel">
            <div className="section-heading">
              <div><p className="step-label">Step 01 <span>/ 04</span></p><h2>Tell us what you’re building</h2></div>
              <span className="progress-pill">25% complete</span>
            </div>

            <div className="field-block">
              <label>Application type</label>
              <div className="segmented-control">
                {(['Mobile app', 'Web app', 'Both'] as AppType[]).map((item) => <button key={item} className={appType === item ? 'active' : ''} onClick={() => setAppType(item)}>{item}</button>)}
              </div>
            </div>

            <div className="field-block">
              <label htmlFor="category">Business category</label>
              <div className="select-wrap"><select id="category" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setSelectedFeatures([]) }}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown /></div>
              <p className="field-hint">{category.description}</p>
            </div>

            <div className="field-block">
              <div className="label-row"><label>Choose a starting package</label><span className="hint-inline">You can change this later</span></div>
              <div className="package-grid">
                {(Object.keys(packages) as PackageLevel[]).map((item) => <button key={item} className={`package-option ${level === item ? 'selected' : ''}`} onClick={() => setLevel(item)}><span className="package-top"><strong>{item}</strong>{item === 'Standard' && <span className="recommended">Recommended</span>}</span><span>{packages[item].caption}</span><b>{packages[item].label}</b></button>)}
              </div>
            </div>

            <div className="divider" />
            <div className="section-heading compact"><div><p className="step-label">Step 02 <span>/ 04</span></p><h2>Select the features you need</h2></div></div>
            <p className="section-subcopy">Start with the essentials. Each selection fine-tunes your estimate.</p>
            <div className="check-list">
              {category.features.map((feature) => <button key={feature.id} className={`check-option ${selectedFeatures.includes(feature.id) ? 'checked' : ''}`} onClick={() => toggle(feature.id, selectedFeatures, setSelectedFeatures)}><span className="check-box">{selectedFeatures.includes(feature.id) && <Check />}</span><span className="check-copy"><strong>{feature.label}{feature.id.startsWith('ai-') && <span className="ai-tag">AI</span>}</strong><small>{feature.detail}</small></span><span className="check-price">+{formatCurrency(feature.price).replace('₹', '₹ ')}</span></button>)}
            </div>

            <div className="divider" />
            <div className="section-heading compact"><div><p className="step-label">Step 03 <span>/ 04</span></p><h2>Connect the important pieces</h2></div></div>
            <div className="integration-grid">
              {integrations.map((item) => <button key={item.id} className={`integration-option ${selectedIntegrations.includes(item.id) ? 'checked' : ''}`} onClick={() => toggle(item.id, selectedIntegrations, setSelectedIntegrations)}><span className="integration-check">{selectedIntegrations.includes(item.id) ? <Check /> : <Plus />}</span><span><strong>{item.label}</strong><small>+{formatCurrency(item.price).replace('₹', '₹ ')}</small></span></button>)}
            </div>

            <div className="divider" />
            <div className="section-heading compact"><div><p className="step-label">Step 04 <span>/ 04</span></p><h2>How ambitious is the first release?</h2></div></div>
            <div className="scale-row"><span>Lean MVP</span><input aria-label="Project scale" type="range" min="0.85" max="1.25" step="0.05" value={scale} onChange={(event) => setScale(Number(event.target.value))} /><span>Feature-rich</span></div>
            <div className="scale-caption"><span>{scale < 1 ? 'A lean, validation-first release' : scale > 1 ? 'More depth for a confident launch' : 'A balanced first release'}</span><b>{Math.round(scale * 100)}% scope</b></div>
            <div className="delivery-control"><div className="delivery-control-heading"><span><strong>Target delivery window</strong><small>Guarded by the features selected above</small></span><b>{estimate.weeks} weeks</b></div><input aria-label="Target delivery window" type="range" min={estimate.minWeeks} max={estimate.maxWeeks} step="1" value={estimate.weeks} onChange={(event) => setDeliveryWeeks(Number(event.target.value))} /><div className="scale-caption"><span>Minimum: {estimate.minWeeks} weeks</span><b>Maximum: {estimate.maxWeeks} weeks</b></div></div>

            <div className="privacy-note"><Info /><span><strong>Good to know:</strong> this tool stores nothing. Please don’t enter passwords or confidential access details here.</span></div>
          </section>

          <aside className="estimate-card">
            <div className="estimate-topline"><span className="result-label"><span className="result-dot" /> Your live estimate</span><button className="icon-button" aria-label="Close estimate panel"><X /></button></div>
            <h2>Here’s the shape<br />of your project.</h2>
            <p className="estimate-caption">An early-stage range to help you plan the conversation.</p>
            <div className="price-display"><span>Estimated investment</span><strong>{formatCurrency(estimate.lower)} <i>—</i> {formatCurrency(estimate.upper)}</strong><small>Excluding GST · final quote follows discovery</small></div>
            <div className="estimate-stats"><div><Clock3 /><span>Delivery window<strong>{estimate.weeks} weeks</strong><small>Guardrail {estimate.minWeeks}–{estimate.maxWeeks}</small></span></div><div><Users /><span>Suggested team<strong>{estimate.team} people</strong></span></div></div>
            <div className="team-strip"><span>Typical team mix</span><div className="avatar-stack">{estimate.roles.map((role) => <span key={role.role}>{role.short}</span>)}</div></div>
            <div className="team-breakdown"><div className="team-breakdown-title"><b>Suggested team · {estimate.team} people</b><span>Exact role count</span></div>{estimate.roles.map((role) => <div className="team-role" key={role.role}><span>{role.role}</span><b>{role.count}</b></div>)}</div>
            <button className="details-toggle" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide estimate details' : 'See what’s included'}<ChevronDown className={showDetails ? 'rotated' : ''} /></button>
            {showDetails && <div className="details-panel"><p><b>Selected scope</b></p>{estimate.selected.slice(0, 5).map((feature) => <span key={feature.id}><Check /> {feature.label}</span>)}{estimate.chosenIntegrations.map((item) => <span key={item.id}><Check /> {item.label}</span>)}<p className="scope-heading"><b>Included in our delivery</b></p>{estimate.scope.included.map((item) => <span key={item}><Check /> {item}</span>)}<p className="scope-heading excluded-heading"><b>Excluded / paid by client</b></p>{estimate.scope.excluded.map((item) => <span className="excluded-item" key={item}><X /> {item}</span>)}</div>}
            <div className="result-actions"><button className="primary-button" onClick={copySummary}>{copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}{copied ? 'Copied estimate' : 'Copy estimate'}</button><button className="secondary-button" onClick={shareOnWhatsApp}><MessageCircle data-icon="inline-start" /> Share on WhatsApp</button><button className="secondary-button" onClick={emailEstimate}><Mail data-icon="inline-start" /> Email my estimate</button></div>
            <div className="estimate-footer"><span><FileText /> Summary ready to share</span><span><Link2 /> No backend needed</span></div>
          </aside>
        </div>

        <section className="bottom-cta"><div><p className="eyebrow">Ready when you are</p><h2>Have a more specific idea?</h2><p>Share your estimate with our team and we’ll turn the range into a thoughtful, detailed proposal.</p></div><div className="cta-actions"><button className="primary-button"><Mail data-icon="inline-start" /> Email my estimate <ArrowRight data-icon="inline-end" /></button><small>Usually replied to within one business day.</small></div></section>
      </main>
      <footer><span>© 2025 Failure Folks Academy</span><span>Indicative pricing for planning only</span><span>Built for better first conversations.</span></footer>
    </div>
  )
}

export default App
