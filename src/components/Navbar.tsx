import React, { useEffect, useRef } from 'react';
import { Tag, ScrollText } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { DeltaLogo } from './DeltaLogo';
import { DiscordIcon } from './DiscordIcon';
import { Locale } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  onOpenDocs: () => void;
  onGoToStore?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  setLocale,
  onOpenDocs,
  onGoToStore,
}) => {
  const t = translations[locale];
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -24, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const scrollToStore = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('store');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[94vw]"
    >
      <nav className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.05] backdrop-blur-[60px] backdrop-saturate-150 px-2.5 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 pl-3 pr-4 sm:pr-5 transition-opacity hover:opacity-85 cursor-pointer"
        >
          <DeltaLogo size={20} />
          <span className="font-title text-[14px] font-bold text-white/90 tracking-tight">
            insomnis
          </span>
        </a>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-0.5">
          <button
            onClick={scrollToStore}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium text-white/30 hover:text-white/70 rounded-full hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
          >
            <Tag size={14} strokeWidth={1.8} />
            <span>{t.nav.pricing}</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium text-white/30 hover:text-white/70 rounded-full hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
          >
            <ScrollText size={14} strokeWidth={1.8} />
            <span>{t.nav.docs}</span>
          </button>

          <a
            href="https://dsc.gg/insomnisclient"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium text-white/30 hover:text-white/70 rounded-full hover:bg-white/[0.04] transition-all duration-200"
          >
            <DiscordIcon size={14} className="opacity-80" />
            <span>{t.nav.support}</span>
          </a>
        </div>

        {/* Language selector */}
        <div className="flex items-center ml-1 sm:ml-2 mr-1 sm:mr-2 rounded-full border border-white/[0.06] bg-white/[0.02] p-0.5">
          {(['ru', 'en', 'ua'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLocale(lang)}
              className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 uppercase cursor-pointer ${
                locale === lang
                  ? 'bg-white/[0.1] text-white font-semibold'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Action button */}
        <button
          onClick={(e) => {
            if (onGoToStore) onGoToStore();
            else scrollToStore(e);
          }}
          className="ml-1 flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full sm:rounded-xl text-[13px] font-semibold text-white bg-[#0abab5] hover:bg-[#099e9a] transition-all duration-200 hover:shadow-[0_0_20px_rgba(10, 186, 181,0.35)] cursor-pointer"
        >
          <Tag size={14} strokeWidth={2} />
          <span>{t.nav.pricing}</span>
        </button>
      </nav>
    </header>
  );
};
