import crypto from 'crypto';
import { getOrder, updateOrder, completeOrder, PaymentOrder } from './payments';

// Supported Crypto Bot environments
const CRYPTO_BOT_MAINNET_API = 'https://pay.crypt.bot/api';
const CRYPTO_BOT_TESTNET_API = 'https://testnet-pay.crypt.bot/api';

/**
 * Get Crypto Bot API Token from environment variables
 */
export function getCryptoBotApiToken(): string {
  return (
    process.env.CRYPTO_BOT_API_TOKEN ||
    process.env.CRYPTO_PAY_TOKEN ||
    process.env.CRYPTO_BOT_TOKEN ||
    ''
  );
}

/**
 * Get the API base URL depending on environment / testnet setting
 */
export function getCryptoBotApiBaseUrl(): string {
  const isTestnet =
    process.env.CRYPTO_BOT_TESTNET === 'true' ||
    process.env.CRYPTO_PAY_TESTNET === 'true' ||
    getCryptoBotApiToken().startsWith('test_');

  return isTestnet ? CRYPTO_BOT_TESTNET_API : CRYPTO_BOT_MAINNET_API;
}

export interface CryptoBotInvoiceResult {
  invoice_id: number;
  status: 'active' | 'paid' | 'expired';
  hash: string;
  currency_type: 'fiat' | 'crypto';
  asset?: string;
  fiat?: string;
  amount: string;
  pay_url: string;
  bot_invoice_url: string;
  mini_app_invoice_url: string;
  web_app_invoice_url?: string;
  description?: string;
  payload?: string;
  created_at: string;
  expiration_date?: string;
}

export interface CreateInvoiceOptions {
  orderId: string;
  hostUrl?: string;
}

export interface CreateInvoiceResponse {
  success: boolean;
  pay_url?: string;
  bot_invoice_url?: string;
  mini_app_invoice_url?: string;
  invoice_id?: number;
  order?: PaymentOrder;
  error?: string;
}

/**
 * 1. Create Crypto Bot Invoice for an order
 * Performs server-side check of the exact price in database, then creates invoice via Crypto Bot API.
 */
