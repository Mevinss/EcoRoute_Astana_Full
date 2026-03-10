// database/seeds/data/pois.ts
// 50 Астана eco нүктелері — нақты координаттар

export const POIS = [
  // ──── PARKS × 15 ────
  { name: 'Орталық Парк', name_kz: 'Орталық Парк', category: 'park', lat: 51.1801, lng: 71.4460, eco_certified: true, eco_bonus_pts: 50, icon: '🌳', description: 'Астананың ең үлкен орталық паркі. Серуен жолдары, фонтандар, жасыл аймақтар.' },
  { name: 'Ботаникалық Бақ', name_kz: 'Ботаникалық Бақ', category: 'park', lat: 51.2110, lng: 71.4010, eco_certified: true, eco_bonus_pts: 80, icon: '🌿', description: '500+ өсімдік түрлері, зерттеу орталығы, экологиялық білім беру.' },
  { name: 'Президент Паркі', name_kz: 'Президент Паркі', category: 'park', lat: 51.1290, lng: 71.4490, eco_certified: true, eco_bonus_pts: 60, icon: '🌳', description: 'Байтерек алдындағы үлкен парк. Фонтандар, жасыл аллея.' },
  { name: 'EXPO Жасыл Аймақ', name_kz: 'EXPO Жасыл Аймақ', category: 'park', lat: 51.0930, lng: 71.4780, eco_certified: true, eco_bonus_pts: 70, icon: '🌱', description: 'EXPO 2017 аумағындағы eco friendly жасыл аймақ.' },
  { name: 'Мемлекеттік Парк', name_kz: 'Мемлекеттік Парк', category: 'park', lat: 51.1650, lng: 71.4200, eco_certified: false, eco_bonus_pts: 40, icon: '🌳', description: 'Тыныш және кең парк. Жанұялар үшін тамаша орын.' },
  { name: 'Орман Саябағы', name_kz: 'Орман Саябағы', category: 'park', lat: 51.1920, lng: 71.3900, eco_certified: true, eco_bonus_pts: 90, icon: '🌲', description: 'Табиғи орман массиві. Жаяу жүру, тынығу орындары.' },
  { name: 'Жастар Паркі', name_kz: 'Жастар Паркі', category: 'park', lat: 51.1780, lng: 71.4600, eco_certified: false, eco_bonus_pts: 40, icon: '🌳', description: 'Жастарға арналған парк. Скейт, BMX, споттар.' },
  { name: 'Достық Паркі', name_kz: 'Достық Паркі', category: 'park', lat: 51.1550, lng: 71.4100, eco_certified: false, eco_bonus_pts: 40, icon: '🌳', description: 'Тыныш серуен паркі. Балалар алаңы, скамейкалар.' },
  { name: 'Нурлы Жол Паркі', name_kz: 'Нурлы Жол Паркі', category: 'park', lat: 51.2000, lng: 71.4700, eco_certified: false, eco_bonus_pts: 45, icon: '🌿', description: 'Жаңа аудандардағы заманауи парк.' },
  { name: 'Балалар Паркі Арман', name_kz: 'Балалар Паркі Арман', category: 'park', lat: 51.1960, lng: 71.4350, eco_certified: false, eco_bonus_pts: 35, icon: '🌳', description: 'Балалар ойын алаңы, аттракциондар, жасыл аймақ.' },
  { name: 'Есіл Жағалауы Паркі', name_kz: 'Есіл Жағалауы Паркі', category: 'park', lat: 51.1820, lng: 71.4300, eco_certified: true, eco_bonus_pts: 65, icon: '🌿', description: 'Есіл өзені жағасындағы серуен паркі.' },
  { name: 'Шамалған Жасылдығы', name_kz: 'Шамалған Жасылдығы', category: 'park', lat: 51.2200, lng: 71.3700, eco_certified: true, eco_bonus_pts: 85, icon: '🌲', description: 'Қаланың шетіндегі үлкен орман массиві. Жабайы табиғат.' },
  { name: 'Мәдени Демалыс Паркі', name_kz: 'Мәдени Демалыс Паркі', category: 'park', lat: 51.1700, lng: 71.4500, eco_certified: false, eco_bonus_pts: 40, icon: '🌳', description: 'Мәдени іс-шаралар өтетін парк аймағы.' },
  { name: 'Нурсат Жасыл Аймақ', name_kz: 'Нурсат Жасыл Аймақ', category: 'park', lat: 51.1600, lng: 71.5000, eco_certified: false, eco_bonus_pts: 40, icon: '🌱', description: 'Нурсат ауданындағы жасыл аймақ, жаяу жол.' },
  { name: 'Алматы Ауданы Паркі', name_kz: 'Алматы Ауданы Паркі', category: 'park', lat: 51.1480, lng: 71.4200, eco_certified: false, eco_bonus_pts: 35, icon: '🌳', description: 'Ескі аудандағы тыныш парк.' },

  // ──── ECO CAFES × 10 ────
  { name: 'Green Cup Café', name_kz: 'Green Cup Кафе', category: 'cafe', lat: 51.1810, lng: 71.4470, eco_certified: true, eco_bonus_pts: 60, icon: '☕', working_hours: '08:00-22:00', description: '100% organic кофе. Өсімдікке негізделген тағам. Компостируемый ыдыс-аяқ.', website_url: 'https://greencup.kz' },
  { name: 'Eco Garden Restaurant', name_kz: 'Eco Garden Мейрамхана', category: 'cafe', lat: 51.1920, lng: 71.4050, eco_certified: true, eco_bonus_pts: 80, icon: '🌿', working_hours: '10:00-23:00', description: 'Farm-to-table концепциясы. Жергілікті фермерлерден өнімдер. Eco дизайн.' },
  { name: 'Nomad Eco Bistro', name_kz: 'Nomad Eco Бистро', category: 'cafe', lat: 51.1750, lng: 71.4620, eco_certified: true, eco_bonus_pts: 70, icon: '☕', working_hours: '09:00-21:00', description: 'Қазақ eco тағамдары. Zero-waste асхана.' },
  { name: 'Steppe Brew', name_kz: 'Степ Брю', category: 'cafe', lat: 51.1300, lng: 71.4510, eco_certified: false, eco_bonus_pts: 40, icon: '☕', working_hours: '08:00-20:00', description: 'Specialty кофе. Барлық кесе комpostable.' },
  { name: 'The Green Corner', name_kz: 'Жасыл Бұрыш', category: 'cafe', lat: 51.1840, lng: 71.4380, eco_certified: true, eco_bonus_pts: 65, icon: '🌱', working_hours: '10:00-22:00', description: 'Vegan меню. Eco packaging. Өсімдік бағы.' },
  { name: 'Экофрут Смузи', name_kz: 'Экофрут Смузи', category: 'cafe', lat: 51.1660, lng: 71.4150, eco_certified: false, eco_bonus_pts: 45, icon: '🍹', working_hours: '10:00-20:00', description: 'Табиғи жемістен смузи. Қантсыз, органикалық.' },
  { name: 'Samal Organic', name_kz: 'Самал Органик', category: 'cafe', lat: 51.2050, lng: 71.4550, eco_certified: true, eco_bonus_pts: 75, icon: '☕', working_hours: '09:00-21:00', description: 'Organic тағам. Certification ISO 14001.' },
  { name: 'Bayterek Café', name_kz: 'Байтерек Кафе', category: 'cafe', lat: 51.1290, lng: 71.4300, eco_certified: false, eco_bonus_pts: 35, icon: '☕', working_hours: '10:00-22:00', description: 'Туристерге арналған кафе. Байтерек жанында.' },
  { name: 'Eco Nomad Kitchen', name_kz: 'Eco Nomad Асхана', category: 'cafe', lat: 51.1700, lng: 71.4700, eco_certified: true, eco_bonus_pts: 70, icon: '🌿', working_hours: '11:00-22:00', description: 'Fusion қазақ-eco тағам. Жергілікті фермерлер.' },
  { name: 'Astana Bean Lab', name_kz: 'Астана Кофе Зертхана', category: 'cafe', lat: 51.1850, lng: 71.4250, eco_certified: false, eco_bonus_pts: 40, icon: '☕', working_hours: '08:00-20:00', description: 'Specialty кофе зертханасы. Сынамалар, мастер-класс.' },

  // ──── BIKE PARKS × 10 ────
  { name: 'Есіл Велопаркингі', category: 'bike_park', lat: 51.1760, lng: 71.4320, eco_certified: true, eco_bonus_pts: 30, icon: '🚴', description: '50 орынды қауіпсіз велопаркинг. Күзет бар.', is_open_24h: true },
  { name: 'EXPO Велостанция', category: 'bike_park', lat: 51.0910, lng: 71.4760, eco_certified: true, eco_bonus_pts: 30, icon: '🚴', description: 'Велосипед жалдау + паркинг. Electric bike бар.', working_hours: '08:00-21:00' },
  { name: 'Орталық Вело-Хаб', category: 'bike_park', lat: 51.1800, lng: 71.4450, eco_certified: true, eco_bonus_pts: 35, icon: '🚲', description: 'Велосипед жөндеу, насос, паркинг. 100 орын.' },
  { name: 'Нурлы Жол Велопаркинг', category: 'bike_park', lat: 51.2010, lng: 71.4720, eco_certified: false, eco_bonus_pts: 25, icon: '🚴', description: 'Жаңа ауданда ашылған велопаркинг.' },
  { name: 'Достық Вело-Стоп', category: 'bike_park', lat: 51.1560, lng: 71.4090, eco_certified: false, eco_bonus_pts: 25, icon: '🚴', description: 'Аудан велопаркингі. Тегін.' },
  { name: 'Байтерек Велостанция', category: 'bike_park', lat: 51.1280, lng: 71.4490, eco_certified: true, eco_bonus_pts: 30, icon: '🚲', description: 'Туристік велостанция. Жалдау + экскурсия.' },
  { name: 'Жасыл Велопаркинг №1', category: 'bike_park', lat: 51.1900, lng: 71.3950, eco_certified: false, eco_bonus_pts: 20, icon: '🚴', description: 'Ботаникалық бақ жанындағы велопаркинг.' },
  { name: 'Сарыарқа Вело-Точка', category: 'bike_park', lat: 51.1810, lng: 71.4390, eco_certified: false, eco_bonus_pts: 20, icon: '🚴', description: 'Парк ішіндегі велопаркинг. Тегін.' },
  { name: 'Велошеринг Хаб Орталық', category: 'bike_park', lat: 51.1700, lng: 71.4400, eco_certified: true, eco_bonus_pts: 40, icon: '🚲', description: 'Astana Bike Share станциясы. Карта/телефонмен жалдау.', working_hours: '07:00-23:00' },
  { name: 'Esil Bike Repair', category: 'bike_park', lat: 51.1830, lng: 71.4280, eco_certified: false, eco_bonus_pts: 30, icon: '🔧', description: 'Велосипед жөндеу шеберханасы. Насос, инструмент.' },

  // ──── WATER POINTS × 8 ────
  { name: 'Есіл Жағалауы Тынығу', category: 'water', lat: 51.1790, lng: 71.4310, eco_certified: true, eco_bonus_pts: 50, icon: '💧', description: 'Есіл өзенінің тынығу нүктесі. Балық аулау, медитация.', is_open_24h: true },
  { name: 'Орталық Фонтан', category: 'water', lat: 51.1800, lng: 71.4440, eco_certified: false, eco_bonus_pts: 30, icon: '⛲', description: 'Орталық парк фонтаны. Жаз мезгілінде жұмыс.', working_hours: '10:00-22:00' },
  { name: 'Тауаразы Жағалауы', category: 'water', lat: 51.1650, lng: 71.3850, eco_certified: true, eco_bonus_pts: 70, icon: '🦆', description: 'Табиғи су қоймасы. Құстар бақылау, балық аулау.', is_open_24h: true },
  { name: 'EXPO Жасанды Көл', category: 'water', lat: 51.0920, lng: 71.4790, eco_certified: true, eco_bonus_pts: 55, icon: '🌊', description: 'EXPO аумағындағы декоративті көл. Фото нүкте.' },
  { name: 'Сарыарқа Бұлағы', category: 'water', lat: 51.1850, lng: 71.4420, eco_certified: true, eco_bonus_pts: 60, icon: '💧', description: 'Табиғи бұлақ. Таза ауа, тыныш орын.', is_open_24h: true },
  { name: 'Президент Паркі Фонтан', category: 'water', lat: 51.1285, lng: 71.4480, eco_certified: false, eco_bonus_pts: 35, icon: '⛲', description: 'Байтерек алдындағы үлкен фонтан.' },
  { name: 'Жасыл Арна', category: 'water', lat: 51.1720, lng: 71.4550, eco_certified: true, eco_bonus_pts: 45, icon: '🌿', description: 'Жасанды арна. Экологиялық дизайн. Балықтар бар.', is_open_24h: true },
  { name: 'Ботаникалық Бақ Көлі', category: 'water', lat: 51.2120, lng: 71.4000, eco_certified: true, eco_bonus_pts: 65, icon: '🦢', description: 'Ботаникалық бақ ішіндегі декоративті көл. Аққулар.' },

  // ──── LANDMARKS × 7 ────
  { name: 'Байтерек', name_kz: 'Байтерек мұнарасы', category: 'landmark', lat: 51.1284, lng: 71.4308, eco_certified: false, eco_bonus_pts: 100, icon: '🏛️', description: 'Астананың символы. Биіктігі 97 метр. Панорамалық алаң.', working_hours: '10:00-21:00' },
  { name: 'Хан Шатыр', name_kz: 'Хан Шатыр', category: 'landmark', lat: 51.1900, lng: 71.4100, eco_certified: false, eco_bonus_pts: 80, icon: '⛺', description: 'Әлемдегі ең үлкен шатыр ғимарат. Сауда + демалыс орталығы.' },
  { name: 'Нур-Астана Мешіті', name_kz: 'Нур-Астана Мешіті', category: 'landmark', lat: 51.1830, lng: 71.4565, eco_certified: false, eco_bonus_pts: 60, icon: '🕌', description: 'Орталық Азиядағы ең үлкен мешіттердің бірі.', working_hours: '06:00-22:00' },
  { name: 'ЭКСПО Шары', name_kz: 'EXPO Нур Әлем', category: 'landmark', lat: 51.0945, lng: 71.4780, eco_certified: true, eco_bonus_pts: 90, icon: '🌐', description: 'EXPO 2017 Нур Әлем шары. Энергетика мұражайы.' },
  { name: 'Дворец Мира және Бітімгершіліктің', name_kz: 'Бейбітшілік Сарайы', category: 'landmark', lat: 51.1247, lng: 71.4495, eco_certified: false, eco_bonus_pts: 70, icon: '🔷', description: 'Пирамида формасындағы бірегей ғимарат. Norman Foster жобасы.' },
  { name: 'Ұлттық Музей', name_kz: 'Ұлттық Музей', category: 'landmark', lat: 51.1269, lng: 71.4479, eco_certified: false, eco_bonus_pts: 80, icon: '🏛️', description: 'Қазақстанның ең үлкен музейі. 450 000+ артефакт.', working_hours: '10:00-18:00' },
  { name: 'Қазақ Елі Монументі', name_kz: 'Қазақ Елі Монументі', category: 'landmark', lat: 51.1900, lng: 71.4030, eco_certified: false, eco_bonus_pts: 50, icon: '🗿', description: 'Қазақстан тәуелсіздігінің символы. Тарихи орын.', is_open_24h: true },
];
