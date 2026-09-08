import React, { useState, useMemo, useEffect } from 'react';
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
import { DeltaLogo } from './DeltaLogo';

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

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

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
    return allSections.find((s) => s.slug === selectedSlug) || allSections[0];
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
    window.location.hash = `#/rules/${slug}`;
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

  // Sidebar component matching deltaclient docs layout-eadb2d2fdf5d7e7e.js
  const renderSidebar = () => (
    <div className="flex flex-col gap-1.5 min-w-0">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-[12px] text-[13px] font-display text-white/30 hover:text-white/50 transition-colors duration-200 mb-2 cursor-pointer"
        onClick={onBackToHome}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        <span>{locale === 'en' ? 'Back' : locale === 'ua' ? 'Назад' : 'Назад'}</span>
      </button>

      {/* Search Bar */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 mb-5 rounded-full border border-white/[0.06] bg-white/[0.02] w-[190px]">
        <Search className="text-white/25 flex-shrink-0" size={14} strokeWidth={1.5} />
        <input
          className="flex-1 min-w-0 bg-transparent text-[13px] text-white/70 font-display placeholder:text-white/25 outline-none"
          placeholder={locale === 'en' ? 'Search...' : locale === 'ua' ? 'Пошук...' : 'Поиск...'}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories & Links */}
      {categoriesWithLinks.map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.id} className="mb-2">
            <div className="flex items-center gap-2 px-3 mb-1">
              <Icon className="text-white/25" size={14} strokeWidth={1.5} />
              <span className="text-[12px] font-display font-medium text-white/25 uppercase tracking-[0.08em]">
                {cat.title}
              </span>
            </div>
            <div className="flex flex-col">
              {cat.links.map((link) => {
                const isActive = selectedSlug === link.slug;
                return (
                  <button
                    key={link.slug}
                    onClick={() => handleSelectSection(link.slug)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-[12px] text-[14px] font-display transition-all duration-200 text-left cursor-pointer ${
                      isActive ? 'text-[#0abab5] font-medium' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <ChevronRight
                      className={isActive ? 'text-[#0abab5]' : 'text-white/15'}
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
  );

  // Article component matching deltaclient docs [slug]/page-2385537770e3f5ca.js
  const renderArticle = () => (
    <article className="max-w-[760px]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 mb-6 text-[12px] font-display text-white/20">
        <button
          onClick={onBackToHome}
          className="hover:text-white/40 transition-colors cursor-pointer"
        >
          {locale === 'en' ? 'Documentation' : locale === 'ua' ? 'Документація' : 'Документация'}
        </button>
        <ChevronRight size={10} strokeWidth={2} />
        <span className="text-white/35 truncate">{activeSection.title}</span>
      </div>

      {/* Main Title */}
      <h1 className="text-[28px] font-title font-bold text-white mb-2">
        {activeSection.title}
      </h1>

      {/* Description */}
      {activeSection.lead && (
        <p className="text-[15px] font-display text-white/40 font-light mb-8">
          {activeSection.lead}
        </p>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.04] mb-8" />

      {/* Content */}
      <div>
        {activeSection.points.map((point) => (
          <div key={point.num} id={`rule-${point.num}`} className="scroll-mt-28 mb-8">
            <h2 className="text-[20px] font-title font-semibold text-white mt-10 mb-4 flex items-baseline gap-2">
              <span className="text-[#0abab5] font-mono text-[16px]">§ {point.num}</span>
              {point.title && <span>{point.title}</span>}
            </h2>
            {point.content.map((p, pIdx) => (
              <p
                key={pIdx}
                className="text-[14px] font-display text-white/50 font-light leading-[1.8] mb-4"
              >
                {p}
              </p>
            ))}
            {point.listItems && point.listItems.length > 0 && (
              <ul className="mb-4 space-y-2 pl-4 list-disc marker:text-[#0abab5] text-[13.5px] text-white/50 font-light leading-[1.7]">
                {point.listItems.map((li, liIdx) => (
                  <li key={liIdx}>{li}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Divider */}
      <div className="w-full h-px bg-white/[0.04] mt-12 mb-6" />

      {/* Prev / Next Pagination */}
      <div className="flex items-center justify-between">
        {prevSection ? (
          <button
            onClick={() => handleSelectSection(prevSection.slug)}
            className="group flex items-center gap-2 text-[13px] font-display text-white/25 hover:text-white/50 transition-colors cursor-pointer"
          >
            <ArrowLeft
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
              size={14}
              strokeWidth={1.5}
            />
            <span>{prevSection.title}</span>
          </button>
        ) : (
          <div />
        )}

        {nextSection && (
          <button
            onClick={() => handleSelectSection(nextSection.slug)}
            className="group flex items-center gap-2 text-[13px] font-display text-white/25 hover:text-white/50 transition-colors cursor-pointer ml-auto"
          >
            <span>{nextSection.title}</span>
            <ArrowRight
              className="group-hover:translate-x-0.5 transition-transform duration-200"
              size={14}
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen relative bg-[#111216] text-white antialiased font-sans">
      {/* Background layer directly from deltaclient docs layout */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/images/main/landing_1.jpg"
          alt=""
          className="w-full h-full object-cover object-[center_40%]"
          style={{ filter: 'blur(20px)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(17,18,22,0.84) 0%, rgba(17,18,22,0.87) 16%, rgba(17,18,22,0.9) 36%, rgba(17,18,22,0.93) 58%, rgba(17,18,22,0.95) 80%, rgba(17,18,22,0.96) 100%)',
          }}
        />
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.18)' }}
        />
      </div>

      {/* Desktop Floating Navbar */}
      <div className="relative z-20 hidden md:block">
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

      {/* Desktop Layout: Exactly matching deltaclient (style width: 1040, aside w-[220px], main max-w-[820px]) */}
      <div className="relative z-10 hidden md:flex justify-center min-h-screen pt-24">
        <div className="flex" style={{ width: 1040 }}>
          <aside className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col justify-between py-10 flex-shrink-0 overflow-y-auto overflow-x-hidden scrollbar-hide w-[220px]">
            {renderSidebar()}
          </aside>

          <main className="flex-1 py-10 pl-10 max-w-[820px]">
            {renderArticle()}
          </main>
        </div>
      </div>

      {/* Mobile Layout: Exactly matching deltaclient (md:hidden) */}
      <div className="md:hidden relative z-10">
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 bg-[#111216]/80 backdrop-blur-xl border-b border-white/[0.04]">
          <button onClick={onBackToHome} className="flex items-center gap-2 cursor-pointer">
            <DeltaLogo size={20} />
            <span className="text-[14px] font-title font-semibold text-white/80">
              {locale === 'en' ? 'documentation' : locale === 'ua' ? 'документація' : 'документация'}
            </span>
          </button>
          <button
            className="text-white/40 hover:text-white/60 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-20 bg-[#111216]/95 backdrop-blur-xl pt-16 px-5 overflow-y-auto">
            {renderSidebar()}
          </div>
        )}

        <main className="px-5 pt-6 pb-16">
          {renderArticle()}
        </main>
      </div>
    </div>
  );
};