export async function createCryptoBotInvoice(options: CreateInvoiceOptions): Promise<CreateInvoiceResponse> {
  const { orderId, hostUrl } = options;
  const order = getOrder(orderId);

  if (!order) {
    console.error(`[CryptoPay] Order not found in database: ${orderId}`);
    return {
      success: false,
      error: 'Заказ не найден в базе данных',
    };
  }

  if (order.status === 'completed') {
    return {
      success: false,
      error: 'Этот заказ уже был успешно оплачен',
    };
  }

  const apiToken = getCryptoBotApiToken();

  // If API token is configured in env, make real server request to Crypto Pay API
  if (apiToken) {
    try {
      const baseUrl = getCryptoBotApiBaseUrl();
      const apiUrl = `${baseUrl}/createInvoice`;

      const fallbackHost = hostUrl || process.env.APP_URL || 'https://insomnis.fun';
      const returnUrl = `${fallbackHost.replace(/\/+$/, '')}/?order=${order.orderId}&status=success`;

      const requestPayload = {
        currency_type: 'fiat',
        fiat: 'RUB',
        amount: String(order.finalPrice),
        description: `Оплата привилегии "${order.planName}" (${order.durationLabel}) для игрока ${order.nickname || 'игрок'}`,
        hidden_message: `Спасибо за поддержку Insomnis! Привилегия "${order.planName}" успешно активирована.`,
        payload: order.orderId,
        paid_btn_name: 'callback',
        paid_btn_url: returnUrl,
        expires_in: 1800, // 30 minutes
      };

      console.log(`[CryptoPay] Creating invoice for order ${orderId}, amount: ${order.finalPrice} RUB`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Crypto-Pay-API-Token': apiToken,
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        console.error('[CryptoPay] API error response:', data);
        return {
          success: false,
          error: data.error?.name || data.description || 'Ошибка при создании счета в Crypto Bot',
        };
      }

      const invoice: CryptoBotInvoiceResult = data.result;

      // Update order in database with invoice details
      updateOrder(orderId, {
        cryptoInvoiceId: invoice.invoice_id,
        cryptoPayUrl: invoice.pay_url,
        cryptoBotInvoiceUrl: invoice.bot_invoice_url,
        cryptoMiniAppInvoiceUrl: invoice.mini_app_invoice_url,
        paymentUrl: invoice.pay_url,
      });

      console.log(`[CryptoPay] Invoice #${invoice.invoice_id} successfully created for order ${orderId}`);

      return {
        success: true,
        pay_url: invoice.pay_url,
        bot_invoice_url: invoice.bot_invoice_url,
        mini_app_invoice_url: invoice.mini_app_invoice_url,
        invoice_id: invoice.invoice_id,
        order: getOrder(orderId),
      };
    } catch (err: any) {
      console.error('[CryptoPay] Network/Server exception while calling Crypto Pay API:', err);
      return {
        success: false,
        error: `Не удалось связаться с сервером Crypto Bot: ${err?.message || 'Network error'}`,
      };
    }
  }

  // Fallback for development/sandbox when token is not yet provided in .env
  console.warn('[CryptoPay] CRYPTO_BOT_API_TOKEN is not set in environment variables. Generating sandbox invoice link.');
  const mockInvoiceId = Math.floor(100000 + Math.random() * 900000);
  const mockPayUrl = `https://t.me/CryptoBot?start=IV${mockInvoiceId}_sandbox`;

  updateOrder(orderId, {
    cryptoInvoiceId: mockInvoiceId,
    cryptoPayUrl: mockPayUrl,
    paymentUrl: mockPayUrl,
  });

  return {
    success: true,
    pay_url: mockPayUrl,
    bot_invoice_url: mockPayUrl,
    mini_app_invoice_url: mockPayUrl,
    invoice_id: mockInvoiceId,
    order: getOrder(orderId),
  };
}

/**
 * 2. Strict Webhook Signature Validation
 *
 * Algorithm required by Crypto Pay:
 * 1. Extract `Crypto-Pay-API-Signature` header.
 * 2. Compute SHA256 of the API token -> binary secret key for HMAC.
 * 3. Compute HMAC-SHA256 of raw request body using this secret key.
 * 4. Timing-safe compare computed hex signature against the header.
 */
export function verifyCryptoPayWebhookSignature(
  rawBody: Buffer | string,
  signatureHeader: string | undefined
): { valid: boolean; error?: string } {
  if (!signatureHeader || typeof signatureHeader !== 'string') {
    return { valid: false, error: 'Missing Crypto-Pay-API-Signature header' };
  }

  const apiToken = getCryptoBotApiToken();
  if (!apiToken) {
    return { valid: false, error: 'CRYPTO_BOT_API_TOKEN is not configured on server' };
  }

  try {
    // Secret key = SHA256(api_token)
    const secretKey = crypto.createHash('sha256').update(apiToken).digest();

    // HMAC = HMAC_SHA256(secretKey, rawBody)
    const bodyBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf-8');
    const calculatedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(bodyBuffer)
      .digest('hex');

    const expectedBuffer = Buffer.from(calculatedSignature, 'utf8');
    const actualBuffer = Buffer.from(signatureHeader.trim(), 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return { valid: false, error: 'Signature length mismatch' };
    }

    const isValid = crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    if (!isValid) {
      return { valid: false, error: 'Signature checksum verification failed' };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: `Signature verification exception: ${err?.message}` };
  }
}

