// database/seeds/data/users.ts
// 20 тест пайдаланушы — нақты Қазақ аттарымен

export const USERS = [
  { name: 'Арман Сейткали',    email: 'arman@mail.kz',     eco_points: 1240, eco_level: 'Explorer',      role: 'user'  },
  { name: 'Дана Нурланова',    email: 'dana@gmail.com',    eco_points: 2500, eco_level: 'Green Hero',    role: 'user'  },
  { name: 'Асель Қасымова',    email: 'asel@mail.kz',      eco_points: 800,  eco_level: 'Explorer',      role: 'user'  },
  { name: 'Берік Жаксыбеков',  email: 'berik@gmail.com',   eco_points: 350,  eco_level: 'Beginner',      role: 'user'  },
  { name: 'Айгүл Мұхамеджан',  email: 'aigul@mail.kz',     eco_points: 3200, eco_level: 'Eco Champion',  role: 'user'  },
  { name: 'Нұрлан Оспанов',    email: 'nurlan@mail.kz',    eco_points: 150,  eco_level: 'Beginner',      role: 'user'  },
  { name: 'Зарина Сатыбалды',  email: 'zarina@gmail.com',  eco_points: 1800, eco_level: 'Green Hero',    role: 'user'  },
  { name: 'Ерлан Бекболатов',  email: 'erlan@mail.kz',     eco_points: 920,  eco_level: 'Explorer',      role: 'user'  },
  { name: 'Мадина Тілеуова',   email: 'madina@gmail.com',  eco_points: 2100, eco_level: 'Green Hero',    role: 'user'  },
  { name: 'Санжар Алиев',      email: 'sanzhar@mail.kz',   eco_points: 450,  eco_level: 'Beginner',      role: 'user'  },
  { name: 'Гүлнара Серікқызы', email: 'gulnara@mail.kz',   eco_points: 1650, eco_level: 'Explorer',      role: 'user'  },
  { name: 'Тимур Абдуллин',    email: 'timur@gmail.com',   eco_points: 700,  eco_level: 'Explorer',      role: 'user'  },
  { name: 'Жанар Ертаева',     email: 'zhanar@mail.kz',    eco_points: 2900, eco_level: 'Eco Champion',  role: 'guide' },
  { name: 'Бауыржан Қонаев',   email: 'bauyrzhan@mail.kz', eco_points: 500,  eco_level: 'Beginner',      role: 'user'  },
  { name: 'Алина Попова',      email: 'alina@gmail.com',   eco_points: 1100, eco_level: 'Explorer',      role: 'user'  },
  { name: 'Серік Мамытбеков',  email: 'serik@mail.kz',     eco_points: 3800, eco_level: 'Eco Champion',  role: 'guide' },
  { name: 'Динара Ахметова',   email: 'dinara@gmail.com',  eco_points: 250,  eco_level: 'Beginner',      role: 'user'  },
  { name: 'Руслан Исаев',      email: 'ruslan@mail.kz',    eco_points: 1400, eco_level: 'Explorer',      role: 'user'  },
  { name: 'Камила Нурмагамбет',email: 'kamila@gmail.com',  eco_points: 1950, eco_level: 'Green Hero',    role: 'user'  },
  { name: 'Admin EcoRoute',    email: 'admin@ecoroute.kz', eco_points: 0,    eco_level: 'Eco Champion',  role: 'admin' },
];

// Eco Level ережесі:
// 0-499:    Beginner
// 500-1499: Explorer
// 1500-2999: Green Hero
// 3000+:    Eco Champion
