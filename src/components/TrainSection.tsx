import React, { useState, useMemo, useEffect } from 'react';
import {
  Train as TrainIcon,
  Clock,
  Zap,
  ShieldCheck,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  Coffee,
  Wifi,
  Wind,
  Phone,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  X,
  Globe2,
  MapPin,
  Luggage,
  Award,
  Info,
  ExternalLink,
  ChevronRight,
  Eye,
  Ticket,
  QrCode,
  Printer,
  Download,
  User,
  Share2,
  Shield,
  FileText,
  AlertCircle,
  Gift,
} from 'lucide-react';
import { MOCK_TRAINS } from '../data/mockData';
import { Train, Currency, Language, TrainInteriorPhoto } from '../types';
import { formatPrice, calculateTripDiscount, UserProfile } from '../utils/helpers';
import { CustomSelect } from './ui/CustomSelect';
import { TrainSeatMapModal } from './TrainSeatMapModal';

interface TrainSectionProps {
  currency: Currency;
  language: Language;
  trains?: Train[];
  userProfile?: UserProfile | null;
  onOpenAuth?: () => void;
  onBookTrain: (
    train: Train,
    classType: 'vip' | 'biz' | 'kupe' | 'platskart',
    priceUZS: number,
    chosenDate?: string,
    chosenSeat?: string,
    isRoundTrip?: boolean,
    passengersCount?: number,
    discountDetails?: {
      originalPriceUZS?: number;
      discountPercent?: number;
      savedAmountUZS?: number;
      discountLabel?: string;
    }
  ) => void;
}

const TRAIN_STATIONS = [
  { value: 'Barchasi', label: 'Barcha vokzallar (Barcha yo‘nalishlar)', icon: '🌍', badge: 'ALL' },
  // O'zbekiston
  { value: 'Toshkent', label: 'Toshkent (Barcha vokzallar)', icon: '🚆', badge: 'TAS' },
  { value: 'Toshkent (Shimoliy Vokzal)', label: 'Toshkent (Shimoliy Vokzal)', icon: '🚆', badge: 'TAS-N' },
  { value: 'Toshkent (Janubiy Vokzal)', label: 'Toshkent (Janubiy Vokzal)', icon: '🚆', badge: 'TAS-S' },
  { value: 'Samarqand', label: 'Samarqand Vokzali', icon: '🏛️', badge: 'SKD' },
  { value: 'Buxoro 1 (Kogon)', label: 'Buxoro 1 (Kogon Vokzali)', icon: '🕌', badge: 'BHK' },
  { value: 'Qarshi', label: 'Qarshi Vokzali', icon: '🚆', badge: 'KSQ' },
  { value: 'Navoiy', label: 'Navoiy Vokzali', icon: '🏭', badge: 'NVI' },
  { value: 'Urganch', label: 'Urganch / Xiva Vokzali', icon: '🏰', badge: 'UGC' },
  { value: 'Andijon', label: 'Andijon Vokzali', icon: '🌄', badge: 'AZN' },
  { value: 'Termiz', label: 'Termiz Vokzali', icon: '🌴', badge: 'TMZ' },
  // Yevropa
  { value: 'London', label: 'London (St Pancras International, Buyuk Britaniya)', icon: '🇬🇧', badge: 'LON' },
  { value: 'Parij', label: 'Parij (Gare du Nord / Gare de Lyon, Fransiya)', icon: '🇫🇷', badge: 'PAR' },
  { value: 'Marsel', label: 'Marsel (Marseille Saint-Charles, Fransiya)', icon: '🇫🇷', badge: 'MRS' },
  { value: 'Berlin', label: 'Berlin (Berlin Hbf, Germaniya)', icon: '🇩🇪', badge: 'BER' },
  { value: 'Myunxen', label: 'Myunxen (München Hbf, Germaniya)', icon: '🇩🇪', badge: 'MUC' },
  { value: 'Rim', label: 'Rim (Roma Termini, Italiya)', icon: '🇮🇹', badge: 'ROM' },
  { value: 'Milan', label: 'Milan (Milano Centrale, Italiya)', icon: '🇮🇹', badge: 'MIL' },
  { value: 'Syurix', label: 'Syurix (Zürich HB, Shveysariya)', icon: '🇨🇭', badge: 'ZRH' },
  { value: 'Zermatt', label: 'Zermatt (Matterhorn Terminal, Shveysariya)', icon: '🇨🇭', badge: 'ZMT' },
  { value: 'Madrid', label: 'Madrid (Puerta de Atocha, Ispaniya)', icon: '🇪🇸', badge: 'MAD' },
  { value: 'Barselona', label: 'Barselona (Barcelona Sants, Ispaniya)', icon: '🇪🇸', badge: 'BCN' },
  // Osiyo & Yaqin Sharq
  { value: 'Tokio', label: 'Tokio (Tokyo Central Station, Yaponiya)', icon: '🇯🇵', badge: 'TYO' },
  { value: 'Kioto', label: 'Kioto (Kyoto Station, Yaponiya)', icon: '🇯🇵', badge: 'UKY' },
  { value: 'Pekin', label: 'Pekin (Beijing South, Xitoy)', icon: '🇨🇳', badge: 'PEK' },
  { value: 'Shanxay', label: 'Shanxay (Shanghai Hongqiao, Xitoy)', icon: '🇨🇳', badge: 'SHA' },
  { value: 'Seul', label: 'Seul (Seoul Station, Janubiy Koreya)', icon: '🇰🇷', badge: 'SEL' },
  { value: 'Pusan', label: 'Pusan (Busan Station, Janubiy Koreya)', icon: '🇰🇷', badge: 'PUS' },
  { value: 'Makka', label: 'Makka (Makkah Station, Saudiya)', icon: '🇸🇦', badge: 'QMK' },
  { value: 'Madina', label: 'Madina (Madinah Station, Saudiya)', icon: '🇸🇦', badge: 'MED' },
  { value: 'Dubay', label: 'Dubay (Al Jaddaf, BAA)', icon: '🇦🇪', badge: 'DXB' },
  { value: 'Abu-Dabi', label: 'Abu-Dabi (Abu Dhabi Central, BAA)', icon: '🇦🇪', badge: 'AUH' },
  { value: 'Istanbul', label: 'Istanbul (Söğütlüçeşme, Turkiya)', icon: '🇹🇷', badge: 'IST' },
  { value: 'Anqara', label: 'Anqara (Ankara YHT Garı, Turkiya)', icon: '🇹🇷', badge: 'ANK' },
  // Amerika
  { value: 'Nyu-York', label: 'Nyu-York (Penn Station / Moynihan, AQSH)', icon: '🇺🇸', badge: 'NYC' },
  { value: 'Vashington', label: 'Vashington (Union Station, AQSH)', icon: '🇺🇸', badge: 'WAS' },
  // Markaziy Osiyo & Xalqaro
  { value: 'Olmaota', label: 'Olmaota (Almaty-2, Qozog‘iston)', icon: '🇰🇿', badge: 'ALA' },
  { value: 'Moskva', label: 'Moskva (Paveletskiy Vokzali, Rossiya)', icon: '🇷🇺', badge: 'MOW' },
  { value: 'Dushanbe', label: 'Dushanbe Vokzali (Tojikiston)', icon: '🇹🇯', badge: 'DYU' },
];

