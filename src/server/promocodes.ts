export interface PromoCode {
  code: string;
  discountPercent: number;
  maxUses?: number;
  currentUses: number;
  description: string;
  isActive: boolean;
  expiresAt?: string;
}

// Server-side authoritative storage of valid promo codes
export const PROMO_CODES_DB: Record<string, PromoCode> = {
  INSOMNIS: {
    code: 'INSOMNIS',
    discountPercent: 20,
    currentUses: 342,
    description: 'Официальный промокод сервера Insomnis',
    isActive: true,
  },
  VANILLA: {
    code: 'VANILLA',
    discountPercent: 15,
    currentUses: 189,
    description: 'Скидка на ванильный проход',
    isActive: true,
  },
  START: {
    code: 'START',
    discountPercent: 10,
    currentUses: 512,
    description: 'Стартовая скидка для новых игроков',
    isActive: true,
  },
  WEXDAMI: {
    code: 'WEXDAMI',
    discountPercent: 25,
    currentUses: 78,
    description: 'Партнёрский промокод разработчика',
    isActive: true,
  },
  DISCORD: {
    code: 'DISCORD',
    discountPercent: 15,
    currentUses: 421,
    description: 'Скидка для участников Discord сообщества',
    isActive: true,
  },
  SPRING2026: {
    code: 'SPRING2026',
    discountPercent: 20,
    currentUses: 95,
    description: 'Весенний промокод',
    isActive: true,
  },
};

export interface ValidatePromoResult {
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discountAmount?: number;
  finalPrice?: number;
  message: string;
}

export function validatePromoCode(rawCode: string, rawPrice: number): ValidatePromoResult {
  if (!rawCode || typeof rawCode !== 'string') {
    return {
      valid: false,
      message: 'Введите промокод',
    };
  }

  const cleanCode = rawCode.trim().toUpperCase();
  const promo = PROMO_CODES_DB[cleanCode];

  if (!promo) {
    return {
      valid: false,
      message: 'Промокод не найден или недействителен',
    };
  }

  if (!promo.isActive) {
    return {
      valid: false,
      message: 'Срок действия промокода истёк',
    };
  }

  if (promo.maxUses && promo.currentUses >= promo.maxUses) {
    return {
      valid: false,
      message: 'Лимит использований данного промокода исчерпан',
    };
  }

  const discountPercent = promo.discountPercent;
  const discountAmount = Math.round((rawPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, rawPrice - discountAmount);

  return {
    valid: true,
    code: promo.code,
    discountPercent,
    discountAmount,
    finalPrice,
    message: `Промокод применён (-${discountPercent}%)`,
  };
}
