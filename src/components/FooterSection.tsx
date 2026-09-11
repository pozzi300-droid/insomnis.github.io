import React from 'react';
import { Map } from 'lucide-react';
import { Locale } from '../types';

interface FooterSectionProps {
  locale?: Locale;
  onOpenDocs?: () => void;
  onGoToStore?: () => void;
  onOpenDoc?: (type: 'offer' | 'terms' | 'privacy' | 'consent') => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenDoc }) => {
  const handleDocClick = (e: React.MouseEvent, type: 'offer' | 'terms' | 'privacy' | 'consent') => {
    e.preventDefault();
    if (onOpenDoc) {
      onOpenDoc(type);
    } else {
      window.location.href = `/${type}`;
    }
  };

  return (
    <footer className="relative px-6 lg:px-22 mx-auto max-w-[110rem] size-full pt-20 lg:pt-30 pb-0 overflow-hidden">
      <div className="flex flex-col gap-14 relative z-10">
        <div className="grid gap-12 2xl:grid-cols-[3.8fr_0.8fr_1fr] md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 leading-7 lg:leading-normal">
              <div className="text-white/60 font-jacobs text-[14px] flex flex-col gap-2.5">
                <p>© 2026 Insomnis. Все права защищены.</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 leading-relaxed">
                  <span className="inline-flex items-center gap-1.5">
                    Почта
                    <span className="inline-block text-white bg-white/10 px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                      support@insomnis.fun
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    ИП
                    <span className="inline-block text-white bg-white/10 px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                      Дрожжин Артём Викторович
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    ИНН
                    <span className="inline-block text-white bg-white/10 px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                      772450657890
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    ОГРНИП
                    <span className="inline-block text-white bg-white/10 px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                      326774600392741
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h2 className="font-jacobs font-medium text-cyan-200 bg-cyan-500/20 px-2 py-0.5 rounded-md text-[13px] uppercase mb-2">
              Ссылки
            </h2>
            <a
              href="https://discord.gg/Bf78hBZWs"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--discord] size-4"></span> Discord сервер
            </a>
            <a
              href="https://map.insomnis.fun"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <Map size={16} className="text-white/60" /> Карта мира
            </a>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h2 className="font-jacobs font-medium text-cyan-200 bg-cyan-500/20 px-2 py-0.5 rounded-md text-[13px] uppercase mb-2">
              Документы
            </h2>
            <a
              href="/offer"
              onClick={(e) => handleDocClick(e, 'offer')}
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--open-book] size-4"></span> Договор-оферта
            </a>
            <a
              href="/terms"
              onClick={(e) => handleDocClick(e, 'terms')}
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--book] size-4"></span> Условия использования
            </a>
            <a
              href="/privacy"
              onClick={(e) => handleDocClick(e, 'privacy')}
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--lock] size-4"></span> Политика конфиденциальности
            </a>
            <a
              href="/consent"
              onClick={(e) => handleDocClick(e, 'consent')}
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--check] size-4"></span> Согласие на обработку данных
            </a>
          </div>
        </div>
      </div>

      <div className="relative w-full mt-8 sm:mt-14 -mb-3 sm:-mb-6 select-none pointer-events-none overflow-hidden">
        <svg
          viewBox="0 -50 1800 270"
          className="block w-full max-w-[1700px] mx-auto overflow-visible"
          preserveAspectRatio="xMidYMin meet"
        >
          <text
            x="900"
            y="230"
            textAnchor="middle"
            className="font-jacobs font-bold"
            fontSize="360"
            letterSpacing="-0.02em"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="4.5"
          >
            INSOMNIS
          </text>
        </svg>
      </div>
    </footer>
  );
};