export interface CryptoBotWebhookUpdate {
  update_id: number;
  update_type: 'invoice_paid' | string;
  request_date: string;
  payload: {
    invoice_id: number;
    status: 'paid' | 'active' | 'expired';
    hash?: string;
    currency_type?: 'fiat' | 'crypto';
    asset?: string;
    fiat?: string;
    amount: string;
    paid_asset?: string;
    paid_amount?: string;
    payload?: string; // Contains our orderId
    paid_at?: string;
  };
}

/**
 * 3. Process Crypto Bot Webhook
 * Performs strict validation, idempotency checks, price tampering checks, and order fulfillment.
 */
export function processCryptoBotWebhookPayload(update: CryptoBotWebhookUpdate): {
  statusCode: number;
  responseBody: Record<string, any>;
} {
  const { update_type, payload: invoice } = update;

  console.log(`[CryptoPay Webhook] Received update: type=${update_type}, invoice_id=${invoice?.invoice_id}, status=${invoice?.status}`);

  if (update_type !== 'invoice_paid' || !invoice) {
    // Non-paid event, acknowledge receipt
    return {
      statusCode: 200,
      responseBody: { ok: true, status: 'ignored_update_type' },
    };
  }

  if (invoice.status !== 'paid') {
    return {
      statusCode: 200,
      responseBody: { ok: true, status: 'invoice_not_paid' },
    };
  }

  // Extract our internal orderId from invoice payload
  const orderId = invoice.payload;
  if (!orderId) {
    console.error('[CryptoPay Webhook] Critical: Webhook invoice does not contain custom payload (orderId).', invoice);
    return {
      statusCode: 400,
      responseBody: { ok: false, error: 'Missing orderId in invoice payload' },
    };
  }

  const order = getOrder(orderId);
  if (!order) {
    console.error(`[CryptoPay Webhook] Order #${orderId} not found in server database.`);
    return {
      statusCode: 404,
      responseBody: { ok: false, error: `Order #${orderId} not found` },
    };
  }

  // IDEMPOTENCY CHECK: If already paid/completed, return 200 immediately without duplicate fulfillment
  if (order.status === 'completed') {
    console.log(`[CryptoPay Webhook] Idempotency: Order #${orderId} is already marked as completed. Skipping fulfillment.`);
    return {
      statusCode: 200,
      responseBody: { ok: true, status: 'already_completed' },
    };
  }

  // ANTI-TAMPERING CHECK: Verify amount & currency match the exact order in our database
  if (invoice.currency_type === 'fiat') {
    const invoiceFiat = (invoice.fiat || '').toUpperCase();
    const invoiceAmount = parseFloat(invoice.amount);
    const expectedAmount = order.finalPrice;

    if (invoiceFiat !== 'RUB') {
      console.error(`[CryptoPay Webhook] Security Alert: Currency mismatch for order ${orderId}! Expected RUB, got ${invoiceFiat}`);
      return {
        statusCode: 422,
        responseBody: { ok: false, error: 'Currency tampering detected' },
      };
    }

    if (Math.abs(invoiceAmount - expectedAmount) > 0.01) {
      console.error(`[CryptoPay Webhook] Security Alert: Price tampering for order ${orderId}! Expected ${expectedAmount} RUB, got ${invoiceAmount} RUB`);
      return {
        statusCode: 422,
        responseBody: { ok: false, error: 'Amount mismatch / price tampering detected' },
      };
    }
  }

  // Mark order as completed and record crypto payment details
  completeOrder(orderId, {
    paidAsset: invoice.paid_asset || invoice.asset,
    paidAmount: invoice.paid_amount || invoice.amount,
    invoiceId: invoice.invoice_id,
  });

  console.log(
    `[CryptoPay Webhook] SUCCESS: Order #${orderId} fulfilled! Privileges granted to player "${order.nickname}". Paid: ${invoice.paid_amount || invoice.amount} ${invoice.paid_asset || invoice.asset || 'crypto'}.`
  );

  return {
    statusCode: 200,
    responseBody: {
      ok: true,
      message: `Order ${orderId} successfully completed and fulfilled`,
      orderId,
    },
  };
}
