import { validatePromoCode } from './promocodes';
import { INSOMNIS_STORE_PLANS } from './plans';

export interface PaymentOrder {
  orderId: string;
  planId: string;
  planName: string;
  durationLabel: string;
  basePrice: number;
  finalPrice: number;
  promoCode?: string;
  discountPercent?: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  nickname?: string;
  email?: string;
  createdAt: string;
  expiresAt: string;
  paymentUrl?: string;
  cryptoInvoiceId?: number | string;
  cryptoPayUrl?: string;
  cryptoBotInvoiceUrl?: string;
  cryptoMiniAppInvoiceUrl?: string;
  cryptoPaidAsset?: string;
  cryptoPaidAmount?: string;
  paidAt?: string;
}

// In-memory order storage
const ORDERS_DB: Map<string, PaymentOrder> = new Map();

export interface CreateOrderRequest {
  planId: string;
  optionIndex?: number;
  promoCode?: string;
  paymentMethod: string;
  nickname?: string;
  email?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: PaymentOrder;
  paymentUrl?: string;
  error?: string;
}

export function createPaymentOrder(data: CreateOrderRequest): CreateOrderResponse {
  const plan = INSOMNIS_STORE_PLANS.find((p) => p.id === data.planId);
  if (!plan) {
    return {
      success: false,
      error: 'Указанный тариф не найден',
    };
  }

  const optionIndex = typeof data.optionIndex === 'number' && data.optionIndex >= 0 && data.optionIndex < plan.options.length
    ? data.optionIndex
    : 0;

  const option = plan.options[optionIndex];
  const basePrice = option.price;

  let finalPrice = basePrice;
  let discountPercent = 0;
  let validatedPromo: string | undefined;

  if (data.promoCode && data.promoCode.trim()) {
    const promoCheck = validatePromoCode(data.promoCode, basePrice);
    if (promoCheck.valid && promoCheck.discountPercent && promoCheck.finalPrice !== undefined) {
      discountPercent = promoCheck.discountPercent;
      finalPrice = promoCheck.finalPrice;
      validatedPromo = promoCheck.code;
    }
  }

  const orderId = `INS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

  // Construct checkout URL (supports Lava / CryptoBot / YooKassa / Telegram Stars)
  const paymentUrl = `/api/payments/checkout/${orderId}`;

  const order: PaymentOrder = {
    orderId,
    planId: plan.id,
    planName: plan.name,
    durationLabel: option.label,
    basePrice,
    finalPrice,
    promoCode: validatedPromo,
    discountPercent,
    paymentMethod: data.paymentMethod || 'CRYPTO_BOT',
    status: 'pending',
    nickname: data.nickname || 'Guest',
    email: data.email,
    createdAt: now.toISOString(),
    expiresAt,
    paymentUrl,
  };

  ORDERS_DB.set(orderId, order);

  return {
    success: true,
    order,
    paymentUrl,
  };
}

export function getOrder(orderId: string): PaymentOrder | undefined {
  return ORDERS_DB.get(orderId);
}

export function updateOrder(orderId: string, updates: Partial<PaymentOrder>): PaymentOrder | undefined {
  const order = ORDERS_DB.get(orderId);
  if (!order) return undefined;
  const updatedOrder = { ...order, ...updates };
  ORDERS_DB.set(orderId, updatedOrder);
  return updatedOrder;
}

export function completeOrder(
  orderId: string,
  paymentDetails?: {
    paidAsset?: string;
    paidAmount?: string;
    invoiceId?: number | string;
  }
): boolean {
  const order = ORDERS_DB.get(orderId);
  if (!order) return false;
  order.status = 'completed';
  order.paidAt = new Date().toISOString();
  if (paymentDetails) {
    if (paymentDetails.paidAsset) order.cryptoPaidAsset = paymentDetails.paidAsset;
    if (paymentDetails.paidAmount) order.cryptoPaidAmount = paymentDetails.paidAmount;
    if (paymentDetails.invoiceId) order.cryptoInvoiceId = paymentDetails.invoiceId;
  }
  ORDERS_DB.set(orderId, order);
  return true;
}
