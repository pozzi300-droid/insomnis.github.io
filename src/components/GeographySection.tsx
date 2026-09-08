import React, { useEffect, useRef } from 'react';
import { Users, Server } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { Locale } from '../types';
import { translations } from '../data/translations';
import { getAssetUrl } from '../utils/assets';

interface GeographySectionProps {
  locale: Locale;
}

export const GeographySection: React.FC<GeographySectionProps> = ({ locale }) => {
  const t = translations[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const serversGridRef = useRef<HTMLDivElement>(null);

  const servers = [
    {
      name: 'FunTime',
      note: t.geography.funTimeNote,
      image: getAssetUrl('/images/cabinet/funTime.jpg'),
      online: '12 850+',
      ip: 'mc.funtime.su',
      accent: '#0abab5',
    },
    {
      name: 'HolyWorld',
      note: t.geography.holyWorldNote,
      image: getAssetUrl('/images/cabinet/holyWorld.png'),
      online: '8 420+',
      ip: 'mc.holyworld.ru',
      accent: '#6E8AFF',
    },
    {
      name: 'SpookyTime',
      note: t.geography.spookyTimeNote,
      image: getAssetUrl('/images/cabinet/spookyTime.jpeg'),
      online: '5 190+',
      ip: 'play.spookytime.net',
      accent: '#B088FF',
    },
  ];

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

      if (serversGridRef.current) {
        const cards = serversGridRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: serversGridRef.current,
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
      id="activity"
      className="relative py-28 sm:py-36 px-6 bg-[#0e0f13] border-y border-white/[0.04]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#0abab5]/10 text-[#0abab5] border border-[#0abab5]/25 mb-4">
            <Server size={13} />
            {t.geography.topLabel}
          </span>
          <h2 className="font-title text-[2.2rem] sm:text-[3.2rem] font-bold text-white tracking-tight leading-[1.1]">
            {t.geography.heading1}{' '}
            <span className="delta-gradient-text">{t.geography.heading2}</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-[14.5px] sm:text-[16px] text-white/40 leading-relaxed">
            {t.geography.subtitle}
          </p>
        </div>

        {/* 3 Servers Grid */}
        <div ref={serversGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servers.map((srv) => (
            <div
              key={srv.name}
              className="group relative rounded-[22px] overflow-hidden border border-white/[0.08] bg-[#14151a] flex flex-col transition-all duration-300 hover:border-white/[0.2] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Server image banner */}
              <div className="relative h-44 w-full overflow-hidden bg-black/40">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-[#14151a]/40 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Users size={12} className="text-white/60" />
                  <span>{srv.online}</span>
                </div>
              </div>

              {/* Server body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-title text-[20px] font-bold text-white mb-2 tracking-tight">
                    {srv.name}
                  </h3>
                  <p className="text-[13px] text-white/45 leading-relaxed mb-4">
                    {srv.note}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[12px] text-white/30">
                  <span className="font-mono">{srv.ip}</span>
                  <span className="text-[#0abab5] font-semibold group-hover:underline">Online</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
