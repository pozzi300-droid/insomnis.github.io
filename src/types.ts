export type Locale = 'ru' | 'en' | 'ua';

export interface ServerPlaytime {
  server: string;
  seconds: number;
  active?: boolean;
}

export interface SubscriptionItem {
  id: number;
  name: string;
  until: string;
  daysLeft: number;
  active: boolean;
  type?: 'default' | 'beta';
}

export interface User {
  username: string;
  email: string;
  uid?: number | string;
  role?: string;
  createdAt?: string;
  plan?: string;
  expiresAt?: string;
  hwid?: string;
  twoFactorEnabled?: boolean;
  discordLinked?: boolean;
  servers?: ServerPlaytime[];
  subscriptions?: SubscriptionItem[];
  promocode?: {
    code: string;
    discount: string;
    referralPercent: number;
    revenue: number;
    transactions: number;
  };
}

export interface PlanOption {
  id: number;
  label: string;
  price: number;
}

export interface StoreItem {
  id: number | string;
  name: string;
  price: string;
  rawPrice: number;
  period: string;
  category?: string;
  tariff?: string;
  displayPrice?: string;
  description: string;
  color: string;
  options?: PlanOption[];
}

export type AuthMode = 'login' | 'register' | 'forgot' | '2fa';
