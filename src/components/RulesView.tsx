import React, { useState, useMemo } from 'react';
import {
  Tag,
  Search,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ScrollText,
  X,
  ExternalLink,
} from 'lucide-react';
import { Locale } from '../types';
import { translations } from '../data/translations';
import { RULES_DATA, RULE_CATEGORIES, RuleSection } from '../data/rulesData';
import { DeltaLogo } from './DeltaLogo';
import { DiscordIcon } from './DiscordIcon';

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

  // Selected slug: default to initialSlug or the first section
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug || allSections[0]?.slug || 'general');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtered sections based on search
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = `#/rules/${slug}`;
  };

  return (
    <div className="min-h-screen bg-[#111216] text-white flex flex-col font-sans selection:bg-[#0abab5]/30 selection:text-white">
      {/* Top Floating Pill Navbar matching main page exactly */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[94vw]">
        <nav className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.05] backdrop-blur-[60px] backdrop-saturate-150 px-2.5 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 pl-3 pr-4 sm:pr-5 transition-opacity hover:opacity-85 cursor-pointer"
          >
            <DeltaLogo size={20} />
            <span className="font-title text-[14px] font-bold text-white/90 tracking-tight">
              insomnis
            </span>
          </button>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-0.5">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-white/40 hover:text-white rounded-full hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
            >
              <Tag size={14} strokeWidth={2} />
              <span>{t.nav.pricing}</span>
            </button>

            <button
              onClick={() => handleSelectSection(allSections[0]?.slug || 'general')}
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-white/90 bg-white/[0.08] rounded-full hover:bg-white/[0.12] transition-all duration-200 cursor-pointer"
            >
              <ScrollText size={14} strokeWidth={2} className="text-[#0abab5]" />
              <span>{t.nav.docs}</span>
            </button>

            <a
              href="https://dsc.gg/insomnisclient"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-white/40 hover:text-white rounded-full hover:bg-white/[0.04] transition-all duration-200"
            >
              <DiscordIcon size={14} className="opacity-80" />
              <span>{t.nav.support}</span>
            </a>
          </div>

          {/* Language selector */}
          {setLocale && (
            <div className="flex items-center ml-1 sm:ml-2 mr-1 sm:mr-2 rounded-full border border-white/[0.06] bg-white/[0.02] p-0.5">
              {(['ru', 'en', 'ua'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 uppercase cursor-pointer ${
                    locale === lang
                      ? 'bg-white/[0.12] text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={() => {
              if (onGoToStore) {
                onGoToStore();
              } else {
                onBackToHome();
                setTimeout(() => {
                  const elem = document.getElementById('store');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="ml-1 flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full sm:rounded-xl text-[13px] font-bold text-white bg-[#0abab5] hover:bg-[#099e9a] transition-all duration-200 hover:shadow-[0_0_20px_rgba(10, 186, 181,0.35)] cursor-pointer"
          >
            <Tag size={14} strokeWidth={2} />
            <span>{t.nav.pricing}</span>
          </button>
        </nav>
      </header>

      {/* Main Page Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex gap-8 relative">
        {/* Sidebar for Desktop & Mobile drawer */}
        <aside
          className={`
            fixed lg:sticky top-24 z-40 lg:z-10
            inset-y-0 left-0 w-72 sm:w-80 lg:w-72
            bg-[#14151a]/95 lg:bg-transparent
            backdrop-blur-xl lg:backdrop-blur-none
            p-6 lg:p-0
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto max-h-[calc(100vh-7rem)]
            border-r border-white/[0.06] lg:border-none
          `}
        >
          {/* Mobile Sidebar Close */}
          <div className="flex lg:hidden items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ScrollText size={16} className="text-[#0abab5]" />
              <span className="font-semibold text-[14px]">
                {locale === 'en' ? 'Rules Navigation' : locale === 'ua' ? 'Навігація правилами' : 'Навигация по правилам'}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-md text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative mb-5">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder={
                locale === 'en'
                  ? 'Search rules...'
                  : locale === 'ua'
                  ? 'Пошук у правилах...'
                  : 'Поиск по правилам...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#0abab5]/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[11px]"
              >
                ×
              </button>
            )}
          </div>

          {/* Grouped Categories and Sections 1..18 */}
          <div className="space-y-6">
            {categories.map((cat) => {
              const catSections = filteredSections.filter((s) => cat.sectionSlugs.includes(s.slug));
              if (catSections.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.14em] px-2 mb-1">
                    {cat.title}
                  </p>
                  {catSections.map((sec) => {
                    const isSelected = activeSection.slug === sec.slug;
                    return (
                      <button
                        key={sec.slug}
                        onClick={() => handleSelectSection(sec.slug)}
                        className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-xl text-[12.5px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0abab5]/15 text-[#0abab5] border border-[#0abab5]/30 font-semibold'
                            : 'text-white/65 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="shrink-0 font-mono text-[11px] opacity-50 mt-0.5">
                          {sec.number}.
                        </span>
                        <span className="line-clamp-1 leading-snug">
                          {sec.title.replace(/^\d+\.\s*/, '')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80 mb-1.5">
              <DiscordIcon size={14} className="text-[#0abab5]" />
              <span>
                {locale === 'en' ? 'Discord Support' : locale === 'ua' ? 'Підтримка в Discord' : 'Поддержка в Discord'}
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed mb-3">
              {locale === 'en'
                ? 'Got questions about the rules or need to report a critical exploit? Reach staff via Discord.'
                : locale === 'ua'
                ? 'Маєте запитання або хочете повідомити про критичну вразливість? Звертайтеся в Discord.'
                : 'Есть вопросы по правилам или хотите сообщить о критической уязвимости? Напишите в Discord.'}
            </p>
            <div>
              <a
                href="https://dsc.gg/insomnisclient"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
              >
                <DiscordIcon size={13} />
                <span>Discord</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[12px] text-white/40 mb-6 flex-wrap">
            <button
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {locale === 'en' ? 'Home' : locale === 'ua' ? 'Головна' : 'Главная'}
            </button>
            <ChevronRight size={12} />
            <button
              onClick={() => handleSelectSection(allSections[0]?.slug || 'general')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.docs}
            </button>
            {activeSection && (
              <>
                <ChevronRight size={12} />
                <span className="text-[#0abab5] font-medium truncate">
                  {activeSection.title}
                </span>
              </>
            )}
          </div>

          {/* Search notice */}
          {searchQuery.trim() && (
            <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <p className="text-[13px] text-white/70">
                {locale === 'en' ? 'Search results for:' : locale === 'ua' ? 'Результати пошуку для:' : 'Результаты поиска по:'}{' '}
                <span className="text-white font-semibold">"{searchQuery}"</span> ({filteredSections.length}{' '}
                {locale === 'en' ? 'sections found' : locale === 'ua' ? 'розділів знайдено' : 'разделов найдено'})
              </p>
            </div>
          )}

          {/* Single Section Detailed View */}
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14151a] border border-white/[0.08] relative overflow-hidden">
              <h1 className="font-title text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                {activeSection.title}
              </h1>
              {activeSection.lead && (
                <p className="text-[14px] sm:text-[15px] text-white/70 leading-relaxed max-w-3xl font-normal border-l-2 border-[#0abab5] pl-4 py-1">
                  {activeSection.lead}
                </p>
              )}
            </div>

            {/* Section Points */}
            <div className="space-y-4">
              {activeSection.points.map((point) => (
                <div
                  key={point.num}
                  id={`rule-${point.num}`}
                  className="p-5 sm:p-6 rounded-2xl border transition-all duration-200 bg-[#14151a] border-white/[0.06] hover:border-white/[0.12]"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded-md bg-white/[0.08] text-[#0abab5] border border-white/[0.06]">
                      § {point.num}
                    </span>
                    {point.title && (
                      <h3 className="text-[15px] font-semibold text-white tracking-tight">
                        {point.title}
                      </h3>
                    )}
                  </div>

                  {/* Content paragraphs */}
                  <div className="space-y-2 mt-3 text-[13.5px] sm:text-[14px] text-white/75 leading-relaxed">
                    {point.content.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Bullet list if exists */}
                  {point.listItems && point.listItems.length > 0 && (
                    <ul className="mt-3.5 space-y-1.5 pl-2 border-l border-white/[0.08]">
                      {point.listItems.map((li, liIdx) => (
                        <li
                          key={liIdx}
                          className="text-[13px] text-white/60 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="text-[#0abab5] mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#0abab5]/70" />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Pagination: Prev / Next Section */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              {prevSection ? (
                <button
                  onClick={() => handleSelectSection(prevSection.slug)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/70 hover:text-white transition-all text-left cursor-pointer group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40">
                      {locale === 'en' ? 'Previous Section' : locale === 'ua' ? 'Попередній розділ' : 'Предыдущий раздел'}
                    </div>
                    <div className="text-[13px] font-semibold text-white/90 line-clamp-1">
                      {prevSection.title}
                    </div>
                  </div>
                </button>
              ) : <div />}

              {nextSection && (
                <button
                  onClick={() => handleSelectSection(nextSection.slug)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/70 hover:text-white transition-all text-right cursor-pointer group ml-auto"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40">
                      {locale === 'en' ? 'Next Section' : locale === 'ua' ? 'Наступний розділ' : 'Следующий раздел'}
                    </div>
                    <div className="text-[13px] font-semibold text-white/90 line-clamp-1">
                      {nextSection.title}
                    </div>
                  </div>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer minimal line */}
      <footer className="mt-auto py-8 border-t border-white/[0.06] bg-[#0e0f12] text-center text-[12px] text-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <DeltaLogo size={16} />
            <span className="font-semibold text-white/80">insomnis</span>
            <span>·</span>
            <span>{t.nav.docs}</span>
          </div>
          <p className="text-white/30">
            {locale === 'en' ? 'Minecraft remains Minecraft.' : locale === 'ua' ? 'Minecraft залишається Minecraft.' : 'Minecraft остаётся Minecraft.'}
          </p>
        </div>
      </footer>
    </div>
  );
};
