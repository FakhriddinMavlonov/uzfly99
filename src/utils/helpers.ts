import { Currency, Language, Booking, Flight, Train, Hotel } from '../types';
import { MOCK_FLIGHTS, MOCK_TRAINS, MOCK_HOTELS } from '../data/mockData';

export const DEFAULT_CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; suffix: boolean }> = {
  UZS: { rate: 1, symbol: "so'm", suffix: true },
  USD: { rate: 12800, symbol: '$', suffix: false },
  EUR: { rate: 13900, symbol: '€', suffix: false },
  RUB: { rate: 140, symbol: '₽', suffix: true },
};

const CURRENCY_STORAGE_KEY = 'uzfly_currency_rates';

export function getStoredCurrencyRates(): Record<Currency, { rate: number; symbol: string; suffix: boolean }> {
  try {
    const data = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (data) return { ...DEFAULT_CURRENCY_RATES, ...JSON.parse(data) };
  } catch {}
  return DEFAULT_CURRENCY_RATES;
}

export function saveStoredCurrencyRates(rates: Record<Currency, { rate: number; symbol: string; suffix: boolean }>) {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(rates));
  } catch {}
}

export let CURRENCY_RATES = getStoredCurrencyRates();

export function formatPrice(amountUZS: number, currency: Currency): string {
  const currentRates = getStoredCurrencyRates();
  const { rate, symbol, suffix } = currentRates[currency] || DEFAULT_CURRENCY_RATES[currency];
  const converted = amountUZS / rate;

  let formatted = '';
  if (currency === 'UZS') {
    formatted = Math.round(converted).toLocaleString('ru-RU').replace(/,/g, ' ');
  } else if (currency === 'USD' || currency === 'EUR') {
    formatted = Math.round(converted).toLocaleString('en-US');
  } else {
    formatted = Math.round(converted).toLocaleString('ru-RU').replace(/,/g, ' ');
  }

  return suffix ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

export function generatePNR(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = 'UZ';
  for (let i = 0; i < 4; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

export function generateTicketNumber(): string {
  const num = Math.floor(1000000000 + Math.random() * 9000000000);
  return `250-${num.toString().substring(0, 4)}-${num.toString().substring(4)}`;
}

const STORAGE_KEY = 'uzfly_user_bookings';
const USER_KEY = 'uzfly_user_profile';
const THEME_KEY = 'uzfly_theme_mode';
const FLIGHTS_KEY = 'uzfly_custom_flights';
const TRAINS_KEY = 'uzfly_custom_trains_v4';
const HOTELS_KEY = 'uzfly_custom_hotels';

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {}
}

export function getStoredBookings(): Booking[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveStoredBooking(booking: Booking): Booking[] {
  const existing = getStoredBookings();
  const updated = [booking, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Storage save error', e);
  }
  return updated;
}

export function updateStoredBookingStatus(id: string, status: 'active' | 'cancelled' | 'confirmed'): Booking[] {
  const existing = getStoredBookings();
  const updated = existing.map((b) => (b.id === id ? { ...b, status } : b));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Storage update status error', e);
  }
  return updated;
}

export function deleteStoredBooking(id: string): Booking[] {
  const existing = getStoredBookings();
  const updated = existing.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Storage delete error', e);
  }
  return updated;
}

export function cancelStoredBooking(id: string): Booking[] {
  return updateStoredBookingStatus(id, 'cancelled');
}

export function getStoredFlights(): Flight[] {
  try {
    const data = localStorage.getItem(FLIGHTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return MOCK_FLIGHTS;
}

export function saveStoredFlights(flights: Flight[]) {
  try {
    localStorage.setItem(FLIGHTS_KEY, JSON.stringify(flights));
  } catch (e) {
    console.error('Storage save flights error', e);
  }
}

export function resetStoredFlights(): Flight[] {
  try {
    localStorage.removeItem(FLIGHTS_KEY);
  } catch {}
  return MOCK_FLIGHTS;
}

export function getStoredTrains(): Train[] {
  try {
    const data = localStorage.getItem(TRAINS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= MOCK_TRAINS.length && parsed[0]?.interiorImages) return parsed;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((p: Train) => p.id));
        const missingFromMock = MOCK_TRAINS.filter((t) => !existingIds.has(t.id));
        const merged = [...parsed, ...missingFromMock];
        localStorage.setItem(TRAINS_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {}
  return MOCK_TRAINS;
}

export function saveStoredTrains(trains: Train[]) {
  try {
    localStorage.setItem(TRAINS_KEY, JSON.stringify(trains));
  } catch {}
}

export function getStoredHotels(): Hotel[] {
  try {
    const data = localStorage.getItem(HOTELS_KEY);
    if (data) {
      const parsed: Hotel[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing hotels from MOCK_HOTELS by ID
        const existingIds = new Set(parsed.map((h) => h.id));
        const missing = MOCK_HOTELS.filter((h) => !existingIds.has(h.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          saveStoredHotels(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch {}
  return MOCK_HOTELS;
}

export function saveStoredHotels(hotels: Hotel[]) {
  try {
    localStorage.setItem(HOTELS_KEY, JSON.stringify(hotels));
  } catch {}
}

export interface UserProfile {
  fullName: string;
  passportId: string;
  phone: string;
  email: string;
  role?: 'user' | 'admin';
  isAdmin?: boolean;
  totalTicketsBought?: number;
  loyaltyTier?: 'standard' | 'bronze_10' | 'silver_15' | 'gold_20';
  loyaltyDiscountPercent?: number;
  registeredAt?: string;
}

export interface DiscountDetails {
  isRegistered: boolean;
  totalTicketsCount: number;
  pastTicketsCount: number;
  currentTicketsCount: number;
  isRoundTrip: boolean;
  isInternational: boolean;
  isFamilyBundle: boolean;
  discountPercent: number; // e.g. 10, 15, 20, 50
  discountType: 'family_bundle' | 'round_trip' | 'international' | 'account_loyalty' | 'combo' | 'none';
  discountLabel: string;
  discountBadges: string[];
  explanation: string;
  nextTierInfo: {
    nextPercent: number;
    ticketsNeeded: number;
    message: string;
  };
}

export function getUserPastTicketsCount(user: UserProfile | null): number {
  if (!user) return 0;
  const bookings = getStoredBookings();
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const fromBookings = activeBookings.reduce((sum, b) => sum + (b.passengersCount || 1), 0);
  return Math.max(fromBookings, user.totalTicketsBought || 0);
}

export function calculateTripDiscount(params: {
  user: UserProfile | null;
  passengersCount: number;
  isRoundTrip: boolean;
  isInternational: boolean;
  isFamilyBundle?: boolean;
  familyBundleCount?: number;
}): DiscountDetails {
  const { user, passengersCount, isRoundTrip, isInternational } = params;
  const isRegistered = Boolean(user && user.fullName);
  const count = passengersCount || 1;

  return {
    isRegistered,
    totalTicketsCount: count,
    pastTicketsCount: 0,
    currentTicketsCount: count,
    isRoundTrip,
    isInternational,
    isFamilyBundle: false,
    discountPercent: 0,
    discountType: 'none',
    discountLabel: '',
    discountBadges: [],
    explanation: '',
    nextTierInfo: {
      nextPercent: 0,
      ticketsNeeded: 0,
      message: '',
    },
  };
}

const ADMIN_CREDS_KEY = 'uzfly_admin_credentials_v2';
export const DEFAULT_ADMIN_CREDS = {
  login: 'admin',
  password: 'admin777',
  secretCode: 'ADMIN2026',
};

export function getStoredAdminCreds(): { login: string; password: string; secretCode: string } {
  try {
    const data = localStorage.getItem(ADMIN_CREDS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.login && parsed.password) return parsed;
    }
  } catch {}
  return DEFAULT_ADMIN_CREDS;
}

export function saveStoredAdminCreds(creds: { login: string; password: string; secretCode: string }) {
  try {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
  } catch {}
}

export function verifyAdminCredentials(login: string, pass: string): boolean {
  const creds = getStoredAdminCreds();
  return (
    login.trim().toLowerCase() === creds.login.toLowerCase() &&
    pass.trim() === creds.password
  );
}

export function verifyAdminSecretCode(code: string): boolean {
  if (!code) return false;
  const creds = getStoredAdminCreds();
  return (
    code.trim().toUpperCase() === creds.secretCode.toUpperCase() ||
    code.trim() === creds.password
  );
}

export function getStoredUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Storage save user error', e);
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Storage clear user error', e);
  }
}


// Multilingual Dictionaries
export const DICTIONARY = {
  uz: {
    heroTitle: 'Bu yerdan arzon samolyot chiptalarini sotib oling',
    flightsTab: 'Aviachiptalar',
    countriesTab: 'Davlatlar 🇺🇿🇹🇷🇦🇪',
    hotelsTab: 'Mehmonxonalar',
    trainsTab: 'Poyezdlar',
    impressionsTab: 'Taassurotlar',
    favoritesTab: 'Sevimlilar',
    from: 'Qayerdan',
    to: 'Qayerga',
    when: 'Qachon',
    back: 'Orqaga',
    passengersAndClass: "Yo'lovchilar / Klass",
    departureTime: "Jo'nash Soati",
    searchBtn: 'Chiptalarni toping',
    complexRoute: "Murakkab yo'nalish",
    bookingSyncText: 'Booking.com saytini yangi yorliqda oching',
    radarBtn: 'Parvozlar Radari',
    myBookingsBtn: 'Mening Bronlarim',
    profileBtn: 'Profil',
    passengerInfo: "Yo'lovchi",
    support: "Qo'llab-quvvatlash",
    cheapest: '💰 Eng arzon',
    fastest: '⚡ Eng tezkor',
    recommended: '⭐ Tavsiya etilgan',
    calendarTitle: '📅 Narxlar Kalendari — Boshqa kunlardagi eng arzon tariflar',
    officialGuarantee: '✓ Aviasales rasmiy kafolati',
    filters: '🎛️ Filtrlar:',
    allAirlines: 'Barcha aviakompaniyalar',
    allFlights: 'Barcha reyslar (Tranzit va Direct)',
    directOnly: "Faqat To'g'ridan-to'g'ri (Direct)",
    includedTaxes: '✓ Barcha narxlarga soliqlar kiritilgan',
    seatAndBook: "O'rindiq va Bron 💺",
    fast48hBook: '48 Soatlik Bron 🎫',
    countriesTitle: "Borish Mumkin Bo'lgan Davlatlar",
    countriesSubtitle: "Davlat bayrog'ini tanlang — Siz belgilagan vaqtga eng yaqin parvoz topiladi!",
    instantEngine: '⚡ Instant Search Engine',
    destinationsTitle: "Barcha Yo'nalishlar va Shaharlar",
    destinationsSubtitle: "Dunyo va O'zbekistonning barcha yirik shaharlariga eng arzon chiptalar",
    hotDealsTitle: 'Issiq chiptalar',
    hotDealsSubtitle: 'Tez orada uni ajratib olishadi!',
    bakuTitle: 'Boku haqida nima deyish mumkin?',
    popularTitle: "Ommabop yo'nalishlar",
    cookieText: "Biz cookie-fayllar va shunga o'xshash texnologiyalardan foydalanamiz — ularsiz Aviasales shunchaki to'g'ri ishlay olmaydi.",
    cookieAccept: 'Hammasi joyida',
  },
  ru: {
    heroTitle: 'Покупайте дешёвые авиабилеты здесь',
    flightsTab: 'Авиабилеты',
    countriesTab: 'Страны 🇺🇿🇹🇷🇦🇪',
    hotelsTab: 'Отели',
    trainsTab: 'Поезда',
    impressionsTab: 'Впечатления',
    favoritesTab: 'Избранное',
    from: 'Откуда',
    to: 'Куда',
    when: 'Когда',
    back: 'Обратно',
    passengersAndClass: 'Пассажиры / Класс',
    departureTime: 'Время вылета',
    searchBtn: 'Найти билеты',
    complexRoute: 'Сложный маршрут',
    bookingSyncText: 'Открыть Booking.com в новой вкладке',
    radarBtn: 'Радар рейсов',
    myBookingsBtn: 'Мои бронирования',
    profileBtn: 'Профиль',
    passengerInfo: 'Пассажир',
    support: 'Поддержка',
    cheapest: '💰 Самый дешевый',
    fastest: '⚡ Самый быстрый',
    recommended: '⭐ Рекомендуемый',
    calendarTitle: '📅 Календарь цен — лучшие тарифы на соседние даты',
    officialGuarantee: '✓ Официальная гарантия Aviasales',
    filters: '🎛️ Фильтры:',
    allAirlines: 'Все авиакомпании',
    allFlights: 'Все рейсы (с пересадками и прямые)',
    directOnly: 'Только прямые',
    includedTaxes: '✓ Все сборы и налоги включены',
    seatAndBook: 'Место и бронь 💺',
    fast48hBook: 'Бронь на 48 часов 🎫',
    countriesTitle: 'Куда можно полететь',
    countriesSubtitle: 'Выберите флаг страны — ближайший доступный рейс подберется мгновенно!',
    instantEngine: '⚡ Моментальный поиск',
    destinationsTitle: 'Все направления и города',
    destinationsSubtitle: 'Самые выгодные предложения в популярные города',
    hotDealsTitle: 'Горящие билеты',
    hotDealsSubtitle: 'Разберут в любую секунду!',
    bakuTitle: 'Что сказать про Баку?',
    popularTitle: 'Популярные направления',
    cookieText: 'Мы используем cookie-файлы — без них сайт Aviasales просто не сможет нормально работать.',
    cookieAccept: 'Всё в порядке',
  },
  en: {
    heroTitle: 'Buy cheap airline tickets online right here',
    flightsTab: 'Flights',
    countriesTab: 'Countries 🇺🇿🇹🇷🇦🇪',
    hotelsTab: 'Hotels',
    trainsTab: 'Trains',
    impressionsTab: 'Experiences',
    favoritesTab: 'Favorites',
    from: 'From',
    to: 'To',
    when: 'Departure',
    back: 'Return',
    passengersAndClass: 'Passengers / Class',
    departureTime: 'Departure Time',
    searchBtn: 'Find Tickets',
    complexRoute: 'Multi-city route',
    bookingSyncText: 'Open Booking.com in a new tab',
    radarBtn: 'Flight Radar',
    myBookingsBtn: 'My Bookings',
    profileBtn: 'Profile',
    passengerInfo: 'Traveler',
    support: 'Help & Support',
    cheapest: '💰 Cheapest',
    fastest: '⚡ Fastest',
    recommended: '⭐ Recommended',
    calendarTitle: '📅 Low Fare Calendar — Best prices for nearby dates',
    officialGuarantee: '✓ Official Aviasales Guarantee',
    filters: '🎛️ Filters:',
    allAirlines: 'All Airlines',
    allFlights: 'All flights (Transit & Direct)',
    directOnly: 'Direct flights only',
    includedTaxes: '✓ All taxes and airport fees included',
    seatAndBook: 'Select Seat & Book 💺',
    fast48hBook: 'Hold for 48 Hours 🎫',
    countriesTitle: 'Destinations Open For Travel',
    countriesSubtitle: 'Select a country flag to instantly find the nearest matching flights!',
    instantEngine: '⚡ Instant Search Engine',
    destinationsTitle: 'All Destinations & Cities',
    destinationsSubtitle: 'Lowest flight prices across Uzbekistan and top global hubs',
    hotDealsTitle: 'Hot Deals',
    hotDealsSubtitle: 'Hurry up, limited seats remaining!',
    bakuTitle: 'What to explore in Baku?',
    popularTitle: 'Popular Destinations',
    cookieText: 'We use cookies and similar technologies to ensure the Aviasales platform functions seamlessly.',
    cookieAccept: 'Got it, all good',
  }
};
