import React from 'react';
import { Locale } from '../types';

interface FooterSectionProps {
  locale?: Locale;
  onOpenDocs?: () => void;
  onGoToStore?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = () => {
  return (
    <footer className="relative px-6 lg:px-22 mx-auto max-w-[110rem] size-full pt-20 lg:pt-30 pb-24 lg:pb-0 overflow-hidden">
      <div className="flex flex-col gap-14 relative z-10">
        <div className="grid gap-12 2xl:grid-cols-[3.8fr_0.8fr_1fr]">
          <div className="flex flex-col gap-6">
            <img src="/branding/logo.svg" className="size-8" alt="Insomnis" />
            <div className="flex flex-col gap-6 leading-7 lg:leading-normal">
              <p className="text-white/60 font-jacobs text-[14px]">
                © 2026 Insomnis. Все права защищены. <br /><br />
                Почта <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg mx-1">support@insomnis.fun</span><br className="lg:hidden" />
                ИП <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg mx-1">Дрожжин Артём Викторович</span><br className="lg:hidden" />
                ИНН <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg mx-1">772450657890</span><br className="lg:hidden" />
                ОГРНИП <span className="text-white bg-white/10 px-1.5 py-1 rounded-lg mx-1">326774600392741</span>
              </p>
              <div className="font-jacobs text-[12px] text-white/40 flex gap-2 items-center">
                <span>
                  Дизайн и разработка от{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://ggsky.one?from=insomnis"
                    className="bg-linear-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent hover:brightness-115 smooth"
                  >
                    <span className="underline underline-offset-2">@GGSkyOne</span>
                  </a>
                </span>
                <button className="flex cursor-pointer hover:brightness-115 smooth text-white" aria-label="fr">
                  <span className="icon-[iconoir--spark-solid] size-3.5 bg-linear-to-r from-blue-300 to-indigo-300 -skew-x-12 grayscale-25"></span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h2 className="font-jacobs font-medium text-sky-200 bg-blue-400/20 px-1 rounded-md mx-1 text-[13px] uppercase mb-2">
              Ссылки
            </h2>
            <a
              href="https://t.me/insomnis"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--telegram] size-4"></span> Telegram канал
            </a>
            <a
              href="https://dsc.gg/insomnisclient"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--discord] size-4"></span> Discord сервер
            </a>
            <a
              href="https://my.insomnis.fun/"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--settings] size-4"></span> Панель управления
            </a>
            <a
              href="https://insomnis.fun/status"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--activity] size-4"></span> Статус серверов
            </a>
          </div>

          <div className="flex flex-col gap-3 items-start">
            <h2 className="font-jacobs font-medium text-sky-200 bg-blue-400/20 px-1 rounded-md mx-1 text-[13px] uppercase mb-2">
              Документы
            </h2>
            <a
              href="/documents/публичная_офферта.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--open-book] size-4"></span> Договор-оферта
            </a>
            <a
              href="/terms"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--book] size-4"></span> Условия использования
            </a>
            <a
              href="/privacy"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--lock] size-4"></span> Политика конфиденциальности
            </a>
            <a
              href="/consent"
              className="flex gap-3 hover:bg-white/10 px-2 hover:py-1.5 hover:rounded-lg hover:-my-1.5 items-center font-jacobs text-white/60 text-[12px] hover:text-white smooth text-left cursor-pointer pl-2"
            >
              <span className="icon-[iconoir--check] size-4"></span> Согласие на обработку данных
            </a>
          </div>
        </div>
      </div>

      <svg viewBox="0 0 1000 180" className="hidden lg:block w-full mt-12 lg:-ml-3" preserveAspectRatio="xMidYMid meet">
        <text x="500" y="150" textAnchor="middle" className="font-jacobs font-bold" fontSize="165" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4">
          INSOMNIS
        </text>
      </svg>
    </footer>
  );
};

