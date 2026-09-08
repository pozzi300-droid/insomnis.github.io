import React, { useEffect, useRef } from 'react';
import { Crosshair, Eye, Zap, Sliders } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { Locale } from '../types';
import { translations } from '../data/translations';

interface FeaturesSectionProps {
  locale: Locale;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ locale }) => {
  const t = translations[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const icons = [Crosshair, Eye, Zap, Sliders];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 96%',
              once: true,
            },
          }
        );
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.05,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: cardsRef.current,
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
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 px-6 bg-[#111216] overflow-hidden"
    >
      {/* Background soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#0abab5]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="font-title text-[2.2rem] sm:text-[3.2rem] font-bold text-white tracking-tight leading-[1.1]">
            {t.features.heading1}{' '}
            <span className="delta-gradient-text">{t.features.headingAccent}</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-[14.5px] sm:text-[16px] text-white/40 leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.features.items.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={item.title}
                className="group relative rounded-[22px] border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.045] backdrop-blur-2xl p-7 sm:p-8 transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0abab5]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-12 h-12 rounded-2xl border border-white/[0.1] bg-white/[0.04] flex items-center justify-center text-[#0abab5] mb-6 group-hover:scale-110 group-hover:border-[#0abab5]/40 transition-all duration-300">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <h3 className="font-title text-[19px] font-bold text-white mb-2.5 tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-[13.5px] sm:text-[14px] text-white/40 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
