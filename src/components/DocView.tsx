import React from 'react';
import { ArrowLeft, FileText, Shield, CheckCircle, Scroll } from 'lucide-react';
import { Locale } from '../types';
import { Navbar } from './Navbar';

export type DocType = 'offer' | 'terms' | 'privacy' | 'consent';

interface DocViewProps {
  type: DocType;
  locale: Locale;
  setLocale?: (locale: Locale) => void;
  onBackToHome: () => void;
  onOpenRules: () => void;
  onGoToStore?: () => void;
}

const DOC_METADATA: Record<
  DocType,
  {
    title: { ru: string; en: string; ua: string };
    subtitle: { ru: string; en: string; ua: string };
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  offer: {
    title: {
      ru: 'Публичная оферта',
      en: 'Public Offer',
      ua: 'Публічна оферта',
    },
    subtitle: {
      ru: 'Договор публичной оферты о предоставлении игровых и сопутствующих услуг',
      en: 'Public offer agreement for the provision of game and related services',
      ua: 'Договір публічної оферти про надання ігрових та супутніх послуг',
    },
    icon: Scroll,
  },
  terms: {
    title: {
      ru: 'Условия использования',
      en: 'Terms of Service',
      ua: 'Умови використання',
    },
    subtitle: {
      ru: 'Правила и условия пользования веб-ресурсом и сервисами Insomnis',
      en: 'Terms and conditions for using the Insomnis web resource and services',
      ua: 'Правила та умови користування веб-ресурсом та сервісами Insomnis',
    },
    icon: FileText,
  },
  privacy: {
    title: {
      ru: 'Политика конфиденциальности',
      en: 'Privacy Policy',
      ua: 'Політика конфіденційності',
    },
    subtitle: {
      ru: 'Порядок сбора, хранения и защиты информации пользователей проекта',
      en: 'Procedures for collecting, storing, and protecting project user information',
      ua: 'Порядок збору, зберігання та захисту інформації користувачів проекту',
    },
    icon: Shield,
  },
  consent: {
    title: {
      ru: 'Согласие на обработку персональных данных',
      en: 'Consent to Personal Data Processing',
      ua: 'Згода на обробку персональних даних',
    },
    subtitle: {
      ru: 'Условия обработки и использования персональных данных при регистрации и покупке',
      en: 'Terms of processing and using personal data during registration and purchase',
      ua: 'Умови обробки та використання персональних даних при реєстрації та покупці',
    },
    icon: CheckCircle,
  },
};

export const DocView: React.FC<DocViewProps> = ({
  type,
  locale,
  setLocale,
  onBackToHome,
  onOpenRules,
  onGoToStore,
}) => {
  const meta = DOC_METADATA[type] || DOC_METADATA.terms;
  const Icon = meta.icon;

  const currentLang = locale === 'ua' ? 'ua' : locale === 'en' ? 'en' : 'ru';
  const title = meta.title[currentLang];
  const subtitle = meta.subtitle[currentLang];

  return (
    <div className="min-h-screen relative text-white antialiased font-jacobs flex flex-col">
      {/* Floating Navbar */}
      <div className="relative z-50 shrink-0">
        <Navbar
          locale={locale}
          setLocale={setLocale || (() => {})}
          onOpenDocs={onOpenRules}
          onGoToStore={onGoToStore}
          onLogoClick={onBackToHome}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 flex-1 flex flex-col items-center">
        <div className="w-full relative p-8 sm:p-12 rounded-[36px] overflow-hidden bg-[#07090e]/70 border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {/* Noise & Glow */}
          <div className="absolute inset-0 z-[1] bg-blue-950/10 pointer-events-none" />
          <div className="absolute w-72 h-72 -left-16 -top-16 bg-blue-500/20 rounded-full opacity-60 blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Back button */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 text-[14px] cursor-pointer w-fit"
            >
              <ArrowLeft size={16} />
              <span>{locale === 'en' ? 'Back to Home' : locale === 'ua' ? 'На головну' : 'На главную'}</span>
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-blue-300">
                <Icon size={20} />
              </div>
              <span className="text-[13px] uppercase tracking-wider text-blue-300/80 font-semibold">
                {locale === 'en' ? 'Legal Document' : locale === 'ua' ? 'Юридичний документ' : 'Официальный документ'}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{title}</h1>
              <p className="text-white/60 text-[15px] sm:text-[16px] leading-relaxed">{subtitle}</p>
            </div>

            <div className="w-full h-px bg-white/[0.08] my-2" />

            {/* Placeholder Stub Body */}
            <div className="space-y-6 text-white/70 text-[15px] leading-relaxed font-normal">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-blue-200/90 font-medium mb-2">
                  {locale === 'en'
                    ? 'Document is currently being prepared for official publication.'
                    : locale === 'ua'
                    ? 'Документ знаходиться на стадії підготовки до офіційної публікації.'
                    : 'Документ находится в процессе подготовки к официальной публикации.'}
                </p>
                <p className="text-white/50 text-[14px]">
                  {locale === 'en'
                    ? 'Full text of the legal terms will be published prior to public launch. For questions or support, contact us via Discord or email support@insomnis.fun.'
                    : locale === 'ua'
                    ? 'Повний текст юридичних положень буде опубліковано до офіційного запуску. З усіх питань звертайтесь у наш Discord або на support@insomnis.fun.'
                    : 'Полный текст юридических условий будет опубликован до официального запуска. По всем вопросам обращайтесь в наш Discord или по адресу support@insomnis.fun.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                <div className="text-[13px] text-white/40">
                  <span>Insomnis © 2026 • ИП Дрожжин А.В. • ОГРНИП 326774600392741</span>
                </div>
                <button
                  onClick={onOpenRules}
                  className="text-[13px] text-blue-300 hover:text-blue-200 underline underline-offset-4 cursor-pointer"
                >
                  {locale === 'en' ? 'View Server Rules' : locale === 'ua' ? 'Переглянути правила сервера' : 'Правила сервера'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
