export interface InsomnisPlanOption {
  id: number;
  label: string;
  price: number;
}

export interface InsomnisStorePlan {
  id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  color: string;
  shortDesc: string;
  fullDesc?: string;
  features: string[];
  options: InsomnisPlanOption[];
}

export const INSOMNIS_STORE_PLANS: InsomnisStorePlan[] = [
  {
    id: 'pass-standard',
    name: 'Проходка (Pass)',
    category: 'Доступ на сервер',
    price: 99,
    discount: 10,
    color: '#38bdf8',
    shortDesc: 'Постоянный доступ на сервер Insomnis, добавление ника в WhiteList и базовые привилегии игрока.',
    fullDesc: 'Официальный доступ в ванильный мир Insomnis. Ваш никнейм мгновенно вносится в белый список сервера.',
    features: [
      'Доступ на основной сервер 24/7',
      'Защита построек через CoreProtect',
      'Доступ к голосовому чату Simple Voice Chat',
      'Участие во всех сезонных событиях',
      'Доступ к торговой площадке игроков',
    ],
    options: [
      { id: 1, label: '7 дн', price: 99 },
      { id: 2, label: '30 дн', price: 249 },
      { id: 3, label: 'Навсегда', price: 499 },
    ],
  },
  {
    id: 'pass-plus',
    name: 'Проходка+ (Pass+)',
    category: 'Расширенный доступ',
    price: 199,
    discount: 15,
    color: '#818cf8',
    shortDesc: 'Расширенный пропуск с приоритетным входом, уникальным цветом ника в чате и косметическими эффектами.',
    fullDesc: 'Идеальный выбор для активных участников. Включает всё из Pass, а также приоритетный слот и косметические бонусы.',
    features: [
      'Все возможности стандартной проходки',
      'Приоритетный вход при полном сервере',
      'Выбор цвета ника в чате и табе (/color)',
      'Дополнительные слоты для точек дома (/sethome)',
      'Уникальная роль в Discord сервере',
      'Значок спонсора на веб-карте мира',
    ],
    options: [
      { id: 1, label: '7 дн', price: 199 },
      { id: 2, label: '30 дн', price: 449 },
      { id: 3, label: 'Навсегда', price: 899 },
    ],
  },
];
