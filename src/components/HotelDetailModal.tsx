import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Check,
  Wifi,
  Coffee,
  Waves,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Heart,
  Share2,
  Award,
  Bed,
  Maximize2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Hotel, HotelRoom, Currency } from '../types';
import { formatPrice } from '../utils/helpers';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onBookRoom: (hotel: Hotel, room?: HotelRoom) => void;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  nightsCount: number;
  isFavorite?: boolean;
  onToggleFavorite?: (hotelId: string) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  isOpen,
  onClose,
  currency,
  onBookRoom,
  checkInDate,
  checkOutDate,
  guestsCount,
  nightsCount,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'rooms' | 'amenities' | 'reviews' | 'location'>('rooms');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  if (!isOpen || !hotel) return null;

  const gallery = hotel.galleryImages && hotel.galleryImages.length > 0
    ? hotel.galleryImages
    : [hotel.image];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const defaultRooms: HotelRoom[] = [
    {
      id: `${hotel.id}-std`,
      name: 'Standart Qulay Xona (Standard Double)',
      bedType: '1 ta ikki kishilik Queen karavot',
      sizeSqM: 32,
      maxGuests: 2,
      priceUZS: hotel.pricePerNightUZS,
      breakfastIncluded: true,
      freeCancellation: true,
      amenities: ['Bepul Wi-Fi', 'Konditsioner', 'Smart TV', 'Dush va vanna', 'Choy/kofe jihozlari'],
      image: hotel.galleryImages?.[1] || hotel.image,
    },
    {
      id: `${hotel.id}-dlx`,
      name: 'Deluxe King Room Panoramik Manzara',
      bedType: '1 ta katta King-size karavot',
      sizeSqM: 45,
      maxGuests: 3,
      priceUZS: Math.round(hotel.pricePerNightUZS * 1.35),
      breakfastIncluded: true,
      freeCancellation: true,
      amenities: ['Shahar / Dengiz panoramasi', 'Balkon', 'Espresso kofe mashinasi', 'Vanna', 'Mini-bar'],
      image: hotel.galleryImages?.[2] || hotel.image,
    },
    {
      id: `${hotel.id}-exec`,
      name: 'Executive Suite & Mehmonxona Zali',
      bedType: '1 ta Super King karavot + mehmonxona zali',
      sizeSqM: 70,
      maxGuests: 4,
      priceUZS: Math.round(hotel.pricePerNightUZS * 1.85),
      breakfastIncluded: true,
      freeCancellation: true,
      amenities: ['Executive Lounge kirish', 'Jakuzi', 'VIP xizmat', 'Aeroport transferi'],
      image: hotel.galleryImages?.[0] || hotel.image,
    },
  ];

  const roomsList = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : defaultRooms;

  const defaultBreakdown = hotel.ratingBreakdown || {
    cleanliness: 4.9,
    service: 4.9,
    comfort: 4.9,
    location: 4.9,
    valueForMoney: 4.8,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber-400 font-bold text-sm tracking-wider">
                {'★'.repeat(hotel.stars)}
              </span>
              {hotel.featuredBadge && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {hotel.featuredBadge}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">{hotel.address || `${hotel.city}, ${hotel.country}`} • {hotel.distanceToCenter}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(hotel.id)}
                className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:text-rose-500'
                }`}
                title="Sevimlilarga qo'shish"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Photo Gallery Hero */}
          <div className="space-y-2">
            <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden bg-slate-900 group">
              <img
                src={gallery[activePhotoIdx]}
                alt={hotel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Prev / Next controls */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom rating overlay on hero */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 px-3 py-1.5 rounded-2xl text-sm font-black flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>{hotel.rating} / 5</span>
                  </div>
                  <span className="text-xs font-bold drop-shadow">
                    ({hotel.reviewsCount} ta tasdiqlangan mehmon sharhlari)
                  </span>
                </div>
                <div className="text-xs font-mono bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl">
                  {activePhotoIdx + 1} / {gallery.length} foto
                </div>
              </div>
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 transition cursor-pointer border-2 ${
                      activePhotoIdx === idx
                        ? 'border-blue-600 scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stay Specs Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  Kirish: <strong className="text-slate-900 dark:text-white">{checkInDate}</strong> ({hotel.checkInTime || '14:00'})
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>
                  Chiqish: <strong className="text-slate-900 dark:text-white">{checkOutDate}</strong> ({hotel.checkOutTime || '12:00'})
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Muddati: <strong className="text-slate-900 dark:text-white">{nightsCount} kecha</strong></span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Mehmonlar: <strong className="text-slate-900 dark:text-white">{guestsCount} kishi</strong></span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">1 kecha boshlang'ich:</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">
                {formatPrice(hotel.pricePerNightUZS, currency)}
              </span>
            </div>
          </div>

          {/* Description Snippet */}
          {hotel.description && (
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <p>{hotel.description}</p>
            </div>
          )}

          {/* Navigation Tabs within Modal */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                activeTab === 'rooms'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Mavjud Xonalar ({roomsList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('amenities')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                activeTab === 'amenities'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Qulayliklar & Xizmatlar
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Mehmonlar Baholari & Sharhlar ({hotel.reviewsCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('location')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                activeTab === 'location'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Joylashuv & Xarita
            </button>
          </div>

          {/* TAB 1: ROOMS SELECTION */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  O'zingizga ma'qul xonani tanlang:
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {nightsCount} kechalik hisob bilan
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {roomsList.map((room) => {
                  const totalRoomStay = room.priceUZS * nightsCount;
                  const isSelected = selectedRoomId === room.id;

                  return (
                    <div
                      key={room.id}
                      className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-stretch justify-between gap-5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500'
                          : 'border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Room Photo & Info */}
                      <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                        {room.image && (
                          <div className="w-full sm:w-48 h-36 rounded-2xl overflow-hidden shrink-0 relative bg-slate-200 dark:bg-slate-800">
                            <img
                              src={room.image}
                              alt={room.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white font-bold flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" />
                              <span>{room.sizeSqM} m²</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 flex-1 min-w-0">
                          <h4 className="font-black text-base text-slate-900 dark:text-white">
                            {room.name}
                          </h4>

                          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-blue-500" />
                              <span>{room.bedType}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Maks. {room.maxGuests} mehmon</span>
                            </div>
                          </div>

                          {/* Key Perks badges */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {room.breakfastIncluded && (
                              <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                <Coffee className="w-3 h-3" />
                                <span>Nonushta kiritilgan (Mazali bufet)</span>
                              </span>
                            )}
                            {room.freeCancellation && (
                              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Bepul bekor qilish</span>
                              </span>
                            )}
                          </div>

                          {/* Amenities list */}
                          <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                            {room.amenities.map((am, i) => (
                              <span key={i} className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                                <Check className="w-2.5 h-2.5 text-emerald-500" />
                                <span>{am}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Room Price & Action */}
                      <div className="sm:border-l border-slate-200 dark:border-slate-800 sm:pl-5 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">
                            1 kecha:
                          </span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {formatPrice(room.priceUZS, currency)}
                          </span>

                          <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">
                            Jami ({nightsCount} kecha):
                          </span>
                          <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                            {formatPrice(totalRoomStay, currency)}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                            Barcha soliqlar kiritilgan
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoomId(room.id);
                            onBookRoom(hotel, room);
                          }}
                          className="px-5 py-3 bg-[#ff6d00] hover:bg-[#e06000] text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/20 transition cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          Ushbu Xonani Band Qilish ➔
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AMENITIES & SERVICES */}
          {activeTab === 'amenities' && (
            <div className="space-y-5">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Mehmonxonadagi barcha xizmatlar va qulayliklar:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Standard Hotel Policies */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Qoidalar va Shartlar</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Ro'yxatdan o'tish (Check-in):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{hotel.checkInTime || '14:00 dan boshlab'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Chiqish (Check-out):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{hotel.checkOutTime || '12:00 gacha'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Bolalar siyosati:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">6 yoshgacha bolalar bepul joylashadi</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Breakdown card */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                    {hotel.rating}
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      A'lo darajada
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {hotel.reviewsCount} ta sayohatchi bahosi asosida
                    </div>
                    <div className="text-[11px] text-amber-500 font-bold mt-1">
                      100% haqiqiy tasdiqlangan mehmonlar
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tozalik va gigiyena</span>
                    <span className="font-black text-slate-900 dark:text-white">{defaultBreakdown.cleanliness} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(defaultBreakdown.cleanliness / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Xodimlar xizmati</span>
                    <span className="font-black text-slate-900 dark:text-white">{defaultBreakdown.service} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(defaultBreakdown.service / 5) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Joylashuv qulayligi</span>
                    <span className="font-black text-slate-900 dark:text-white">{defaultBreakdown.location} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(defaultBreakdown.location / 5) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Verified Guest Reviews List */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Sayohatchilar fikrlari:
                </h4>

                {hotel.reviews && hotel.reviews.length > 0 ? (
                  hotel.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-xs text-slate-900 dark:text-white">
                              {rev.author}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {rev.city}, {rev.country} • {rev.date}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">
                    Ushbu mehmonxona uchun barcha 1,420+ sharhlar tizimda saqlanmoqda.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LOCATION & MAP */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="text-xs text-slate-800 dark:text-slate-200">
                  <strong>Manzil:</strong> {hotel.address || `${hotel.city}, ${hotel.country}`} ({hotel.distanceToCenter})
                </div>
              </div>

              {/* Vector Map Simulation Card */}
              <div className="h-64 sm:h-80 rounded-3xl overflow-hidden relative bg-slate-900 border border-slate-800 flex items-center justify-center text-center p-6">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80"
                  alt="City Map"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 filter contrast-125"
                />
                <div className="relative z-10 max-w-md bg-slate-950/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 text-white space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-sm">{hotel.name}</h4>
                  <p className="text-xs text-slate-300">{hotel.address || `${hotel.city}, ${hotel.country}`}</p>
                  <div className="text-[11px] text-emerald-400 font-bold">
                    Aeroportdan transfer va taksi to'g'ridan-to'g'ri eshikkacha keladi
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Booking Sticky Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
              Jami hisob ({nightsCount} kecha uchun):
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                {formatPrice(hotel.pricePerNightUZS * nightsCount, currency)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                (Nonushta & Wi-Fi kiritilgan)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              Yopish
            </button>
            <button
              type="button"
              onClick={() => onBookRoom(hotel)}
              className="flex-1 sm:flex-none px-7 py-3 bg-[#ff6d00] hover:bg-[#e06000] text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/30 transition cursor-pointer active:scale-95"
            >
              Xonani Band Qilish ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
