import React, { useEffect, useRef } from 'react';
import { UserCheck, DownloadCloud, Trophy } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { Locale } from '../types';
import { translations } from '../data/translations';

interface HowItWorksSectionProps {
  locale: Locale;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ locale }) => {
  const t = translations[locale];
  const steps = t.howItWorks.steps;
  const icons = [UserCheck, DownloadCloud, Trophy];

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

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

      if (stepsContainerRef.current) {
        const stepItems = stepsContainerRef.current.querySelectorAll('.step-item');
        gsap.fromTo(
          stepItems,
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
              trigger: stepsContainerRef.current,
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
      className="relative overflow-hidden px-6 pt-24 pb-36 sm:pt-32 sm:pb-48 bg-[#111216]"
      id="how-it-works"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center"
        >
          <h2 className="mx-auto font-title text-[2.4rem] sm:text-[3.4rem] font-bold leading-[1.05] tracking-tight text-white">
            {t.howItWorks.heading1} <br className="hidden sm:inline" />
            <span className="delta-gradient-text">{t.howItWorks.heading2}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[14.5px] sm:text-[16px] leading-relaxed text-white/40">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsContainerRef}
          className="mt-20 flex flex-col items-stretch gap-12 lg:flex-row lg:items-start lg:gap-0"
        >
          {steps.map((step, idx) => {
            const Icon = icons[idx];
            return (
              <React.Fragment key={step.title}>
                <div className="step-item group flex flex-1 flex-col items-center text-center px-4">
                  <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/70 group-hover:text-[#0abab5] group-hover:border-[#0abab5]/40 group-hover:bg-[#0abab5]/10 transition-all duration-300">
                    <Icon size={26} strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-6 font-title text-[18px] sm:text-[20px] font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2.5 max-w-[17rem] text-[13.5px] sm:text-[14px] leading-relaxed text-white/40">
                    {step.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="mt-8 hidden h-px basis-20 origin-left self-start bg-gradient-to-r from-white/[0.16] to-white/[0.03] lg:block"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};
