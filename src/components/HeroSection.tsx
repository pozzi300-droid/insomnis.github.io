import React from 'react';
import { ArrowRight, ShoppingBag, Users, Calendar, Activity, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Locale } from '../types';

interface HeroSectionProps {
  locale: Locale;
  onGoToStore: () => void;
  onOpenRules: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGoToStore, onOpenRules }) => {
  return (
    <div className="relative">
      <div className="relative flex flex-col gap-2.5 px-4 sm:px-6 lg:px-20 mx-auto max-w-[110rem] size-full mt-20 sm:mt-24 lg:mt-28">
        {/* 1. Main Hero Banner */}
        <motion.div
          data-panel
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 flex flex-col py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 rounded-[32px] sm:rounded-[40px] overflow-hidden text-center supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_40px)] bg-[#07090e]/75 border border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          {/* Static Unified High-Performance Background Patterns */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-[inherit]" aria-hidden="true">
            <img
              src="/illustrations/main.avif"
              alt=""
              className="insomnis-card-pattern"
            />
            {/* Ambient Insomnis ice-blue atmospheric glow */}
            <div className="absolute w-[30rem] sm:w-[50rem] h-[30rem] sm:h-[40rem] -left-20 -top-20 bg-blue-500/25 rounded-full opacity-60 blur-[120px] pointer-events-none" />
            <div className="absolute w-[25rem] sm:w-[45rem] h-[25rem] sm:h-[35rem] -right-20 -bottom-20 bg-sky-500/20 rounded-full opacity-50 blur-[130px] pointer-events-none" />
            {/* Noise & Glass tone */}
            <div className="noise absolute inset-0 z-[2] opacity-30 pointer-events-none" />
            <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />
          </div>

          {/* Content layered strictly above background and grain */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Hero Main Headline - Perfectly synchronized font scaling */}
            <h1 className="font-jacobs font-bold uppercase text-white text-[24px] min-[380px]:text-[28px] sm:text-[42px] md:text-[54px] lg:text-[68px] xl:text-[84px] leading-[1.24] sm:leading-[1.18] tracking-tight">
              <span className="inline-block bg-blue-300/20 px-2.5 sm:px-4 py-0.5 mx-0.5 sm:mx-1 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/10 align-baseline">
                <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  Идеальный
                </span>
              </span>{' '}
              <span>ванильный</span> <br className="hidden sm:inline" />
              <span>сервер для</span>{' '}
              <span className="inline-block bg-blue-300/20 px-2.5 sm:px-4 py-0.5 mx-0.5 sm:mx-1 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/10 align-baseline">
                <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  выживания
                </span>
              </span>
            </h1>

            {/* Description - fluid text wrapping naturally on mobile without broken linebreaks */}
            <p className="font-jacobs text-white/75 text-sm sm:text-base lg:text-lg xl:text-xl max-w-2xl lg:max-w-3xl leading-relaxed">
              <span className="inline-block text-white bg-white/10 px-2 py-0.5 rounded-lg">Абсолютно чистое</span> ванильное выживание.
              Создавай <span className="inline-block text-white bg-white/10 px-2 py-0.5 rounded-lg">монументальные постройки</span>, торгуй, исследуй
              и <span className="inline-block text-white bg-white/10 px-2 py-0.5 rounded-lg">стань легендой</span> сервера.
            </p>

            {/* Action Buttons: Main Accent + Secondary Rules */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2">
              <motion.button
                type="button"
                onClick={onGoToStore}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex group items-center gap-3.5 bg-white px-6 py-3.5 rounded-2xl hover:bg-white/90 ring-1 ring-white/20 text-black font-jacobs font-bold text-[15px] smooth cursor-pointer hover:px-7 shadow-lg shadow-white/10"
              >
                <ArrowRight className="size-4 group-hover:scale-110 group-hover:translate-x-0.5 smooth" />
                <p>Перейти к товарам</p>
              </motion.button>

              <motion.button
                type="button"
                onClick={onOpenRules}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex group items-center gap-3 bg-white/10 hover:bg-white/15 px-5 py-3.5 rounded-2xl ring-1 ring-white/10 hover:ring-white/25 text-white/90 hover:text-white font-jacobs text-[15px] smooth cursor-pointer backdrop-blur-md"
              >
                <BookOpen className="size-4 opacity-70 group-hover:opacity-100 smooth" />
                <p>Правила</p>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 2-5. The 4 Stats Panels (Forming the bottom row of the 5-panel layout) */}
        <div className="relative z-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
          {/* Card 1: куплено привилегий */}
          <motion.div
            data-panel
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            className="relative flex flex-col px-7 sm:px-8 py-6 rounded-[28px] sm:rounded-[36px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_36px)] bg-[#07090e]/75 border border-white/[0.04] transition-colors hover:border-blue-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-[inherit]" aria-hidden="true">
              <img src="/illustrations/main.avif" alt="" className="insomnis-pattern-card-1" />
              <div className="absolute w-56 h-56 -left-12 -top-12 bg-blue-500/25 rounded-full opacity-55 blur-[60px]" />
              <div className="noise absolute inset-0 z-[2] opacity-30 pointer-events-none" />
              <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-3 w-full">
              <div className="flex gap-2.5 items-center pl-1">
                <ShoppingBag className="size-3.5 text-white/80" />
                <p className="text-white font-jacobs text-sm sm:text-base">куплено привилегий</p>
              </div>
              <span className="bg-blue-300/20 px-3 py-1 inline-block leading-none rounded-2xl">
                <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-5xl sm:text-6xl font-jacobs font-bold">
                  1.4K+
                </span>
              </span>
            </div>
          </motion.div>

          {/* Card 2: игроков */}
          <motion.div
            data-panel
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            className="relative flex flex-col px-7 sm:px-8 py-6 rounded-[28px] sm:rounded-[36px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_36px)] bg-[#07090e]/75 border border-white/[0.04] transition-colors hover:border-blue-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-[inherit]" aria-hidden="true">
              <img src="/illustrations/main.avif" alt="" className="insomnis-pattern-card-2" />
              <div className="absolute w-56 h-56 -right-12 -top-12 bg-sky-500/25 rounded-full opacity-50 blur-[60px]" />
              <div className="noise absolute inset-0 z-[2] opacity-30 pointer-events-none" />
              <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-3 w-full">
              <div className="flex gap-2.5 items-center pl-1">
                <Users className="size-3.5 text-white/80" />
                <p className="text-white font-jacobs text-sm sm:text-base">игроков</p>
              </div>
              <span className="bg-blue-300/20 px-3 py-1 inline-block leading-none rounded-2xl">
                <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-5xl sm:text-6xl font-jacobs font-bold">
                  6.0K+
                </span>
              </span>
            </div>
          </motion.div>

          {/* Card 3: дней с открытия */}
          <motion.div
            data-panel
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            className="relative flex flex-col px-7 sm:px-8 py-6 rounded-[28px] sm:rounded-[36px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_36px)] bg-[#07090e]/75 border border-white/[0.04] transition-colors hover:border-blue-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-[inherit]" aria-hidden="true">
              <img src="/illustrations/main.avif" alt="" className="insomnis-pattern-card-3" />
              <div className="absolute w-56 h-56 -left-12 -bottom-12 bg-indigo-500/20 rounded-full opacity-50 blur-[60px]" />
              <div className="noise absolute inset-0 z-[2] opacity-30 pointer-events-none" />
              <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-3 w-full">
              <div className="flex gap-2.5 items-center pl-1">
                <Calendar className="size-3.5 text-white/80" />
                <p className="text-white font-jacobs text-sm sm:text-base">дней с открытия</p>
              </div>
              <span className="bg-blue-300/20 px-3 py-1 inline-block leading-none rounded-2xl">
                <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-5xl sm:text-6xl font-jacobs font-bold">
                  600+
                </span>
              </span>
            </div>
          </motion.div>

          {/* Card 4: текущий онлайн */}
          <motion.div
            data-panel
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            className="relative flex flex-col px-7 sm:px-8 py-6 rounded-[28px] sm:rounded-[36px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_36px)] bg-[#07090e]/75 border border-white/[0.04] transition-colors hover:border-blue-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none rounded-[inherit]" aria-hidden="true">
              <img src="/illustrations/main.avif" alt="" className="insomnis-pattern-card-4" />
              <div className="absolute w-56 h-56 -right-12 -bottom-12 bg-sky-400/25 rounded-full opacity-55 blur-[60px]" />
              <div className="noise absolute inset-0 z-[2] opacity-30 pointer-events-none" />
              <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-3 w-full">
              <div className="flex gap-2.5 items-center pl-1">
                <Activity className="size-3.5 text-white/80" />
                <p className="text-white font-jacobs text-sm sm:text-base">онлайн</p>
              </div>
              <span className="bg-blue-300/20 px-3 py-1 inline-block leading-none rounded-2xl">
                <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-5xl sm:text-6xl font-jacobs font-bold">
                  128
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
