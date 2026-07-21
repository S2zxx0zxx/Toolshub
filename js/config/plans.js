export const PLANS = [
  {
    id: 'free',
    label: 'Free',
    badge: null,
    priceLabel: '₹0',
    periodLabel: '/mo',
    description: 'Basic access to everyday utilities.',
    dailyMessageCap: 15,
    bullets: [
      'Standard AI engine only',
      '15 messages per day',
      'Utilities & Files categories only',
      '7-day chat history'
    ]
  },
  {
    id: 'monthly',
    label: 'Starter',
    badge: null,
    priceLabel: '₹99',
    periodLabel: '/mo',
    description: 'Built for the work you do every single day.',
    dailyMessageCap: Infinity,
    bullets: [
      'Unlimited AI conversations — zero daily caps',
      'Every tool, every mode, fully unlocked',
      'Faster response times across the platform',
      'Your entire history, saved and searchable forever',
      'Direct email support, real humans'
    ]
  },
  {
    id: '6month',
    label: 'Pro',
    badge: 'Popular',
    priceLabel: '₹349',
    periodLabel: ' total',
    description: 'Where most serious users land.',
    originalPriceLabel: '₹894',
    dailyMessageCap: Infinity,
    bullets: [
      'Unlimited conversations + every tool, fully unlocked',
      'All AI models, plus priority processing on every request',
      'Early access to new tools, the moment we ship them',
      'Full history saved forever, backed by priority support',
      '~₹40/month cheaper than paying monthly, zero compromise'
    ]
  },
  {
    id: 'yearly',
    label: 'Max',
    badge: 'Best Value',
    priceLabel: '₹999',
    periodLabel: ' total',
    description: 'For absolute power users.',
    originalPriceLabel: '₹1788',
    dailyMessageCap: Infinity,
    bullets: [
      'Everything in Pro, completely unlocked',
      'Deep Research enabled — our most capable reasoning mode',
      'Highest API priority — jump to the front of every queue',
      'Custom Connectors — bring your own data (coming soon)',
      'Lock in this pricing forever'
    ]
  }
];
