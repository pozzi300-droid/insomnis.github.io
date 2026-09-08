import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { Locale, StoreItem } from '../types';
import { translations } from '../data/translations';
import { getAssetUrl } from '../utils/assets';

interface StoreSectionProps {
  locale: Locale;
  onSelectPlan: (item: StoreItem) => void;
}

const colors = ['#B088FF', '#6E8AFF', '#66DDAA', '#FFB066', '#FF7E7E'];

// Exact particles from deltaclient.xyz
const cardParticles = [
  { top: '6%', left: '5%', size: 'w-6 h-6', rotate: '-12deg', opacity: 0.12 },
  { top: '4%', left: '40%', size: 'w-5 h-5', rotate: '8deg', opacity: 0.08 },
  { top: '8%', right: '8%', size: 'w-5 h-5', rotate: '20deg', opacity: 0.1 },
  { top: '30%', left: '8%', size: 'w-7 h-7', rotate: '-6deg', opacity: 0.07 },
  { top: '28%', right: '12%', size: 'w-5 h-5', rotate: '15deg', opacity: 0.1 },
  { top: '55%', left: '12%', size: 'w-5 h-5', rotate: '22deg', opacity: 0.09 },
  { top: '52%', right: '5%', size: 'w-6 h-6', rotate: '-18deg', opacity: 0.07 },
  { top: '75%', left: '5%', size: 'w-5 h-5', rotate: '10deg', opacity: 0.08 },
  { top: '78%', right: '15%', size: 'w-5 h-5', rotate: '-10deg', opacity: 0.1 },
  { top: '15%', left: '22%', size: 'w-4 h-4', rotate: '30deg', opacity: 0.06 },
  { top: '65%', left: '35%', size: 'w-4 h-4', rotate: '-25deg', opacity: 0.07 },
  { top: '42%', right: '30%', size: 'w-4 h-4', rotate: '5deg', opacity: 0.06 },
];

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

export const StoreSection: React.FC<StoreSectionProps> = ({ locale, onSelectPlan }) => {
  const t = translations[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const planOptions: Record<number, { id: number; label: string; price: number }[]> = {
    1: [
      { id: 1, label: locale === 'en' ? 'Standard Option' : locale === 'ua' ? 'Стандартний тариф' : 'Стандартный тариф', price: 666 },
    ],
    2: [
      { id: 2, label: locale === 'en' ? 'Standard Option' : locale === 'ua' ? 'Стандартний тариф' : 'Стандартный тариф', price: 666 },
    ],
    3: [
      { id: 3, label: locale === 'en' ? 'Standard Option' : locale === 'ua' ? 'Стандартний тариф' : 'Стандартный тариф', price: 666 },
    ],
  };

  const rawPrices = [666, 666, 666];

  const items: StoreItem[] = t.store.items.slice(0, 3).map((item, idx) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    rawPrice: 666,
    displayPrice: item.price,
    period: item.period,
    tariff: item.period,
    category: item.period,
    description: item.description,
    color: colors[idx % colors.length],
    options: planOptions[item.id] || [],
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 96%',
              once: true,
            },
          }
        );
      }

      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: cardsGridRef.current,
              start: 'top 96%',
              once: true,
            },
          }
        );
      }

      if (noteRef.current) {
        gsap.fromTo(
          noteRef.current,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: noteRef.current,
              start: 'top 96%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden scroll-mt-6 sm:scroll-mt-8" id="store">
      {/* Top fade gradient */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 z-[2] h-48 sm:h-64"
        style={{
          background:
            'linear-gradient(to bottom, rgba(17,18,22,1) 0%, rgba(17,18,22,0.64) 45%, rgba(17,18,22,0) 100%)',
        }}
      />

      {/* Background with landing_3.jpg */}
      <div className="absolute inset-0 z-0">
        <img
          src={getAssetUrl('/images/main/landing_3.jpg')}
          alt=""
          className="w-full h-full object-cover object-center opacity-[0.15] select-none pointer-events-none"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(17,18,22,0.68) 0%, rgba(17,18,22,0.74) 28%, rgba(17,18,22,0.9) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(10, 186, 181,0.045),transparent_28%)]" />
      </div>

      {/* Bottom fade gradient */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-[2] h-40 sm:h-56"
        style={{
          background:
            'linear-gradient(to top, rgba(17,18,22,1) 0%, rgba(17,18,22,0.76) 42%, rgba(17,18,22,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-16 sm:pt-24 pb-28 sm:pb-36 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-9 sm:mb-10">
            <h2 className="font-title text-[1.8rem] sm:text-[2.5rem] font-bold text-white mb-3">
              {t.store.title}
            </h2>
            <p className="font-display text-[14px] sm:text-[15px] text-white/35 font-light max-w-lg mx-auto leading-relaxed">
              {t.store.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div ref={cardsGridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {items.map((plan) => (
              <div
                key={plan.id}
                onClick={() => onSelectPlan(plan)}
                className="group relative rounded-[20px] overflow-hidden h-[340px] cursor-pointer backdrop-blur-[40px] select-none"
                style={{
                  background: `linear-gradient(145deg, ${plan.color}80 0%, ${plan.color}50 50%, ${plan.color}30 100%)`,
                  boxShadow: `inset 0 1px 0 ${plan.color}20, 0 0 0 1px ${plan.color}18`,
                }}
              >
                {/* Floating particle logos */}
                <div className="absolute inset-0 pointer-events-none" style={{ color: plan.color }}>
                  {cardParticles.map((e, tIdx) => (
                    <div
                      key={tIdx}
                      className="absolute"
                      style={{
                        top: e.top,
                        left: 'left' in e ? e.left : undefined,
                        right: 'right' in e ? e.right : undefined,
                        opacity: e.opacity,
                        transform: `rotate(${e.rotate})`,
                      }}
                    >
                      <DeltaSvg className={e.size} />
                    </div>
                  ))}
                </div>

                {/* Big center logo watermark */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-125 pointer-events-none"
                  style={{ color: plan.color }}
                >
                  <DeltaSvg className="w-20 h-20 opacity-25" />
                </div>

                {/* Bottom gradient mask for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Card Details */}
                <div className="relative z-10 h-full flex flex-col justify-end p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-0.5">
                  <p className="text-[10px] font-display font-medium text-white/40 uppercase tracking-wider mb-1">
                    {plan.category || plan.tariff || plan.period}
                  </p>
                  <p className="text-[18px] font-title font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] mb-1">
                    {plan.name}
                  </p>
                  <p className="text-[11px] font-display text-white/30 mb-3 leading-relaxed">
                    {plan.description}
                  </p>
                  <p className="text-[22px] font-display font-bold" style={{ color: plan.color }}>
                    {plan.displayPrice || (plan.price ? `${plan.price}` : '')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FunPay Note */}
          <div ref={noteRef}>
            <p className="text-center text-[12px] font-display text-white/20 mt-20">
              {t.store.allPlansInclude}
              <br />
              {t.store.funpayNote}{' '}
              <a
                className="text-[#5BB8E0]/60 hover:text-[#5BB8E0] transition-colors"
                href="https://funpay.com/users/9360872/"
                rel="noopener noreferrer"
                target="_blank"
              >
                FunPay
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