export const TrainSection: React.FC<TrainSectionProps> = ({
  currency,
  language,
  trains,
  onBookTrain,
  userProfile,
  onOpenAuth,
}) => {
  const [trainFrom, setTrainFrom] = useState('Toshkent (Shimoliy Vokzal)');
  const [trainTo, setTrainTo] = useState('Samarqand');
  const [travelDate, setTravelDate] = useState('2026-09-24');
  const [trainReturnDate, setTrainReturnDate] = useState('');
  const [trainPassengers, setTrainPassengers] = useState(1);
  const [regionFilter, setRegionFilter] = useState<'all' | 'domestic' | 'europe' | 'asia_world' | 'international'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'afrosiyob' | 'international' | 'overnight'>('all');
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'earliest'>('cheapest');

  // Check if international train route or region
  const isCurrentTrainRouteInternational = useMemo(() => {
    if (regionFilter === 'europe' || regionFilter === 'asia_world' || regionFilter === 'international') return true;
    const intlStations = ['London', 'Parij', 'Marsel', 'Berlin', 'Myunxen', 'Rim', 'Milan', 'Syurix', 'Zermatt', 'Madrid', 'Barselona', 'Tokio', 'Kioto', 'Pekin', 'Shanxay', 'Seul', 'Pusan', 'Makka', 'Madina', 'Dubay', 'Abu-Dabi', 'Istanbul', 'Anqara', 'Nyu-York', 'Vashington', 'Olmaota', 'Moskva', 'Dushanbe'];
    return intlStations.some((s) => trainFrom.includes(s) || trainTo.includes(s));
  }, [regionFilter, trainFrom, trainTo]);

  const isTrainRoundTrip = Boolean(trainReturnDate && trainReturnDate.trim() !== '');

  // Dynamic Discount Engine for Train Bookings
  const trainDiscount = useMemo(() => {
    return calculateTripDiscount({
      user: userProfile || null,
      passengersCount: trainPassengers,
      isRoundTrip: isTrainRoundTrip,
      isInternational: isCurrentTrainRouteInternational,
    });
  }, [userProfile, trainPassengers, isTrainRoundTrip, isCurrentTrainRouteInternational]);

  // Expanded train ID for showing inside view (Exterior + Salon photos + Details + Ticket Detail)
  const [expandedTrainId, setExpandedTrainId] = useState<string | null>(null);

  // Active selected interior photo for each train
  const [selectedSalonPhoto, setSelectedSalonPhoto] = useState<{ [trainId: string]: number }>({});

  // Active selected class for inline ticket detail view
  const [inlineTicketClass, setInlineTicketClass] = useState<{ [trainId: string]: 'vip' | 'biz' | 'kupe' | 'platskart' }>({});

  // Fullscreen Lightbox preview state
  const [lightboxImage, setLightboxImage] = useState<{
    title: string;
    image: string;
    tag?: string;
    description?: string;
  } | null>(null);

  // Ticket Detail Modal state (USER REQ: Ticket detail qismini full ekran qilib ochilsin)
  const [ticketDetailModalTrain, setTicketDetailModalTrain] = useState<Train | null>(null);
  const [ticketDetailModalClass, setTicketDetailModalClass] = useState<'vip' | 'biz' | 'kupe' | 'platskart'>('biz');
  const [isTicketDetailModalFullscreen, setIsTicketDetailModalFullscreen] = useState(true);

  // Train Seat Map Modal state (USER REQ: o'rindiqni tanlash imkoniyatini qo'sh)
  const [seatModalTrain, setSeatModalTrain] = useState<Train | null>(null);
  const [seatModalClass, setSeatModalClass] = useState<'vip' | 'biz' | 'kupe' | 'platskart'>('biz');
  const [customSelectedSeats, setCustomSelectedSeats] = useState<{ [trainId: string]: string }>({});

  const sourceTrains = trains && trains.length > 0 ? trains : MOCK_TRAINS;

  // Swap stations
  const handleSwapStations = () => {
    const temp = trainFrom;
    setTrainFrom(trainTo);
    setTrainTo(temp);
  };

  // Helper to extract clean city key for matching
  const extractCity = (station: string): string => {
    const s = station.toLowerCase();
    if (s.includes('toshkent')) return 'toshkent';
    if (s.includes('samarqand')) return 'samarqand';
    if (s.includes('buxoro')) return 'buxoro';
    if (s.includes('qarshi')) return 'qarshi';
    if (s.includes('navoiy')) return 'navoiy';
    if (s.includes('urganch') || s.includes('xiva')) return 'urganch';
    if (s.includes('andijon')) return 'andijon';
    if (s.includes('termiz')) return 'termiz';
    if (s.includes('london')) return 'london';
    if (s.includes('parij') || s.includes('paris')) return 'parij';
    if (s.includes('marsel') || s.includes('marseille')) return 'marsel';
    if (s.includes('berlin')) return 'berlin';
    if (s.includes('myunxen') || s.includes('munich')) return 'myunxen';
    if (s.includes('rim') || s.includes('rome')) return 'rim';
    if (s.includes('milan')) return 'milan';
    if (s.includes('syurix') || s.includes('zurich')) return 'syurix';
    if (s.includes('zermatt')) return 'zermatt';
    if (s.includes('madrid')) return 'madrid';
    if (s.includes('barselona') || s.includes('barcelona')) return 'barselona';
    if (s.includes('tokio') || s.includes('tokyo')) return 'tokio';
    if (s.includes('kioto') || s.includes('kyoto')) return 'kioto';
    if (s.includes('pekin') || s.includes('beijing')) return 'pekin';
    if (s.includes('shanxay') || s.includes('shanghai')) return 'shanxay';
    if (s.includes('seul') || s.includes('seoul')) return 'seul';
    if (s.includes('pusan') || s.includes('busan')) return 'pusan';
    if (s.includes('makka') || s.includes('makkah')) return 'makka';
    if (s.includes('madina') || s.includes('madinah')) return 'madina';
    if (s.includes('dubay') || s.includes('dubai')) return 'dubay';
    if (s.includes('abu-dabi') || s.includes('abu dhabi')) return 'abu-dabi';
    if (s.includes('istanbul')) return 'istanbul';
    if (s.includes('anqara') || s.includes('ankara')) return 'anqara';
    if (s.includes('nyu-york') || s.includes('new york')) return 'nyu-york';
    if (s.includes('vashington') || s.includes('washington')) return 'vashington';
    if (s.includes('olmaota') || s.includes('almaty')) return 'olmaota';
    if (s.includes('moskva') || s.includes('moscow')) return 'moskva';
    if (s.includes('dushanbe')) return 'dushanbe';
    return s.split(' ')[0] || '';
  };

  // Filtered & Sorted Trains
  const filteredTrains = useMemo(() => {
    const fromKey = extractCity(trainFrom);
    const toKey = extractCity(trainTo);

    let result = sourceTrains.filter((t) => {
      // 1. Region filter
      if (regionFilter === 'domestic' && t.category === 'international') return false;
      if (regionFilter === 'international' && t.category !== 'international') return false;
      if (regionFilter === 'europe') {
        const europeCountries = ['Buyuk Britaniya', 'Fransiya', 'Germaniya', 'Italiya', 'Shveysariya', 'Ispaniya'];
        const matchesEurope = europeCountries.some((c) => (t.country || '').includes(c));
        if (!matchesEurope) return false;
      }
      if (regionFilter === 'asia_world') {
        const asiaWorld = ['Yaponiya', 'Xitoy', 'Janubiy Koreya', 'Saudiya Arabistoni', 'BAA', 'Turkiya', 'AQSH', "Qozog'iston", 'Rossiya', 'Tojikiston'];
        const matchesAsiaWorld = asiaWorld.some((c) => (t.country || '').includes(c));
        if (!matchesAsiaWorld) return false;
      }

      // 2. Station matching
      const trainFromKey = extractCity(t.fromCity);
      const trainToKey = extractCity(t.toCity);

      const matchesFrom = trainFrom === 'Barchasi' || trainFromKey.includes(fromKey) || fromKey.includes(trainFromKey);
      const matchesTo = trainTo === 'Barchasi' || trainToKey.includes(toKey) || toKey.includes(trainToKey);

      if (!matchesFrom || !matchesTo) return false;

      // 3. Train type filter
      if (selectedTypeFilter === 'afrosiyob') {
        return t.name.toLowerCase().includes('afrosiyob');
      }
      if (selectedTypeFilter === 'international') {
        return t.category === 'international';
      }
      if (selectedTypeFilter === 'overnight') {
        return t.type.toLowerCase().includes('tungi') || t.name.toLowerCase().includes('xiva') || t.name.toLowerCase().includes('surxon');
      }

      return true;
    });

    // Sorting
    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.pricePlatskartUZS - b.pricePlatskartUZS);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => {
        const getMins = (dur: string) => {
          const parts = dur.match(/\d+/g);
          if (!parts) return 999;
          const h = parseInt(parts[0] || '0', 10);
          const m = parseInt(parts[1] || '0', 10);
          return h * 60 + m;
        };
        return getMins(a.duration) - getMins(b.duration);
      });
    } else if (sortBy === 'earliest') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    return result;
  }, [sourceTrains, trainFrom, trainTo, regionFilter, selectedTypeFilter, sortBy]);

  // Quick route shortcut click
  const handleQuickRoute = (from: string, to: string, reg?: 'domestic' | 'international') => {
    setTrainFrom(from);
    setTrainTo(to);
    if (reg) setRegionFilter(reg);
  };

  // Toggle train inside details
  const toggleTrainInside = (trainId: string) => {
    if (expandedTrainId === trainId) {
      setExpandedTrainId(null);
    } else {
      setExpandedTrainId(trainId);
      // default to first salon photo if not set
      if (selectedSalonPhoto[trainId] === undefined) {
        setSelectedSalonPhoto((prev) => ({ ...prev, [trainId]: 0 }));
      }
      // default inline ticket class to 'biz' if not set
      if (inlineTicketClass[trainId] === undefined) {
        setInlineTicketClass((prev) => ({ ...prev, [trainId]: 'biz' }));
      }
    }
  };

  // Helper to get class price
  const getClassPrice = (train: Train, cType: 'vip' | 'biz' | 'kupe' | 'platskart'): number => {
    switch (cType) {
      case 'vip':
        return train.priceVipUZS;
      case 'biz':
        return train.priceBizUZS;
      case 'kupe':
        return train.priceKupeUZS;
      case 'platskart':
        return train.pricePlatskartUZS;
      default:
        return train.priceBizUZS;
    }
  };

  // Helper for seat and wagon label
  const getWagonAndSeatInfo = (cType: 'vip' | 'biz' | 'kupe' | 'platskart') => {
    switch (cType) {
      case 'vip':
        return {
          wagon: '01',
          seat: '06',
          label: 'Vagon 01 (VIP), O‘rindiq 06',
          position: 'Deraza oldi, 2x1 qulay charm kreslo',
          amenities: "Issiq taom, qahva/choy, shaxsiy audio-video tizimi, ko'rpa-to'shak",
        };
      case 'biz':
        return {
          wagon: '02',
          seat: '14',
          label: 'Vagon 02 (Biznes), O‘rindiq 14',
          position: 'Deraza oldi, 2x2 ergonomik kreslo',
          amenities: "Choy/qahva, 220V/USB quvvatlagich, keng stolcha, bepul Wi-Fi",
        };
      case 'kupe':
        return {
          wagon: '05',
          seat: '22',
          label: 'Vagon 05 (Kupe), O‘rindiq 22',
          position: 'Pastki qulay o‘rindiq (Yopiq 4 kishilik xona)',
          amenities: "Toza choyshab komplekti, shaxsiy chiroq, konditsioner, yuk bo'limi",
        };
      case 'platskart':
        return {
          wagon: '08',
          seat: '35',
          label: 'Vagon 08 (Platskart), O‘rindiq 35',
          position: 'Pastki o‘rindiq, markaziy salon',
          amenities: "Toza yotoq to'plami, markaziy sovitish/isitish, biohojatxona",
        };
    }
  };

  // Station Code generator
  const getStationCode = (city: string): string => {
    const c = city.toLowerCase();
    if (c.includes('toshkent')) return 'TAS';
    if (c.includes('samarqand')) return 'SKD';
    if (c.includes('buxoro')) return 'BHK';
    if (c.includes('qarshi')) return 'KSQ';
    if (c.includes('navoiy')) return 'NVI';
    if (c.includes('urganch') || c.includes('xiva')) return 'UGC';
    if (c.includes('andijon')) return 'AZN';
    if (c.includes('termiz')) return 'TMZ';
    if (c.includes('london')) return 'LON';
    if (c.includes('parij')) return 'PAR';
    if (c.includes('marsel')) return 'MRS';
    if (c.includes('berlin')) return 'BER';
    if (c.includes('myunxen')) return 'MUC';
    if (c.includes('rim')) return 'ROM';
    if (c.includes('milan')) return 'MIL';
    if (c.includes('syurix')) return 'ZRH';
    if (c.includes('zermatt')) return 'ZMT';
    if (c.includes('madrid')) return 'MAD';
    if (c.includes('barselona')) return 'BCN';
    if (c.includes('tokio')) return 'TYO';
    if (c.includes('kioto')) return 'UKY';
    if (c.includes('pekin')) return 'PEK';
    if (c.includes('shanxay')) return 'SHA';
    if (c.includes('seul')) return 'SEL';
    if (c.includes('pusan')) return 'PUS';
    if (c.includes('makka')) return 'QMK';
    if (c.includes('madina')) return 'MED';
    if (c.includes('dubay')) return 'DXB';
    if (c.includes('abu-dabi')) return 'AUH';
    if (c.includes('istanbul')) return 'IST';
    if (c.includes('anqara')) return 'ANK';
    if (c.includes('nyu-york')) return 'NYC';
    if (c.includes('vashington')) return 'WAS';
    if (c.includes('olmaota')) return 'ALA';
    if (c.includes('moskva')) return 'MOW';
    if (c.includes('dushanbe')) return 'DYU';
    return 'RAIL';
  };

  return (
    <div className="space-y-6">
      {/* Train Search Hero Card */}
      <div className="bg-white dark:bg-[#111c35] p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md shadow-rose-500/25">
                <TrainIcon className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Poyezd Reyslari: O'zbekiston & Butun Dunyo</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Afrosiyob, Eurostar, Shinkansen, TGV, ICE, Frecciarossa, Fuxing, KTX va Haramain tezyurarlariga rasmiy chiptalar
                </p>
              </div>
            </div>
          </div>

          {/* Region Tabs (O'zbekiston vs Yevropa vs Osiyo & Dunyo vs Barchasi) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setRegionFilter('all');
                setTrainFrom('Barchasi');
                setTrainTo('Barchasi');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                regionFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🌍</span>
              <span>Barchasi (Dunyo)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('domestic');
                setTrainFrom('Toshkent (Shimoliy Vokzal)');
                setTrainTo('Samarqand');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                regionFilter === 'domestic'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇺🇿</span>
              <span>O'zbekiston</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('europe');
                setTrainFrom('Barchasi');
                setTrainTo('Barchasi');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                regionFilter === 'europe'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇪🇺</span>
              <span>Yevropa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('asia_world');
                setTrainFrom('Barchasi');
                setTrainTo('Barchasi');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                regionFilter === 'asia_world'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🌏</span>
              <span>Osiyo & Amerika</span>
            </button>
          </div>
        </div>

        {/* Quick Popular Route Pills Across the World */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Dunyo yo'nalishlari:</span>
          </span>
          {[
            { label: '🇺🇿 Toshkent ➔ Samarqand', from: 'Toshkent (Shimoliy Vokzal)', to: 'Samarqand', reg: 'domestic' as const },
            { label: '🇺🇿 Toshkent ➔ Buxoro', from: 'Toshkent (Shimoliy Vokzal)', to: 'Buxoro 1 (Kogon)', reg: 'domestic' as const },
            { label: '🇬🇧 🇫🇷 London ➔ Parij (Eurostar)', from: 'London', to: 'Parij', reg: 'europe' as const },
            { label: '🇯🇵 Tokio ➔ Kioto (Shinkansen)', from: 'Tokio', to: 'Kioto', reg: 'asia_world' as const },
            { label: '🇫🇷 Parij ➔ Marsel (TGV)', from: 'Parij', to: 'Marsel', reg: 'europe' as const },
            { label: '🇨🇭 Syurix ➔ Zermatt (Glacier)', from: 'Syurix', to: 'Zermatt', reg: 'europe' as const },
            { label: '🇩🇪 Berlin ➔ Myunxen (ICE)', from: 'Berlin', to: 'Myunxen', reg: 'europe' as const },
            { label: '🇮🇹 Rim ➔ Milan (Freccia)', from: 'Rim', to: 'Milan', reg: 'europe' as const },
            { label: '🇪🇸 Madrid ➔ Barselona (AVE)', from: 'Madrid', to: 'Barselona', reg: 'europe' as const },
            { label: '🇨🇳 Pekin ➔ Shanxay (Fuxing)', from: 'Pekin', to: 'Shanxay', reg: 'asia_world' as const },
            { label: '🇸🇦 Makka ➔ Madina (Haramain)', from: 'Makka', to: 'Madina', reg: 'asia_world' as const },
            { label: '🇺🇸 Nyu-York ➔ Vashington (Acela)', from: 'Nyu-York', to: 'Vashington', reg: 'asia_world' as const },
            { label: '🇰🇷 Seul ➔ Pusan (KTX)', from: 'Seul', to: 'Pusan', reg: 'asia_world' as const },
            { label: '🇦🇪 Dubay ➔ Abu-Dabi (Etihad)', from: 'Dubay', to: 'Abu-Dabi', reg: 'asia_world' as const },
            { label: '🇹🇷 Istanbul ➔ Anqara (YHT)', from: 'Istanbul', to: 'Anqara', reg: 'asia_world' as const },
            { label: '🇺🇿 Toshkent ➔ Xiva (Jaloliddin)', from: 'Toshkent (Janubiy Vokzal)', to: 'Urganch', reg: 'domestic' as const },
            { label: '🇺🇿 Toshkent ➔ Andijon (Vodiy)', from: 'Toshkent (Shimoliy Vokzal)', to: 'Andijon', reg: 'domestic' as const },
            { label: '🇰🇿 Toshkent ➔ Olmaota (Talgo)', from: 'Toshkent (Shimoliy Vokzal)', to: 'Olmaota', reg: 'international' as const },
            { label: '🇷🇺 Toshkent ➔ Moskva (Ekspress)', from: 'Toshkent (Shimoliy Vokzal)', to: 'Moskva', reg: 'international' as const },
          ].map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickRoute(pill.from, pill.to, pill.reg as any)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 font-bold whitespace-nowrap transition cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-800 text-[11px]"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Train Search Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* From Station */}
          <div className="md:col-span-3 bg-slate-50 dark:bg-[#0c1427] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CustomSelect
              id="train-from-select"
              label="Qayerdan (Jo'nash Vokzali / Shahar)"
              value={trainFrom}
              onChange={setTrainFrom}
              buttonClassName="bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/80 p-0 font-black text-slate-900 dark:text-white text-sm border-0"
              options={TRAIN_STATIONS}
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwapStations}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition cursor-pointer shadow-sm group"
              title="Vokzallarni almashtirish"
            >
              <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* To Station */}
          <div className="md:col-span-3 bg-slate-50 dark:bg-[#0c1427] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CustomSelect
              id="train-to-select"
              label="Qayerga (Yetib Borish Vokzali / Shahar)"
              value={trainTo}
              onChange={setTrainTo}
              buttonClassName="bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/80 p-0 font-black text-slate-900 dark:text-white text-sm border-0"
              options={TRAIN_STATIONS}
            />
          </div>

          {/* Departure Date */}
          <div className="md:col-span-2 bg-slate-50 dark:bg-[#0c1427] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-0.5">
              Jo'nash Sanasi
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
            />
          </div>

          {/* Return Date (Borish-Kelish) */}
          <div className="md:col-span-2 bg-slate-50 dark:bg-[#0c1427] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 relative">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-0.5">
                Qaytish Sanasi
              </label>
              {trainReturnDate ? (
                <span className="text-[9px] font-black px-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  -15% ~ 20%
                </span>
              ) : (
                <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">
                  +Borish-kelish
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={trainReturnDate}
                onChange={(e) => setTrainReturnDate(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
              />
              {trainReturnDate && (
                <button
                  type="button"
                  onClick={() => setTrainReturnDate('')}
                  className="text-slate-400 hover:text-rose-500 text-xs font-bold"
                  title="Qaytish sanasini bekor qilish"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Passengers Counter */}
          <div className="md:col-span-1 bg-slate-50 dark:bg-[#0c1427] p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <label className="block text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 mb-0.5 truncate">
              Yo'lovchi
            </label>
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setTrainPassengers((prev) => Math.max(1, prev - 1))}
                className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-300"
              >
                -
              </button>
              <span className="font-black text-xs text-slate-900 dark:text-white w-4">
                {trainPassengers}
              </span>
              <button
                type="button"
                onClick={() => setTrainPassengers((prev) => Math.min(10, prev + 1))}
                className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Quick Date Shortcuts & Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Quick Date Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Sana:</span>
            {[
              { label: 'Bugun (24-sent)', date: '2026-09-24' },
              { label: 'Ertaga (25-sent)', date: '2026-09-25' },
              { label: 'Indinga (26-sent)', date: '2026-09-26' },
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTravelDate(p.date)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  travelDate === p.date
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedTypeFilter === 'all'
                  ? 'bg-white dark:bg-rose-600 text-rose-600 dark:text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Barchasi
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('afrosiyob')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedTypeFilter === 'afrosiyob'
                  ? 'bg-white dark:bg-rose-600 text-rose-600 dark:text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Afrosiyob</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('international')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                selectedTypeFilter === 'international'
                  ? 'bg-white dark:bg-rose-600 text-rose-600 dark:text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe2 className="w-3 h-3 text-blue-500" />
              <span>Xalqaro & Dunyo</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('overnight')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedTypeFilter === 'overnight'
                  ? 'bg-white dark:bg-rose-600 text-rose-600 dark:text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tungi / Yotoqli
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold p-1.5 rounded-lg border-0 focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="cheapest">Eng arzon narx</option>
              <option value="fastest">Eng qisqa vaqt</option>
              <option value="earliest">Eng erta jo'nash</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Counter & 24/7 Call Center Hotline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-slate-900 dark:text-white text-base">
            Mavjud Poyezd Reyslari ({filteredTrains.length} ta topildi)
          </h3>
          <span className="text-xs text-slate-400 font-bold">
            • {travelDate} sanasiga
          </span>
        </div>

        <a
          href="tel:+998930399291"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-black text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 transition"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Center: +998 93 039 92 91 (24/7)</span>
        </a>
      </div>

      {/* Train Listings */}
      <div className="space-y-5">
        {filteredTrains.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-[#111c35] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
              <TrainIcon className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-lg text-slate-900 dark:text-white">
                Bu yo'nalishda to'g'ridan-to'g'ri poyezd topilmadi
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 font-medium">
                Siz tanlagan "{trainFrom}" ➔ "{trainTo}" yo'nalishida ayni vaqtda reys yo'q. Boshqa vokzalni tanlab ko'ring yoki barcha poyezdlarni ko'ring.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRegionFilter('domestic');
                  setTrainFrom('Toshkent (Shimoliy Vokzal)');
                  setTrainTo('Samarqand');
                  setSelectedTypeFilter('all');
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Toshkent ➔ Samarqand poyezdlarini ko'rish
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegionFilter('all');
                  setTrainFrom('Barchasi');
                  setTrainTo('Barchasi');
                  setSelectedTypeFilter('all');
                }}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-black text-xs rounded-xl transition cursor-pointer"
              >
                Barcha O'zbekiston va Jahon poyezdlari
              </button>
            </div>
          </div>
        ) : (
          filteredTrains.map((train) => {
            const isAfrosiyob = train.name.toLowerCase().includes('afrosiyob');
            const isInternational = train.category === 'international';
            const isSeatsLow = train.availableSeats < 25;
            const isExpanded = expandedTrainId === train.id;

            const interiorPhotos = train.interiorImages || [
              {
                title: 'VIP Salon',
                tag: 'VIP Vagon',
                image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80',
                description: "Keng charmli ergonomik o'rindiqlar va issiq taom servisi."
              },
              {
                title: 'Biznes Klass',
                tag: 'Biznes',
                image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
                description: "Qulay o'rindiqlar, keng stollar va rozetkalar."
              },
              {
                title: 'Standart / Platskart',
                tag: 'Standart',
                image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&auto=format&fit=crop&q=80',
                description: "Toza, yorug' va xavfsiz yo'lovchi saloni."
              },
              {
                title: 'Restoran / Bistro',
                tag: 'Restoran',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
                description: "Issiq taomlar va kofe-choy zali."
              }
            ];

            const activePhotoIdx = selectedSalonPhoto[train.id] ?? 0;
            const currentPhoto = interiorPhotos[activePhotoIdx] || interiorPhotos[0];

            // Inline Ticket Detail selected class for this train
            const currentTicketClass = inlineTicketClass[train.id] || 'biz';
            const currentTicketPrice = getClassPrice(train, currentTicketClass);
            const currentWagonInfo = getWagonAndSeatInfo(currentTicketClass);
            const pnrCode = `TR-${train.id.replace('tr-', '').toUpperCase()}-89`;
            const ticketNumber = `UZTY-2026-${Math.abs(train.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 100000))}`;

            return (
              <div
                key={train.id}
                className="bg-white dark:bg-[#111c35] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden hover:border-rose-300 dark:hover:border-rose-700 transition"
              >
                {/* Main Card Header (Clickable to expand inside view) */}
                <div className="p-5 sm:p-6 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
                  {/* Left: Train Route and Schedule Details */}
                  <div className="space-y-4 flex-1">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xl">
                        {train.flag ? train.flag : isInternational ? '🌍' : '🚆'}
                      </span>
                      <h3
                        onClick={() => {
                          setTicketDetailModalTrain(train);
                          setTicketDetailModalClass('biz');
                          setIsTicketDetailModalFullscreen(true);
                        }}
                        className="font-black text-slate-900 dark:text-white text-lg hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{train.name}</span>
                      </h3>

                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          isAfrosiyob
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : isInternational
                            ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {isAfrosiyob ? (
                          <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                        ) : isInternational ? (
                          <Globe2 className="w-3 h-3 text-indigo-500" />
                        ) : null}
                        <span>{train.type}</span>
                      </span>

                      {train.speed && (
                        <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚡ {train.speed}
                        </span>
                      )}

                      {train.country && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          📍 {train.country}
                        </span>
                      )}
                    </div>

                    {/* Route Timeline */}
                    <div className="flex items-center gap-4 sm:gap-8 text-sm">
                      {/* Departure */}
                      <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {train.departureTime}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5 max-w-[150px] truncate" title={train.fromCity}>
                          {train.fromCity}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Jo'nash vaqti</span>
                      </div>

                      {/* Middle Track Indicator */}
                      <div className="flex-1 max-w-[200px] flex flex-col items-center">
                        <div className="text-[11px] font-black text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-600" />
                          <span>{train.duration}</span>
                        </div>

                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 my-2 relative rounded-full">
                          <div className="w-3 h-3 rounded-full bg-rose-600 border-2 border-white dark:border-[#111c35] absolute -top-[4px] left-1/2 -translate-x-1/2 shadow-sm"></div>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          To'g'ridan-to'g'ri qatnov
                        </span>
                      </div>

                      {/* Arrival */}
                      <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {train.arrivalTime}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-0.5 max-w-[150px] truncate" title={train.toCity}>
                          {train.toCity}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Yetib borish</span>
                      </div>
                    </div>

                    {/* Amenities, Seats info & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                          <Coffee className="w-3.5 h-3.5 text-amber-600" />
                          <span>Choy & kofe</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                          <Wifi className="w-3.5 h-3.5 text-blue-500" />
                          <span>Wi-Fi</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                          <Wind className="w-3.5 h-3.5 text-sky-500" />
                          <span>Konditsioner</span>
                        </div>
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-lg ${
                            isSeatsLow
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {train.availableSeats} ta bo'sh joy
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* SEAT SELECTION BUTTON (USER REQ: o'rindiqni tanlash imkoniyati) */}
                        <button
                          type="button"
                          onClick={() => {
                            setSeatModalTrain(train);
                            setSeatModalClass('biz');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 shadow-sm"
                          title="Poyezd vagonlari va qulay o'rindiqlarini tanlash"
                        >
                          <span>💺 O'rindiq Tanlash</span>
                        </button>

                        {/* TICKET DETAIL DIRECT BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setTicketDetailModalTrain(train);
                            setTicketDetailModalClass('biz');
                            setIsTicketDetailModalFullscreen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 shadow-sm"
                          title="Ushbu poyezdning to'liq ekranli elektron chipta detallari va barcha ma'lumotlarini ko'rish"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>To'liq Ekran Chipta (Ticket Detail)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: 4 Class Selection Cards */}
                  {(() => {
                    const discountPct = 0;
                    const isDiscounted = false;

                    // VIP
                    const vipBaseTotal = train.priceVipUZS * trainPassengers;
                    const vipFinal = vipBaseTotal;
                    const vipSaved = 0;

                    // Biznes
                    const bizBaseTotal = train.priceBizUZS * trainPassengers;
                    const bizFinal = bizBaseTotal;
                    const bizSaved = 0;

                    // Kupe
                    const kupeBaseTotal = train.priceKupeUZS * trainPassengers;
                    const kupeFinal = kupeBaseTotal;
                    const kupeSaved = 0;

                    // Platskart
                    const platBaseTotal = train.pricePlatskartUZS * trainPassengers;
                    const platFinal = platBaseTotal;
                    const platSaved = 0;

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 xl:border-l xl:border-slate-100 dark:xl:border-slate-800/80 xl:pl-6 min-w-[340px] sm:min-w-[460px]">
                        {/* VIP */}
                        <div className="bg-slate-50 dark:bg-[#0c1427] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-between hover:border-amber-400 transition group">
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded uppercase">
                                VIP
                              </span>
                              {isDiscounted && (
                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1 rounded">
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold mt-1">
                              Issiq taom + Keng o'rindiq
                            </p>
                            {isDiscounted && (
                              <div className="text-[10px] line-through text-slate-400 font-bold mt-0.5">
                                {formatPrice(vipBaseTotal, currency)}
                              </div>
                            )}
                            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                              {formatPrice(vipFinal, currency)}
                            </div>
                            {isDiscounted && (
                              <span className="text-[9px] font-bold text-emerald-600 block">
                                {formatPrice(vipSaved, currency)} tejaldi
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 mt-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSeatModalTrain(train);
                                setSeatModalClass('vip');
                              }}
                              className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-black text-[10px] rounded-lg cursor-pointer transition flex items-center justify-center gap-1 shadow-xs"
                              title="VIP vagon o'rindiqlarini tanlash"
                            >
                              <span>💺 O'rindiq tanlash</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onBookTrain(
                                  train,
                                  'vip',
                                  vipFinal,
                                  travelDate,
                                  customSelectedSeats[train.id],
                                  isTrainRoundTrip,
                                  trainPassengers,
                                  {
                                    originalPriceUZS: vipBaseTotal,
                                    discountPercent: discountPct,
                                    savedAmountUZS: vipSaved,
                                    discountLabel: trainDiscount.discountLabel,
                                  }
                                )
                              }
                              className="w-full py-2 bg-slate-900 hover:bg-amber-600 dark:bg-slate-800 dark:hover:bg-amber-600 text-white font-black text-[11px] rounded-xl cursor-pointer transition shadow-sm"
                            >
                              Bron qilish
                            </button>
                          </div>
                        </div>

                        {/* Biznes */}
                        <div className="bg-slate-50 dark:bg-[#0c1427] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-between hover:border-blue-400 transition group">
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] font-black text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/70 px-2 py-0.5 rounded uppercase">
                                Biznes
                              </span>
                              {isDiscounted && (
                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1 rounded">
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold mt-1">
                              Charm o'rindiq + Kofe
                            </p>
                            {isDiscounted && (
                              <div className="text-[10px] line-through text-slate-400 font-bold mt-0.5">
                                {formatPrice(bizBaseTotal, currency)}
                              </div>
                            )}
                            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                              {formatPrice(bizFinal, currency)}
                            </div>
                            {isDiscounted && (
                              <span className="text-[9px] font-bold text-emerald-600 block">
                                {formatPrice(bizSaved, currency)} tejaldi
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 mt-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSeatModalTrain(train);
                                setSeatModalClass('biz');
                              }}
                              className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-black text-[10px] rounded-lg cursor-pointer transition flex items-center justify-center gap-1 shadow-xs"
                              title="Biznes vagon o'rindiqlarini tanlash"
                            >
                              <span>💺 O'rindiq tanlash</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onBookTrain(
                                  train,
                                  'biz',
                                  bizFinal,
                                  travelDate,
                                  customSelectedSeats[train.id],
                                  isTrainRoundTrip,
                                  trainPassengers,
                                  {
                                    originalPriceUZS: bizBaseTotal,
                                    discountPercent: discountPct,
                                    savedAmountUZS: bizSaved,
                                    discountLabel: trainDiscount.discountLabel,
                                  }
                                )
                              }
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] rounded-xl cursor-pointer transition shadow-sm shadow-blue-500/20"
                            >
                              Bron qilish
                            </button>
                          </div>
                        </div>

                        {/* Kupe */}
                        <div className="bg-slate-50 dark:bg-[#0c1427] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-between hover:border-orange-400 transition group">
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] font-black text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/70 px-2 py-0.5 rounded uppercase">
                                Kupe
                              </span>
                              {isDiscounted && (
                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1 rounded">
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold mt-1">
                              4 kishilik yopiq xona
                            </p>
                            {isDiscounted && (
                              <div className="text-[10px] line-through text-slate-400 font-bold mt-0.5">
                                {formatPrice(kupeBaseTotal, currency)}
                              </div>
                            )}
                            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                              {formatPrice(kupeFinal, currency)}
                            </div>
                            {isDiscounted && (
                              <span className="text-[9px] font-bold text-emerald-600 block">
                                {formatPrice(kupeSaved, currency)} tejaldi
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 mt-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSeatModalTrain(train);
                                setSeatModalClass('kupe');
                              }}
                              className="w-full py-1.5 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/60 dark:hover:bg-orange-900/60 border border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200 font-black text-[10px] rounded-lg cursor-pointer transition flex items-center justify-center gap-1 shadow-xs"
                              title="Kupe vagon o'rindiqlarini tanlash"
                            >
                              <span>💺 O'rindiq tanlash</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onBookTrain(
                                  train,
                                  'kupe',
                                  kupeFinal,
                                  travelDate,
                                  customSelectedSeats[train.id],
                                  isTrainRoundTrip,
                                  trainPassengers,
                                  {
                                    originalPriceUZS: kupeBaseTotal,
                                    discountPercent: discountPct,
                                    savedAmountUZS: kupeSaved,
                                    discountLabel: trainDiscount.discountLabel,
                                  }
                                )
                              }
                              className="mt-0 w-full py-2 bg-[#ff6d00] hover:bg-[#e06000] text-white font-black text-[11px] rounded-xl cursor-pointer transition shadow-sm shadow-orange-500/20"
                            >
                              Bron qilish
                            </button>
                          </div>
                        </div>

                        {/* Platskart */}
                        <div className="bg-slate-50 dark:bg-[#0c1427] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-between hover:border-emerald-400 transition group">
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded uppercase">
                                Platskart
                              </span>
                              {isDiscounted && (
                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1 rounded">
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold mt-1">
                              Tejamkor qulay narx
                            </p>
                            {isDiscounted && (
                              <div className="text-[10px] line-through text-slate-400 font-bold mt-0.5">
                                {formatPrice(platBaseTotal, currency)}
                              </div>
                            )}
                            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                              {formatPrice(platFinal, currency)}
                            </div>
                            {isDiscounted && (
                              <span className="text-[9px] font-bold text-emerald-600 block">
                                {formatPrice(platSaved, currency)} tejaldi
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 mt-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSeatModalTrain(train);
                                setSeatModalClass('platskart');
                              }}
                              className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-black text-[10px] rounded-lg cursor-pointer transition flex items-center justify-center gap-1 shadow-xs"
                              title="Platskart vagon o'rindiqlarini tanlash"
                            >
                              <span>💺 O'rindiq tanlash</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onBookTrain(
                                  train,
                                  'platskart',
                                  platFinal,
                                  travelDate,
                                  customSelectedSeats[train.id],
                                  isTrainRoundTrip,
                                  trainPassengers,
                                  {
                                    originalPriceUZS: platBaseTotal,
                                    discountPercent: discountPct,
                                    savedAmountUZS: platSaved,
                                    discountLabel: trainDiscount.discountLabel,
                                  }
                                )
                              }
                              className="mt-0 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] rounded-xl cursor-pointer transition shadow-sm shadow-emerald-500/20"
                            >
                              Bron qilish
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ======================================================== */}
                {/* EXPANDED SECTION (USER REQ: poyest utiga bosa ichi ochilsin */}
                {/* va poyest rasmi va salon rasimlari chiiqib kesin keyin     */}
                {/* tagidan rasimlari chiqib keyin tagidan ma'lumotlari chiqsin*/}
                {/* + TIKET DETEL QISMI POYEZDGA QO'SHILDI)                    */}
                {/* ======================================================== */}
                {isExpanded && (
                  <div className="border-t-2 border-rose-500/30 bg-slate-50/80 dark:bg-[#0a1222] p-5 sm:p-8 space-y-8 animate-fadeIn">
                    {/* Header bar of expanded view */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                          Interfaol Ko'rik, Salon & Chipta Detallari
                        </span>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{train.name} — Poyezd Ko'rinishi, Saloni, Ma'lumotlari va Chiptasi</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTicketDetailModalTrain(train);
                            setTicketDetailModalClass('biz');
                            setIsTicketDetailModalFullscreen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>To'liq Ekran Chipta (PDF)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleTrainInside(train.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Yopish</span>
                        </button>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* 1. POYEZDNING ASOSIY TASHQI KO'RINISHI RASMI (Poyezd rasmi)*/}
                    {/* ======================================================== */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs">
                            1
                          </span>
                          <h5 className="font-black text-slate-900 dark:text-white text-base">
                            Poyezdning Tashqi Ko'rinishi (Lokomotiv & Tezyurar Vagonlar)
                          </h5>
                        </div>
                        <span className="text-xs text-slate-400 font-bold">
                          Kattalashtirish uchun rasm ustiga bosing 🔍
                        </span>
                      </div>

                      <div
                        onClick={() =>
                          setLightboxImage({
                            title: `${train.name} — Tashqi Ko'rinishi`,
                            image: train.image || 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
                            tag: train.type,
                            description: `${train.name} (${train.speed || '250 km/soat'}). Ishlab chiqaruvchi: ${train.manufacturer || 'Talgo / Alstom / Siemens'}.`
                          })
                        }
                        className="group relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 cursor-pointer h-72 sm:h-96 w-full bg-slate-900"
                      >
                        <img
                          src={train.image || 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80'}
                          alt={train.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-5 sm:p-6 text-white">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-xl bg-rose-600/90 text-white font-black text-xs shadow-md backdrop-blur-sm flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5" />
                              <span>{train.speed || '250 km/soat'}</span>
                            </span>
                            <span className="w-9 h-9 rounded-2xl bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 group-hover:bg-rose-600 transition">
                              <Maximize2 className="w-4 h-4" />
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                              <span>{train.flag}</span>
                              <span>{train.country || "O'zbekiston"}</span>
                              <span>•</span>
                              <span>{train.fromCity} ➔ {train.toCity}</span>
                            </div>
                            <h4 className="text-xl sm:text-2xl font-black text-white">
                              {train.name}
                            </h4>
                            <p className="text-xs text-slate-200 line-clamp-2 max-w-2xl font-medium">
                              {train.description || "Yuqori darajadagi xavfsizlik, shovqinsiz qulay harakat va zamonaviy tezyurar temir yo'l texnologiyasi."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* 2. SALON RASIMLARI (Poyezd saloni va interyer rasmlari)   */}
                    {/* ======================================================== */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                            2
                          </span>
                          <div>
                            <h5 className="font-black text-slate-900 dark:text-white text-base">
                              Poyezd Saloni va Vagonlar Rasmlari (Salon Rasmlari)
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Har bir vagon turini ko'rish uchun quyidagi salon rasmlari tugmalarini bosing
                            </p>
                          </div>
                        </div>

                        {/* Salon category tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                          {interiorPhotos.map((photo, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedSalonPhoto((prev) => ({ ...prev, [train.id]: idx }))}
                              className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                                activePhotoIdx === idx
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {photo.tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Salon Photo Focus Showcase */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-white dark:bg-[#111c35] p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        {/* Main focused photo */}
                        <div
                          onClick={() =>
                            setLightboxImage({
                              title: `${train.name} — ${currentPhoto.title}`,
                              image: currentPhoto.image,
                              tag: currentPhoto.tag,
                              description: currentPhoto.description
                            })
                          }
                          className="lg:col-span-8 group relative rounded-2xl overflow-hidden h-64 sm:h-80 bg-slate-900 cursor-pointer shadow-md"
                        >
                          <img
                            src={currentPhoto.image}
                            alt={currentPhoto.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-4 text-white">
                            <div className="flex items-center justify-between">
                              <span className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-black shadow-md">
                                {currentPhoto.tag}
                              </span>
                              <span className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 group-hover:bg-amber-500 transition">
                                <Maximize2 className="w-4 h-4" />
                              </span>
                            </div>
                            <div>
                              <h6 className="font-black text-lg text-white">
                                {currentPhoto.title}
                              </h6>
                              <p className="text-xs text-slate-200 mt-0.5 line-clamp-2">
                                {currentPhoto.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Side thumbnails gallery */}
                        <div className="lg:col-span-4 flex flex-col justify-between gap-2.5">
                          <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500">
                            Barcha Salon Fotolari ({interiorPhotos.length} ta vagon ko'rinishi):
                          </span>
                          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 overflow-y-auto max-h-[300px] pr-1">
                            {interiorPhotos.map((photo, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedSalonPhoto((prev) => ({ ...prev, [train.id]: idx }))}
                                className={`flex items-center gap-2.5 p-2 rounded-2xl border transition cursor-pointer ${
                                  activePhotoIdx === idx
                                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                                    : 'bg-slate-50 dark:bg-[#0c1427] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                <img
                                  src={photo.image}
                                  alt={photo.title}
                                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 shadow-sm"
                                  loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block truncate">
                                    {photo.tag}
                                  </span>
                                  <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {photo.title}
                                  </h6>
                                  <span className="text-[10px] text-slate-400 line-clamp-1">
                                    {photo.description}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* 3. TAGIDAN TO'LIQ MA'LUMOTLARI (Keyin tagidan ma'lumotlari) */}
                    {/* ======================================================== */}
                    <div className="space-y-5 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          3
                        </span>
                        <div>
                          <h5 className="font-black text-slate-900 dark:text-white text-base">
                            Poyezd Bo'yicha To'liq Ma'lumotlar, Bekatlar Jadvali va Qoidalar
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Reys jadvali, texnik ma'lumotlar, vagon toifalari va bepul xizmatlar
                          </p>
                        </div>
                      </div>

                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Marshrut va Bekatlar jadvali */}
                        <div className="bg-white dark:bg-[#111c35] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>Marshrut & Bekatlar Jadvali</span>
                          </div>

                          <div className="space-y-3 pt-1">
                            {train.stops && train.stops.length > 0 ? (
                              train.stops.map((stop, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-3 relative">
                                  {/* Line connector */}
                                  {sIdx < train.stops!.length - 1 && (
                                    <div className="absolute left-[7px] top-4 bottom-[-14px] w-[2px] bg-slate-200 dark:bg-slate-700"></div>
                                  )}
                                  <div className="w-4 h-4 rounded-full bg-rose-600 border-2 border-white dark:border-[#111c35] flex-shrink-0 mt-0.5 z-10"></div>
                                  <div className="flex-1 text-xs">
                                    <div className="font-black text-slate-900 dark:text-white">
                                      {stop.station}
                                    </div>
                                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                                      <span>Jo'nash: <strong>{stop.departure}</strong></span>
                                      <span className="text-[10px] text-rose-500 font-bold">{stop.stopDuration}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-slate-400 space-y-2">
                                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                                  <span>{train.fromCity}</span>
                                  <span>{train.departureTime}</span>
                                </div>
                                <div className="text-[11px] text-emerald-600 font-bold">
                                  To'g'ridan-to'g'ri tezyurar reys ({train.duration})
                                </div>
                                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                                  <span>{train.toCity}</span>
                                  <span>{train.arrivalTime}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. Texnik xususiyatlar va xizmatlar */}
                        <div className="bg-white dark:bg-[#111c35] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm">
                            <Award className="w-4 h-4" />
                            <span>Texnik Ko'rsatkichlar & Servis</span>
                          </div>

                          <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400">Maksimal Tezlik:</span>
                              <strong className="text-slate-900 dark:text-white font-mono">{train.speed || '250 km/soat'}</strong>
                            </div>
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400">Ishlab chiqaruvchi:</span>
                              <strong className="text-slate-900 dark:text-white text-right max-w-[170px] truncate" title={train.manufacturer}>
                                {train.manufacturer || 'Talgo / Alstom'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400">Vagon toifalari:</span>
                              <strong className="text-slate-900 dark:text-white">VIP, Biznes, Kupe, Platskart</strong>
                            </div>
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400">Bron saqlanishi:</span>
                              <strong className="text-emerald-600 font-bold">48 Soat Bepul Zaxira</strong>
                            </div>
                          </div>

                          {/* Amenity tags */}
                          <div className="pt-1 flex flex-wrap gap-1.5">
                            {(train.amenities || ['Wi-Fi', 'Issiq Taom', '220V Rozetka', 'Konditsioner', 'Bistro']).map((am, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold"
                              >
                                ✓ {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 3. Bagaj va Yo'lovchi qoidalari */}
                        <div className="bg-white dark:bg-[#111c35] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                            <Luggage className="w-4 h-4" />
                            <span>Bagaj & Yo'lovchi Qoidalari</span>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p>
                              <strong>Yuk me'yori:</strong> {train.luggagePolicy || "Har bir chiptaga 36 kg gacha bepul yuk va shaxsiy qo'l yuki kiradi."}
                            </p>
                            <p>
                              <strong>Pasport talabi:</strong> Vokzalga kirishda shaxsni tasdiqlovchi pasport yoki ID karta asl nusxasi talab etiladi.
                            </p>
                            <p>
                              <strong>Bolalar chegirmasi:</strong> 5 yoshgacha bo'lgan bolalar alohida o'rindiqsiz bepul sayohat qilishi mumkin.
                            </p>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              <a
                                href="tel:+998930399291"
                                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-black hover:underline"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>24/7 Temir Yo'l Call Center: +998 93 039 92 91</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ======================================================== */}
                      {/* 4. TIKET DETEL (TICKET DETAIL) BO'LIMI                   */}
                      {/* ======================================================== */}
                      <div className="bg-white dark:bg-[#111c35] rounded-3xl border-2 border-blue-500/30 dark:border-blue-700/40 p-5 sm:p-7 space-y-5 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/25">
                              <Ticket className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-black text-slate-900 dark:text-white text-base">
                                  🎫 Ticket Detail — Elektron Chipta Taloni & Boarding Pass
                                </h5>
                                <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                  48H Zaxira
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Vagon, o'rindiq, QR-kod va turniketdan o'tish tafsilotlari
                              </p>
                            </div>
                          </div>

                          {/* Class Switcher for Ticket Preview */}
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {(['vip', 'biz', 'kupe', 'platskart'] as const).map((cType) => (
                              <button
                                key={cType}
                                type="button"
                                onClick={() => setInlineTicketClass((prev) => ({ ...prev, [train.id]: cType }))}
                                className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase transition cursor-pointer ${
                                  currentTicketClass === cType
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                {cType}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Boarding Pass Card Container */}
                        <div className="bg-slate-50 dark:bg-[#0c1427] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
                          {/* Boarding pass top header */}
                          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700 text-white p-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <TrainIcon className="w-5 h-5 text-amber-300" />
                              <span className="font-black text-sm tracking-wide">
                                {isInternational ? `${train.country || 'Xalqaro'} Temir Yo'llari` : "O'zbekiston Temir Yo'llari (UZ RAILWAY)"}
                              </span>
                              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                {train.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-mono">
                              <div>
                                <span className="text-[10px] text-white/70 block uppercase">PNR Shifri</span>
                                <strong className="text-amber-300 tracking-wider">{pnrCode}</strong>
                              </div>
                              <div className="hidden sm:block">
                                <span className="text-[10px] text-white/70 block uppercase">Chipta Raqami</span>
                                <strong className="text-white">{ticketNumber}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Boarding pass main body */}
                          <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                            {/* Route & Passenger details */}
                            <div className="md:col-span-8 space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="text-slate-400 text-[10px] font-black uppercase block">Jo'nash Vokzali</span>
                                  <strong className="text-slate-900 dark:text-white text-sm block">{train.fromCity}</strong>
                                  <span className="text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                                    {train.departureTime} • Perron 2 (Yo'l 1)
                                  </span>
                                </div>

                                <div>
                                  <span className="text-slate-400 text-[10px] font-black uppercase block">Yetib Borish</span>
                                  <strong className="text-slate-900 dark:text-white text-sm block">{train.toCity}</strong>
                                  <span className="text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                                    {train.arrivalTime} ({train.duration})
                                  </span>
                                </div>

                                <div>
                                  <span className="text-slate-400 text-[10px] font-black uppercase block">Sayohat Sanasi</span>
                                  <strong className="text-slate-900 dark:text-white text-sm block">{travelDate}</strong>
                                  <span className="text-emerald-600 font-bold text-[11px]">Tasdiqlangan</span>
                                </div>
                              </div>

                              {/* Vagon & O'rindiq Joylashuvi */}
                              <div className="p-3 bg-white dark:bg-[#111c35] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-black uppercase text-[10px]">
                                      {currentTicketClass} Klass
                                    </span>
                                    <strong className="text-slate-900 dark:text-white text-sm">
                                      {currentWagonInfo.label}
                                    </strong>
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    📍 {currentWagonInfo.position} • {currentWagonInfo.amenities}
                                  </p>
                                </div>

                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] text-slate-400 uppercase font-black block">Tarif Narxi</span>
                                  <strong className="text-lg font-black text-rose-600 dark:text-rose-400">
                                    {formatPrice(currentTicketPrice, currency)}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            {/* QR Code & Turnstile pass */}
                            <div className="md:col-span-4 bg-white dark:bg-[#111c35] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-2">
                              <div className="w-24 h-24 bg-white p-1.5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-center">
                                <QrCode className="w-full h-full text-slate-900" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                {ticketNumber}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                ✓ Vokzal turniketidan to'g'ridan-to'g'ri o'tish kodi
                              </span>
                            </div>
                          </div>

                          {/* Boarding pass footer action strip */}
                          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>48 soatlik bepul bron kafolati • Kassaga bormasdan elektron chipta</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setTicketDetailModalTrain(train);
                                  setTicketDetailModalClass(currentTicketClass);
                                }}
                                className="px-3 py-1.5 bg-white dark:bg-[#111c35] hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Chiptani To'liq Ko'rish / Chop etish (PDF)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onBookTrain(train, currentTicketClass, currentTicketPrice, travelDate)}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition cursor-pointer shadow-sm shadow-blue-500/25 flex items-center gap-1"
                              >
                                <span>Ushbu Chiptani Bron Qilish</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Direct One-Click Booking Buttons Bar right under details */}
                      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-900 text-white p-5 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-0.5 text-center md:text-left">
                          <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                            Kafolatlangan 48-soatlik bron
                          </span>
                          <h6 className="font-black text-lg text-white">
                            {train.name} poyezdiga chiptani hoziroq band qiling
                          </h6>
                          <p className="text-xs text-white/80">
                            {travelDate} sanasiga rasmiy elektron chipta (QR-kodli)
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => onBookTrain(train, 'vip', train.priceVipUZS, travelDate)}
                            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs cursor-pointer shadow-md transition"
                          >
                            VIP ({formatPrice(train.priceVipUZS, currency)})
                          </button>
                          <button
                            type="button"
                            onClick={() => onBookTrain(train, 'biz', train.priceBizUZS, travelDate)}
                            className="px-3.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs cursor-pointer shadow-md transition"
                          >
                            Biznes ({formatPrice(train.priceBizUZS, currency)})
                          </button>
                          <button
                            type="button"
                            onClick={() => onBookTrain(train, 'kupe', train.priceKupeUZS, travelDate)}
                            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs cursor-pointer shadow-md transition"
                          >
                            Kupe ({formatPrice(train.priceKupeUZS, currency)})
                          </button>
                          <button
                            type="button"
                            onClick={() => onBookTrain(train, 'platskart', train.pricePlatskartUZS, travelDate)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs cursor-pointer shadow-md transition"
                          >
                            Platskart ({formatPrice(train.pricePlatskartUZS, currency)})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Train Travel Information & FAQ */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h4 className="font-black text-lg">Poyezd Chiptalari Bo'yicha Muhim Eslatma & Qoidalar</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="font-black text-white text-sm block">🎫 48 Soatlik Zaxira</span>
            <p className="leading-relaxed text-slate-300">
              Bron qilingan chipta 48 soat davomida bepul ushlab turiladi. Vokzal kassasiga bormasdan elektron shaklda foydalanishingiz mumkin.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="font-black text-white text-sm block">🪪 Pasport Talabi</span>
            <p className="leading-relaxed text-slate-300">
              Poyezdga chiqishda shaxsni tasdiqlovchi pasport yoki ID karta asl nusxasini taqdim etish majburiydir.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="font-black text-white text-sm block">📞 24/7 Call Center</span>
            <p className="leading-relaxed text-slate-300">
              Reys o'zgarishi yoki bekor qilish bo'yicha Call Center operatorimizga murojaat qiling: <strong>+998 93 039 92 91</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN LIGHTBOX PHOTO MODAL (rasmni kattalashtirib ko'rish) */}
      {/* ======================================================== */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-rose-600 transition flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] w-full overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>

            <div className="p-5 bg-slate-900 border-t border-slate-800 text-white space-y-1">
              <div className="flex items-center gap-2">
                {lightboxImage.tag && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-[10px] font-black uppercase">
                    {lightboxImage.tag}
                  </span>
                )}
                <h4 className="font-black text-lg">{lightboxImage.title}</h4>
              </div>
              {lightboxImage.description && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEDICATED TRAIN TICKET DETAIL MODAL (FULLSCREEN & RICH)    */}
      {/* USER REQ: "tikket detyl qismini full ekram qilib ochildin" */}
      {/* ======================================================== */}
      {ticketDetailModalTrain && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl print:p-0 print:bg-white flex flex-col justify-start animate-fadeIn transition-all duration-300 ${
            isTicketDetailModalFullscreen ? 'p-2 sm:p-6' : 'items-center justify-center p-4'
          }`}
          onClick={() => setTicketDetailModalTrain(null)}
        >
          <div
            className={`relative w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl text-left border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none text-slate-900 dark:text-slate-100 transition-all duration-300 ${
              isTicketDetailModalFullscreen
                ? 'max-w-7xl mx-auto my-auto min-h-[92vh] flex flex-col justify-between'
                : 'max-w-3xl my-6'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Fullscreen Header Controls Bar */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-rose-700 via-rose-600 to-indigo-800 text-white flex flex-wrap items-center justify-between gap-4 border-b border-rose-800/40">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <TrainIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black leading-tight">
                      {ticketDetailModalTrain.name}
                    </span>
                    <span className="bg-white/20 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {ticketDetailModalTrain.category === 'international' ? 'Xalqaro' : 'Tezyurar'}
                    </span>
                  </div>
                  <span className="text-xs text-white/90 font-medium block mt-1">
                    {ticketDetailModalTrain.category === 'international'
                      ? 'Xalqaro Temir Yo‘l Chiptasi & To‘liq Sayohat Ma’lumotnomasi'
                      : "O'zbekiston Temir Yo'llari Rasmiy Elektron Chiptasi & Marshrut Detallari"}
                  </span>
                </div>
              </div>

              {/* Top Action Controls */}
              <div className="flex items-center gap-2 print:hidden ml-auto sm:ml-0">
                {/* Fullscreen toggle button */}
                <button
                  type="button"
                  onClick={() => setIsTicketDetailModalFullscreen(!isTicketDetailModalFullscreen)}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/20 shadow-sm"
                  title={isTicketDetailModalFullscreen ? "Kichik oyna (Restore)" : "To'liq ekran (Fullscreen)"}
                >
                  {isTicketDetailModalFullscreen ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Kichik Oyna</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">To'liq Ekran</span>
                    </>
                  )}
                </button>

                {/* Print button */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/20 shadow-sm"
                  title="Chop etish yoki PDF sifatida saqlash"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Chop etish</span>
                </button>

                {/* Close modal */}
                <button
                  type="button"
                  onClick={() => setTicketDetailModalTrain(null)}
                  className="w-9 h-9 rounded-xl bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
                  title="Yopish (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Live Status Notification Strip */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  <strong>Reys Holati:</strong> Reja bo'yicha harakatlanmoqda. Joylar va elektron bron kafolatlangan.
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-[11px] text-emerald-800 dark:text-emerald-300">
                <span>PNR: TR-{ticketDetailModalTrain.id.replace('tr-', '').toUpperCase()}-89</span>
                <span>•</span>
                <span>Sana: {travelDate}</span>
              </div>
            </div>

            {/* Modal Body: Rich 2-Column Responsive Layout */}
            <div className="p-5 sm:p-8 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ========================================== */}
                {/* LEFT COLUMN: Train Specs, Route Timeline & Gallery */}
                {/* ========================================== */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Train Exterior Banner Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 h-64 sm:h-80 bg-slate-900">
                    <img
                      src={
                        ticketDetailModalTrain.image ||
                        'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80'
                      }
                      alt={ticketDetailModalTrain.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-between p-5 text-white">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-rose-600 font-black text-xs shadow-md flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          <span>{ticketDetailModalTrain.speed || '250 km/soat'}</span>
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-bold text-xs border border-white/20">
                          {ticketDetailModalTrain.country || "O'zbekiston"} {ticketDetailModalTrain.flag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {ticketDetailModalTrain.name}
                        </h3>
                        <p className="text-xs text-slate-200 line-clamp-2">
                          {ticketDetailModalTrain.description ||
                            "Zamonaviy tezyurar temir yo'l texnologiyasi, favqulodda yuqori xavfsizlik va yo'lovchilar uchun barcha qulayliklar."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Route & Station Timeline Details */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-rose-600" />
                        <h4 className="font-black text-base text-slate-900 dark:text-white">
                          Marshrut va Vokzallar Jadvali (Stops Timeline)
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        Umumiy vaqt: {ticketDetailModalTrain.duration}
                      </span>
                    </div>

                    {/* Timeline stops */}
                    <div className="space-y-3 pt-2">
                      {(ticketDetailModalTrain.stops && ticketDetailModalTrain.stops.length > 0
                        ? ticketDetailModalTrain.stops
                        : [
                            { station: ticketDetailModalTrain.fromCity, arrival: '-', departure: ticketDetailModalTrain.departureTime, stopDuration: "Jo'nash" },
                            { station: 'Oraliq Texnik Bekat', arrival: '1h 10m', departure: '1h 15m', stopDuration: '5 daqiqa' },
                            { station: ticketDetailModalTrain.toCity, arrival: ticketDetailModalTrain.arrivalTime, departure: '-', stopDuration: 'Yetib borish' },
                          ]
                      ).map((stop, idx, arr) => (
                        <div key={idx} className="flex items-start gap-3 relative">
                          {/* Dot and Line */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                idx === 0
                                  ? 'border-rose-600 bg-rose-600 text-white'
                                  : idx === arr.length - 1
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-400 bg-white dark:bg-slate-900'
                              }`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                            {idx !== arr.length - 1 && (
                              <div className="w-0.5 h-10 bg-slate-300 dark:bg-slate-700 my-0.5"></div>
                            )}
                          </div>

                          {/* Station Info */}
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between pb-2 text-xs">
                            <div>
                              <strong className="font-black text-slate-900 dark:text-white block text-sm">
                                {stop.station}
                              </strong>
                              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                                {idx === 0
                                  ? "Boshlanish bekati • Perron 1"
                                  : idx === arr.length - 1
                                  ? "Yakuniy bekat • Markaziy perron"
                                  : `Oraliq bekat • To'xtash: ${stop.stopDuration}`}
                              </span>
                            </div>
                            <div className="text-left sm:text-right mt-1 sm:mt-0 font-mono">
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {stop.departure !== '-' ? `Jo'nash: ${stop.departure}` : `Yetish: ${stop.arrival}`}
                              </span>
                              {stop.arrival !== '-' && stop.departure !== '-' && (
                                <span className="text-[10px] text-slate-400 block">
                                  Kelish: {stop.arrival}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specs & Onboard Amenities Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 block">Ishlab chiqaruvchi</span>
                      <strong className="text-slate-900 dark:text-white font-bold block truncate">
                        {ticketDetailModalTrain.manufacturer || 'Talgo / Alstom'}
                      </strong>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 block">Maksimal Tezlik</span>
                      <strong className="text-rose-600 dark:text-rose-400 font-black block">
                        {ticketDetailModalTrain.speed || '250 km/soat'}
                      </strong>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 block">Internet Aloqasi</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold block">
                        5G Yuqori Tezlikdagi Wi-Fi
                      </strong>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-black text-slate-400 block">Bort Taomlari</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-bold block">
                        Bistro & Vagon-Restoran
                      </strong>
                    </div>
                  </div>

                  {/* Luggage Policy & Passenger Guide */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                      <Luggage className="w-4 h-4 text-blue-600" />
                      <span>Yuk va Bagaj Qoidalari:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {ticketDetailModalTrain.luggagePolicy ||
                        "Har bir yo'lovchiga 36 kg gacha bepul bagaj va o'rindiq ustidagi/tagidagi maxsus bo'limda qo'l yuki ruxsat etiladi."}
                    </p>
                  </div>
                </div>

                {/* ========================================== */}
                {/* RIGHT COLUMN: The Official Boarding Pass Ticket */}
                {/* ========================================== */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Physical Boarding Pass Card Container */}
                  <div className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200 dark:border-slate-800">
                    {/* Pass Header */}
                    <div className="p-5 bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-800 text-white flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider block">
                          ELEKTRON CHIPTA TALONI
                        </span>
                        <h4 className="text-lg font-black tracking-tight leading-tight">
                          {ticketDetailModalTrain.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-white/80 uppercase block">PNR CODE</span>
                        <strong className="font-mono text-xl text-amber-300 tracking-wider">
                          TR-{ticketDetailModalTrain.id.replace('tr-', '').toUpperCase()}-89
                        </strong>
                      </div>
                    </div>

                    {/* Class Selector Segmented Control */}
                    <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-700 dark:text-slate-300">
                          Vagon Toifasi (Klassni tanlang):
                        </span>
                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                          {ticketDetailModalClass}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['vip', 'biz', 'kupe', 'platskart'] as const).map((cType) => (
                          <button
                            key={cType}
                            type="button"
                            onClick={() => setTicketDetailModalClass(cType)}
                            className={`py-2 px-1 rounded-xl text-xs font-black uppercase transition cursor-pointer text-center ${
                              ticketDetailModalClass === cType
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-500'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {cType}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ticket Core Content */}
                    <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-800 dark:text-slate-200">
                      {/* Stations Infographic */}
                      <div className="flex items-center justify-between gap-3 pb-4 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white">
                            {getStationCode(ticketDetailModalTrain.fromCity)}
                          </span>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 max-w-[130px] truncate" title={ticketDetailModalTrain.fromCity}>
                            {ticketDetailModalTrain.fromCity}
                          </div>
                          <div className="text-sm font-black text-rose-600 dark:text-rose-400 mt-1">
                            {ticketDetailModalTrain.departureTime}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {ticketDetailModalTrain.duration}
                          </span>
                          <div className="w-full flex items-center gap-1.5 my-1">
                            <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                            <TrainIcon className="w-4 h-4 text-rose-600" />
                            <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-700"></div>
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            Kafolatlangan
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white">
                            {getStationCode(ticketDetailModalTrain.toCity)}
                          </span>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 max-w-[130px] truncate ml-auto" title={ticketDetailModalTrain.toCity}>
                            {ticketDetailModalTrain.toCity}
                          </div>
                          <div className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">
                            {ticketDetailModalTrain.arrivalTime}
                          </div>
                        </div>
                      </div>

                      {/* Coach & Seat Details */}
                      <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black text-slate-400 block">
                              Vagon va O'rindiq (Joylashuv)
                            </span>
                            <strong className="text-sm sm:text-base font-black text-slate-900 dark:text-white block mt-0.5">
                              {customSelectedSeats[ticketDetailModalTrain.id] ||
                                getWagonAndSeatInfo(ticketDetailModalClass).label}
                            </strong>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                              {getWagonAndSeatInfo(ticketDetailModalClass).position}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSeatModalTrain(ticketDetailModalTrain);
                              setSeatModalClass(ticketDetailModalClass);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                            title="Vagon xaritasi orqali aniq o'rindiqni tanlash"
                          >
                            <span>💺 O'rindiqni Tanlash</span>
                          </button>
                        </div>

                        {/* Interactive Quick Seat Bar */}
                        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Tezkor o'rindiqlar (Bosib tanlang):
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {[
                              { label: '06', tag: '🪟 Deraza' },
                              { label: '08', tag: '🚶 Yo\'lak' },
                              { label: '14', tag: '🪟 Deraza' },
                              { label: '18', tag: '🍽️ Stol' },
                              { label: '22', tag: '⚡ Rozetka' },
                              { label: '26', tag: '🪟 Deraza' },
                            ].map((st) => {
                              const seatStr = `Vagon 0${
                                ticketDetailModalClass === 'vip' ? '1' : ticketDetailModalClass === 'biz' ? '2' : '4'
                              } • O'rindiq ${st.label} (${st.tag})`;
                              const isCur = customSelectedSeats[ticketDetailModalTrain.id] === seatStr;
                              return (
                                <button
                                  key={st.label}
                                  type="button"
                                  onClick={() =>
                                    setCustomSelectedSeats((prev) => ({
                                      ...prev,
                                      [ticketDetailModalTrain.id]: seatStr,
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer border ${
                                    isCur
                                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-400'
                                  }`}
                                >
                                  #{st.label} {st.tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Included Class Amenities */}
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs space-y-1">
                        <span className="font-black text-blue-900 dark:text-blue-300 block">
                          Ushbu Chiptaga Kiritilgan ({ticketDetailModalClass.toUpperCase()}):
                        </span>
                        <p className="text-[11px] text-blue-800 dark:text-blue-200 font-medium">
                          {getWagonAndSeatInfo(ticketDetailModalClass).amenities}
                        </p>
                      </div>

                      {/* Barcode & Turnstile QR Section */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center flex-shrink-0">
                            <QrCode className="w-full h-full text-slate-950" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-black text-slate-400 block">
                              Elektron Turniket Kodi
                            </span>
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                              TR-{ticketDetailModalTrain.id.replace('tr-', '').toUpperCase()}-89
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                              ✓ Kassaga bormasdan perronga o'tish
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] uppercase font-black text-slate-400 block">Chipta Narxi</span>
                          <strong className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
                            {formatPrice(getClassPrice(ticketDetailModalTrain, ticketDetailModalClass), currency)}
                          </strong>
                        </div>
                      </div>

                      {/* Big Action: Book This Ticket Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const chosenPrice = getClassPrice(ticketDetailModalTrain, ticketDetailModalClass);
                          const chosenSeat =
                            customSelectedSeats[ticketDetailModalTrain.id] ||
                            getWagonAndSeatInfo(ticketDetailModalClass).label;
                          const trainObj = ticketDetailModalTrain;
                          setTicketDetailModalTrain(null);
                          onBookTrain(trainObj, ticketDetailModalClass, chosenPrice, travelDate, chosenSeat);
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-5 h-5" />
                        <span>Ushbu Poyezd Chiptasini Bron Qilish (48 Soat Kafolat)</span>
                      </button>

                      <div className="text-center text-[11px] text-slate-400">
                        Hech qanday oldindan to'lovsiz 48 soat davomida joyingiz saqlanadi.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Rasmiy IATA / UZTY kafolati • 24/7 Call Center: +998 93 039 92 91</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTicketDetailModalTrain(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Yopish (Esc)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const chosenPrice = getClassPrice(ticketDetailModalTrain, ticketDetailModalClass);
                    const chosenSeat =
                      customSelectedSeats[ticketDetailModalTrain.id] ||
                      getWagonAndSeatInfo(ticketDetailModalClass).label;
                    const trainObj = ticketDetailModalTrain;
                    setTicketDetailModalTrain(null);
                    onBookTrain(trainObj, ticketDetailModalClass, chosenPrice, travelDate, chosenSeat);
                  }}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Bron Qilishga O'tish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INTERACTIVE TRAIN SEAT MAP MODAL                          */}
      {/* USER REQ: "o'rindiq mi tamnlash imkonyatini qush"         */}
      {/* ======================================================== */}
      {seatModalTrain && (
        <TrainSeatMapModal
          train={seatModalTrain}
          initialClass={seatModalClass}
          travelDate={travelDate}
          currency={currency}
          onClose={() => setSeatModalTrain(null)}
          onConfirmSeat={(train, classType, finalPriceUZS, seatLabel, date) => {
            setCustomSelectedSeats((prev) => ({
              ...prev,
              [train.id]: seatLabel,
            }));
            setSeatModalTrain(null);
            onBookTrain(train, classType, finalPriceUZS, date, seatLabel);
          }}
        />
      )}
    </div>
  );
};
