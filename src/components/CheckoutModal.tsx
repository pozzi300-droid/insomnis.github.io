import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { StoreItem, User, Locale } from '../types';
import { translations } from '../data/translations';
import { getAssetUrl } from '../utils/assets';

interface CheckoutModalProps {
  isOpen: boolean;
  plan: StoreItem | null;
  locale?: Locale;
  onClose: () => void;
  onSuccess: (planName: string) => void;
}

function DeltaSvg({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 32 27">
      <path d="M4.18 26.43H8.36L9.53 24.21L7.31 20.69L4.18 26.43Z" fill="currentColor" />
      <path
        d="M14.89 26.3H19.33C24.09 26.08 29.89 22.95 31.54 16.67C31.84 15.54 32 14.31 32 12.98C32 12.84 32 12.7 31.99 12.57C31.83 8.7 29.37 4.92 26.27 2.67C24.46 1.37 22.43 0.57 20.51 0.57H0L14.89 26.3ZM13.71 17.03L18.94 7.89H14.76L11.62 13.24L6.14 4.1H19.72C22.8 4.1 27.37 6.88 28.21 11.67C28.3 12.17 28.34 12.7 28.34 13.24C28.34 17.94 24.29 22.64 19.72 22.64H16.85L13.71 17.03Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

// Payment methods identical to deltaclient.xyz
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

  const [selectedMethod, setSelectedMethod] = useState('RU_SBP');
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
      setSelectedMethod('RU_SBP');
      setSelectedOptionIndex(plan.options && plan.options.length > 0 ? plan.options.length - 1 : 0);
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
        { opacity: 0, scale: 0.94, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.38, ease: 'power3.out', force3D: true }
      );
    }
  }, [isOpen, plan]);

  // Selected option & price calculation
  const currentOption = useMemo(() => {
    if (plan?.options && plan.options.length > 0) {
      return plan.options[selectedOptionIndex] || plan.options[0];
    }
    return null;
  }, [plan, selectedOptionIndex]);

  const basePrice = useMemo(() => {
    if (currentOption) return currentOption.price;
    if (plan?.rawPrice) return plan.rawPrice;
    return 0;
  }, [currentOption, plan]);

  const finalPrice = useMemo(() => {
    if (!discountPercent || discountPercent <= 0) return basePrice;
    return Math.max(0, Math.round(basePrice * (1 - discountPercent / 100)));
  }, [basePrice, discountPercent]);

  // Handle promo code debounce
  const handlePromoChange = (val: string) => {
    setPromo(val);
    const clean = val.trim().toUpperCase();
    if (!clean) {
      setPromoStatus(null);
      setDiscountPercent(null);
      return;
    }
    if (clean === 'DELTA' || clean === 'INSOMNIS') {
      setDiscountPercent(15);
      setPromoStatus({ type: 'success', text: '15%' });
    } else {
      setDiscountPercent(null);
      setPromoStatus({ type: 'error', text: v.promoNotFound });
    }
  };

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.94,
        y: 16,
        duration: 0.2,
        ease: 'power2.in',
        force3D: true,
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const handlePurchase = () => {
    if (!agreed || isProcessing || isRedirecting) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRedirecting(true);
      setTimeout(() => {
        setIsRedirecting(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(plan?.name || 'Item');
          handleClose();
        }, 800);
      }, 900);
    }, 800);
  };

  if (!isOpen || !plan) return null;

  const hasMultipleOptions = Boolean(plan.options && plan.options.length > 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative z-10 overflow-hidden rounded-[28px] bg-[#0E1017] shadow-[0_8px_60px_rgba(0,0,0,0.6)] w-[95vw] max-w-[860px] h-auto md:h-[540px] min-h-[500px]"
        style={{ perspective: 1200 }}
      >
        {/* Blurred background image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={getAssetUrl('/images/main/landing_1.jpg')}
            alt=""
            className="w-full h-full object-cover object-[center_40%] scale-[1.02]"
            style={{ filter: 'blur(20px)' }}
          />
          <div className="absolute inset-0 bg-[rgba(11,13,22,0.9)]" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] text-white/30 hover:text-white/60 hover:bg-white/[0.1] transition-all duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Left column banner (hidden on mobile, visible on desktop) */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 h-[490px] max-h-[490px] w-[320px] overflow-hidden rounded-[25px] z-20 hidden md:block [backface-visibility:hidden]">
          <div className="relative h-full w-full min-w-0 overflow-hidden rounded-[25px]">
            <img
              src={getAssetUrl('/images/main/landing_1.jpg')}
              alt=""
              className="w-full h-full object-cover scale-[1.05]"
            />
            <div className="absolute inset-0 bg-[rgba(11,13,22,0.8)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(10, 186, 181,0.5)] mix-blend-overlay" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 p-6">
              <div className="text-[#0abab5] drop-shadow-[0_0_24px_rgba(10, 186, 181,0.5)]">
                <DeltaSvg className="w-12 h-12" />
              </div>
              <div className="text-center space-y-2 w-[220px]">
                <p className="text-[20px] font-display font-semibold text-white leading-[1.2]">
                  {plan.name}
                </p>
                <p className="text-[12px] font-display font-light text-white/50 leading-[1.6] tracking-[0.24px]">
                  {plan.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column checkout form */}
        <div
          className={`absolute inset-0 md:left-auto md:right-0 md:top-0 md:bottom-0 md:w-[490px] z-10 flex flex-col justify-center px-6 py-7 md:py-5 md:px-10 overflow-y-auto ${
            hasMultipleOptions ? 'py-5' : 'py-8'
          }`}
        >
          {/* Order info */}
          <div className={hasMultipleOptions ? 'mb-2' : 'mb-3'}>
            <p className="text-[11px] font-display font-medium text-[#0abab5]/60 uppercase tracking-[0.1em] mb-1.5">
              {v.order} #{plan.id}
            </p>
            <h2 className="text-[28px] font-title font-bold text-white leading-tight">
              <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span>{finalPrice} ₽</span>
                <span className="text-[15px] font-display font-light text-white/30">
                  / {currentOption ? currentOption.label : plan.tariff || plan.period}
                </span>
              </span>
            </h2>
          </div>

          {/* Payment Methods */}
          <div className={hasMultipleOptions ? 'mb-3' : 'mb-4'}>
            <p className="text-[11px] font-display font-medium text-white/25 uppercase tracking-[0.08em] mb-2">
              {v.method}
            </p>
            <div className="flex flex-col gap-2">
              {paymentRegions.map((reg) => (
                <div key={reg.regionKey} className="flex items-center gap-2">
                  <span className="text-[11px] font-display text-white/25 w-[54px] flex-shrink-0 leading-tight">
                    {reg.regionKey === 'regionRu' ? v.regionRu : v.regionEu}
                  </span>
                  <div className="flex gap-2">
                    {reg.methods.map((meth) => {
                      const isActive = selectedMethod === meth.id;
                      return (
                        <button
                          key={meth.id}
                          type="button"
                          onClick={() => setSelectedMethod(meth.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-display font-bold transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-[#0abab5]/15 text-[#0abab5] border border-[#0abab5]/30'
                              : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70'
                          }`}
                        >
                          <img
                            src={meth.logo}
                            alt={meth.label}
                            className={`object-contain flex-shrink-0 ${
                              meth.id === 'CRYPTO_BOT' ? 'rounded-[15px]' : ''
                            }`}
                            style={{
                              width: 18,
                              height: 14,
                              filter: isActive ? 'none' : 'grayscale(1) opacity(0.5)',
                            }}
                          />
                          {meth.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tariff Options (if multiple options available) */}
          {hasMultipleOptions && (
            <div className="mb-2.5">
              <p className="text-[11px] font-display font-medium text-white/25 uppercase tracking-[0.08em] mb-1.5">
                {plan.id === 4 ? v.selectPrefix : v.period}
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.options?.map((opt, oIdx) => {
                  const isActive = selectedOptionIndex === oIdx;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionIndex(oIdx)}
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-display font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#0abab5]/15 text-[#0abab5] border border-[#0abab5]/30'
                          : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/70'
                      }`}
                    >
                      <span>
                        {plan.id === 4 ? opt.label : `${opt.label} – ${opt.price} ₽`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Promo code */}
          <div className={hasMultipleOptions ? 'mb-3' : 'mb-4'}>
            <p className="text-[11px] font-display font-medium text-white/25 uppercase tracking-[0.08em] mb-2">
              {v.promoCode}
            </p>
            <div className="flex items-center h-[42px] pl-4 pr-2 rounded-full border border-white/[0.06] bg-white/[0.03]">
              <input
                className="flex-1 bg-transparent text-[13px] text-white/70 font-display placeholder:text-white/20 outline-none tracking-wide"
                placeholder={v.promoPlaceholder}
                type="text"
                value={promo}
                onChange={(e) => handlePromoChange(e.target.value)}
              />
              {promoStatus && (
                <span
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-display font-medium whitespace-nowrap ${
                    promoStatus.type === 'success'
                      ? 'bg-[#66FFAA]/10 text-[#66FFAA]/80'
                      : 'bg-white/[0.04] text-white/25'
                  }`}
                >
                  {promoStatus.text}
                </span>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <label
            className="flex items-start gap-3 mb-3 cursor-pointer select-none"
            onClick={() => setAgreed(!agreed)}
          >
            <div
              className={`w-4 h-4 mt-0.5 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                agreed
                  ? 'bg-[#0abab5] border-[#0abab5]'
                  : 'border-white/15 bg-white/[0.03]'
              }`}
            >
              {agreed && (
                <svg fill="none" height="8" viewBox="0 0 10 8" width="10">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
            <span className="text-[11px] font-display text-white/25 leading-relaxed">
              {v.agreeBefore}
              <span className="text-[#0abab5]/85 hover:text-[#0abab5] underline underline-offset-2 decoration-[#0abab5]/40 transition-colors">
                {v.agreeTerms}
              </span>
              {v.agreeAfter}
            </span>
          </label>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={!agreed || isProcessing || isRedirecting}
              onClick={handlePurchase}
              className={`w-full flex items-center justify-center py-3.5 rounded-[20px] font-display text-[14px] font-bold text-white transition-all duration-300 bg-[#0abab5] hover:bg-[#30ded5] hover:shadow-[0_0_40px_rgba(10, 186, 181,0.2)] ${
                agreed
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-50 hover:bg-[#0abab5] hover:shadow-none'
              } ${isProcessing || isRedirecting ? 'opacity-65' : ''}`}
            >
              <span className="relative grid min-h-[1.35em] w-full place-items-center overflow-hidden px-1">
                <span className="text-center text-[14px] font-display font-bold leading-snug flex items-center gap-2 justify-center text-white">
                  {isRedirecting
                    ? v.redirecting
                    : isProcessing
                    ? v.processing
                    : isSuccess
                    ? (locale === 'en' ? 'Success!' : locale === 'ua' ? 'Успішно!' : 'Успешно!')
                    : `${v.pay} ${finalPrice} ₽`}
                  {!isProcessing && !isRedirecting && !isSuccess && (
                    <ArrowRight size={15} strokeWidth={2.2} />
                  )}
                </span>
              </span>
            </button>

            <a
              className="group w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[16px] bg-[#5BB8E0]/50 hover:bg-[#5BB8E0]/65 text-[12px] font-display font-bold text-white/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(91,184,224,0.15)]"
              href="https://funpay.com/users/9360872/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {v.funpay}
              <ArrowRight
                className="group-hover:translate-x-0.5 transition-transform duration-200"
                size={13}
                strokeWidth={2.2}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
