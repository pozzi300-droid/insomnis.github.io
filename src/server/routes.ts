import { Router, Request, Response } from 'express';
import { validatePromoCode } from './promocodes';
import { INSOMNIS_STORE_PLANS } from './plans';
import { createPaymentOrder, getOrder } from './payments';
import { getServerStatus } from './serverStatus';
import {
  createCryptoBotInvoice,
  verifyCryptoPayWebhookSignature,
  processCryptoBotWebhookPayload,
} from './cryptoPay';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Insomnis Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Server Status & Live Metrics
apiRouter.get('/server-status', (_req: Request, res: Response) => {
  res.json(getServerStatus());
});

// Plans Catalog
apiRouter.get('/plans', (_req: Request, res: Response) => {
  res.json({
    success: true,
    plans: INSOMNIS_STORE_PLANS,
  });
});

// Promo code validation endpoint
apiRouter.post('/promocodes/validate', (req: Request, res: Response) => {
  try {
    const { code, rawPrice } = req.body || {};
    const priceNum = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice) || 99;
    const result = validatePromoCode(code, priceNum);
    res.json(result);
  } catch {
    res.status(500).json({ valid: false, message: 'Ошибка проверки промокода' });
  }
});

// Payments: Create Generic Order
apiRouter.post('/payments/create-order', (req: Request, res: Response) => {
  try {
    const { planId, optionIndex, promoCode, paymentMethod, nickname, email } = req.body || {};
    const result = createPaymentOrder({
      planId,
      optionIndex,
      promoCode,
      paymentMethod,
      nickname,
      email,
    });
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка создания заказа' });
  }
});

/**
 * 1. Crypto Bot: Create Invoice Endpoint
 * Accepts order ID, checks exact amount in database, calls Crypto Pay API and returns pay_url
 */
apiRouter.post(['/crypto/create-invoice', '/payments/crypto/create-invoice'], async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body || {};

    if (!orderId || typeof orderId !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Необходимо указать orderId',
      });
      return;
    }

    const hostHeader = req.get('x-forwarded-proto') && req.get('host')
      ? `${req.get('x-forwarded-proto')}://${req.get('host')}`
      : undefined;

    const result = await createCryptoBotInvoice({
      orderId,
      hostUrl: hostHeader,
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (err: any) {
    console.error('[API] create-invoice error:', err);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка при создании инвойса Crypto Bot',
    });
  }
});

/**
 * 2. Crypto Bot: Webhook Endpoint
 * Strict signature validation (SHA256 of API Token -> HMAC-SHA256 of raw body),
 * price tampering prevention, and idempotent completion.
 */
apiRouter.post(['/crypto/webhook', '/payments/crypto/webhook'], (req: Request, res: Response) => {
  try {
    const signatureHeader = req.headers['crypto-pay-api-signature'] as string | undefined;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    // Validate Signature
    const verification = verifyCryptoPayWebhookSignature(rawBody, signatureHeader);
    if (!verification.valid) {
      console.warn(
        `[CryptoPay Webhook] UNAUTHORIZED: signature mismatch or missing from IP ${req.ip}. Error: ${verification.error}`
      );
      res.status(401).json({
        ok: false,
        error: verification.error || 'Invalid Crypto-Pay-API-Signature',
      });
      return;
    }

    // Process update with idempotency & amount verification
    const result = processCryptoBotWebhookPayload(req.body);
    res.status(result.statusCode).json(result.responseBody);
  } catch (err: any) {
    console.error('[CryptoPay Webhook] Internal server error processing webhook:', err);
    res.status(500).json({
      ok: false,
      error: 'Internal webhook processing error',
    });
  }
});

// Payments: Order Status
apiRouter.get('/payments/status/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = getOrder(orderId);
  if (!order) {
    res.status(404).json({ success: false, error: 'Заказ не найден' });
    return;
  }
  res.json({ success: true, order });
});
