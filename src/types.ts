export type Currency = 'UZS' | 'USD' | 'EUR' | 'RUB';

export type Language = 'uz' | 'ru' | 'en';

export type ServiceTab = 'avia' | 'countries' | 'hotel' | 'train' | 'impressions' | 'favorites';

export type ThemeMode = 'light' | 'dark';

export type AdminTab = 'overview' | 'flights' | 'bookings' | 'trains_hotels' | 'settings';

export type SortMode = 'cheapest' | 'fastest' | 'recommended';

export type CabinClass = 'econ' | 'biz';

export interface Airport {
  city: string;
  code: string;
  country: string;
  flag: string;
  name: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  direct: boolean;
  transitCity?: string;
  basePriceUZS: number;
  aircraft: string;
  baggage: string;
  seatsRemaining: number;
  featuredTag?: string;
  originalPriceUZS?: number;
  discountPercent?: number;
  savedAmountUZS?: number;
  isFamilyBundle?: boolean;
  familyBundleCount?: number;
  discountType?: 'account_loyalty' | 'round_trip' | 'international' | 'family_bundle' | 'combo';
  discountLabel?: string;
  isRoundTrip?: boolean;
  isInternational?: boolean;
}

export interface Seat {
  id: string; // e.g. "1A"
  row: number;
  letter: string;
  isBusiness: boolean;
  isWindow: boolean;
  isAisle: boolean;
  isOccupied: boolean;
  priceModifierUZS: number;
}

export interface Booking {
  id: string;
  pnr: string;
  ticketNumber: string;
  passengerName: string;
  passportId: string;
  phone: string;
  email: string;
  type: 'flight' | 'train' | 'hotel';
  title: string;
  route: string;
  fromCode: string;
  toCode: string;
  date: string;
  time: string;
  seatNumber: string;
  cabinClass: CabinClass | 'vip' | 'kupe' | 'platskart';
  totalPriceUZS: number;
  createdAt: string;
  expiresAt: string; // 48 hours later
  status: 'active' | 'cancelled' | 'confirmed';
  isRoundTrip?: boolean;
  returnDate?: string;
  passengersCount?: number;
  originalPriceUZS?: number;
  discountPercent?: number;
  savedAmountUZS?: number;
  discountLabel?: string;
}

export interface TrainInteriorPhoto {
  title: string;
  image: string;
  tag: string;
  description?: string;
}

export interface TrainStop {
  station: string;
  arrival: string;
  departure: string;
  stopDuration: string;
}

export interface Train {
  id: string;
  name: string; // e.g. "Afrosiyob #762"
  type: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  priceVipUZS: number;
  priceBizUZS: number;
  priceKupeUZS: number;
  pricePlatskartUZS: number;
  availableSeats: number;
  category?: 'domestic' | 'international';
  country?: string;
  flag?: string;
  image?: string;
  interiorImages?: TrainInteriorPhoto[];
  speed?: string;
  manufacturer?: string;
  description?: string;
  stops?: TrainStop[];
  amenities?: string[];
  luggagePolicy?: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  bedType: string;
  sizeSqM: number;
  maxGuests: number;
  priceUZS: number;
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  amenities: string[];
  image?: string;
  roomFeatures?: string[];
}

export interface HotelReview {
  id: string;
  author: string;
  city: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
  userBadge?: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  region?: 'uzbekistan' | 'uae' | 'turkey' | 'saudi' | 'europe' | 'asia' | 'tropical' | 'usa';
  stars: number;
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages?: string[];
  pricePerNightUZS: number;
  amenities: string[];
  distanceToCenter: string;
  address?: string;
  description?: string;
  featuredBadge?: string;
  rooms?: HotelRoom[];
  reviews?: HotelReview[];
  ratingBreakdown?: {
    cleanliness: number;
    service: number;
    comfort: number;
    location: number;
    valueForMoney: number;
  };
  checkInTime?: string;
  checkOutTime?: string;
}

export interface DestinationCard {
  id: string;
  city: string;
  country: string;
  flag: string;
  code: string;
  image: string;
  lowestPriceUZS: number;
  badge?: string;
}

export interface FlightStatus {
  flightNumber: string;
  airline: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  estimatedArrival: string;
  status: 'Havoda (In Flight)' | 'Qo\'ndi (Landed)' | 'Reysga Tayyorlanmoqda (Scheduled)' | 'Kechikmoqda (Delayed)';
  statusColor: string;
  altitude: string;
  speed: string;
  progressPercent: number;
  aircraft: string;
}
