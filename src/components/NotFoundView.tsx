import React from 'react';
import { Home, ArrowLeft, BookOpen, ShoppingBag } from 'lucide-react';
import { Locale } from '../types';

interface NotFoundViewProps {
  locale: Locale;
  onBackToHome: () => void;
  onOpenRules?: () => void;
  onGoToStore?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  locale,
  onBackToHome,
  onOpenRules,
  onGoToStore,
}) => {
  const content = {
    ru: {
      code: '404',
      badge: 'Страница не найдена',
      title: 'Кажется, вы забрели не туда',
      desc: 'Запрашиваемая страница не существует или была перемещена. Проверьте адрес или вернитесь на главную страницу сервера.',
      btnHome: 'На главную',
      btnRules: 'Правила сервера',
      btnStore: 'Товары и проходки',
    },
    en: {
      code: '404',
      badge: 'Page Not Found',
      title: 'Looks like you are lost',
      desc: 'The page you requested does not exist or has been moved. Check the URL or return to the Insomnis home page.',
      btnHome: 'Home Page',
      btnRules: 'Server Rules',
      btnStore: 'Store Catalog',
    },
    ua: {
      code: '404',
      badge: 'Сторінку не знайдено',
      title: 'Схоже, ви заблукали',
      desc: 'Запитувана сторінка не існує або була переміщена. Перевірте адресу або поверніться на головну сторінку сервера.',
      btnHome: 'На головну',
      btnRules: 'Правила сервера',
      btnStore: 'Товари та проходки',
    },
  }[locale] || {
    code: '404',
    badge: 'Страница не найдена',
    title: 'Кажется, вы забрели не туда',
    desc: 'Запрашиваемая страница не существует или была перемещена.',
    btnHome: 'На главную',
    btnRules: 'Правила сервера',
    btnStore: 'Товары и проходки',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 relative z-10 font-jacobs">
      <div className="relative max-w-xl w-full text-center p-8 sm:p-12 rounded-[36px] bg-[#07090e]/85 border border-white/[0.08] shadow-[0_16px_60px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Background unified pattern */}
        <img
          src="/illustrations/main.avif"
          alt=""
          className="insomnis-card-pattern"
          aria-hidden="true"
        />
        <div className="absolute size-72 -left-16 -top-16 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute size-72 -right-16 -bottom-16 bg-sky-500/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="noise absolute inset-0 z-[2] opacity-25 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* 404 Big Numeric Pill */}
          <div className="inline-flex items-center gap-2 bg-blue-300/20 border border-blue-400/30 px-5 py-2 rounded-2xl shadow-lg shadow-blue-500/10">
            <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent text-5xl sm:text-6xl font-bold tracking-tight">
              404
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              {content.title}
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {content.desc}
            </p>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center justify-center gap-2.5 bg-white px-5 py-3 rounded-2xl text-black font-semibold text-sm hover:bg-white/90 ring-1 ring-white/20 transition-all cursor-pointer shadow-lg shadow-white/10"
            >
              <Home className="size-4" />
              <span>{content.btnHome}</span>
            </button>

            {onOpenRules && (
              <button
                type="button"
                onClick={onOpenRules}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-3 rounded-2xl text-white/90 hover:text-white ring-1 ring-white/10 text-sm transition-all cursor-pointer backdrop-blur-md"
              >
                <BookOpen className="size-4 opacity-70" />
                <span>{content.btnRules}</span>
              </button>
            )}

            {onGoToStore && (
              <button
                type="button"
                onClick={onGoToStore}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-3 rounded-2xl text-white/90 hover:text-white ring-1 ring-white/10 text-sm transition-all cursor-pointer backdrop-blur-md"
              >
                <ShoppingBag className="size-4 opacity-70" />
                <span>{content.btnStore}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
