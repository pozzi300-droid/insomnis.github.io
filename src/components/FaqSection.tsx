import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { Locale } from '../types';
import { translations } from '../data/translations';

interface FaqSectionProps {
  locale: Locale;
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  return (
    <div
      className={`faq-item rounded-2xl border transition-colors duration-300 overflow-hidden ${
        isOpen
          ? 'border-[#0abab5]/35 bg-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.03]'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4"
      >
        <span className="font-title text-[15.5px] sm:text-[17px] font-medium text-white/90">
          {question}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 bg-[#0abab5]/20 text-[#0abab5]' : 'text-white/40 bg-white/5'
          }`}
        >
          <ChevronDown size={17} />
        </div>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-5 sm:px-6 pb-6 pt-1 text-[14px] sm:text-[14.5px] text-white/50 leading-relaxed border-t border-white/[0.04]">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const FaqSection: React.FC<FaqSectionProps> = ({ locale }) => {
  const t = translations[locale];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter out the latin placeholder items if needed, or display all 4 relevant questions
  const items = t.faq.items.filter(
    (item) => !item.question.includes('Lorem') && !item.question.includes('Sed ut')
  );

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

      if (listRef.current) {
        const faqItems = listRef.current.querySelectorAll('.faq-item');
        gsap.fromTo(
          faqItems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.04,
            ease: 'power2.out',
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: {
              trigger: listRef.current,
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
    <section ref={sectionRef} className="relative py-28 sm:py-36 px-6 bg-[#111216]" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] text-white/50 mb-4">
            <HelpCircle size={14} className="text-[#0abab5]" />
            <span>FAQ</span>
          </div>
          <h2 className="font-title text-[2.2rem] sm:text-[3rem] font-bold text-white mb-4 tracking-tight">
            {t.faq.title}
          </h2>
          <p className="text-[14px] sm:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion list */}
        <div ref={listRef} className="flex flex-col gap-3.5">
          {items.map((item, idx) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
