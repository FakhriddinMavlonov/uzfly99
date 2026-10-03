import { Train } from '../types';

export const MOCK_TRAINS: Train[] = [
  // ==========================================
  // 1. O'ZBEKISTON ICHKI TEZYURAR VA TUNGI REYSLARI (DOMESTIC)
  // ==========================================

  // Toshkent -> Samarqand (#762 Afrosiyob)
  {
    id: 'tr-762',
    name: 'Afrosiyob #762 (Toshkent - Samarqand)',
    type: 'Tezyurar elektropoyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Samarqand',
    departureTime: '08:00',
    arrivalTime: '10:15',
    duration: '2s 15daq',
    speed: '250 km/soat',
    manufacturer: 'Talgo 250 (Ispaniya / Patentes Talgo)',
    priceVipUZS: 340000,
    priceBizUZS: 240000,
    priceKupeUZS: 175000,
    pricePlatskartUZS: 120000,
    availableSeats: 34,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'VIP Salon (1-klass)',
        tag: 'VIP Vagon',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Keng charmli ergonomik o'rindiqlar (2x1 sxema), bepul issiq nonushta, yangi gazeta va shaxsiy multimedia displeyi."
      },
      {
        title: 'Biznes Klass Saloni',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Qulay yumshoq o'rindiqlar, kengaytirilgan oyoq masofasi, 220V/USB quvvatlagichlar va xushbo'y kofe servisi."
      },
      {
        title: 'Ekonom / Standart Salon',
        tag: 'Standart',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=900&auto=format&fit=crop&q=80',
        description: "Shinam va toza o'rindiqlar, panoramik oynalar, harorat nazorat qilinadigan zamonaviy iqlim tizimi."
      },
      {
        title: 'Bistro & Vagon-Restoran',
        tag: 'Bistro',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
        description: "Issiq milliy somsa, choy, sendvichlar, qandolat mahsulotlari va ichimliklar taqdim etiladigan shinam bar zonasi."
      }
    ],
    description: "Ispaniyaning 'Talgo 250' tezyurar elektropoyezdi Toshkent va Samarqand o'rtasidagi masofani atigi 2 soat 15 daqiqada xavfsiz va favqulodda qulaylik bilan bosib o'tadi.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '08:00', stopDuration: "Jo'nash" },
      { station: 'Jizzax Vokzali', arrival: '09:20', departure: '09:23', stopDuration: '3 daqiqa' },
      { station: 'Samarqand Vokzali', arrival: '10:15', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Tezkor Wi-Fi', 'Issiq Taom & Choy', '220V/USB Rozetkalar', 'Konditsioner', 'Nogironlar uchun pandus', 'Bistro-Bar'],
    luggagePolicy: "Har bir yo'lovchiga 36 kg gacha bepul bagaj va o'lchami 200 sm dan oshmagan qo'l yuki ruxsat etiladi."
  },

  // Toshkent -> Samarqand (#770 Kechki)
  {
    id: 'tr-770',
    name: 'Afrosiyob #770 (Kechki)',
    type: 'Tezyurar elektropoyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Samarqand',
    departureTime: '19:00',
    arrivalTime: '21:15',
    duration: '2s 15daq',
    speed: '250 km/soat',
    manufacturer: 'Talgo 250 (Ispaniya)',
    priceVipUZS: 340000,
    priceBizUZS: 240000,
    priceKupeUZS: 175000,
    pricePlatskartUZS: 120000,
    availableSeats: 22,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'VIP Salon (Kechki muhit)',
        tag: 'VIP Vagon',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Yumshoq kechki yoritish tizimi, bepul issiq kechki taom va to'liq osoyishtalik."
      },
      {
        title: 'Biznes Klass',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Noutbukda ishlash uchun keng stollar va tezkor internet aloqasi."
      }
    ],
    description: "Kechki qulay reys. Ish kunidan so'ng Samarqandga tunab qolish va dam olish kunlarini o'tkazish uchun ajoyib tanlov.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '19:00', stopDuration: "Jo'nash" },
      { station: 'Jizzax Vokzali', arrival: '20:20', departure: '20:23', stopDuration: '3 daqiqa' },
      { station: 'Samarqand Vokzali', arrival: '21:15', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Wi-Fi', 'Kechki Taom', 'Rozetkalar', 'Iqlim nazorati', 'Audio tizim'],
    luggagePolicy: "36 kg gacha bepul yuk, audio-multimedia quloqchinlari bepul taqdim etiladi."
  },

  // Samarqand -> Toshkent (#761 Afrosiyob)
  {
    id: 'tr-761',
    name: 'Afrosiyob #761 (Samarqand - Toshkent)',
    type: 'Tezyurar elektropoyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Samarqand',
    toCity: 'Toshkent (Shimoliy Vokzal)',
    departureTime: '17:30',
    arrivalTime: '19:45',
    duration: '2s 15daq',
    speed: '250 km/soat',
    manufacturer: 'Talgo 250 (Ispaniya)',
    priceVipUZS: 340000,
    priceBizUZS: 240000,
    priceKupeUZS: 175000,
    pricePlatskartUZS: 120000,
    availableSeats: 28,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'VIP Salon (Samarqand-Toshkent)',
        tag: 'VIP Vagon',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Samarqand ziyoratidan so'ng poytaxtga qulay qaytish uchun eng hashamatli vagon."
      },
      {
        title: 'Biznes Klass',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Keng charmli qulay suyanchiqlar va bepul ichimliklar."
      }
    ],
    description: "Samarqanddan Toshkentga kechki tezyurar qatnov. Qulay vaqt jadvali va professional xizmat ko'rsatish.",
    stops: [
      { station: 'Samarqand Vokzali', arrival: '-', departure: '17:30', stopDuration: "Jo'nash" },
      { station: 'Jizzax Vokzali', arrival: '18:25', departure: '18:28', stopDuration: '3 daqiqa' },
      { station: 'Toshkent Shimoliy', arrival: '19:45', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Wi-Fi', 'Issiq Choy & Qahva', 'Iqlim nazorati', 'USB/220V Rozetkalar'],
    luggagePolicy: '36 kg gacha bepul bagaj.'
  },

  // Toshkent -> Buxoro (#766 Afrosiyob)
  {
    id: 'tr-766',
    name: 'Afrosiyob #766 (Toshkent - Buxoro)',
    type: 'Tezyurar elektropoyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Buxoro 1 (Kogon)',
    departureTime: '07:28',
    arrivalTime: '11:20',
    duration: '3s 52daq',
    speed: '250 km/soat',
    manufacturer: 'Talgo 250 (Ispaniya)',
    priceVipUZS: 450000,
    priceBizUZS: 310000,
    priceKupeUZS: 225000,
    pricePlatskartUZS: 155000,
    availableSeats: 19,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'VIP Salon (Buxoro yo‘nalishi)',
        tag: 'VIP Vagon',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Buxoroyi Sharifga hashamatli sayohat: nonushta, xushbo'y qahva, audio-gid."
      },
      {
        title: 'Biznes Salon',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Ergonomik charm kreslolar va keng vagon koridori."
      }
    ],
    description: "Toshkentdan qadimiy Buxoroga Samarqand va Navoiy orqali o'tuvchi tezyurar afsonaviy poezd qatnovi.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '07:28', stopDuration: "Jo'nash" },
      { station: 'Samarqand', arrival: '09:42', departure: '09:47', stopDuration: '5 daqiqa' },
      { station: 'Navoiy', arrival: '10:35', departure: '10:38', stopDuration: '3 daqiqa' },
      { station: 'Buxoro 1 (Kogon)', arrival: '11:20', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Wi-Fi', 'Nonushta', 'Konditsioner', 'Bistro-Bar', 'Audio-gid'],
    luggagePolicy: '36 kg gacha bepul yuk.'
  },

  // Toshkent -> Qarshi (#760 Afrosiyob)
  {
    id: 'tr-760',
    name: 'Afrosiyob #760 (Toshkent - Qarshi)',
    type: 'Tezyurar elektropoyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Qarshi',
    departureTime: '06:50',
    arrivalTime: '10:05',
    duration: '3s 15daq',
    speed: '250 km/soat',
    manufacturer: 'Talgo 250 (Ispaniya)',
    priceVipUZS: 420000,
    priceBizUZS: 290000,
    priceKupeUZS: 210000,
    pricePlatskartUZS: 145000,
    availableSeats: 30,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Biznes Klass',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Qashqadaryo vohasiga tezkor va qulay yetib borish uchun ideal tanlov."
      }
    ],
    description: "Toshkentdan Samarqand orqali Qarshi shahriga qatnovchi qulay tezyurar Talgo poyezdi.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '06:50', stopDuration: "Jo'nash" },
      { station: 'Samarqand', arrival: '09:05', departure: '09:10', stopDuration: '5 daqiqa' },
      { station: 'Qarshi Vokzali', arrival: '10:05', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Wi-Fi', 'Issiq Taom', 'Konditsioner', 'Rozetkalar'],
    luggagePolicy: '36 kg bepul bagaj.'
  },

  // Toshkent -> Urganch / Xiva (#056 Jaloliddin Manguberdi)
  {
    id: 'tr-056',
    name: 'Jaloliddin Manguberdi #056 (Toshkent - Xiva)',
    type: 'Tezyurar zamonaviy poyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Janubiy Vokzal)',
    toCity: 'Urganch',
    departureTime: '20:30',
    arrivalTime: '09:40',
    duration: '13s 10daq',
    speed: '140 km/soat',
    manufacturer: 'Toshkent Yo‘lovchi Vagonlarini Ta’mirlash Zavodi',
    priceVipUZS: 480000,
    priceBizUZS: 340000,
    priceKupeUZS: 240000,
    pricePlatskartUZS: 165000,
    availableSeats: 62,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Lyuks Kupe (2 kishilik)',
        tag: 'Lyuks Kupe',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Qadimiy Xivaga yo'l olgan sayohatchilar uchun shaxsiy TV, yumshoq yotoqlar va maxsus sovg'a to'plami."
      },
      {
        title: 'Kupe Vagon (4 kishilik)',
        tag: 'Kupe',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop&q=80',
        description: "Shinam yotoq joylari, individual chiroqlar, toza yostiq va ko'rpa to'plamlari."
      }
    ],
    description: "Xorazm va qadimiy Ichan-Qal'aga tun bo'yi qulay yotib sayohat qilish uchun mo'ljallangan tungi qulay poyezd.",
    stops: [
      { station: 'Toshkent Janubiy', arrival: '-', departure: '20:30', stopDuration: "Jo'nash" },
      { station: 'Samarqand', arrival: '00:40', departure: '00:55', stopDuration: '15 daqiqa' },
      { station: 'Buxoro', arrival: '04:10', departure: '04:25', stopDuration: '15 daqiqa' },
      { station: 'Urganch Vokzali', arrival: '09:40', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Toza yotoq komplekti', 'Choyxona servisi', 'Konditsioner', 'Rozetkalar', 'Restoran vagoni'],
    luggagePolicy: '36 kg bepul bagaj, yotoq tagida xavfsiz yuk sandig‘i.'
  },

  // Toshkent -> Andijon (#060 Vodiy Ekspress - Qamchiq tunneli orqali)
  {
    id: 'tr-060',
    name: 'Vodiy Ekspress #060 (Toshkent - Andijon)',
    type: 'Tezyurar elektropoyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Andijon',
    departureTime: '06:40',
    arrivalTime: '12:35',
    duration: '5s 55daq',
    speed: '160 km/soat',
    manufacturer: "O'zbekiston Temir Yo'llari",
    priceVipUZS: 360000,
    priceBizUZS: 250000,
    priceKupeUZS: 180000,
    pricePlatskartUZS: 125000,
    availableSeats: 44,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Biznes Klass',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Qamchiq dovonining 19 kilometrlik ulug'vor tunneli orqali Farg'ona vodiysiga qulay sayohat."
      }
    ],
    description: "Toshkentdan Qo'qon, Marg'ilon orqali Andijonga dunyodagi eng uzun tog' temir yo'l tunnellaridan biri orqali qatnovchi zamonaviy ekspress.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '06:40', stopDuration: "Jo'nash" },
      { station: 'Pop Vokzali', arrival: '09:20', departure: '09:25', stopDuration: '5 daqiqa' },
      { station: 'Qo‘qon Vokzali', arrival: '10:15', departure: '10:20', stopDuration: '5 daqiqa' },
      { station: 'Marg‘ilon Vokzali', arrival: '11:10', departure: '11:15', stopDuration: '5 daqiqa' },
      { station: 'Andijon Vokzali', arrival: '12:35', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Qamchiq Tunneli manzarasi', 'Wi-Fi', 'Issiq Choy', 'Konditsioner', 'USB Rozetkalar'],
    luggagePolicy: '36 kg bepul bagaj.'
  },

  // Toshkent -> Termiz (#080 Surxon Ekspress)
  {
    id: 'tr-080',
    name: 'Surxon Ekspress #080 (Toshkent - Termiz)',
    type: 'Tungi qulay poyezd',
    category: 'domestic',
    country: "O'zbekiston",
    flag: '🇺🇿',
    fromCity: 'Toshkent (Janubiy Vokzal)',
    toCity: 'Termiz',
    departureTime: '19:40',
    arrivalTime: '08:30',
    duration: '12s 50daq',
    speed: '120 km/soat',
    manufacturer: "O'zbekiston Temir Yo'llari",
    priceVipUZS: 460000,
    priceBizUZS: 330000,
    priceKupeUZS: 230000,
    pricePlatskartUZS: 155000,
    availableSeats: 54,
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Kupe Vagon',
        tag: 'Kupe',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop&q=80',
        description: "Surxondaryoga tun davomida qulay dam olib yetib borish."
      }
    ],
    description: "Toshkentdan Termiz shahriga tog'lar va dashtlar orqali o'tuvchi manzarali tungi qatnov.",
    stops: [
      { station: 'Toshkent Janubiy', arrival: '-', departure: '19:40', stopDuration: "Jo'nash" },
      { station: 'Samarqand', arrival: '23:50', departure: '00:05', stopDuration: '15 daqiqa' },
      { station: 'Qarshi', arrival: '02:10', departure: '02:25', stopDuration: '15 daqiqa' },
      { station: 'Termiz Vokzali', arrival: '08:30', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Yotoq to‘plami', 'Issiq Choy', 'Konditsioner', 'Yuk bo‘lmasi'],
    luggagePolicy: '36 kg gacha bepul yuk.'
  },

  // ==========================================
  // 2. YEVROPA TEZYURAR POYEZDLARI (EUROPE)
  // ==========================================

  // London ⇄ Parij (Eurostar e320 #9024)
  {
    id: 'tr-world-eurostar',
    name: 'Eurostar e320 #9024 (London - Parij)',
    type: 'Tezyurar Trans-Yevropa Poyezdi',
    category: 'international',
    country: 'Buyuk Britaniya / Fransiya',
    flag: '🇬🇧 / 🇫🇷',
    fromCity: 'London',
    toCity: 'Parij',
    departureTime: '09:31',
    arrivalTime: '12:47',
    duration: '2s 16daq',
    speed: '320 km/soat',
    manufacturer: 'Siemens Velaro e320 (Germaniya)',
    priceVipUZS: 2850000,
    priceBizUZS: 1950000,
    priceKupeUZS: 1450000,
    pricePlatskartUZS: 920000,
    availableSeats: 42,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Business Premier (VIP)',
        tag: 'VIP Salon',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Mishelin oshpazlari tayyorlagan 3 taomli tushlik, xususiy biznes zaliga kirish va 10 daqiqalik tezkor tekshiruv."
      },
      {
        title: 'Standard Premier (Biznes)',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Keng o'rindiqlar, engil sovuq taom va ichimliklar, xalqaro elektr rozetkalar."
      },
      {
        title: 'Eurostar Café Bar',
        tag: 'Kafe Bar',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=80',
        description: "Fransuz kruassanlari, ingliz choyi, sendvichlar va premium qahva."
      }
    ],
    description: "Buyuk Britaniya va Yevropani bog'lovchi afsonaviy poyezd. La-Mansh dengizi ostidagi 50 km tunneldan 320 km/soat tezlikda o'tib, Londondan Parij markaziga 2 soat 16 daqiqada yetib boradi.",
    stops: [
      { station: 'London St Pancras', arrival: '-', departure: '09:31', stopDuration: "Jo'nash" },
      { station: 'Channel Tunnel (La-Mansh)', arrival: '10:05', departure: '10:25', stopDuration: 'Dengiz osti tranziti' },
      { station: 'Lille Europe', arrival: '11:58', departure: '12:02', stopDuration: '4 daqiqa' },
      { station: 'Parij Gare du Nord', arrival: '12:47', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Yuqori tezlikdagi 5G Wi-Fi', 'Mishelin Tushlik', 'Xalqaro rozetkalar (UK/EU)', 'Biznes Lounge', 'Konditsioner'],
    luggagePolicy: "Har bir yo'lovchiga 2 ta katta chamadon va 1 ta qo'l yuki bepul. Og'irlik cheklovi yo'q."
  },

  // Parij ⇄ Marsel (TGV inOui #6611)
  {
    id: 'tr-world-tgv',
    name: 'TGV inOui #6611 (Parij - Marsel)',
    type: 'Fransuz Tezyurar Poyezdi',
    category: 'international',
    country: 'Fransiya',
    flag: '🇫🇷',
    fromCity: 'Parij',
    toCity: 'Marsel',
    departureTime: '10:14',
    arrivalTime: '13:28',
    duration: '3s 14daq',
    speed: '320 km/soat',
    manufacturer: 'Alstom TGV Duplex (Fransiya)',
    priceVipUZS: 2200000,
    priceBizUZS: 1550000,
    priceKupeUZS: 1100000,
    pricePlatskartUZS: 780000,
    availableSeats: 38,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Première Classe (1-klass)',
        tag: 'VIP 1-klass',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Ikki qavatli TGV poyezdining yuqori qavatidagi keng panorama ko'rinish va ergonomik kreslolar."
      },
      {
        title: 'Le Bar TGV',
        tag: 'Bistro Bar',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
        description: "Fransuz pishloqlari, issiq ovqatlar, bagetlar va organik kofe."
      }
    ],
    description: "Parijdan O'rta Yer dengizi sohilidagi Marselga 320 km/soat tezlikda harakatlanuvchi ikki qavatli afsonaviy Alstom TGV poyezdi.",
    stops: [
      { station: 'Paris Gare de Lyon', arrival: '-', departure: '10:14', stopDuration: "Jo'nash" },
      { station: 'Lyon Saint-Exupéry', arrival: '12:08', departure: '12:12', stopDuration: '4 daqiqa' },
      { station: 'Avignon TGV', arrival: '12:55', departure: '12:58', stopDuration: '3 daqiqa' },
      { station: 'Marseille Saint-Charles', arrival: '13:28', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['TGV Connect Wi-Fi', 'Bar Vagoni', 'USB/220V Rozetkalar', 'Oilaviy bo‘lma', 'Nogironlar aravachasi joyi'],
    luggagePolicy: "Chamadonlar soni va og'irligi cheklanmagan, har bir yukka yorliq taqilishi kerak."
  },

  // Berlin ⇄ Myunxen (ICE 4 #1003)
  {
    id: 'tr-world-ice',
    name: 'Deutsche Bahn ICE 4 #1003 (Berlin - Myunxen)',
    type: 'Nemis Tezyurar Ekspressi',
    category: 'international',
    country: 'Germaniya',
    flag: '🇩🇪',
    fromCity: 'Berlin',
    toCity: 'Myunxen',
    departureTime: '07:34',
    arrivalTime: '11:42',
    duration: '4s 08daq',
    speed: '300 km/soat',
    manufacturer: 'Siemens Mobility & Bombardier (Germaniya)',
    priceVipUZS: 2350000,
    priceBizUZS: 1650000,
    priceKupeUZS: 1180000,
    pricePlatskartUZS: 820000,
    availableSeats: 45,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: '1. Klasse (VIP)',
        tag: '1-Klass',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Haqiqiy charm kreslolar, joyingizga yetkazib beriladigan restoran taomlari va bepul gazeta-jurnallar."
      },
      {
        title: 'Bordrestaurant',
        tag: 'Restoran',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop&q=80',
        description: "Klassik nemis taomlari, vafli va yangi tayyorlangan kofe."
      }
    ],
    description: "Germaniyaning faxri bo'lgan Intercity-Express (ICE 4). Berlin markaziy vokzalidan Myunxengacha Tyuringiya o'rmonlari orqali 300 km/soat tezlikda uchadi.",
    stops: [
      { station: 'Berlin Hbf', arrival: '-', departure: '07:34', stopDuration: "Jo'nash" },
      { station: 'Leipzig Hbf', arrival: '08:48', departure: '08:52', stopDuration: '4 daqiqa' },
      { station: 'Erfurt Hbf', arrival: '09:35', departure: '09:38', stopDuration: '3 daqiqa' },
      { station: 'Nürnberg Hbf', arrival: '10:36', departure: '10:40', stopDuration: '4 daqiqa' },
      { station: 'München Hbf', arrival: '11:42', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['WIFIonICE bepul internet', 'Bordrestaurant', 'Jimjitlik hududi', 'Bolalar o‘yin vagoni', 'Velosiped o‘rni'],
    luggagePolicy: "Bagaj bepul, o'rindiqlar ustida va vagon o'rtasida katta yuk tokchalari mavjud."
  },

  // Rim ⇄ Milan (Frecciarossa 1000 #9614)
  {
    id: 'tr-world-freccia',
    name: 'Frecciarossa 1000 #9614 (Rim - Milan)',
    type: "Italiya 'Qizil O'q' Tezyurari",
    category: 'international',
    country: 'Italiya',
    flag: '🇮🇹',
    fromCity: 'Rim',
    toCity: 'Milan',
    departureTime: '08:50',
    arrivalTime: '11:45',
    duration: '2s 55daq',
    speed: '360 km/soat',
    manufacturer: 'Hitachi Rail Italy & Bombardier',
    priceVipUZS: 2600000,
    priceBizUZS: 1850000,
    priceKupeUZS: 1300000,
    pricePlatskartUZS: 890000,
    availableSeats: 32,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Executive Class (VIP)',
        tag: 'Executive VIP',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Atigi 8 ta aylanuvchi charm kreslo, konferents-zal, italyan delikateslari va shaxsiy styuard."
      },
      {
        title: 'FRECCIA Bistro',
        tag: 'Bistro',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=80',
        description: "Haqiqiy italyan espressosi, paninilar va pishiriqlar."
      }
    ],
    description: "Italiyaning eng tezyurar va hashamatli poyezdi (360 km/soatgacha). Rimdan Florensiya va Bolonya orqali moda poytaxti Milanga atigi 2 soat 55 daqiqada eltadi.",
    stops: [
      { station: 'Roma Termini', arrival: '-', departure: '08:50', stopDuration: "Jo'nash" },
      { station: 'Firenze SMN', arrival: '10:04', departure: '10:09', stopDuration: '5 daqiqa' },
      { station: 'Bologna Centrale', arrival: '10:44', departure: '10:47', stopDuration: '3 daqiqa' },
      { station: 'Milano Centrale', arrival: '11:45', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Frecciarossa Wi-Fi', 'Italiya Expressosi', 'Konferentsiya stoli', '220V/USB Rozetkalar', 'Konditsioner'],
    luggagePolicy: 'Yuk miqdori bo‘yicha qatʼiy cheklov yo‘q, barcha vagonlarda yuk bo‘limlari mavjud.'
  },

  // Syurix ⇄ Zermatt (Glacier Express #GL-01) - Shveysariya Alp tog'lari panoramasi
  {
    id: 'tr-world-glacier',
    name: 'Glacier Express #GL-01 (Syurix - Zermatt)',
    type: 'Alp Tog‘lari Panoramik Poyezdi',
    category: 'international',
    country: 'Shveysariya',
    flag: '🇨🇭',
    fromCity: 'Syurix',
    toCity: 'Zermatt',
    departureTime: '08:52',
    arrivalTime: '14:10',
    duration: '5s 18daq',
    speed: '80-120 km/soat (Manzarali tog‘)',
    manufacturer: 'Stadler Rail (Shveysariya)',
    priceVipUZS: 3800000,
    priceBizUZS: 2700000,
    priceKupeUZS: 1950000,
    pricePlatskartUZS: 1350000,
    availableSeats: 26,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Excellence Class (Oliy VIP)',
        tag: 'Excellence VIP',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Shisha gumbazli panoramik shift, 5 taomli shveysarcha delikates tushligi, shaxsiy konsyerj va alp manzaralari."
      },
      {
        title: 'Panoramik 1-Klass',
        tag: '1-Klass',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "360 daraja alp cho'qqilari, muzliklar va Matterhorn tog'ining unutilmas manzarasi."
      }
    ],
    description: "Dunyodagi eng manzarali poyezd. 291 ko'prik va 91 tog' tunnelidan o'tib, Shveysariya Alp tog'larining eng go'zal burchaklariga olib boradi.",
    stops: [
      { station: 'Zürich HB', arrival: '-', departure: '08:52', stopDuration: "Jo'nash" },
      { station: 'Chur Vokzali', arrival: '10:10', departure: '10:25', stopDuration: '15 daqiqa' },
      { station: 'Andermatt', arrival: '12:05', departure: '12:15', stopDuration: '10 daqiqa' },
      { station: 'Brig', arrival: '13:20', departure: '13:25', stopDuration: '5 daqiqa' },
      { station: 'Zermatt (Matterhorn)', arrival: '14:10', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Shisha Shiftli Panoramik Vagon', '5 Taomli Shveysar Taomi', 'Audio-gid quloqchinlari', 'Alp sharbati', 'Wi-Fi'],
    luggagePolicy: "Chang'i va snoubord anjomlari uchun maxsus bepul yuk bo'limlari mavjud."
  },

  // Madrid ⇄ Barselona (Renfe AVE S-103 #03083)
  {
    id: 'tr-world-ave',
    name: 'Renfe AVE S-103 #03083 (Madrid - Barselona)',
    type: 'Ispaniya Tezyurar Poyezdi',
    category: 'international',
    country: 'Ispaniya',
    flag: '🇪🇸',
    fromCity: 'Madrid',
    toCity: 'Barselona',
    departureTime: '07:00',
    arrivalTime: '09:30',
    duration: '2s 30daq',
    speed: '310 km/soat',
    manufacturer: 'Siemens Velaro E (Germaniya/Ispaniya)',
    priceVipUZS: 2100000,
    priceBizUZS: 1450000,
    priceKupeUZS: 1050000,
    pricePlatskartUZS: 750000,
    availableSeats: 52,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Clase Prémium (VIP)',
        tag: 'Prémium VIP',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Keng charmli kreslolar, ispan tapasi, yangi apelsin sharbati va PlayRenfe ko'ngilochar tizimi."
      }
    ],
    description: "Madridning Puerta de Atocha vokzalidan Kataloniya poytaxti Barselonaga 621 km masofani 2 soat 30 daqiqada bosib o'tadi.",
    stops: [
      { station: 'Madrid Puerta de Atocha', arrival: '-', departure: '07:00', stopDuration: "Jo'nash" },
      { station: 'Zaragoza-Delicias', arrival: '08:15', departure: '08:18', stopDuration: '3 daqiqa' },
      { station: 'Barcelona Sants', arrival: '09:30', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['PlayRenfe Wi-Fi & Filmlar', 'Kafe-Bar', 'Rozetkalar', 'Konditsioner', 'Xavfsiz tekshiruv'],
    luggagePolicy: '3 tagacha yuk jami 25 kg bepul.'
  },

  // ==========================================
  // 3. OSIYO VA YAQIN SHARQ POYEZDLARI (ASIA & MIDDLE EAST)
  // ==========================================

  // Tokio ⇄ Kioto & Osaka (Shinkansen N700S Nozomi #215)
  {
    id: 'tr-world-shinkansen',
    name: 'Shinkansen N700S Nozomi #215 (Tokio - Kioto)',
    type: "O'q-Poyezd (Bullet Train)",
    category: 'international',
    country: 'Yaponiya',
    flag: '🇯🇵',
    fromCity: 'Tokio',
    toCity: 'Kioto',
    departureTime: '08:18',
    arrivalTime: '10:32',
    duration: '2s 14daq',
    speed: '320 km/soat',
    manufacturer: 'Hitachi & Nippon Sharyo (Yaponiya)',
    priceVipUZS: 2450000,
    priceBizUZS: 1750000,
    priceKupeUZS: 1250000,
    pricePlatskartUZS: 890000,
    availableSeats: 56,
    image: 'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Gran Class (Super VIP)',
        tag: 'Gran Class',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Yaponiyaning eng oliy toifadagi poyezd saloni. 180 gradus yotadigan avtomat charm kreslo, bento tushlik va yapon choyi."
      },
      {
        title: 'Green Car (Biznes Klass)',
        tag: 'Green Car',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Keng 2+2 joylashuv, oyoq isitgichlari, jimjitlik va mutlaq osoyishtalik."
      },
      {
        title: 'Shinkansen Wagon Service',
        tag: 'Servis',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=80',
        description: "Mashhur Ekiben bento qutilari, issiq yashil choy va muzqaymoq aravachasi."
      }
    ],
    description: "Yaponiyaning afsonaviy Shinkansen 'O'q-poyezdi'. Fudzi tog'i etagidan 320 km/soat tezlikda sekundomer aniqligida uchib o'tadi.",
    stops: [
      { station: 'Tokyo Central', arrival: '-', departure: '08:18', stopDuration: "Jo'nash" },
      { station: 'Shinagawa', arrival: '08:25', departure: '08:26', stopDuration: '1 daqiqa' },
      { station: 'Shin-Yokohama', arrival: '08:37', departure: '08:38', stopDuration: '1 daqiqa' },
      { station: 'Nagoya', arrival: '09:54', departure: '09:56', stopDuration: '2 daqiqa' },
      { station: 'Kyoto Station', arrival: '10:32', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Shinkansen Free Wi-Fi', 'Har bir o‘rindiqda rozetka', 'Ekiben xizmati', 'Fudzi tog‘i panoramasi', 'Chekish xonasi'],
    luggagePolicy: '160 sm dan katta chamadonlar uchun oldindan joy band qilish talab etiladi.'
  },

  // Pekin ⇄ Shanxay (CR400 Fuxing Hao #G1 - Dunyodagi eng tezkor 350 km/s)
  {
    id: 'tr-world-fuxing',
    name: 'CR400 Fuxing Hao #G1 (Pekin - Shanxay)',
    type: 'Dunyodagi Eng Tezkor Tijoriy Tezyurar',
    category: 'international',
    country: 'Xitoy',
    flag: '🇨🇳',
    fromCity: 'Pekin',
    toCity: 'Shanxay',
    departureTime: '09:00',
    arrivalTime: '13:18',
    duration: '4s 18daq',
    speed: '350 km/soat (Maks 400)',
    manufacturer: 'CRRC Qingdao Sifang (Xitoy)',
    priceVipUZS: 2500000,
    priceBizUZS: 1800000,
    priceKupeUZS: 1200000,
    pricePlatskartUZS: 820000,
    availableSeats: 68,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Business Class (VIP Pods)',
        tag: 'VIP Kapsula',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "To'liq yotadigan 180° shaxsiy kapsula, simsiz telefon zaryadlash, bepul issiq xitoy taomlari."
      }
    ],
    description: "1318 kilometr masofani atigi 4 soat 18 daqiqada bosib o'tuvchi dunyodagi eng tezkor poyezd. Sayyoramizdagi eng ilg'or temir yo'l texnologiyasi.",
    stops: [
      { station: 'Beijing South', arrival: '-', departure: '09:00', stopDuration: "Jo'nash" },
      { station: 'Jinan West', arrival: '10:22', departure: '10:24', stopDuration: '2 daqiqa' },
      { station: 'Nanjing South', arrival: '12:12', departure: '12:14', stopDuration: '2 daqiqa' },
      { station: 'Shanghai Hongqiao', arrival: '13:18', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['5G Wi-Fi & Simsiz Quvvatlash', 'Biznes Kapsulalar', 'Issiq Choy & Taomlar', 'Multitil audio tizimi'],
    luggagePolicy: '20 kg bepul yuk. Barcha vagonlarda xavfsizlik nazorati mavjud.'
  },

  // Seul ⇄ Pusan (KTX-Sancheon #021)
  {
    id: 'tr-world-ktx',
    name: 'KTX-Sancheon #021 (Seul - Pusan)',
    type: 'Koreys Tezyurar Poyezdi',
    category: 'international',
    country: 'Janubiy Koreya',
    flag: '🇰🇷',
    fromCity: 'Seul',
    toCity: 'Pusan',
    departureTime: '08:30',
    arrivalTime: '10:45',
    duration: '2s 15daq',
    speed: '305 km/soat',
    manufacturer: 'Hyundai Rotem (Janubiy Koreya)',
    priceVipUZS: 1950000,
    priceBizUZS: 1400000,
    priceKupeUZS: 980000,
    pricePlatskartUZS: 680000,
    availableSeats: 40,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'First Class (VIP)',
        tag: '1-Klass',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "2x1 ergonomik aylanuvchi o'rindiqlar, bepul shirinliklar to'plami va suv."
      }
    ],
    description: "Koreya poytaxti Seuldan dengiz bo'yidagi Pusan shahriga 305 km/soat tezlikda eltuvchi zamonaviy Hyundai Rotem tezyurari.",
    stops: [
      { station: 'Seoul Station', arrival: '-', departure: '08:30', stopDuration: "Jo'nash" },
      { station: 'Daejeon', arrival: '09:25', departure: '09:27', stopDuration: '2 daqiqa' },
      { station: 'Dongdaegu', arrival: '10:08', departure: '10:10', stopDuration: '2 daqiqa' },
      { station: 'Busan Station', arrival: '10:45', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['KTX High-Speed Wi-Fi', 'USB/220V Rozetkalar', 'Ichimlik avtomatlari', 'Konditsioner'],
    luggagePolicy: 'Chamadonlar va ryukzaklar uchun bepul katta javonlar.'
  },

  // Makka ⇄ Madina (Haramain High-Speed #H12)
  {
    id: 'tr-world-haramain',
    name: 'Haramain High-Speed #H12 (Makka - Madina)',
    type: 'Muqaddas Shaharlar Tezyurari',
    category: 'international',
    country: 'Saudiya Arabistoni',
    flag: '🇸🇦',
    fromCity: 'Makka',
    toCity: 'Madina',
    departureTime: '08:00',
    arrivalTime: '10:20',
    duration: '2s 20daq',
    speed: '300 km/soat',
    manufacturer: 'Talgo 350 S-102 (Ispaniya)',
    priceVipUZS: 1850000,
    priceBizUZS: 1350000,
    priceKupeUZS: 950000,
    pricePlatskartUZS: 650000,
    availableSeats: 60,
    image: 'https://images.unsplash.com/photo-1510009489794-352fba39a0b8?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Business Class (VIP Ziyoratchilar)',
        tag: 'Biznes Klass',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Haj va Umra ziyoratchilari uchun qulay kengaytirilgan o'rindiqlar, zamzam suvi, arab xurmolari va qahvasi."
      },
      {
        title: 'Economy Class',
        tag: 'Ekonom Klass',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=900&auto=format&fit=crop&q=80',
        description: "Sahro jaziramasidan himoyalovchi maxsus qudratli iqlim tizimi va ibodat uchun qulay sharoit."
      }
    ],
    description: "Ikki muqaddas shahar Makkayi Mukarrama va Madinayi Munavvarani atigi 2 soat 20 daqiqada bog'lovchi 300 km/soat tezlikdagi zamonaviy poyezd.",
    stops: [
      { station: 'Makkah Station', arrival: '-', departure: '08:00', stopDuration: "Jo'nash" },
      { station: 'Jeddah Al-Sulaymaniyah', arrival: '08:34', departure: '08:38', stopDuration: '4 daqiqa' },
      { station: 'King Abdulaziz Airport (JED)', arrival: '08:52', departure: '08:56', stopDuration: '4 daqiqa' },
      { station: 'Madinah Station', arrival: '10:20', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Zamzam suvi & Xurmo', 'Yuqori quvvatli iqlim tizimi', 'Halol kafe', 'Arabcha audio-gid', 'Wi-Fi'],
    luggagePolicy: "1 ta katta chamadon (25 kg gacha) va 1 ta qo'l yuki bepul."
  },

  // Dubay ⇄ Abu-Dabi (Etihad Rail Gulf Express #ET-10)
  {
    id: 'tr-world-etihad',
    name: 'Etihad Rail Gulf Express #ET-10 (Dubay - Abu-Dabi)',
    type: 'Yangi Avlod Fors Ko‘rfazi Tezyurari',
    category: 'international',
    country: 'BAA',
    flag: '🇦🇪',
    fromCity: 'Dubay',
    toCity: 'Abu-Dabi',
    departureTime: '08:15',
    arrivalTime: '09:05',
    duration: '50daq',
    speed: '200 km/soat',
    manufacturer: 'CAF & Etihad Rail (BAA / Ispaniya)',
    priceVipUZS: 1200000,
    priceBizUZS: 850000,
    priceKupeUZS: 580000,
    pricePlatskartUZS: 380000,
    availableSeats: 58,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'First Class Suite',
        tag: 'VIP Suite',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Emirates hashamati: italiyalik dizaynerlar tomonidan ishlangan o'rindiqlar va xushbo'y arab choylari."
      }
    ],
    description: "Dubay va Abu-Dabi o'rtasidagi yo'l vaqtini atigi 50 daqiqagacha qisqartiruvchi Birlashgan Arab Amirliklarining eng so'nggi flagman temir yo'l tarmog'i.",
    stops: [
      { station: 'Dubai Al Jaddaf', arrival: '-', departure: '08:15', stopDuration: "Jo'nash" },
      { station: 'Abu Dhabi Central', arrival: '09:05', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Ultra High-Speed 5G', 'Iqlim nazorati', 'Arab qahvasi', 'USB-C Zaryadlovchilar'],
    luggagePolicy: '30 kg gacha bepul yuk.'
  },

  // Istanbul ⇄ Anqara (YHT Yüksek Hızlı Tren #YHT-910)
  {
    id: 'tr-world-yht',
    name: 'YHT Yüksek Hızlı Tren #YHT-910 (Istanbul - Anqara)',
    type: 'Turkiya Tezyurar Poyezdi',
    category: 'international',
    country: 'Turkiya',
    flag: '🇹🇷',
    fromCity: 'Istanbul',
    toCity: 'Anqara',
    departureTime: '07:10',
    arrivalTime: '11:40',
    duration: '4s 30daq',
    speed: '250 km/soat',
    manufacturer: 'Siemens Velaro TR (Germaniya / Turkiya)',
    priceVipUZS: 1450000,
    priceBizUZS: 1050000,
    priceKupeUZS: 750000,
    pricePlatskartUZS: 510000,
    availableSeats: 50,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Business Class',
        tag: 'Biznes',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=900&auto=format&fit=crop&q=80',
        description: "Turk choyi, simit, turk pishiriqlari va qulay ergonomik kreslolar."
      }
    ],
    description: "Bo'g'oz sohilidagi qadimiy Istanbuldan Turkiya poytaxti Anqaragacha tezyurar poezd qatnovi.",
    stops: [
      { station: 'Istanbul Söğütlüçeşme', arrival: '-', departure: '07:10', stopDuration: "Jo'nash" },
      { station: 'Pendik', arrival: '07:45', departure: '07:47', stopDuration: '2 daqiqa' },
      { station: 'Eskişehir', arrival: '09:55', departure: '10:00', stopDuration: '5 daqiqa' },
      { station: 'Ankara YHT Garı', arrival: '11:40', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['YHT Wi-Fi', 'Turk Choyi va Kofesi', 'Bistro Vagoni', '220V Rozetkalar'],
    luggagePolicy: '30 kg bepul bagaj.'
  },

  // ==========================================
  // 4. AMERIKA (AMERICAS)
  // ==========================================

  // Nyu-York ⇄ Vashington (Amtrak Acela #2151)
  {
    id: 'tr-world-acela',
    name: 'Amtrak Acela Express #2151 (Nyu-York - Vashington)',
    type: 'AQSH Shimoli-Sharqiy Koridor Tezyurari',
    category: 'international',
    country: 'AQSH',
    flag: '🇺🇸',
    fromCity: 'Nyu-York',
    toCity: 'Vashington',
    departureTime: '07:05',
    arrivalTime: '09:58',
    duration: '2s 53daq',
    speed: '240 km/soat',
    manufacturer: 'Alstom Avelia Liberty (AQSH / Fransiya)',
    priceVipUZS: 3100000,
    priceBizUZS: 2200000,
    priceKupeUZS: 1600000,
    pricePlatskartUZS: 1050000,
    availableSeats: 36,
    image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'First Class (VIP)',
        tag: 'First Class',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Issiq nonushta servisi, yangi qovurilgan Amerika kofesi, Moynihan Train Hall zaliga kirish."
      },
      {
        title: 'Café Acela',
        tag: 'Kafe',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=80',
        description: "Klassik Nyu-York beygllari, organik salatlar va qahva."
      }
    ],
    description: "Manxetten markazidagi Moynihan Train Hall (Penn Station)dan Vashington poytaxtiga Filadelfiya orqali uchib boruvchi AQSHning yagona tezyurar poyezdi.",
    stops: [
      { station: 'New York Penn Station', arrival: '-', departure: '07:05', stopDuration: "Jo'nash" },
      { station: 'Newark Penn', arrival: '07:22', departure: '07:24', stopDuration: '2 daqiqa' },
      { station: 'Philadelphia 30th St', arrival: '08:15', departure: '08:18', stopDuration: '3 daqiqa' },
      { station: 'Baltimore Penn', arrival: '09:12', departure: '09:14', stopDuration: '2 daqiqa' },
      { station: 'Washington Union Station', arrival: '09:58', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Amtrak Free Wi-Fi', 'Keng Charm Kreslolar', 'Har bir o‘rindiqda rozetka', 'Jimjitlik Vagoni'],
    luggagePolicy: '2 ta katta chamadon (har biri 23 kg) + 2 ta qo‘l yuki bepul.'
  },

  // ==========================================
  // 5. MARKAZIY OSIYO VA TRANS-YEVROOSIYO REYSLARI (CENTRAL ASIA & EURASIA)
  // ==========================================

  // Toshkent ⇄ Olmaota (Tulpar Talgo #001)
  {
    id: 'tr-int-001',
    name: 'Tulpar Talgo #001 (Toshkent - Olmaota)',
    type: 'Xalqaro Tezyurar Poyezd',
    category: 'international',
    country: "Qozog'iston / O'zbekiston",
    flag: '🇰🇿 / 🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Olmaota',
    departureTime: '15:20',
    arrivalTime: '08:45',
    duration: '17s 25daq',
    speed: '160-200 km/soat',
    manufacturer: 'Tulpar-Talgo (Ispaniya - Qozog‘iston)',
    priceVipUZS: 1250000,
    priceBizUZS: 890000,
    priceKupeUZS: 620000,
    pricePlatskartUZS: 410000,
    availableSeats: 48,
    image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Grand Lyuks (VIP Kupe)',
        tag: 'VIP Kupe',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Xususiy dush va hojatxona, keng ikki kishilik yotoq, xalqaro pasport nazorati to'g'ridan-to'g'ri kupe ichida."
      }
    ],
    description: "Toshkentdan Chimkent va Taraz orqali Olmaotaga qatnovchi zamonaviy xalqaro tezyurar Talgo poyezdi.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '15:20', stopDuration: "Jo'nash" },
      { station: 'Sariog‘och (Chegara)', arrival: '16:15', departure: '17:30', stopDuration: 'Chegara nazorati' },
      { station: 'Chimkent Vokzali', arrival: '19:40', departure: '19:55', stopDuration: '15 daqiqa' },
      { station: 'Taraz Vokzali', arrival: '23:30', departure: '23:45', stopDuration: '15 daqiqa' },
      { station: 'Olmaota-2 Vokzali', arrival: '08:45', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Xalqaro Wi-Fi', 'Toza Yotoq To‘plami', 'Restoran-Bar', 'Iqlim nazorati', '220V/USB Rozetkalar'],
    luggagePolicy: "Xalqaro standart: 36 kg gacha bepul yuk. Xorijga chiqish pasporti bo'lishi shart."
  },

  // Toshkent ⇄ Moskva (Sharqiy Ekspress #005)
  {
    id: 'tr-int-005',
    name: 'Sharqiy Ekspress #005 (Toshkent - Moskva)',
    type: 'Trans-Yevroosiyo Xalqaro Poyezdi',
    category: 'international',
    country: "Rossiya / O'zbekiston",
    flag: '🇷🇺 / 🇺🇿',
    fromCity: 'Toshkent (Shimoliy Vokzal)',
    toCity: 'Moskva',
    departureTime: '18:50',
    arrivalTime: '11:15',
    duration: '64s 25daq',
    speed: '120-140 km/soat',
    manufacturer: 'Tver Vagonsozlik Zavodi',
    priceVipUZS: 3200000,
    priceBizUZS: 2400000,
    priceKupeUZS: 1750000,
    pricePlatskartUZS: 1100000,
    availableSeats: 72,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'SV Vagon (Lyuks 2 kishilik)',
        tag: 'SV Lyuks',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Uzoq masofali xalqaro sayohat uchun eng qulay 2 kishilik keng xona, yumshoq divanlar va televizor."
      }
    ],
    description: "Toshkentdan Rossiya poytaxti Moskva shahriga to'g'ridan-to'g'ri qatnovchi afsonaviy xalqaro poyezd.",
    stops: [
      { station: 'Toshkent Shimoliy', arrival: '-', departure: '18:50', stopDuration: "Jo'nash" },
      { station: 'Chimkent', arrival: '22:15', departure: '22:45', stopDuration: '30 daqiqa' },
      { station: 'Qizilo‘rda', arrival: '05:30', departure: '06:00', stopDuration: '30 daqiqa' },
      { station: 'Samara Vokzali', arrival: '22:00', departure: '22:40', stopDuration: '40 daqiqa' },
      { station: 'Moskva Paveletskiy', arrival: '11:15', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Biohojatxonalar', 'Vagon-Restoran', 'Qaynoq Choy Titani', 'Xavfsizlik Xizmati', 'Dush xonasi'],
    luggagePolicy: '50 kg gacha bepul bagaj. Pasport va migratsiya hujjatlari talab etiladi.'
  },

  // Toshkent ⇄ Dushanbe (Do'stlik Ekspress #301)
  {
    id: 'tr-int-301',
    name: "Do'stlik Ekspress #301 (Toshkent - Dushanbe)",
    type: 'Xalqaro Yo‘lovchi Poyezdi',
    category: 'international',
    country: "Tojikiston / O'zbekiston",
    flag: '🇹🇯 / 🇺🇿',
    fromCity: 'Toshkent (Janubiy Vokzal)',
    toCity: 'Dushanbe',
    departureTime: '16:15',
    arrivalTime: '10:30',
    duration: '18s 15daq',
    speed: '120 km/soat',
    manufacturer: "O'zbekiston & Tojikiston Temir Yo'llari",
    priceVipUZS: 890000,
    priceBizUZS: 650000,
    priceKupeUZS: 470000,
    pricePlatskartUZS: 310000,
    availableSeats: 50,
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&auto=format&fit=crop&q=80',
    interiorImages: [
      {
        title: 'Lyuks Kupe',
        tag: 'Lyuks',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=900&auto=format&fit=crop&q=80',
        description: "Ikki qardosh el poytaxtlari o'rtasidagi qulay shaxsiy bo'lma."
      }
    ],
    description: "Toshkentdan Samarqand va Quduzli orqali Tojikiston poytaxti Dushanbe shahriga manzarali xalqaro yo'nalish.",
    stops: [
      { station: 'Toshkent Janubiy', arrival: '-', departure: '16:15', stopDuration: "Jo'nash" },
      { station: 'Samarqand', arrival: '20:10', departure: '20:30', stopDuration: '20 daqiqa' },
      { station: 'Dushanbe Vokzali', arrival: '10:30', departure: '-', stopDuration: 'Yetib borish' }
    ],
    amenities: ['Yotoq to‘plami', 'Choy xizmati', 'Biohojatxona', 'Iqlim nazorati'],
    luggagePolicy: '36 kg bepul yuk. Amaldagi xorijiy pasport talab qilinadi.'
  }
];
