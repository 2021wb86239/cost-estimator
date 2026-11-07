import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Globe2,
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
import countryToCurrency from 'country-to-currency'
import './App.css'
import './AppEnhancements.css'

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
      { id: 'appointments', label: 'Appointment scheduling', detail: 'Let customers request and manage visits', price: 24000, weeks: 0.7 },
      { id: 'invoices', label: 'Quotes & invoices', detail: 'Prepare estimates and track payment status', price: 26000, weeks: 0.8 },
      { id: 'notifications', label: 'Push notifications', detail: 'Keep customers in the loop', price: 12000, weeks: 0.3 },
      { id: 'analytics', label: 'Business analytics', detail: 'Review enquiries and service performance', price: 28000, weeks: 0.8 },
      { id: 'knowledge-base', label: 'Help centre', detail: 'Publish answers to common questions', price: 18000, weeks: 0.5 },
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
      { id: 'wishlist', label: 'Wishlist', detail: 'Save products for a future purchase', price: 16000, weeks: 0.5 },
      { id: 'promotions', label: 'Discounts & promotions', detail: 'Create coupon codes and sale rules', price: 22000, weeks: 0.6 },
      { id: 'shipping', label: 'Shipping rules', detail: 'Configure delivery zones and rates', price: 24000, weeks: 0.7 },
      { id: 'sales-reports', label: 'Sales reports', detail: 'Track orders, revenue and popular products', price: 26000, weeks: 0.8 },
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
      { id: 'restaurant-dashboard', label: 'Restaurant dashboard', detail: 'Manage menus, hours and incoming orders', price: 32000, weeks: 0.9 },
      { id: 'scheduled-orders', label: 'Scheduled orders', detail: 'Let customers choose a future delivery time', price: 20000, weeks: 0.6 },
      { id: 'promotions', label: 'Offers & promo codes', detail: 'Configure restaurant discounts', price: 22000, weeks: 0.6 },
      { id: 'loyalty', label: 'Loyalty rewards', detail: 'Reward repeat orders with points', price: 28000, weeks: 0.8 },
      { id: 'support', label: 'Order support inbox', detail: 'Review customer issues and order context', price: 24000, weeks: 0.7 },
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
      { id: 'live-classes', label: 'Live classes', detail: 'Schedule and join instructor-led sessions', price: 38000, weeks: 1.0 },
      { id: 'assignments', label: 'Assignments', detail: 'Submit work and review instructor feedback', price: 26000, weeks: 0.8 },
      { id: 'discussion', label: 'Class discussion', detail: 'Give learners a space to ask questions', price: 22000, weeks: 0.7 },
      { id: 'announcements', label: 'Course announcements', detail: 'Share updates with enrolled learners', price: 14000, weeks: 0.4 },
      { id: 'learning-reports', label: 'Learning reports', detail: 'Review completion and learner progress', price: 28000, weeks: 0.8 },
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
      { id: 'payments', label: 'Booking deposits', detail: 'Collect a deposit when customers book', price: 20000, weeks: 0.6 },
      { id: 'cancellations', label: 'Rescheduling & cancellations', detail: 'Apply cancellation and change rules', price: 22000, weeks: 0.7 },
      { id: 'multi-location', label: 'Multiple locations', detail: 'Manage availability across branches', price: 30000, weeks: 0.9 },
      { id: 'packages', label: 'Service packages', detail: 'Offer bundles and repeat visit plans', price: 24000, weeks: 0.7 },
      { id: 'booking-reports', label: 'Booking reports', detail: 'Review attendance and appointment trends', price: 22000, weeks: 0.6 },
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

const basicFeaturesByCategory: Record<string, string[]> = {
  business: ['profiles', 'catalogue', 'leads'],
  ecommerce: ['catalogue', 'cart', 'orders'],
  food: ['menu', 'cart', 'tracking'],
  education: ['courses', 'lessons', 'progress'],
  booking: ['calendar', 'booking', 'history'],
}

const packages: Record<PackageLevel, { multiplier: number; label: string; caption: string }> = {
  Basic: { multiplier: 0.82, label: 'A focused launch', caption: 'Core features included, with optional add-ons.' },
  Standard: { multiplier: 1, label: 'Most chosen', caption: 'A balanced first release for serious customer validation.' },
  Premium: { multiplier: 1.34, label: 'Built to scale', caption: 'Advanced workflows, dashboards and launch support.' },
}

