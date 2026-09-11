import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { StoreItem, Locale } from '../types';
import { translations } from '../data/translations';
import { getAssetUrl } from '../utils/assets';

interface CheckoutModalProps {
  isOpen: boolean;
  plan: StoreItem | null;
  locale?: Locale;
  onClose: () => void;
  onSuccess: (planName: string) => void;
}

// Payment methods
const paymentRegions = [
  {
    regionKey: 'regionRu',
    methods: [
      { id: 'RU_MIR', label: 'МИР', logo: getAssetUrl('/images/cabinet/mir.webp') },
      { id: 'RU_SBP', label: 'СБП', logo: getAssetUrl('/images/cabinet/sbp.svg') },
    ],
  },
  {
    regionKey: 'regionEu',
    methods: [
      { id: 'EU_VISA', label: 'Visa / MC', logo: getAssetUrl('/images/cabinet/visaMaster.png') },
      { id: 'CRYPTO_BOT', label: 'Crypto Bot', logo: getAssetUrl('/images/cabinet/crypto_bot.jpg') },
    ],
  },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  plan,
  locale = 'ru',
  onClose,
  onSuccess,
}) => {
  const t = translations[locale];
  const v = t.cabinet.payment;

  const [selectedMethod, setSelectedMethod] = useState('CRYPTO_BOT');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [promo, setPromo] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state on open or plan change
  useEffect(() => {
    if (plan) {
      setPromo('');
      setPromoStatus(null);
      setDiscountPercent(null);
      setAgreed(false);
      setSelectedMethod('CRYPTO_BOT');
      setSelectedOptionIndex(0);
      setIsProcessing(false);
      setIsRedirecting(false);
      setIsSuccess(false);
    }
  }, [plan?.id]);

  // Animate modal open
  useEffect(() => {
    if (!isOpen || !plan) return;

    if (overlayRef.current && modalRef.current) {
      gsap.killTweensOf([overlayRef.current, modalRef.current]);
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: 'power3.out', force3D: true }
      );
    }
  }, [isOpen, plan]);

  // Effective duration options (7 дн, 30 дн, Навсегда)
  const durationOptions = useMemo(() => {
    if (plan?.options && plan.options.length > 0) {
      return plan.options;
    }
    const base = plan?.rawPrice || 99;
    return [
      { id: 1, label: '7 дн', price: base },
      { id: 2, label: '30 дн', price: base === 99 ? 249 : Math.round(base * 2.25) },
      { id: 3, label: 'Навсегда', price: base === 99 ? 499 : Math.round(base * 4.5) },
    ];
  }, [plan]);

  // Selected option & price calculation
  const currentOption = useMemo(() => {
    if (durationOptions.length > 0) {
      return durationOptions[selectedOptionIndex] || durationOptions[0];
    }
    return null;
  }, [durationOptions, selectedOptionIndex]);

  const basePrice = useMemo(() => {
    if (currentOption) return currentOption.price;
    if (plan?.rawPrice) return plan.rawPrice;
    return 0;
  }, [currentOption, plan]);

  const finalPrice = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return basePrice;
    return Math.max(0, Math.round(basePrice * (1 - discountPercent / 100)));
  }, [basePrice, discountPercent]);

  // Handle promo code via Backend API
  const promoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validatePromoCode = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setPromoStatus(null);
      setDiscountPercent(null);
      return;
    }

    try {
      const response = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean, planId: plan?.id }),
      });

      const data = await response.json();
      if (data.valid && data.discountPercent) {
        setDiscountPercent(data.discountPercent);
        setPromoStatus({ type: 'success', text: `-${data.discountPercent}%` });
      } else {
        setDiscountPercent(null);
        setPromoStatus({ type: 'error', text: data.message || v.promoNotFound });
      }
    } catch {
      // Fallback in case network is disconnected
      setDiscountPercent(null);
      setPromoStatus({ type: 'error', text: v.promoNotFound });
    }
  };

  const handlePromoChange = (val: string) => {
    setPromo(val);
    if (promoTimeoutRef.current) {
      clearTimeout(promoTimeoutRef.current);
    }
    if (!val.trim()) {
      setPromoStatus(null);
      setDiscountPercent(null);
      return;
    }
    promoTimeoutRef.current = setTimeout(() => {
      validatePromoCode(val);
    }, 300);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (overlayRef.current && modalRef.current) {
      gsap.killTweensOf([overlayRef.current, modalRef.current]);
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.15, ease: 'power2.in' });
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.96,
        y: 8,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: onClose,
      });
      // Immediate fallback to ensure modal ALWAYS closes reliably
      setTimeout(() => {
        onClose();
      }, 160);
    } else {
      onClose();
    }
  };

  const handlePurchase = async () => {
    if (!agreed || isProcessing || isRedirecting) return;

    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan?.id,
          optionIndex: selectedOptionIndex,
          promoCode: promo ? promo.trim().toUpperCase() : undefined,
          paymentMethod: selectedMethod,
        }),
      });

      const orderData = await orderRes.json();
      const orderId = orderData.order?.orderId;

      if (orderId && selectedMethod === 'CRYPTO_BOT') {
        // 2. Request real Crypto Bot Invoice from backend
        const invoiceRes = await fetch('/api/crypto/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const invoiceData = await invoiceRes.json();

        if (invoiceData.success && invoiceData.pay_url) {
          setIsProcessing(false);
          setIsRedirecting(true);
          setTimeout(() => {
            window.location.href = invoiceData.pay_url;
          }, 600);
          return;
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsRedirecting(true);
      setTimeout(() => {
        setIsRedirecting(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(plan?.name ? `${plan.name} (${currentOption?.label || ''})` : 'Item');
          handleClose();
        }, 800);
      }, 900);
    }, 800);
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none font-jacobs">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer overflow-hidden"
        onClick={handleClose}
      >
        {/* Backdrop Subtle Noise (reduced by 50% to opacity-10) */}
        <div className="noise absolute inset-0 opacity-10 pointer-events-none select-none" aria-hidden="true" />
      </div>

      {/* Modal Container */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#07090e]/95 border border-white/[0.08] shadow-[0_16px_70px_rgba(0,0,0,0.8)] w-full max-w-[860px] max-h-[92vh] flex flex-col md:flex-row transition-colors"
      >
        {/* Insomnis card background pattern image */}
        <img
          src="/illustrations/main.avif"
          className="insomnis-card-pattern"
          aria-hidden="true"
          alt=""
        />
        {/* Ambient Site-Themed Glows & Subtle Noise Texture (reduced by 50% to opacity-12) */}
        <div className="noise absolute inset-0 opacity-12 pointer-events-none select-none z-[2]" aria-hidden="true" />
        <div className="absolute inset-0 bg-blue-950/15 pointer-events-none z-[1]" />
        <div className="absolute w-96 h-96 -left-20 -top-20 bg-blue-500/25 rounded-full opacity-50 blur-[110px] pointer-events-none z-[1]" />
        <div className="absolute w-96 h-96 -right-20 -bottom-20 bg-sky-500/20 rounded-full opacity-50 blur-[110px] pointer-events-none z-[1]" />

        {/* Left column preview banner (styled identically to StoreSection cards, desktop only) */}
        <div className="hidden md:flex flex-col justify-between w-[310px] m-4 p-7 rounded-[32px] relative overflow-hidden bg-black/40 border border-white/[0.06] z-10 flex-shrink-0">
          <img
            src="/illustrations/main.avif"
            className="insomnis-card-pattern"
            aria-hidden="true"
            alt=""
          />
          <div className="noise absolute inset-0 opacity-10 pointer-events-none select-none z-[2]" aria-hidden="true" />
          <div className="absolute size-80 -left-20 -top-20 bg-blue-500/25 rounded-[100%] opacity-55 blur-[75px] pointer-events-none z-[1]" />
          <div className="absolute size-80 -right-20 -bottom-20 bg-sky-500/20 rounded-[100%] opacity-55 blur-[75px] pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-blue-950/15 pointer-events-none z-[1]" />

          {/* Top category pill */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-jacobs font-semibold text-blue-200 bg-blue-300/20 border border-blue-400/30 px-3 py-1 rounded-xl uppercase tracking-wider">
              {plan.category || 'Привилегия'}
            </span>
            <Sparkles className="size-4 text-blue-300/70" />
          </div>

          {/* Center plan info */}
          <div className="relative z-10 flex flex-col items-center text-center gap-3.5 my-auto py-6">
            <p className="font-jacobs font-bold text-white text-3xl leading-tight">
              {plan.name}
            </p>

            <span className="bg-blue-300/20 px-4 py-1.5 inline-block leading-none rounded-2xl shadow-lg shadow-blue-500/10">
              <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-4xl font-jacobs font-bold">
                {finalPrice} ₽
              </span>
            </span>

            <span className="text-[12px] font-jacobs text-white/50">
              Срок: <span className="text-blue-300 font-medium">{currentOption?.label || '7 дн'}</span>
            </span>

            {plan.description && (
              <p className="text-[13px] font-jacobs text-white/60 leading-relaxed max-w-[240px] line-clamp-4">
                {plan.description}
              </p>
            )}
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 flex items-center justify-center gap-2 text-white/40 text-[12px] pt-2 border-t border-white/[0.06]">
            <ShieldCheck size={14} className="text-blue-300/80" />
            <span>Мгновенная выдача</span>
          </div>
        </div>

        {/* Right column checkout form */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 md:py-8 md:px-10 overflow-y-auto relative z-10 max-h-[90vh]">
          {/* Order info */}
          <div className="mb-4 pr-10 sm:pr-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-jacobs font-semibold text-blue-200 bg-blue-300/20 border border-blue-400/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
                {v.order} #{plan.id}
              </span>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="bg-blue-300/20 px-3.5 py-1 inline-block leading-none rounded-2xl">
                <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-3xl sm:text-4xl font-jacobs font-bold">
                  {finalPrice} ₽
                </span>
              </span>
              <span className="text-[14px] font-jacobs text-white/40">
                / {currentOption ? currentOption.label : '7 дн'}
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-4">
            <p className="text-[11px] font-jacobs font-medium text-white/40 uppercase tracking-[0.08em] mb-2">
              {v.method}
            </p>
            <div className="flex flex-col gap-2">
              {paymentRegions.map((reg) => (
                <div key={reg.regionKey} className="flex items-center gap-2">
                  <span className="text-[11px] font-jacobs text-white/35 w-[52px] flex-shrink-0 leading-tight">
                    {reg.regionKey === 'regionRu' ? v.regionRu : v.regionEu}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {reg.methods.map((meth) => {
                      const isAvailable = meth.id === 'CRYPTO_BOT';
                      const isActive = selectedMethod === meth.id && isAvailable;
                      return (
                        <button
                          key={meth.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => {
                            if (isAvailable) setSelectedMethod(meth.id);
                          }}
                          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-[12px] font-jacobs font-medium transition-all duration-200 ${
                            isAvailable
                              ? isActive
                                ? 'bg-blue-400/20 text-blue-100 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-semibold cursor-pointer'
                                : 'bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.07] hover:text-white cursor-pointer'
                              : 'opacity-35 cursor-not-allowed bg-white/[0.01] border border-white/[0.04] text-white/30 select-none'
                          }`}
                        >
                          <img
                            src={meth.logo}
                            alt={meth.label}
                            className={`object-contain flex-shrink-0 ${
                              meth.id === 'CRYPTO_BOT' ? 'rounded-[10px]' : ''
                            }`}
                            style={{
                              width: 18,
                              height: 14,
                              filter: isAvailable ? 'none' : 'grayscale(1) opacity(0.35)',
                            }}
                          />
                          <span>{meth.label}</span>
                          {!isAvailable && (
                            <span className="text-[9px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded-md font-sans">
                              {locale === 'en' ? 'Unavailable' : locale === 'ua' ? 'Недоступно' : 'Недоступно'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Duration selection (7 дн, 30 дн, Навсегда) */}
          <div className="mb-4">
            <p className="text-[11px] font-jacobs font-medium text-white/40 uppercase tracking-[0.08em] mb-2">
              Количество дней
            </p>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((opt, oIdx) => {
                const isActive = selectedOptionIndex === oIdx;
                const hasDiscount = Boolean(discountPercent && discountPercent > 0);
                const optFinalPrice = hasDiscount
                  ? Math.max(0, Math.round(opt.price * (1 - (discountPercent || 0) / 100)))
                  : opt.price;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOptionIndex(oIdx)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-[12px] font-jacobs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-400/20 text-blue-100 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-semibold'
                        : 'bg-white/[0.03] text-white/50 border border-white/[0.06] hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {hasDiscount ? (
                      <span className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-semibold ${isActive ? 'text-blue-200' : 'text-blue-300'}`}>
                          · {optFinalPrice} ₽
                        </span>
                        <span className="text-[10px] line-through text-white/30">
                          {opt.price} ₽
                        </span>
                      </span>
                    ) : (
                      <span className={`text-[11px] ${isActive ? 'text-blue-300' : 'text-white/35'}`}>
                        · {opt.price} ₽
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Promo code */}
          <div className="mb-4">
            <p className="text-[11px] font-jacobs font-medium text-white/40 uppercase tracking-[0.08em] mb-2">
              {v.promoCode}
            </p>
            <div className="flex items-center h-[42px] pl-4 pr-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] focus-within:border-blue-400/40 focus-within:bg-white/[0.05] transition-colors">
              <input
                className="flex-1 bg-transparent text-[13px] text-white/80 font-jacobs placeholder:text-white/25 outline-none tracking-wide"
                placeholder={v.promoPlaceholder}
                type="text"
                value={promo}
                onChange={(e) => handlePromoChange(e.target.value)}
              />
              {promoStatus && (
                <span
                  className={`px-3 py-1 rounded-xl text-[11px] font-jacobs font-medium whitespace-nowrap ${
                    promoStatus.type === 'success'
                      ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30'
                      : 'bg-white/[0.04] text-white/35'
                  }`}
                >
                  {promoStatus.text}
                </span>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <label
            className="flex items-start gap-3 mb-4 cursor-pointer select-none group"
            onClick={() => setAgreed(!agreed)}
          >
            <div
              className={`w-4 h-4 mt-0.5 rounded-[6px] border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                agreed
                  ? 'bg-blue-300 border-blue-300 text-black'
                  : 'border-white/20 bg-white/[0.03] group-hover:border-white/40'
              }`}
            >
              {agreed && (
                <svg fill="none" height="8" viewBox="0 0 10 8" width="10">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <span className="text-[11px] font-jacobs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
              {v.agreeBefore}
              <span className="text-blue-300 underline underline-offset-2 decoration-blue-300/40 hover:text-blue-200 transition-colors">
                {v.agreeTerms}
              </span>
              {v.agreeAfter}
            </span>
          </label>

          {/* Action buttons styled with the site's primary button style */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={!agreed || isProcessing || isRedirecting}
              onClick={handlePurchase}
              className={`group/btn w-full flex items-center justify-center py-3.5 px-6 rounded-2xl font-jacobs text-[14px] font-bold text-black transition-all duration-300 bg-white hover:bg-white/90 ring-1 ring-white/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] ${
                agreed
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-40 hover:bg-white hover:shadow-none'
              } ${isProcessing || isRedirecting ? 'opacity-65' : ''}`}
            >
              <span className="flex items-center gap-2 justify-center">
                {isRedirecting
                  ? v.redirecting
                  : isProcessing
                  ? v.processing
                  : isSuccess
                  ? (locale === 'en' ? 'Success!' : locale === 'ua' ? 'Успішно!' : 'Успешно!')
                  : `${v.pay} ${finalPrice} ₽`}
                {!isProcessing && !isRedirecting && !isSuccess && (
                  <ArrowRight size={16} strokeWidth={2.2} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                )}
              </span>
            </button>

            <a
              className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-blue-400/20 text-[12px] font-jacobs font-medium text-white/70 hover:text-white transition-all duration-300"
              href="https://funpay.com/users/9360872/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>{v.funpay}</span>
              <ArrowRight
                className="group-hover:translate-x-0.5 transition-transform duration-200 opacity-60 group-hover:opacity-100"
                size={13}
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* Close button (rendered with high z-index and explicit click target) */}
        <button
          id="checkout-modal-close"
          onClick={handleClose}
          type="button"
          aria-label="Закрыть"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-[90] size-11 flex items-center justify-center rounded-2xl bg-white/[0.12] hover:bg-white/[0.22] active:scale-90 border border-white/[0.18] text-white transition-all duration-200 cursor-pointer pointer-events-auto shadow-lg"
        >
          <X size={19} strokeWidth={2} className="pointer-events-none" />
        </button>
      </div>
    </div>
  );
};
