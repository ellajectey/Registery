// ═══════════════════════════════════════════════════════════
//  WEDDING SITE CONFIG
//  Edit this file to customise all content on the site.
// ═══════════════════════════════════════════════════════════

const config = {
  // ── Couple ──────────────────────────────────────────────
  names: {
    partner1: 'Emmanuella',
    partner2: 'Jonathan',
  },

  // ── Event ───────────────────────────────────────────────
  date:            'June 2026',
  weddingDateTime: '2026-06-12T09:00:00', // used for the countdown timer
  venue:           'Accra, Ghana',
  rsvpDeadline:    'April 30th, 2026',

  // ── Contact ─────────────────────────────────────────────
  email: 'jonathangbaja@gmail.com',

  // ── Google Sheets integration ────────────────────────────
  // Paste your Apps Script Web App URL into both fields below.
  // Leave empty to see demo/placeholder data.
  REGISTRY_URL: 'https://script.google.com/macros/s/AKfycbw__O7Tt_Ti2W2SUZb-iyqv-Kl_dvGZCXTtYF9a-zyVPVEmfm97Uzc_4xQO9QdsWVEs/exec',
  RSVP_URL:     'https://script.google.com/macros/s/AKfycbw__O7Tt_Ti2W2SUZb-iyqv-Kl_dvGZCXTtYF9a-zyVPVEmfm97Uzc_4xQO9QdsWVEs/exec',

  // ── Images ──────────────────────────────────────────────
  // Replace these with your own photo URLs, or drop photos into
  // the /public folder and reference them as '/your-photo.jpg'
  heroImage:    '/closeup-casual.jpg',
  heroImage2:    '/couch-cam-1.jpg',
  heroImage3:    '/couch-face-1.jpg',
  heroImage4:    '/couch-face-2-cropped.jpg',
  heroImage5:    '/formal.jpg',
  galleryImage: '/closeup-casual-cropped.jpg',

  // ── Ceremony details cards ───────────────────────────────
  details: [
    { icon: '🥻', label: 'Traditional Wedding',      body: 'Adenta Frafraha', note: '8:00 AM · Closing 11:30 AM' },
    { icon: '🕍', label: 'Church Wedding', body: 'ICGC Holy Ghost Temple',      note: 'Small & Private' },
    { icon: '🥂', label: 'Reception',     body: 'Adenta Frafraha', note: '2:00 PM · Until late evening' },
    { icon: '👗', label: 'Dress Code',    body: 'A touch of purple and/or green',       note: 'We are just glad to see you!' },
  ],

  // ── Our Story ────────────────────────────────────────────
  story: [
    'A match made that felt like coming home. Eight years of adventure, friendship, love and support — we are ready to celebrate with everyone we love and helped to make us happen.',
    'We will be joined at ICGC Holy Ghost Temple — The place where we first met.',
  ],

  // ── Photo band quote ─────────────────────────────────────
  photoBandQuote: '"In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."',
  photoBandAttr:  '— Maya Angelou',

  // ── Payment details (shown in the "Send Money" gift flow) ─
  // Replace placeholders with your real account details
  payment: {
    bank: {
      name:          'Ghana Commercial Bank',       // Bank name
      logo:          '🏦',                          // Replace with bank logo URL if you have one
      accountName:   'Eleanor & James Wedding',
      accountNumber: '1234567890',
      branch:        'Accra Main Branch',
    },
    mobileMoney: {
      provider:    'MTN Mobile Money',             // e.g. MTN, Vodafone, AirtelTigo
      logo:        '📱',                           // Replace with provider logo URL if you have one
      number:      '024 000 0000',
      accountName: 'Eleanor Mensah',
    },
    referenceFormat: 'Use your name + item ID as reference (e.g. "John Smith – EJ-001")',
  },

  // ── Meal options ─────────────────────────────────────────
  mealOptions: [
    'Intercontinental — Rice Dishes with Salads',
    'Ghanaian Cuisine — Kenke, Banku, Fufu + Light/Groundnut Soup',
    'Nigerian Cuisine — Pounded Yam/Amala + Egusi Soup',
    'All Combos! — Everything, Everywhere, All at once',
  ],
}

export default config
