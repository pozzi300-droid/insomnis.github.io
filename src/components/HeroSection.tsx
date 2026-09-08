import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { DeltaLogo } from './DeltaLogo';
import { Locale } from '../types';
import { translations } from '../data/translations';
import { getAssetUrl } from '../utils/assets';

interface HeroSectionProps {
  locale: Locale;
  onGoToStore?: () => void;
  onOpenDocs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  locale,
  onGoToStore,
  onOpenDocs,
}) => {
  const t = translations[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLHeadingElement>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Logo entrance
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85, filter: 'blur(10px)', y: -10 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 0.55, ease: 'back.out(1.2)' },
        0.05
      );

      // Title characters motion-blur typing reveal
      const titleChars = titleContainerRef.current?.querySelectorAll('.motion-blur-char');
      if (titleChars && titleChars.length > 0) {
        tl.fromTo(
          titleChars,
          {
            opacity: 0,
            filter: 'blur(12px)',
            y: 6,
            scale: 1.05,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            scale: 1,
            duration: 0.35,
            stagger: 0.022,
            ease: 'power2.out',
          },
          0.15
        );
      }

      // Slogan / Subtitle characters motion-blur typing reveal
      const sloganChars = subtitleContainerRef.current?.querySelectorAll('.motion-blur-char');
      if (sloganChars && sloganChars.length > 0) {
        tl.fromTo(
          sloganChars,
          {
            opacity: 0,
            filter: 'blur(10px)',
            y: 5,
            scale: 1.04,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            scale: 1,
            duration: 0.3,
            stagger: 0.014,
            ease: 'power2.out',
          },
          '-=0.2'
        );
      }

      // Action buttons smooth fade & blur clear
      tl.fromTo(
        buttonsRef.current,
        { opacity: 0, filter: 'blur(8px)', y: 12 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]);

  // Helper to render text into word containers with individual character spans for motion blur typing
  const renderChars = (text: string, isBrand = false, isSubtitle = false) => {
    const words = text.split(' ');
    return words.map((word, wIdx) => (
      <span key={wIdx} className="inline-block whitespace-nowrap">
        {word.split('').map((char, cIdx) => (
          <span
            key={cIdx}
            className={`motion-blur-char inline-block will-change-[transform,filter,opacity] ${
              isBrand
                ? 'delta-gradient-text drop-shadow-[0_0_30px_rgba(10, 186, 181,0.45)]'
                : isSubtitle
                ? 'text-white/60'
                : 'text-white'
            }`}
          >
            {char}
          </span>
        ))}
        {wIdx < words.length - 1 && (
          <span className="inline-block motion-blur-char">&nbsp;</span>
        )}
      </span>
    ));
  };

  const subtitleText = `${t.hero.description} ${t.hero.tagline}`;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Ken Burns zoom animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={getAssetUrl('/images/main/landing_1.jpg')}
          alt="Insomnis Minecraft Server"
          className="w-full h-full object-cover object-[center_40%] animate-ken-burns select-none pointer-events-none"
        />
      </div>

      {/* Exact Delta multilayer dark gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(17,18,22,0.56) 0%, rgba(17,18,22,0.68) 15%, rgba(17,18,22,0.8) 35%, rgba(17,18,22,0.88) 55%, rgba(17,18,22,0.95) 80%, rgba(17,18,22,1) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-14">
        {/* Animated Insomnis Logo */}
        <div
          ref={logoRef}
          className="mb-5 drop-shadow-[0_0_24px_rgba(10, 186, 181,0.4)] will-change-[transform,filter,opacity]"
        >
          <DeltaLogo size={52} />
        </div>

        {/* Title with Motion Blur Typing Effect */}
        <h1
          ref={titleContainerRef}
          className="flex flex-col items-center select-none text-center"
        >
          <div className="font-title text-[2.5rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.25rem] font-bold leading-[1.08] tracking-tight">
            {renderChars(t.hero.line1)}
          </div>

          <div className="mt-1 font-title text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.85rem] font-bold leading-[1.15] tracking-tight flex items-center justify-center flex-wrap gap-x-2 text-center">
            {t.hero.line2pre && (
              <span className="inline-block mr-1.5">{renderChars(t.hero.line2pre)}</span>
            )}
            <span className="inline-block">{renderChars(t.hero.line2brand, true)}</span>
          </div>
        </h1>

        {/* Slogan with Motion Blur Typing Effect */}
        <div
          ref={subtitleContainerRef}
          className="mt-5 max-w-xl text-[14px] sm:text-base md:text-[17px] leading-relaxed font-normal select-none"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
        >
          {renderChars(subtitleText, false, true)}
        </div>

        {/* Action Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-3.5 mt-8 will-change-[transform,filter,opacity]"
        >
          <button
            onClick={() => {
              if (onGoToStore) {
                onGoToStore();
              } else {
                const elem = document.getElementById('store');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 sm:px-7 py-2.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[14px] sm:text-[14.5px] font-bold tracking-tight text-white bg-[#0abab5] hover:bg-[#099e9a] active:scale-[0.98] transition-all duration-200 hover:shadow-[0_0_30px_rgba(10, 186, 181,0.35)] cursor-pointer"
          >
            {t.hero.ctaPrimary}
          </button>

          <button
            onClick={onOpenDocs}
            className="px-6 sm:px-7 py-2.5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[14px] sm:text-[14.5px] font-bold tracking-tight text-white/50 hover:text-white active:scale-[0.98] border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer"
          >
            {t.hero.ctaSecondary}
          </button>
        </div>
      </div>
    </section>
  );
};
