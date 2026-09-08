import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { Locale } from '../types';
import { translations } from '../data/translations';
import { RULES_DATA, RULE_CATEGORIES, RuleSection } from '../data/rulesData';
import { Navbar } from './Navbar';
import { FooterSection } from './FooterSection';

interface RulesViewProps {
  locale: Locale;
  setLocale?: (locale: Locale) => void;
  initialSlug?: string | null;
  onBackToHome: () => void;
  onGoToStore?: () => void;
}

export const RulesView: React.FC<RulesViewProps> = ({
  locale,
  setLocale,
  initialSlug = null,
  onBackToHome,
  onGoToStore,
}) => {
  const t = translations[locale];
  const allSections: RuleSection[] = useMemo(() => RULES_DATA[locale] || RULES_DATA.ru, [locale]);
  const categories = useMemo(() => RULE_CATEGORIES[locale] || RULE_CATEGORIES.ru, [locale]);

  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug || allSections[0]?.slug || 'general');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  // Filter sections by search query
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
    setMobileMenuOpen(false);
    window.location.hash = `#/rules/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#111216] text-[#fafafa] font-sans selection:bg-[#0abab5]/30 selection:text-white flex flex-col">
      {/* Top Floating Pill Navbar matching DeltaClient */}
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

      {/* Main Documentation Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] font-medium text-white/80 hover:bg-white/[0.06] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Menu size={16} className="text-[#0abab5]" />
              <span className="truncate">{activeSection?.title}</span>
            </span>
            <span className="text-xs text-white/40">
              {mobileMenuOpen ? '✕' : (locale === 'en' ? 'Sections' : locale === 'ua' ? 'Розділи' : 'Разделы')}
            </span>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed lg:sticky top-0 lg:top-24 z-40 lg:z-10
            inset-y-0 left-0 w-72 sm:w-80 lg:w-64
            bg-[#111216] lg:bg-transparent
            p-6 lg:p-0
            transform transition-transform duration-200 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0 shadow-2xl border-r border-white/[0.08]' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto max-h-screen lg:max-h-[calc(100vh-7rem)]
            shrink-0
          `}
        >
          {/* Mobile Header Close */}
          <div className="flex lg:hidden items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
            <span className="text-[13px] font-bold text-white/80">
              {locale === 'en' ? 'Documentation' : locale === 'ua' ? 'Документація' : 'Документация'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder={
                locale === 'en'
                  ? 'Search...'
                  : locale === 'ua'
                  ? 'Пошук...'
                  : 'Поиск...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-[#0abab5]/50 transition-colors"
            />
          </div>

          {/* Navigation Links by Category */}
          <nav className="space-y-6">
            {categories.map((cat) => {
              const catSections = filteredSections.filter((s) => cat.sectionSlugs.includes(s.slug));
              if (catSections.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-1">
                  <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-wider px-3 mb-2">
                    {cat.title}
                  </h4>
                  {catSections.map((sec) => {
                    const isSelected = activeSection?.slug === sec.slug;
                    return (
                      <button
                        key={sec.slug}
                        onClick={() => handleSelectSection(sec.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0abab5]/10 text-[#0abab5] font-semibold border-l-2 border-[#0abab5] rounded-l-none'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="line-clamp-1">{sec.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb path */}
          <div className="text-[12px] text-white/40 mb-3 flex items-center gap-1.5 font-medium">
            <span>{t.nav.docs}</span>
            <span>/</span>
            <span className="text-white/70 truncate">{activeSection.title}</span>
          </div>

          {/* Page Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            {activeSection.title}
          </h1>

          {/* Section Lead */}
          {activeSection.lead && (
            <p className="text-[15px] text-white/65 leading-relaxed mb-6 max-w-3xl">
              {activeSection.lead}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-8" />

          {/* Documentation Rules List */}
          <div className="space-y-8">
            {activeSection.points.map((point) => (
              <article
                key={point.num}
                id={`rule-${point.num}`}
                className="scroll-mt-28 pb-8 border-b border-white/[0.04] last:border-0"
              >
                <h2 className="text-[16px] sm:text-[17px] font-bold text-white mb-2 flex items-baseline gap-2">
                  <span className="text-[#0abab5] font-mono text-[14px]">§ {point.num}</span>
                  {point.title && <span>{point.title}</span>}
                </h2>

                <div className="space-y-2.5 text-[14px] text-white/75 leading-relaxed">
                  {point.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {point.listItems && point.listItems.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-5 list-disc marker:text-[#0abab5] text-[13.5px] text-white/70">
                    {point.listItems.map((li, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-between pt-8 mt-12 border-t border-white/[0.08] gap-4">
            {prevSection ? (
              <button
                onClick={() => handleSelectSection(prevSection.slug)}
                className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-[#0abab5] transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span className="truncate">{prevSection.title}</span>
              </button>
            ) : (
              <div />
            )}

            {nextSection && (
              <button
                onClick={() => handleSelectSection(nextSection.slug)}
                className="flex items-center gap-2 text-[13px] font-medium text-white/50 hover:text-[#0abab5] transition-colors ml-auto cursor-pointer"
              >
                <span className="truncate">{nextSection.title}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Footer matching the rest of the site */}
      <FooterSection
        locale={locale}
        onOpenDocs={() => {
          handleSelectSection(allSections[0]?.slug || 'general');
        }}
        onGoToStore={onGoToStore}
      />
    </div>
  );
};