const teamsByCategory: Record<string, Record<PackageLevel, TeamRole[]>> = {
  business: {
    Basic: [
      { role: 'Product manager / business analyst', count: 1, short: 'PM' },
      { role: 'Product designer', count: 1, short: 'UX' },
      { role: 'Full-stack developer', count: 1, short: 'FS' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Standard: [
      { role: 'Product manager / business analyst', count: 1, short: 'PM' },
      { role: 'Product designer', count: 1, short: 'UX' },
      { role: 'Frontend developer', count: 1, short: 'FE' },
      { role: 'Backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Premium: [
      { role: 'Product manager', count: 1, short: 'PM' },
      { role: 'Product designer', count: 1, short: 'UX' },
      { role: 'Frontend developers', count: 2, short: 'FE' },
      { role: 'Backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
      { role: 'DevOps / cloud engineer', count: 1, short: 'DO' },
    ],
  },
  ecommerce: {
    Basic: [
      { role: 'Product manager / business analyst', count: 1, short: 'PM' },
      { role: 'Commerce UX designer', count: 1, short: 'UX' },
      { role: 'Full-stack commerce developer', count: 1, short: 'FS' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Standard: [
      { role: 'Product manager', count: 1, short: 'PM' },
      { role: 'Commerce UX designer', count: 1, short: 'UX' },
      { role: 'Frontend developer', count: 1, short: 'FE' },
      { role: 'Commerce backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Premium: [
      { role: 'Product manager', count: 1, short: 'PM' },
      { role: 'Commerce UX designer', count: 1, short: 'UX' },
      { role: 'Frontend developers', count: 2, short: 'FE' },
      { role: 'Commerce backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
      { role: 'DevOps / cloud engineer', count: 1, short: 'DO' },
    ],
  },
  food: {
    Basic: [
      { role: 'Product manager / operations analyst', count: 1, short: 'PM' },
      { role: 'Service designer', count: 1, short: 'UX' },
      { role: 'Full-stack developer', count: 2, short: 'FS' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Standard: [
      { role: 'Product manager / operations analyst', count: 1, short: 'PM' },
      { role: 'Service designer', count: 1, short: 'UX' },
      { role: 'Frontend developer', count: 1, short: 'FE' },
      { role: 'Backend and order systems developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Premium: [
      { role: 'Product manager / operations analyst', count: 1, short: 'PM' },
      { role: 'Service designer', count: 1, short: 'UX' },
      { role: 'Frontend developers', count: 2, short: 'FE' },
      { role: 'Backend developers', count: 2, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
      { role: 'DevOps / cloud engineer', count: 1, short: 'DO' },
    ],
  },
  education: {
    Basic: [
      { role: 'Product manager / learning analyst', count: 1, short: 'PM' },
      { role: 'Learning experience designer', count: 1, short: 'LX' },
      { role: 'Full-stack developer', count: 1, short: 'FS' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Standard: [
      { role: 'Product manager / learning analyst', count: 1, short: 'PM' },
      { role: 'Learning experience designer', count: 1, short: 'LX' },
      { role: 'Frontend developer', count: 1, short: 'FE' },
      { role: 'Learning platform backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Premium: [
      { role: 'Product manager', count: 1, short: 'PM' },
      { role: 'Learning experience designer', count: 1, short: 'LX' },
      { role: 'Frontend developers', count: 2, short: 'FE' },
      { role: 'Learning platform backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
      { role: 'DevOps / video platform engineer', count: 1, short: 'DO' },
    ],
  },
  booking: {
    Basic: [
      { role: 'Product manager / scheduling analyst', count: 1, short: 'PM' },
      { role: 'Product designer', count: 1, short: 'UX' },
      { role: 'Full-stack scheduling developer', count: 1, short: 'FS' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Standard: [
      { role: 'Product manager / scheduling analyst', count: 1, short: 'PM' },
      { role: 'Product designer', count: 1, short: 'UX' },
      { role: 'Frontend developer', count: 1, short: 'FE' },
      { role: 'Scheduling backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
    ],
    Premium: [
      { role: 'Product manager', count: 1, short: 'PM' },
      { role: 'Product designer', count: 1, short: 'UX' },
      { role: 'Frontend developers', count: 2, short: 'FE' },
      { role: 'Scheduling backend developer', count: 1, short: 'BE' },
      { role: 'QA engineer', count: 1, short: 'QA' },
      { role: 'DevOps / cloud engineer', count: 1, short: 'DO' },
    ],
  },
}

const teamResearchByCategory: Record<string, { label: string; url: string }[]> = {
  business: [
    { label: 'HubSpot: CRM contact records and associations', url: 'https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/contacts/guide' },
    { label: 'Scrum Guide: small, cross-functional teams', url: 'https://scrumguides.org/scrum-guide.html' },
  ],
  ecommerce: [
    { label: 'Shopify: order lifecycle and fulfillment', url: 'https://shopify.dev/docs/api/admin-graphql/latest/objects/Order' },
    { label: 'Stripe: hosted checkout options', url: 'https://docs.stripe.com/payments/checkout' },
  ],
  food: [
    { label: 'Google Maps: routes and travel times', url: 'https://developers.google.com/maps/documentation/routes' },
    { label: 'Stripe: hosted checkout options', url: 'https://docs.stripe.com/payments/checkout' },
  ],
  education: [
    { label: 'Open edX: educator and course workflows', url: 'https://docs.openedx.org/en/latest/educators/index.html' },
  ],
  booking: [
    { label: 'Google Calendar: creating events and access requirements', url: 'https://developers.google.com/workspace/calendar/api/guides/create-events' },
  ],
}

const scopeByCategory: Record<string, ScopeNotes> = {
  business: {
    included: ['Responsive customer and admin experience', 'Basic enquiry and service workflows', 'Role-based access for agreed user types', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
    excluded: ['Cloud hosting, database, backups, DNS, domain and SSL renewal charges', 'CRM or ERP licence and usage fees', 'Bulk data migration and data cleansing', 'Copywriting, photography and ongoing content entry', 'Third-party AI model usage and training costs'],
  },
  ecommerce: {
    included: ['Product, cart, checkout and order flows selected above', 'Basic admin catalogue and order controls', 'Source code handover plus configuration of agreed cloud, DNS and SSL environments'],
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

const formatCurrency = (value: number, locale = 'en-IN', currency = 'INR') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)

const recipientEmail = 'jasjagan22@gmail.com'

type ExchangeRateResponse = {
  result: string
  time_last_update_utc: string
  rates: Record<string, number>
}

type GeocodeResponse = {
  countryCode?: string
  countryName?: string
}

function getCurrentPage(): 'estimator' | 'admin' | 'contact' {
  if (window.location.pathname === '/admin') return 'admin'
  if (window.location.pathname === '/contact') return 'contact'
  return 'estimator'
}

function App() {
  const [appType, setAppType] = useState<AppType>('Both')
  const [categoryId, setCategoryId] = useState('ecommerce')
  const [level, setLevel] = useState<PackageLevel>('Basic')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['catalogue', 'cart', 'orders'])
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [scale, setScale] = useState(1)
  const [deliveryWeeks, setDeliveryWeeks] = useState(0)
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState<'estimator' | 'admin' | 'contact'>(getCurrentPage)
  const [adminCategoryId, setAdminCategoryId] = useState('ecommerce')
  const [adminBase, setAdminBase] = useState(categories[1].base)
  const [adminSaved, setAdminSaved] = useState(false)
  const [locale, setLocale] = useState(() => navigator.language || 'en-IN')
  const [currency, setCurrency] = useState('INR')
  const [exchangeRate, setExchangeRate] = useState(1)
  const [exchangeRateDate, setExchangeRateDate] = useState('')
  const [locationStatus, setLocationStatus] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [contactNotice, setContactNotice] = useState('')
  const locationRequestStarted = useRef(false)

  useEffect(() => {
    const handlePopState = () => setPage(getCurrentPage())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const category = categories.find((item) => item.id === categoryId) ?? categories[1]
  const adminCategory = categories.find((item) => item.id === adminCategoryId) ?? categories[1]
  const formatPrice = (value: number) => formatCurrency(value * exchangeRate, locale, currency)

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('Location detection is not supported by this browser. Prices remain in INR.')
      return
    }

    setLocationLoading(true)
    setCurrency('INR')
    setExchangeRate(1)
    setExchangeRateDate('')
    setLocationStatus('Requesting location permission…')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geocodeUrl = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
          geocodeUrl.searchParams.set('latitude', String(coords.latitude))
          geocodeUrl.searchParams.set('longitude', String(coords.longitude))
          geocodeUrl.searchParams.set('localityLanguage', locale.split('-')[0] || 'en')
          const geocodeResponse = await fetch(geocodeUrl)
          if (!geocodeResponse.ok) throw new Error('Could not look up the country for this location.')
          const geocode = await geocodeResponse.json() as GeocodeResponse
          const countryCode = geocode.countryCode?.toUpperCase()
          if (!countryCode) throw new Error('Could not identify the country for this location.')

          const localCurrency = countryToCurrency[countryCode as keyof typeof countryToCurrency]
          if (!localCurrency) throw new Error(`Could not identify the local currency for ${geocode.countryName ?? 'this country'}.`)
          const nextLocale = `${locale.split('-')[0] || 'en'}-${countryCode}`
          let rateDate = ''

          if (localCurrency === 'INR') {
            setCurrency('INR')
            setExchangeRate(1)
            setExchangeRateDate('')
            setLocale(nextLocale)
          } else {
            const rateResponse = await fetch('https://open.er-api.com/v6/latest/INR')
            if (!rateResponse.ok) throw new Error('The free exchange rate service is unavailable. Prices remain in INR.')
            const rateData = await rateResponse.json() as ExchangeRateResponse
            const nextRate = rateData.rates[localCurrency]
            if (rateData.result !== 'success' || !Number.isFinite(nextRate) || nextRate <= 0) {
              throw new Error(`Exchange rates for ${localCurrency} are not available. Prices remain in INR.`)
            }
            rateDate = rateData.time_last_update_utc
            setCurrency(localCurrency)
            setExchangeRate(nextRate)
            setExchangeRateDate(rateDate)
            setLocale(nextLocale)
          }
          const rateNote = rateDate
            ? ` Reference rate updated ${new Intl.DateTimeFormat(nextLocale, { dateStyle: 'medium' }).format(new Date(rateDate))}.`
            : ''
          setLocationStatus(`Location detected: ${geocode.countryName ?? countryCode}. Prices use ${localCurrency}.${rateNote}`)
        } catch (error) {
          setLocationStatus(error instanceof Error ? error.message : 'Location could not be detected. Prices remain in INR.')
        } finally {
          setLocationLoading(false)
        }
      },
      (error) => {
        const reason = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Prices remain in INR.'
          : error.code === error.TIMEOUT
            ? 'Location request timed out. Please try again.'
            : 'Could not detect your location. Check your connection and try again.'
        setLocationStatus(reason)
        setLocationLoading(false)
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 12000 },
    )
  }, [locale])

  useEffect(() => {
    if (page !== 'estimator' || locationRequestStarted.current) return
    locationRequestStarted.current = true
    detectLocation()
  }, [detectLocation, page])

  const estimate = useMemo(() => {
    const typeMultiplier = appType === 'Mobile app' ? 0.8 : appType === 'Web app' ? 0.76 : 1
    const selected = category.features.filter((feature) => selectedFeatures.includes(feature.id))
    const includedBasicFeatures = level === 'Basic' ? basicFeaturesByCategory[category.id] : []
    const chosenIntegrations = integrations.filter((item) => selectedIntegrations.includes(item.id))
    const availableFeatures = category.features.filter((feature) => !selectedFeatures.includes(feature.id))
    const availableIntegrations = integrations.filter((item) => !selectedIntegrations.includes(item.id))
    const featureTotal = selected.reduce((total, feature) => total + (includedBasicFeatures.includes(feature.id) ? 0 : feature.price), 0)
    const integrationTotal = chosenIntegrations.reduce((total, item) => total + item.price, 0)
    const minWeeks = Math.max(2, Math.ceil((category.weeks + selected.reduce((total, feature) => total + feature.weeks, 0) + chosenIntegrations.reduce((total, item) => total + item.weeks, 0)) * (appType === 'Both' ? 1.18 : 1) * (level === 'Premium' ? 1.12 : 1)))
    const maxWeeks = Math.max(minWeeks + 2, Math.ceil(minWeeks * (scale > 1 ? 1.3 : 1.22)))
    const defaultWeeks = Math.round((minWeeks + maxWeeks) / 2)
    const guardedWeeks = Math.min(maxWeeks, Math.max(minWeeks, deliveryWeeks || defaultWeeks))
    const scheduleProgress = (guardedWeeks - minWeeks) / (maxWeeks - minWeeks)
    const scheduleMultiplier = 1.1 - scheduleProgress * 0.2
    const scheduleAdjustment = Math.round((scheduleMultiplier - 1) * 100)
    const raw = (category.base + featureTotal + integrationTotal) * typeMultiplier * packages[level].multiplier * scale * scheduleMultiplier
    const roles = [...teamsByCategory[category.id][level]]
    if (selected.some((feature) => feature.id.startsWith('ai-'))) {
      roles.push({ role: 'AI / machine learning engineer', count: 1, short: 'AI' })
    }
    if (category.id === 'food' && (selected.some((feature) => feature.id === 'dispatch') || selectedIntegrations.includes('maps'))) {
      roles.push({ role: 'Maps and delivery integration engineer', count: 1, short: 'MI' })
    }
    if (category.id === 'education' && selected.some((feature) => feature.id === 'live-classes') && level !== 'Premium') {
      roles.push({ role: 'Video platform integration engineer', count: 1, short: 'VI' })
    }
    const team = roles.reduce((total, role) => total + role.count, 0)
    const lower = Math.round(raw * 0.9 / 1000) * 1000
    const upper = Math.round(raw * 1.12 / 1000) * 1000
    return { selected, availableFeatures, chosenIntegrations, availableIntegrations, includedBasicFeatures, lower, upper, minWeeks, maxWeeks, weeks: guardedWeeks, scheduleAdjustment, team, roles, research: teamResearchByCategory[category.id], scope: scopeByCategory[category.id] }
  }, [appType, category, deliveryWeeks, level, scale, selectedFeatures, selectedIntegrations])

  const toggle = (id: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(id) ? values.filter((item) => item !== id) : [...values, id])
  }

  const reset = () => {
    setAppType('Both')
    setCategoryId('ecommerce')
    setLevel('Basic')
    setSelectedFeatures(['catalogue', 'cart', 'orders'])
    setSelectedIntegrations([])
    setScale(1)
    setDeliveryWeeks(0)
  }

  const summary = `Project estimate for ${category.name} (${appType}) — ${formatPrice(estimate.lower)} to ${formatPrice(estimate.upper)}${currency === 'INR' ? '' : ` (INR ${formatCurrency(estimate.lower)} to ${formatCurrency(estimate.upper)})`}, ${estimate.weeks} weeks (${estimate.scheduleAdjustment > 0 ? '+' : ''}${estimate.scheduleAdjustment}% timeline adjustment; range ${estimate.minWeeks}–${estimate.maxWeeks} weeks).`
  const summaryBreakdown = `Included in estimate: ${estimate.selected.map((feature) => feature.label).concat(estimate.chosenIntegrations.map((item) => item.label), estimate.scope.included).join('; ')}\nNot included: ${estimate.availableFeatures.map((feature) => feature.label).concat(estimate.availableIntegrations.map((item) => item.label), estimate.scope.excluded).join('; ')}`

  const copySummary = async () => {
    await navigator.clipboard?.writeText(`${summary}\nPackage: ${level}\nSuggested team: ${estimate.roles.map((role) => `${role.role} (${role.count})`).join(', ')}\n${summaryBreakdown}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, '_blank', 'noopener,noreferrer')
  }

  const emailEstimate = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`Project estimate · ${category.name}`)}&body=${encodeURIComponent(`${summary}\n\nPackage: ${level}\nSuggested team: ${estimate.roles.map((role) => `${role.role} (${role.count})`).join(', ')}\n${summaryBreakdown}`)}`
  }

  const saveAdminDraft = () => {
    setAdminSaved(true)
    window.setTimeout(() => setAdminSaved(false), 2200)
  }

  const navigate = (nextPage: 'estimator' | 'admin' | 'contact') => {
    window.history.pushState({}, '', nextPage === 'admin' ? '/admin' : nextPage === 'contact' ? '/contact' : '/')
    setPage(nextPage)
  }

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Project: ${category.name} (${appType}), ${level} package`,
      `Estimate: ${summary}`,
      message ? `Message: ${message}` : '',
    ].filter(Boolean).join('\n')
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(`Website enquiry from ${name}`)}&body=${encodeURIComponent(body)}`
    setContactNotice('Your email app should open with the enquiry addressed to us. Review the details and press Send to complete it.')
  }

  if (page === 'contact') {
    return (
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="Failure Folks Academy home" onClick={(event) => { event.preventDefault(); navigate('estimator') }}>
            <span className="brand-mark">FF</span>
            <span><strong>Failure Folks</strong><small>Academy</small></span>
          </a>
          <button className="ghost-button" onClick={() => navigate('estimator')}><ArrowRight data-icon="inline-start" /> Back to estimator</button>
        </header>
        <main className="contact-page">
          <div className="contact-intro">
            <p className="eyebrow"><Mail data-icon="inline-start" /> Contact Failure Folks Academy</p>
            <h1>Tell us what you <em>have in mind.</em></h1>
            <p>Share your contact details and we’ll follow up about your project estimate.</p>
          </div>
          <form className="contact-card" onSubmit={submitContact}>
            <div className="contact-card-heading"><span>Project enquiry</span><small>Required fields are marked</small></div>
            <div className="contact-fields">
              <div className="contact-field">
                <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={100} />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-phone">Phone number <span aria-hidden="true">*</span></label>
                <input id="contact-phone" name="phone" type="tel" autoComplete="tel" required maxLength={32} />
              </div>
              <div className="contact-field contact-field-wide">
                <label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} />
              </div>
              <div className="contact-field contact-field-wide">
                <label htmlFor="contact-message">Message <small>Optional</small></label>
                <textarea id="contact-message" name="message" rows={5} maxLength={2000} placeholder="What would you like us to know about your project?" />
              </div>
            </div>
            <p className="contact-privacy"><Info /> This site has no email backend. Submitting opens your email app with these details addressed to {recipientEmail}. You must review and send the email yourself.</p>
            <button className="primary-button contact-submit" type="submit"><Mail data-icon="inline-start" /> Open email to send enquiry <ArrowRight data-icon="inline-end" /></button>
            {contactNotice && <p className="contact-notice" role="status">{contactNotice}</p>}
          </form>
        </main>
        <footer><span>© 2025 Failure Folks Academy</span><span>Contact form uses your email app</span></footer>
      </div>
    )
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
        <a className="brand" href="/" aria-label="Failure Folks Academy home" onClick={(event) => { event.preventDefault(); navigate('estimator') }}>
          <span className="brand-mark">FF</span>
          <span><strong>Failure Folks</strong><small>Academy</small></span>
        </a>
        <div className="topbar-actions">
          <span className="saved-badge"><span className="live-dot" /> No sign-in required</span>
          <button className="ghost-button contact-nav" onClick={() => navigate('contact')}><Mail data-icon="inline-start" /> Contact us</button>
          <button className="ghost-button" onClick={reset}><RotateCcw data-icon="inline-start" /> Reset</button>
        </div>
      </header>

      <main>
        <section className="location-toolbar" aria-label="Location and currency">
          <div className="location-toolbar-copy">
            <Globe2 />
            <span><strong>{locationLoading ? 'Detecting your location…' : `Prices in ${currency}`}</strong><small>Number formatting follows your browser language. Page copy is in English.</small></span>
          </div>
          {locationStatus && <p className="location-status" role="status">{locationStatus}</p>}
          {exchangeRateDate && <small className="exchange-rate-note">Converted from INR using the reference rate updated {new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(exchangeRateDate))}. Conversion is indicative.</small>}
          <small className="location-privacy">Only after you approve location access, your coordinates are sent to BigDataCloud to identify your country. Exchange rates come from ExchangeRate-API.</small>
        </section>

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
            <div className="orbit-card"><span className="orbit-icon"><IndianRupee /></span><strong>{formatPrice(300000)}–{formatPrice(450000)}</strong><small>sample estimate</small></div>
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
              <div className="select-wrap"><select id="category" value={categoryId} onChange={(event) => { const nextCategory = event.target.value; setCategoryId(nextCategory); setSelectedFeatures(level === 'Basic' ? basicFeaturesByCategory[nextCategory] : []) }}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown /></div>
              <p className="field-hint">{category.description}</p>
            </div>

            <div className="field-block">
              <div className="label-row"><label>Choose a starting package</label><span className="hint-inline">You can change this later</span></div>
              <div className="package-grid">
                {(Object.keys(packages) as PackageLevel[]).map((item) => <button key={item} type="button" aria-pressed={level === item} className={`package-option ${level === item ? 'selected' : ''}`} onClick={() => { setLevel(item); if (item === 'Basic') setSelectedFeatures((current) => [...new Set([...current, ...basicFeaturesByCategory[category.id]])]) }}><span className="package-top"><strong>{item}</strong>{item === 'Basic' && <span className="recommended">Core included</span>}{item === 'Standard' && <span className="recommended">Recommended</span>}</span><span>{packages[item].caption}</span><b>{packages[item].label}</b></button>)}
              </div>
            </div>

            <div className="divider" />
            <div className="section-heading compact"><div><p className="step-label">Step 02 <span>/ 04</span></p><h2>Select the features you need</h2></div></div>
            <p className="section-subcopy">{level === 'Basic' ? 'Core features are included with Basic. Add any extra features you need; add-ons are priced separately.' : 'Select the features you need. Each add-on fine-tunes your estimate.'}</p>
            <div className="check-list">
              {category.features.map((feature) => {
                const isSelected = selectedFeatures.includes(feature.id)
                const isIncludedWithBasic = level === 'Basic' && estimate.includedBasicFeatures.includes(feature.id)
                return <button key={feature.id} type="button" aria-pressed={isSelected} disabled={isIncludedWithBasic} className={`check-option ${isSelected ? 'checked' : ''} ${isIncludedWithBasic ? 'included-feature' : ''}`} onClick={() => toggle(feature.id, selectedFeatures, setSelectedFeatures)}><span className="check-box">{isSelected && <Check />}</span><span className="check-copy"><strong>{feature.label}{feature.id.startsWith('ai-') && <span className="ai-tag">AI</span>}</strong><small>{feature.detail}</small></span><span className="check-price">{isIncludedWithBasic ? 'Included in Basic' : `+${formatPrice(feature.price)}`}</span></button>
              })}
            </div>

            <div className="divider" />
            <div className="section-heading compact"><div><p className="step-label">Step 03 <span>/ 04</span></p><h2>Connect the important pieces</h2></div></div>
            <div className="integration-grid">
              {integrations.map((item) => <button key={item.id} className={`integration-option ${selectedIntegrations.includes(item.id) ? 'checked' : ''}`} onClick={() => toggle(item.id, selectedIntegrations, setSelectedIntegrations)}><span className="integration-check">{selectedIntegrations.includes(item.id) ? <Check /> : <Plus />}</span><span><strong>{item.label}</strong><small>+{formatPrice(item.price)}</small></span></button>)}
            </div>

            <div className="divider" />
            <div className="section-heading compact"><div><p className="step-label">Step 04 <span>/ 04</span></p><h2>How ambitious is the first release?</h2></div></div>
            <div className="scale-row"><span>Lean MVP</span><input aria-label="Project scale" type="range" min="0.85" max="1.25" step="0.05" value={scale} onChange={(event) => setScale(Number(event.target.value))} /><span>Feature-rich</span></div>
            <div className="scale-caption"><span>{scale < 1 ? 'A lean, validation-first release' : scale > 1 ? 'More depth for a confident launch' : 'A balanced first release'}</span><b>{Math.round(scale * 100)}% scope</b></div>
            <div className="delivery-control"><div className="delivery-control-heading"><span><strong>Target delivery window</strong><small>A longer timeline lowers the estimate. A faster schedule raises it by up to 10%.</small></span><b>{estimate.weeks} weeks</b></div><input aria-label="Target delivery window" type="range" min={estimate.minWeeks} max={estimate.maxWeeks} step="1" value={estimate.weeks} onChange={(event) => setDeliveryWeeks(Number(event.target.value))} /><div className="scale-caption"><span>Faster: {estimate.minWeeks} weeks · higher cost</span><b>Longer: {estimate.maxWeeks} weeks · lower cost</b></div></div>

            <div className="privacy-note"><Info /><span><strong>Good to know:</strong> this tool stores nothing. Please don’t enter passwords or confidential access details here.</span></div>
          </section>

          <aside className="estimate-card">
            <div className="estimate-topline"><span className="result-label"><span className="result-dot" /> Your live estimate</span><button className="icon-button" aria-label="Close estimate panel"><X /></button></div>
            <h2>Here’s the shape<br />of your project.</h2>
            <p className="estimate-caption">An early-stage range to help you plan the conversation.</p>
            <div className="price-display"><span>Estimated investment</span><strong>{formatPrice(estimate.lower)} <i>—</i> {formatPrice(estimate.upper)}</strong>{currency !== 'INR' && <small>INR reference: {formatCurrency(estimate.lower)} — {formatCurrency(estimate.upper)}</small>}<small>Excluding GST · final quote follows discovery</small><small className="timeline-price-adjustment">Timeline adjustment: {estimate.scheduleAdjustment > 0 ? '+' : ''}{estimate.scheduleAdjustment}%</small></div>
            <div className="estimate-stats"><div><Clock3 /><span>Delivery window<strong>{estimate.weeks} weeks</strong><small>Guardrail {estimate.minWeeks}–{estimate.maxWeeks}</small></span></div><div><Users /><span>Suggested team<strong>{estimate.team} contributors</strong></span></div></div>
            <div className="team-strip"><span>Typical team mix</span><div className="avatar-stack">{estimate.roles.map((role) => <span key={role.role}>{role.short}</span>)}</div></div>
            <div className="team-breakdown"><div className="team-breakdown-title"><b>Suggested team · {estimate.team} contributors</b><span>By category and package</span></div>{estimate.roles.map((role) => <div className="team-role" key={role.role}><span>{role.role}</span><b>{role.count}</b></div>)}<p className="team-guidance">A small cross-functional squad is typical for this scope. People may share responsibilities or contribute part time. Counts are planning estimates, not fixed industry requirements.</p><div className="team-research"><span>Research references</span>{estimate.research.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer">{reference.label}<ArrowRight /></a>)}</div></div>
            <section className="scope-summary" aria-label="Detailed estimate inclusions and exclusions">
              <h3>What this estimate covers</h3>
              <div className="scope-summary-grid">
                <div className="scope-summary-column">
                  <h4><Check /> Included in estimate</h4>
                  <p>Selected features</p>
                  <ul>{estimate.selected.map((feature) => <li key={feature.id}><Check /><span><strong>{feature.label}</strong><small>{feature.detail}{estimate.includedBasicFeatures.includes(feature.id) ? ' · Included with Basic' : ` · ${formatPrice(feature.price)}`}</small></span></li>)}</ul>
                  <p>Selected integrations</p>
                  {estimate.chosenIntegrations.length > 0 ? <ul>{estimate.chosenIntegrations.map((item) => <li key={item.id}><Check /><span><strong>{item.label}</strong><small>{formatPrice(item.price)}</small></span></li>)}</ul> : <p className="scope-empty">No integrations selected.</p>}
                  <p>Delivery includes</p>
                  <ul>{estimate.scope.included.map((item) => <li key={item}><Check /><span>{item}</span></li>)}</ul>
                </div>
                <div className="scope-summary-column excluded-column">
                  <h4><X /> Not included</h4>
                  <p>Optional features</p>
                  {estimate.availableFeatures.length > 0 ? <ul>{estimate.availableFeatures.map((feature) => <li key={feature.id}><X /><span><strong>{feature.label}</strong><small>{feature.detail} · Add-on {formatPrice(feature.price)}</small></span></li>)}</ul> : <p className="scope-empty">All available features are selected.</p>}
                  <p>Optional integrations</p>
                  <ul>{estimate.availableIntegrations.map((item) => <li key={item.id}><X /><span><strong>{item.label}</strong><small>Add-on {formatPrice(item.price)}</small></span></li>)}</ul>
                  <p>Client-paid or out of scope</p>
                  <ul>{estimate.scope.excluded.map((item) => <li key={item}><X /><span>{item}</span></li>)}</ul>
                </div>
              </div>
            </section>
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
