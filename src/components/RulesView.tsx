import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Search,
  Menu,
  X,
  Rocket,
  MessageSquare,
  Layers,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { Locale } from '../types';
import { RULES_DATA, RULE_CATEGORIES, RuleSection } from '../data/rulesData';
import { Navbar } from './Navbar';

interface RulesViewProps {
  locale: Locale;
  setLocale?: (locale: Locale) => void;
  initialSlug?: string | null;
  onBackToHome: () => void;
  onGoToStore?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  core: Rocket,
  communication: MessageSquare,
  gameplay: Layers,
  technical: ShieldCheck,
  justice: Scale,
};

export const RulesView: React.FC<RulesViewProps> = ({
  locale,
  setLocale,
  initialSlug = null,
  onBackToHome,
  onGoToStore,
}) => {
  const allSections: RuleSection[] = useMemo(() => RULES_DATA[locale] || RULES_DATA.ru, [locale]);
  const categories = useMemo(() => RULE_CATEGORIES[locale] || RULE_CATEGORIES.ru, [locale]);

  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug || allSections[0]?.slug || 'general');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const articleScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    } else if (allSections.length > 0) {
      setSelectedSlug(allSections[0].slug);
    }
  }, [initialSlug, allSections]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSections;
    const q = searchQuery.toLowerCase();
    return allSections.filter((sec) => {
      const matchTitle = sec.title.toLowerCase().includes(q);
      const matchLead = sec.lead?.toLowerCase().includes(q);
      const matchPoints = sec.points.some((p) =>
        p.content.some((c) => c.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.listItems && p.listItems.some((li) => li.toLowerCase().includes(q)))
      );
      return matchTitle || matchLead || matchPoints;
    });
  }, [allSections, searchQuery]);

  const activeSection = useMemo(() => {
    return allSections.find((s) => s.slug === selectedSlug) || allSections[0] || {
      id: 'section-1',
      number: 1,
      slug: 'general',
      category: 'core' as const,
      title: '1. Основные положения',
      points: []
    };
  }, [allSections, selectedSlug]);

  const currentIndex = useMemo(() => {
    if (!activeSection) return 0;
    return allSections.findIndex((s) => s.slug === activeSection.slug);
  }, [allSections, activeSection]);

  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex >= 0 && currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const handleSelectSection = (slug: string) => {
    setSelectedSlug(slug);
    setMobileOpen(false);
    const targetPath = `/rules/${slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    if (articleScrollRef.current) {
      articleScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoriesWithLinks = useMemo(() => {
    return categories.map((cat) => {
      const links = cat.sectionSlugs
        .map((slug) => filteredSections.find((s) => s.slug === slug))
        .filter((s): s is RuleSection => Boolean(s))
        .map((s) => ({
          slug: s.slug,
          title: s.title,
        }));
      return {
        ...cat,
        icon: CATEGORY_ICONS[cat.id] || Layers,
        links,
      };
    }).filter((c) => c.links.length > 0);
  }, [categories, filteredSections]);

  const renderSidebar = () => (
    <div className="relative flex flex-col gap-1.5 min-w-0 p-5 rounded-[32px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_32px)] bg-[#07090e]/60 border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      {/* Rionix card background pattern image */}
      <img
        src="/illustrations/main.avif"
        className="rionix-card-pattern"
        aria-hidden="true"
        alt=""
      />
      {/* Ambient glows and noise (noise reduced by 50% from 0.7 to 0.35) */}
      <div data-decor className="absolute inset-0 z-[1] pointer-events-none select-none" aria-hidden="true">
        <div className="absolute w-60 h-60 -left-16 -top-16 bg-blue-500/25 rounded-full opacity-55 blur-[75px]" />
      </div>
      <div className="noise absolute inset-0 z-[2] opacity-35 pointer-events-none select-none" aria-hidden="true"></div>
      <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-1.5 min-w-0">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-[12px] text-[13px] font-jacobs text-white/50 hover:text-white transition-colors duration-200 mb-2 cursor-pointer w-fit"
          onClick={onBackToHome}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>{locale === 'en' ? 'Back to Home' : locale === 'ua' ? 'На головну' : 'На главную'}</span>
        </button>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 mb-4 rounded-full border border-white/[0.08] bg-white/[0.03] w-full">
          <Search className="text-white/40 flex-shrink-0" size={14} strokeWidth={1.5} />
          <input
            className="flex-1 min-w-0 bg-transparent text-[13px] text-white/90 font-jacobs placeholder:text-white/30 outline-none"
            placeholder={locale === 'en' ? 'Search rules...' : locale === 'ua' ? 'Пошук у правилах...' : 'Поиск по правилам...'}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories & Links */}
        {categoriesWithLinks.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="mb-3">
              <div className="flex items-center gap-2 px-3 mb-1">
                <Icon className="text-blue-300/70" size={14} strokeWidth={1.5} />
                <span className="text-[12px] font-jacobs font-semibold text-white/40 uppercase tracking-[0.08em]">
                  {cat.title}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {cat.links.map((link) => {
                  const isActive = selectedSlug === link.slug;
                  return (
                    <button
                      key={link.slug}
                      onClick={() => handleSelectSection(link.slug)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-[13.5px] font-jacobs transition-all duration-200 text-left cursor-pointer ${
                        isActive ? 'text-blue-200 bg-blue-400/15 font-medium border border-blue-400/25' : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <ChevronRight
                        className={isActive ? 'text-blue-300' : 'text-white/30'}
                        size={12}
                        strokeWidth={2}
                      />
                      <span className="truncate">{link.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderArticle = () => (
    <article className="relative w-full p-6 sm:p-10 rounded-[36px] sm:rounded-[40px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_40px)] bg-[#07090e]/60 border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      {/* Rionix card background pattern image */}
      <img
        src="/illustrations/main.avif"
        className="rionix-card-pattern"
        aria-hidden="true"
        alt=""
      />
      {/* Ambient glows and noise (noise reduced by 50% from 0.7 to 0.35) */}
      <div data-decor className="absolute inset-0 z-[1] pointer-events-none select-none" aria-hidden="true">
        <div className="absolute w-80 h-80 -left-20 -top-20 bg-blue-500/25 rounded-full opacity-55 blur-[90px]" />
        <div className="absolute w-80 h-80 -right-20 -bottom-20 bg-sky-500/20 rounded-full opacity-55 blur-[90px]" />
      </div>
      <div className="noise absolute inset-0 z-[2] opacity-35 pointer-events-none select-none" aria-hidden="true" />
      <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />

      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 mb-6 text-[12px] font-jacobs text-white/30">
          <button
            onClick={onBackToHome}
            className="hover:text-white/60 transition-colors cursor-pointer"
          >
            {locale === 'en' ? 'Home' : 'Главная'}
          </button>
          <ChevronRight size={10} strokeWidth={2} />
          <span className="text-white/60 truncate">{activeSection.title}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-[28px] sm:text-[32px] font-jacobs font-bold text-white mb-2 leading-tight">
          {activeSection.title}
        </h1>

        {/* Description */}
        {activeSection.lead && (
          <p className="text-[15px] sm:text-[16px] font-jacobs text-white/60 font-normal mb-8 leading-relaxed">
            {activeSection.lead}
          </p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.08] mb-8" />

        {/* Content */}
        <div className="space-y-8">
          {activeSection.points.map((point) => (
            <div key={point.num} id={`rule-${point.num}`} className="scroll-mt-28">
              <h2 className="text-[19px] sm:text-[21px] font-jacobs font-semibold text-white mt-8 mb-4 flex items-baseline gap-2">
                <span className="text-blue-300 font-mono text-[16px] font-bold">§ {point.num}</span>
                {point.title && <span>{point.title}</span>}
              </h2>
              {point.content.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[14.5px] sm:text-[15px] font-jacobs text-white/70 font-normal leading-[1.8] mb-3.5"
                >
                  {p}
                </p>
              ))}
              {point.listItems && point.listItems.length > 0 && (
                <ul className="mb-4 space-y-2 pl-5 list-disc marker:text-blue-300 text-[14px] text-white/70 font-normal leading-[1.7]">
                  {point.listItems.map((li, liIdx) => (
                    <li key={liIdx}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Divider */}
        <div className="w-full h-px bg-white/[0.08] mt-12 mb-8" />

        {/* Prev / Next Pagination */}
        <div className="flex items-center justify-between gap-4">
          {prevSection ? (
            <button
              onClick={() => handleSelectSection(prevSection.slug)}
              className="group flex items-center gap-2 text-[13.5px] font-jacobs text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft
                className="group-hover:-translate-x-1 transition-transform duration-200"
                size={14}
                strokeWidth={1.5}
              />
              <span className="truncate">{prevSection.title}</span>
            </button>
          ) : (
            <div />
          )}

          {nextSection && (
            <button
              onClick={() => handleSelectSection(nextSection.slug)}
              className="group flex items-center gap-2 text-[13.5px] font-jacobs text-white/40 hover:text-white transition-colors cursor-pointer ml-auto"
            >
              <span className="truncate">{nextSection.title}</span>
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform duration-200"
                size={14}
                strokeWidth={1.5}
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden relative bg-black text-white antialiased font-jacobs flex flex-col">
      {/* Ambient glow with exact noise */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute size-[550px] -left-32 top-20 bg-blue-500/15 grayscale-40 rounded-full blur-[140px]" />
        <div className="absolute size-[550px] -right-32 bottom-20 bg-sky-500/15 grayscale-40 rounded-full blur-[140px]" />
      </div>
      <div className="noise fixed inset-0 pointer-events-none select-none z-[1] opacity-60" aria-hidden="true" />

      {/* Floating Pill Navbar */}
      <div className="relative z-50 shrink-0">
        <Navbar
          locale={locale}
          setLocale={setLocale || (() => {})}
          onOpenDocs={() => {
            handleSelectSection(allSections[0]?.slug || 'general');
          }}
          onGoToStore={onGoToStore}
          activeNav="docs"
          onLogoClick={onBackToHome}
        />
      </div>

      {/* Unified Responsive Container for Desktop, Tablet, and Mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 lg:pt-32 pb-10 lg:pb-6 flex-1 min-h-0 flex flex-col">
        {/* Quick Chapter Selector Bar for Mobile & Tablet (< lg) */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-8 px-4 py-3 rounded-2xl border border-white/[0.08] bg-[#0c0d14]/90 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <Layers size={16} className="text-blue-300 shrink-0" />
            <span className="text-[14px] font-jacobs font-medium text-white/90 truncate">
              {activeSection.title}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-400/20 hover:bg-blue-400/30 text-[13px] font-medium text-blue-200 transition-colors shrink-0 cursor-pointer border border-blue-400/30"
          >
            <Menu size={14} />
            <span>{locale === 'en' ? 'Sections' : locale === 'ua' ? 'Розділи' : 'Разделы'}</span>
          </button>
        </div>

        {/* Modal / Drawer for rules navigation on mobile & tablet */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08] max-w-lg mx-auto">
              <span className="text-[16px] font-jacobs font-semibold text-white">
                {locale === 'en' ? 'Rule Sections' : locale === 'ua' ? 'Розділи правил' : 'Разделы правил'}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full bg-white/[0.08] text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-w-lg mx-auto">
              {renderSidebar()}
            </div>
          </div>
        )}

        {/* Two-column layout on Desktop (lg:), single column on Tablet/Mobile */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start flex-1 min-h-0">
          {/* Desktop Left Sidebar: Stationary list of sections */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0 h-full overflow-y-auto pr-3 scrollbar-hide pb-6">
            {renderSidebar()}
          </aside>

          {/* Main Article Content: Independent scroll area */}
          <main
            ref={articleScrollRef}
            className="flex-1 min-w-0 w-full max-w-3xl lg:h-full lg:overflow-y-auto lg:pr-6 pb-16 custom-scrollbar"
          >
            {renderArticle()}
          </main>
        </div>
      </div>
    </div>
  );
};

