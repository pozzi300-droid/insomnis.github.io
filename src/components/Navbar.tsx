import React, { useState, useEffect } from 'react';
import { Home, Headset, ScrollText, Map, Globe, LogIn, Menu, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Locale } from '../types';

interface NavbarProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  onOpenDocs: () => void;
  onGoToStore?: () => void;
  activeNav?: 'pricing' | 'docs' | 'support';
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  setLocale,
  onOpenDocs,
  onGoToStore,
  onLogoClick,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cycleLanguage = () => {
    const langs: Locale[] = ['ru', 'en', 'ua'];
    const nextIdx = (langs.indexOf(locale) + 1) % langs.length;
    setLocale(langs[nextIdx]);
  };

  const scrollToStore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGoToStore) {
      onGoToStore();
      return;
    }
    const elem = document.getElementById('store');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Localized texts matching Rionix style
  const labels = {
    home: locale === 'en' ? 'Home' : locale === 'ua' ? 'Головна' : 'Главная',
    support: locale === 'en' ? 'Support' : locale === 'ua' ? 'Підтримка' : 'Поддержка',
    rules: locale === 'en' ? 'Rules' : locale === 'ua' ? 'Правила' : 'Правила',
    map: locale === 'en' ? 'World Map' : locale === 'ua' ? 'Карта світу' : 'Карта мира',
    changeLang: locale === 'en' ? 'Change language' : locale === 'ua' ? 'Змінити мову' : 'Сменить язык',
    auth: locale === 'en' ? 'Sign In' : locale === 'ua' ? 'Авторизація' : 'Авторизация',
  };

  return (
    <>
      {/* Scroll gradient backdrop */}
      <div
        className={`fixed top-0 left-0 w-full h-32 lg:h-48 bg-gradient-to-b from-black via-black/80 to-transparent mask-b-to-100% z-[100] smooth pointer-events-none transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Mobile Drawer Menu matching Rionix */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[150] xl:hidden">
            <motion.button
              aria-label="Закрыть меню"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 size-full bg-black/70 backdrop-grayscale-25 cursor-default"
              tabIndex={-1}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-6 lg:mx-20 mt-26 p-4 rounded-[30px] overflow-hidden bg-black border border-white/5 shadow-2xl supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_40px)]"
            >
              <nav className="relative z-3 grid sm:grid-cols-2 gap-1.5 font-jacobs">
                {/* 1. Главная */}
                <a
                  aria-current="page"
                  href="/"
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleHomeClick(e);
                  }}
                  className="flex group/item items-center gap-4 bg-blue-400/10 px-5 py-4 rounded-2xl text-white hover:bg-blue-300 hover:text-black active:bg-blue-300 active:text-black smooth cursor-pointer"
                >
                  <Home size={18} className="group-hover/item:scale-125 smooth" />
                  <p className="font-jacobs text-[15px] pointer-events-none">{labels.home}</p>
                  <ArrowRight size={16} className="ml-auto opacity-40 group-hover/item:opacity-100 group-hover/item:translate-x-1 smooth" />
                </a>

                {/* 2. Поддержка */}
                <a
                  href="https://discord.gg/Bf78hBZWs"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex group/item items-center gap-4 bg-blue-400/10 px-5 py-4 rounded-2xl text-white hover:bg-blue-300 hover:text-black active:bg-blue-300 active:text-black smooth cursor-pointer"
                >
                  <Headset size={18} className="group-hover/item:scale-125 smooth" />
                  <p className="font-jacobs text-[15px]">{labels.support}</p>
                  <ArrowRight size={16} className="ml-auto opacity-40 group-hover/item:opacity-100 group-hover/item:translate-x-1 smooth" />
                </a>

                {/* 3. Правила (instead of Новости per request) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenDocs();
                  }}
                  className="flex group/item items-center gap-4 bg-blue-400/10 px-5 py-4 rounded-2xl text-white hover:bg-blue-300 hover:text-black active:bg-blue-300 active:text-black smooth cursor-pointer text-left"
                >
                  <ScrollText size={18} className="group-hover/item:scale-125 smooth" />
                  <p className="font-jacobs text-[15px]">{labels.rules}</p>
                  <ArrowRight size={16} className="ml-auto opacity-40 group-hover/item:opacity-100 group-hover/item:translate-x-1 smooth" />
                </button>

                {/* 4. Карта мира (instead of Статус per request) */}
                <a
                  href="https://map.insomnis.fun"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex group/item items-center gap-4 bg-blue-400/10 px-5 py-4 rounded-2xl text-white hover:bg-blue-300 hover:text-black active:bg-blue-300 active:text-black smooth cursor-pointer"
                >
                  <Map size={18} className="group-hover/item:scale-125 smooth" />
                  <p className="font-jacobs text-[15px]">{labels.map}</p>
                  <ArrowRight size={16} className="ml-auto opacity-40 group-hover/item:opacity-100 group-hover/item:translate-x-1 smooth" />
                </a>

                {/* Divider */}
                <div className="border-t border-white/5 my-2 sm:col-span-2 mx-1" aria-hidden="true" />

                {/* Сменить язык */}
                <button
                  type="button"
                  aria-label="Сменить язык"
                  onClick={cycleLanguage}
                  className="flex sm:col-span-2 group/item items-center gap-4 bg-blue-400/10 px-5 py-4 rounded-2xl text-white hover:bg-blue-300 hover:text-black active:bg-blue-300 active:text-black smooth cursor-pointer"
                >
                  <Globe size={18} className="group-hover/item:scale-125 smooth" />
                  <p className="font-jacobs text-[15px]">{labels.changeLang}</p>
                  <span className="font-jacobs font-medium text-[13px] ml-auto bg-white/10 group-hover/item:bg-black/10 px-2.5 py-1 rounded-lg smooth uppercase">
                    {locale}
                  </span>
                </button>

                {/* Авторизация */}
                <button
                  type="button"
                  aria-label="Авторизация"
                  onClick={(e) => {
                    setMobileOpen(false);
                    scrollToStore(e);
                  }}
                  className="flex sm:col-span-2 group/item items-center gap-4 bg-blue-400/10 px-5 py-4 rounded-2xl text-white hover:bg-blue-300 hover:text-black active:bg-blue-300 active:text-black smooth cursor-pointer"
                >
                  <LogIn size={18} className="group-hover/item:scale-125 smooth" />
                  <p className="font-jacobs text-[15px]">{labels.auth}</p>
                  <ArrowRight size={16} className="ml-auto opacity-40 group-hover/item:opacity-100 group-hover/item:translate-x-1 smooth" />
                </button>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Fixed Navbar Container (matching Rionix) */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 w-full z-[200]"
      >
        <div className="flex items-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-20 mx-auto max-w-[110rem] size-full justify-between relative">
          {/* Mobile hamburger button */}
          <motion.button
            aria-label="Меню"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-400/10 text-white hover:bg-blue-300 hover:text-black py-2.5 flex xl:hidden group items-center gap-4 px-4 sm:px-5 rounded-2xl smooth cursor-pointer"
          >
            <Menu size={18} className="group-hover:scale-110 smooth" />
          </motion.button>

          {/* Left menu items (hidden on < xl, visible on xl) */}
          <div className="hidden xl:flex gap-1 items-center">
            {/* Главная */}
            <motion.a
              aria-current="page"
              href="/"
              onClick={handleHomeClick}
              whileTap={{ scale: 0.96 }}
              className="flex group items-center gap-4 hover:-my-1 bg-blue-400/10 px-5 py-2 rounded-2xl hover:bg-blue-300 text-white hover:text-black smooth cursor-pointer hover:py-3"
            >
              <Home size={16} className="group-hover:scale-125 smooth" />
              <p className="font-jacobs text-[15px] pointer-events-none">{labels.home}</p>
            </motion.a>

            {/* Поддержка */}
            <motion.a
              href="https://discord.gg/Bf78hBZWs"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              className="flex group items-center gap-4 hover:-my-1 bg-blue-400/10 px-5 py-2 rounded-2xl hover:bg-blue-300 text-white hover:text-black smooth cursor-pointer hover:py-3"
            >
              <Headset size={16} className="group-hover:scale-125 smooth" />
              <p className="font-jacobs text-[15px]">{labels.support}</p>
            </motion.a>

            {/* Правила (instead of Новости per request) */}
            <motion.button
              type="button"
              onClick={onOpenDocs}
              whileTap={{ scale: 0.96 }}
              className="flex group items-center gap-4 hover:-my-1 bg-blue-400/10 px-5 py-2 rounded-2xl hover:bg-blue-300 text-white hover:text-black smooth cursor-pointer hover:py-3"
            >
              <ScrollText size={16} className="group-hover:scale-125 smooth" />
              <p className="font-jacobs text-[15px]">{labels.rules}</p>
            </motion.button>

            {/* Карта мира (instead of Статус per request) */}
            <motion.a
              href="https://map.insomnis.fun"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              className="flex group items-center gap-4 hover:-my-1 bg-blue-400/10 px-5 py-2 rounded-2xl hover:bg-blue-300 text-white hover:text-black smooth cursor-pointer hover:py-3"
            >
              <Map size={16} className="group-hover:scale-125 smooth" />
              <p className="font-jacobs text-[15px]">{labels.map}</p>
            </motion.a>
          </div>

          {/* Center Brand: insomnis */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
            <motion.a
              href="/"
              onClick={handleHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-jacobs font-bold text-white hover:text-blue-300 text-[20px] lg:text-[23px] tracking-wide transition-colors cursor-pointer select-none"
            >
              insomnis
            </motion.a>
          </div>

          {/* Right menu items */}
          <div className="flex gap-1 items-center">
            {/* Language switch button */}
            <motion.button
              type="button"
              onClick={cycleLanguage}
              whileTap={{ scale: 0.96 }}
              className="hidden xl:flex group items-center gap-4 hover:-my-1 bg-blue-400/10 px-5 py-3 rounded-2xl hover:bg-blue-300 text-white hover:text-black smooth cursor-pointer hover:py-4"
              aria-label="Сменить язык"
            >
              <Globe size={16} className="group-hover:scale-125 smooth" />
              <span className="font-jacobs font-medium text-[13px] bg-white/10 group-hover:bg-black/10 px-2 py-0.5 rounded-lg smooth uppercase">
                {locale}
              </span>
            </motion.button>

            {/* Авторизация */}
            <motion.button
              type="button"
              onClick={scrollToStore}
              whileTap={{ scale: 0.96 }}
              className="flex group items-center gap-3 sm:gap-4 hover:-my-1 bg-blue-400/10 px-4 sm:px-5 py-2.5 lg:py-2 rounded-2xl hover:bg-blue-300 text-white hover:text-black smooth cursor-pointer hover:py-3.5 lg:hover:py-3"
              aria-label="Авторизация"
            >
              <LogIn size={16} className="group-hover:scale-125 smooth" />
              <p className="font-jacobs text-[15px] hidden lg:flex">{labels.auth}</p>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
