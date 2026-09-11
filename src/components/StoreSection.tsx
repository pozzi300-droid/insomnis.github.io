import React from 'react';
import { motion } from 'motion/react';
import { Locale, StoreItem } from '../types';

interface MinecraftPrivilege {
  id: string;
  name: string;
  price: number;
  discount?: number;
  color: string;
  shortDesc: string;
  options?: { id: number; label: string; price: number }[];
}

interface StoreSectionProps {
  locale: Locale;
  onSelectPlan: (item: StoreItem) => void;
}

const minecraftPrivileges: MinecraftPrivilege[] = [
  {
    id: 'test-1',
    name: 'test-1',
    price: 99,
    discount: 10,
    color: '#EC4899',
    shortDesc: 'Тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест кто прочитал тот натурал',
    options: [
      { id: 1, label: '7 дн', price: 99 },
      { id: 2, label: '30 дн', price: 249 },
      { id: 3, label: 'Навсегда', price: 499 },
    ],
  },
  {
    id: 'test-2',
    name: 'test-2',
    price: 199,
    discount: 15,
    color: '#F43F5E',
    shortDesc: 'Тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест тест кто прочитал тот натурал',
    options: [
      { id: 1, label: '7 дн', price: 199 },
      { id: 2, label: '30 дн', price: 449 },
      { id: 3, label: 'Навсегда', price: 899 },
    ],
  },
];

export const StoreSection: React.FC<StoreSectionProps> = ({ onSelectPlan }) => {
  const handleBuy = (rank: MinecraftPrivilege) => {
    const item: StoreItem = {
      id: rank.id,
      name: rank.name,
      price: `от ${rank.price} ₽`,
      rawPrice: rank.price,
      displayPrice: `от ${rank.price} ₽`,
      period: '7 дн',
      tariff: rank.name,
      category: 'Привилегия',
      description: rank.shortDesc,
      color: rank.color,
      options: rank.options || [
        { id: 1, label: '7 дн', price: rank.price },
        { id: 2, label: '30 дн', price: Math.round(rank.price * 2.5) },
        { id: 3, label: 'Навсегда', price: Math.round(rank.price * 4.9) },
      ],
    };
    onSelectPlan(item);
  };

  return (
    <section id="store" className="flex flex-col gap-12 px-6 lg:px-20 mx-auto max-w-[110rem] size-full mt-30 pb-16 scroll-mt-24">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center gap-5"
      >
        <h2 className="font-jacobs font-bold uppercase text-white text-[28px] sm:text-[42px] lg:text-[55px] leading-tight lg:leading-none">
          <span className="bg-blue-300/20 px-3 mx-1.5 inline-block leading-none rounded-xl lg:rounded-2xl shadow-lg shadow-blue-500/10 align-baseline">
            <span className="bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              Привилегии
            </span>
          </span>
          <span>на любой вкус</span>
        </h2>
        <p className="font-jacobs text-white/75 text-[15px] lg:text-lg max-w-2xl">
          Узнайте больше о наших привилегиях и их возможностях
        </p>
      </motion.div>

      {/* Tariffs Grid with Minecraft privileges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
        {minecraftPrivileges.map((rank, index) => (
          <motion.div
            key={rank.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
            className="relative flex flex-col gap-6 group px-6 sm:px-8 py-7 sm:py-8 rounded-[32px] sm:rounded-[40px] overflow-hidden supports-[-webkit-hyphens:none]:[clip-path:inset(0_round_40px)] bg-[#07090e]/60 border border-white/[0.04] hover:border-blue-400/30 transition-all duration-250 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {/* Insomnis card background pattern image */}
            <img
              src="/illustrations/main.avif"
              className="insomnis-card-pattern"
              aria-hidden="true"
              alt=""
            />

            {/* Ambient glows (Rionix blue/sky) */}
            <div data-decor className="absolute inset-0 z-[1] pointer-events-none select-none" aria-hidden="true">
              <div className="absolute w-72 h-72 -left-16 -top-16 bg-blue-500/25 rounded-[100%] opacity-55 blur-[80px]" />
              <div className="absolute w-72 h-72 -right-16 -bottom-16 bg-sky-500/20 rounded-[100%] opacity-50 blur-[80px]" />
            </div>

            {/* Exact noise layer */}
            <div className="noise absolute inset-0 z-[2] opacity-35 pointer-events-none select-none" aria-hidden="true" />
            <div className="absolute inset-0 z-[1] bg-blue-950/15 pointer-events-none" />

            {/* Rank Name, Discount & Price */}
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex gap-4 items-center justify-between">
                <p className="font-jacobs font-semibold text-white text-2xl z-3">{rank.name}</p>
                {rank.discount ? (
                  <p className="text-blue-200 font-jacobs font-medium bg-blue-300/20 px-3 py-1 rounded-xl">
                    {' '}
                    - {rank.discount}%{' '}
                  </p>
                ) : null}
              </div>

              <div className="flex items-end gap-2">
                <span className="bg-blue-300/20 px-3 py-1 inline-block leading-none rounded-2xl">
                  <span className="bg-gradient-to-r from-sky-200 to-blue-200 bg-clip-text text-transparent text-4xl sm:text-5xl font-jacobs font-bold">
                    от {rank.price} ₽
                  </span>
                </span>
              </div>

              <p className="font-jacobs text-[14px] text-white/70 leading-relaxed">
                {rank.shortDesc}
              </p>
            </div>

            {/* Purchase CTA */}
            <motion.button
              type="button"
              onClick={() => handleBuy(rank)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex z-3 group/btn items-center justify-center gap-3 mt-auto bg-white px-5 py-3 rounded-2xl ring-1 ring-transparent hover:bg-white/5 hover:text-white hover:ring-white text-black smooth cursor-pointer hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]"
            >
              <span className="icon-[iconoir--cart] size-4 group-hover/btn:scale-125 smooth"></span>
              <p className="font-jacobs font-medium text-[15px]">Приобрести</p>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
