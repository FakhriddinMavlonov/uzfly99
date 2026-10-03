import React, { useState, useMemo } from 'react';
import {
  Hotel as HotelIcon,
  Star,
  MapPin,
  Wifi,
  Check,
  Sparkles,
  Calendar,
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  Heart,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Waves,
  ShieldCheck,
  Building,
  Award,
  Globe2,
  Bed,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';
import { Hotel, HotelRoom, Currency, Language } from '../types';
import { formatPrice } from '../utils/helpers';
import { HotelDetailModal } from './HotelDetailModal';
import { HotelBookingModal } from './HotelBookingModal';

interface HotelSectionProps {
  currency: Currency;
  language: Language;
  hotels?: Hotel[];
  onBookHotel: (hotel: Hotel, room?: HotelRoom) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const HotelSection: React.FC<HotelSectionProps> = ({
  currency,
  language,
  hotels,
  onBookHotel,
  favorites = [],
  onToggleFavorite,
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStars, setSelectedStars] = useState<number | 'all'>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');

  // Dates & Guests
  const [checkInDate, setCheckInDate] = useState('2026-09-24');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-27');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  // Active Modals
  const [detailModalHotel, setDetailModalHotel] = useState<Hotel | null>(null);
  const [bookingModalHotel, setBookingModalHotel] = useState<Hotel | null>(null);
  const [bookingModalRoom, setBookingModalRoom] = useState<HotelRoom | null>(null);

  // Active Photo Indexes per card for carousels
  const [photoIndexes, setPhotoIndexes] = useState<Record<string, number>>({});

  // Calculate nights
  const nightsCount = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkInDate, checkOutDate]);

  const sourceHotels = hotels && hotels.length > 0 ? hotels : [];

  // Regional Filter Categories
  const REGIONS = [
    { id: 'all', label: 'Barcha Davlatlar 🌍' },
    { id: 'uzbekistan', label: 'O\'zbekiston 🇺🇿' },
    { id: 'uae', label: 'BAA / Dubay 🇦🇪' },
    { id: 'turkey', label: 'Turkiya 🇹🇷' },
    { id: 'saudi', label: 'Saudiya (Umra) 🇸🇦' },
    { id: 'europe', label: 'Yevropa 🇪🇺' },
    { id: 'tropical', label: 'Maldiv & Tropik 🏝️' },
    { id: 'asia', label: 'Osiyo & Singapur 🇸🇬' },
    { id: 'usa', label: 'AQSH 🇺🇸' },
  ];

  // Quick Popular Destination chips
  const POPULAR_CITIES = [
    'all',
    'Toshkent',
    'Samarqand',
    'Buxoro',
    'Dubay',
    'Istanbul',
    'Antaliya',
    'Makka',
    'Madina',
    'Maldiv orollari',
    'Bali',
    'Parij',
    'London',
    'Singapur',
    'Nyu-York',
  ];

  // Carousel Next/Prev
  const handleCarouselNext = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    const gallery = hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages : [hotel.image];
    setPhotoIndexes((prev) => {
      const current = prev[hotel.id] || 0;
      return { ...prev, [hotel.id]: (current + 1) % gallery.length };
    });
  };

  const handleCarouselPrev = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    const gallery = hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages : [hotel.image];
    setPhotoIndexes((prev) => {
      const current = prev[hotel.id] || 0;
      return { ...prev, [hotel.id]: (current - 1 + gallery.length) % gallery.length };
    });
  };

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    return sourceHotels
      .filter((h) => {
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = h.name.toLowerCase().includes(q);
          const matchCity = h.city.toLowerCase().includes(q);
          const matchCountry = h.country.toLowerCase().includes(q);
          if (!matchName && !matchCity && !matchCountry) return false;
        }

        // Region Filter
        if (selectedRegion !== 'all' && h.region !== selectedRegion) {
          return false;
        }

        // City Filter
        if (selectedCity !== 'all' && h.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // Stars Filter
        if (selectedStars !== 'all' && h.stars !== selectedStars) {
          return false;
        }

        // Amenity Filter
        if (selectedAmenity !== 'all') {
          const hasAmenity = h.amenities.some((a) =>
            a.toLowerCase().includes(selectedAmenity.toLowerCase())
          );
          if (!hasAmenity) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.pricePerNightUZS - b.pricePerNightUZS;
        if (sortBy === 'price_desc') return b.pricePerNightUZS - a.pricePerNightUZS;
        if (sortBy === 'rating') return b.rating - a.rating;
        // recommended
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [sourceHotels, searchQuery, selectedRegion, selectedCity, selectedStars, selectedAmenity, sortBy]);

  const handleOpenDetail = (hotel: Hotel) => {
    setDetailModalHotel(hotel);
  };

  const handleOpenBooking = (hotel: Hotel, room?: HotelRoom) => {
    setBookingModalHotel(hotel);
    setBookingModalRoom(room || null);
    if (detailModalHotel) {
      setDetailModalHotel(null);
    }
  };

  return (
    <div className="space-y-8" id="hotels-main-section">
      {/* 1. HERO SEARCH ENGINE FOR HOTELS */}
      <div className="bg-white dark:bg-[#111c35] rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dunyo Bo'ylab 5-Yulduzli Hashamatli Mehmonxonalar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <HotelIcon className="w-7 h-7 text-amber-500" />
              <span>Butun Dunyo Mehmonxonalari</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              O'zbekiston, BAA (Dubay), Turkiya, Saudiya Arabistoni, Yevropa, Maldiv orollari va AQSH bo'yicha eng sara xonalar
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Globe2 className="w-4 h-4 text-blue-500" />
            <span>{filteredHotels.length} ta mehmonxona topildi</span>
          </div>
        </div>

        {/* Unified Search Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Destination Search Box */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition">
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
              Qayerga / Shahar yoki Mehmonxona
            </label>
            <div className="flex items-center gap-2 pt-1">
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <input
                type="text"
                placeholder="Dubay, Samarqand, Istanbul, Hilton..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Check-In Date */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition">
            <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
              Kirish Sanasi (Check-in)
            </label>
            <div className="flex items-center gap-2 pt-1">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Check-Out Date with live nights counter */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white dark:focus-within:bg-slate-800 transition">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
                Chiqish Sanasi (Check-out)
              </label>
              <span className="text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.2 rounded">
                {nightsCount} kecha
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests & Rooms Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 transition h-full flex flex-col justify-center"
            >
              <label className="block text-[10px] font-black uppercase text-slate-400 dark:text-slate-400 tracking-wider">
                Mehmonlar & Xonalar
              </label>
              <div className="flex items-center gap-2 pt-1 text-xs font-black text-slate-900 dark:text-white">
                <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  {adultsCount} katta{childrenCount > 0 ? `, ${childrenCount} bola` : ''} • 1 xona
                </span>
              </div>
            </div>

            {/* Guest Selector Popup */}
            {showGuestPicker && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#111c35] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-30 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Kattalar</div>
                    <div className="text-[10px] text-slate-400">12 yosh va undan katta</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adultsCount <= 1}
                      onClick={() => setAdultsCount((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 font-black text-sm flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-black text-xs w-4 text-center">{adultsCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultsCount((c) => Math.min(10, c + 1))}
                      className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-sm flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Bolalar</div>
                    <div className="text-[10px] text-slate-400">0 dan 11 yoshgacha</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={childrenCount <= 0}
                      onClick={() => setChildrenCount((c) => Math.max(0, c - 1))}
                      className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 font-black text-sm flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-black text-xs w-4 text-center">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount((c) => Math.min(6, c + 1))}
                      className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-sm flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuestPicker(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition cursor-pointer"
                >
                  Tayyor
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Regional Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {REGIONS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => {
                setSelectedRegion(reg.id);
                setSelectedCity('all');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black cursor-pointer transition whitespace-nowrap ${
                selectedRegion === reg.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* Quick Popular Cities chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Mashhur shaharlar:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition whitespace-nowrap ${
                selectedCity === c
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {c === 'all' ? 'Barchasi' : c}
            </button>
          ))}
        </div>

        {/* Filter & Sort Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Stars Filter */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2">Yulduz:</span>
              <button
                type="button"
                onClick={() => setSelectedStars('all')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedStars === 'all' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Hammasi
              </button>
              <button
                type="button"
                onClick={() => setSelectedStars(5)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedStars === 5 ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-500' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                5 ★ Lyuks
              </button>
              <button
                type="button"
                onClick={() => setSelectedStars(4)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedStars === 4 ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                4 ★
              </button>
            </div>

            {/* Popular Amenities quick filters */}
            {[
              { id: 'all', label: 'Barcha qulayliklar' },
              { id: 'Basseyn', label: 'Hovuz / Basseyn 🏊' },
              { id: 'Nonushta', label: 'Nonushta 🍳' },
              { id: 'dengiz', label: 'Dengiz bo\'yida 🌊' },
              { id: 'Ka\'ba', label: 'Ka\'ba / Haram 🕋' },
              { id: 'Spa', label: 'Spa & Salomatlik 💆' },
            ].map((am) => (
              <button
                key={am.id}
                onClick={() => setSelectedAmenity(am.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedAmenity === am.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {am.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Tavsiya etilgan</option>
              <option value="rating">Eng yuqori reyting</option>
              <option value="price_asc">Narx: Arzondan qimmatga</option>
              <option value="price_desc">Narx: Qimmatdan arzonga</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. HOTELS GRID */}
      {filteredHotels.length === 0 ? (
        <div className="bg-white dark:bg-[#111c35] p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
          <HotelIcon className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-800 dark:text-white">
            Mehmonxona topilmadi
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tanlangan parametrlar bo'yicha hech qanday mehmonxona chiqmadi. Filtrlarni tozalab ko'ring.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('all');
              setSelectedCity('all');
              setSelectedStars('all');
              setSelectedAmenity('all');
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition cursor-pointer"
          >
            Barcha Filtrlarni Bekor Qilish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => {
            const gallery = hotel.galleryImages && hotel.galleryImages.length > 0 ? hotel.galleryImages : [hotel.image];
            const activePhoto = photoIndexes[hotel.id] || 0;
            const currentImg = gallery[activePhoto];
            const isFav = favorites.includes(hotel.id);
            const totalStayPrice = hotel.pricePerNightUZS * nightsCount;

            return (
              <div
                key={hotel.id}
                className="bg-white dark:bg-[#111c35] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Photo Carousel Container */}
                  <div className="h-56 relative overflow-hidden bg-slate-900">
                    <img
                      src={currentImg}
                      alt={hotel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => handleOpenDetail(hotel)}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Stars & Rating Top Left */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-slate-900 dark:text-white flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{hotel.rating}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        ({hotel.reviewsCount})
                      </span>
                    </div>

                    {/* Favorite Button & Stars Count Top Right */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <div className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-amber-300 text-xs font-bold">
                        {'★'.repeat(hotel.stars)}
                      </div>
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(hotel.id);
                          }}
                          className={`p-1.5 rounded-xl backdrop-blur-md transition cursor-pointer ${
                            isFav
                              ? 'bg-rose-500 text-white shadow-md'
                              : 'bg-black/50 text-white hover:bg-rose-500'
                          }`}
                          title="Sevimlilarga qo'shish"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Carousel Nav Arrows */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleCarouselPrev(e, hotel)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCarouselNext(e, hotel)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Featured Tag on Bottom of Image */}
                    {hotel.featuredBadge && (
                      <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                        {hotel.featuredBadge}
                      </div>
                    )}

                    {/* Photo Dots on Bottom Right */}
                    {gallery.length > 1 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full">
                        {gallery.map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition ${
                              activePhoto === i ? 'bg-white scale-125' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hotel Info Block */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{hotel.city}, {hotel.country} • {hotel.distanceToCenter}</span>
                    </div>

                    <h3
                      onClick={() => handleOpenDetail(hotel)}
                      className="font-black text-slate-900 dark:text-white text-base sm:text-lg hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer leading-snug line-clamp-1"
                    >
                      {hotel.name}
                    </h3>

                    {/* Room Type preview */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Bed className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate font-medium">
                        {hotel.rooms?.[0]?.name || 'Deluxe King Panoramik Xona'}
                      </span>
                    </div>

                    {/* Amenities pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hotel.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="bg-slate-50 dark:bg-[#0c1427] text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800 flex items-center gap-1"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{amenity}</span>
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold self-center">
                          +{hotel.amenities.length - 3} yana
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        1 kecha uchun:
                      </span>
                      <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                        {formatPrice(hotel.pricePerNightUZS, currency)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Jami ({nightsCount} kecha):
                      </span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {formatPrice(totalStayPrice, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(hotel)}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xonalar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(hotel)}
                      className="px-3 py-2.5 bg-[#ff6d00] hover:bg-[#e06000] text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 whitespace-nowrap"
                    >
                      <span>Band Qilish</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TRUST & STATS FOOTER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-black mb-1">
            <Award className="w-4 h-4" />
            <span>Kafolatlangan Joylashuv & Eng Yaxshi Narxlar</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Nega Bizning Mehmonxona Xizmatimizni Tanlashadi?
          </h3>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
            Toshkent va xorijdagi to'g'ridan-to'g'ri shartnomalar, rasmiy elektron vaucher, zudlik bilan ro'yxatdan o'tish va 24/7 o'zbek tilidagi qo'llab-quvvatlash.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 shrink-0 text-center">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="text-2xl font-black text-amber-300">30+</div>
            <div className="text-[11px] text-blue-100">Jahon Mehmonxonalari</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="text-2xl font-black text-emerald-300">100%</div>
            <div className="text-[11px] text-blue-100">Rasmiy Vaucher</div>
          </div>
        </div>
      </div>

      {/* Hotel Detail Modal */}
      {detailModalHotel && (
        <HotelDetailModal
          hotel={detailModalHotel}
          isOpen={Boolean(detailModalHotel)}
          onClose={() => setDetailModalHotel(null)}
          currency={currency}
          onBookRoom={(h, r) => handleOpenBooking(h, r)}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guestsCount={adultsCount + childrenCount}
          nightsCount={nightsCount}
          isFavorite={favorites.includes(detailModalHotel.id)}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {/* Hotel Booking Modal */}
      {bookingModalHotel && (
        <HotelBookingModal
          isOpen={Boolean(bookingModalHotel)}
          onClose={() => {
            setBookingModalHotel(null);
            setBookingModalRoom(null);
          }}
          hotel={bookingModalHotel}
          room={bookingModalRoom}
          currency={currency}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          nightsCount={nightsCount}
          guestsCount={adultsCount + childrenCount}
          onConfirmReservation={(resData) => {
            onBookHotel(bookingModalHotel, bookingModalRoom || undefined);
            setBookingModalHotel(null);
            setBookingModalRoom(null);
          }}
        />
      )}
    </div>
  );
};
