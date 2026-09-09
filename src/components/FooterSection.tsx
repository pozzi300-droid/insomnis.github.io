import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { DeltaLogo } from './DeltaLogo';
import { DiscordIcon } from './DiscordIcon';
import { Locale } from '../types';
import { translations } from '../data/translations';

interface FooterSectionProps {
  locale: Locale;
  onOpenDocs: () => void;
  onGoToStore?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  locale,
  onOpenDocs,
  onGoToStore,
}) => {
  const t = translations[locale];
  const ctaRef = useRef<HTMLDivElement>(null);

  const ctaRaw = t?.reviews?.cta || (t?.reviews as Record<string, string>)?.ctaTitle || (locale === 'en' ? 'Ready to start your adventure?' : locale === 'ua' ? 'Готові розпочати свою пригоду?' : 'Готовы начать свое приключение?');
  const ctaWords = ctaRaw.split(' ');
  const ctaPrefix = ctaWords.slice(0, -1).join(' ');
  const ctaAccent = ctaWords.slice(-1)[0] || '';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!ctaRef.current) return;
    const anim = gsap.fromTo(
      ctaRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <footer className="relative bg-[#111216] border-t border-white/[0.04]">
      {/* Top CTA area */}
      <div className="max-w-5xl mx-auto px-6 pt-24 sm:pt-32 pb-24 sm:pb-32">
        <div
          ref={ctaRef}
          className="flex flex-col items-center text-center"
        >
          <h2
            className="font-title text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] font-bold text-white leading-tight tracking-tight"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
          >
            {ctaPrefix} <span className="delta-gradient-text">{ctaAccent}</span>
          </h2>

          <p className="text-[14px] sm:text-[15px] text-white/40 mt-4 max-w-sm leading-relaxed">
            {t.reviews.ctaSub}
          </p>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => {
                if (onGoToStore) onGoToStore();
                else scrollTo('store');
              }}
              className="btn-shimmer group relative flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-bold text-white bg-[#0abab5] hover:bg-[#099e9a] transition-all duration-300 hover:shadow-[0_0_50px_rgba(10,186,181,0.35)] cursor-pointer overflow-hidden"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>

            {/* Discord */}
            <a
              href="https://dsc.gg/insomnisclient"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              title="Discord"
            >
              <DiscordIcon size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 border-t border-white/[0.04]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand col */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <DeltaLogo size={20} />
              <span className="font-title text-[15px] font-bold text-white/90 tracking-tight">insomnis</span>
            </div>
            <p className="text-[12px] text-white/30 leading-relaxed mb-5 max-w-[200px]">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://dsc.gg/insomnisclient"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.06] text-white/30 hover:text-white hover:border-white/[0.2] transition-all duration-200"
                title="Discord"
              >
                <DiscordIcon size={14} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-3.5">
              {t.footer.platform.title}
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => scrollTo('store')}
                className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200 text-left cursor-pointer"
              >
                {t.nav.pricing}
              </button>
              <button
                onClick={onOpenDocs}
                className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200 text-left cursor-pointer"
              >
                {t.nav.docs}
              </button>
              <a
                href="https://dsc.gg/insomnisclient"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200 text-left"
              >
                {t.nav.support}
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-3.5">
              {t.footer.navigation.title}
            </p>
            <div className="flex flex-col gap-2.5">
              {t.footer.navigation.links
                ?.filter((link) => !link.href?.includes('faq') && link.label?.toLowerCase() !== 'faq')
                .map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.href?.includes('activity')) scrollTo('activity');
                      else if (link.href?.includes('store')) scrollTo('store');
                      else scrollTo('how-it-works');
                    }}
                    className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200 text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
              <button
                onClick={onOpenDocs}
                className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200 text-left cursor-pointer"
              >
                {locale === 'ru' ? 'Правила сервера' : locale === 'ua' ? 'Правила сервера' : 'Server Rules'}
              </button>
            </div>
          </div>

          {/* Docs */}
          <div>
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[0.12em] mb-3.5">
              {t.footer.docs.title}
            </p>
            <div className="flex flex-col gap-2.5">
              {t.footer.docs.links.map((link) => (
                <button
                  key={link.label}
                  onClick={onOpenDocs}
                  className="text-[13px] text-white/30 hover:text-white/70 transition-colors duration-200 text-left cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.04] pt-6 sm:flex-row">
          <span className="text-[12px] text-white/25">{t.footer.copy}</span>
          <span className="text-[12px] text-white/25">
            insomnis.fun inc
          </span>
        </div>
      </div>
    </footer>
  );
};
