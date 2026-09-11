import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Locale, StoreItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoreSection } from './components/StoreSection';
import { FooterSection } from './components/FooterSection';

// Lazy load secondary views for instant first page paint
const RulesView = lazy(() => import('./components/RulesView').then(m => ({ default: m.RulesView })));
const NotFoundView = lazy(() => import('./components/NotFoundView').then(m => ({ default: m.NotFoundView })));
const CheckoutModal = lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));

export default function App() {
  const [locale, setLocale] = useState<Locale>('ru');
  const [currentView, setCurrentView] = useState<'home' | 'rules' | '404'>('home');
  const [initialRuleSlug, setInitialRuleSlug] = useState<string | null>(null);

  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    plan: StoreItem | null;
  }>({
    isOpen: false,
    plan: null,
  });

  useEffect(() => {
    const parseRoute = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
      const hash = window.location.hash;

      // Backward compatibility: redirect any legacy hash URLs to clean paths
      if (hash.startsWith('#/rules') || hash.startsWith('#rules')) {
        const hashMatch = hash.match(/#\/?rules\/([a-z0-9-]+)/);
        const slug = hashMatch ? hashMatch[1] : null;
        setCurrentView('rules');
        setInitialRuleSlug(slug);
        const cleanPath = slug ? `/rules/${slug}` : '/rules';
        try {
          window.history.replaceState(null, '', cleanPath);
        } catch {
          // ignore
        }
        return;
      }

      if (pathname === '/' || pathname === '') {
        setCurrentView('home');
        setInitialRuleSlug(null);
      } else if (pathname === '/rules' || pathname.startsWith('/rules/')) {
        setCurrentView('rules');
        const match = pathname.match(/^\/rules\/([a-z0-9-]+)/);
        if (match) {
          setInitialRuleSlug(match[1]);
        } else {
          setInitialRuleSlug(null);
        }
      } else if (pathname === '/404') {
        setCurrentView('404');
        setInitialRuleSlug(null);
      } else {
        // Any unknown path renders 404 view
        setCurrentView('404');
        setInitialRuleSlug(null);
      }
    };

    parseRoute();
    window.addEventListener('popstate', parseRoute);
    window.addEventListener('hashchange', parseRoute);
    return () => {
      window.removeEventListener('popstate', parseRoute);
      window.removeEventListener('hashchange', parseRoute);
    };
  }, []);

  const handleSelectPlan = (plan: StoreItem) => {
    setCheckoutModal({ isOpen: true, plan });
  };

  const handleOpenRules = (slug?: string) => {
    const targetPath = slug ? `/rules/${slug}` : '/rules';
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view: 'rules', slug }, '', targetPath);
      }
    } catch {
      // ignore in iframe environments
    }
    setInitialRuleSlug(slug || null);
    setCurrentView('rules');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState({ view: 'home' }, '', '/');
      }
    } catch {
      // ignore
    }
    setCurrentView('home');
    setInitialRuleSlug(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoToStore = () => {
    if (currentView === 'rules' || currentView === '404') {
      handleBackToHome();
      setTimeout(() => {
        const elem = document.getElementById('store');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const elem = document.getElementById('store');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#fafafa] font-jacobs selection:bg-blue-300/30 selection:text-white relative overflow-x-hidden">
      {/* Global Atmospheric Ambient Lighting (Insomnis Ice Blue & Electric Sky Blue) */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute w-[60rem] sm:w-[95rem] h-[38rem] -top-24 left-1/2 -translate-x-1/2 bg-blue-500/18 rounded-full blur-[140px] opacity-75" />
        <div className="absolute w-[50rem] sm:w-[80rem] h-[42rem] top-[40vh] -left-20 bg-sky-500/14 rounded-full blur-[150px] opacity-70" />
        <div className="absolute w-[60rem] sm:w-[90rem] h-[45rem] bottom-0 -right-20 bg-blue-600/14 rounded-full blur-[160px] opacity-70" />
        <div className="absolute w-[40rem] h-[35rem] top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 rounded-full blur-[180px] opacity-50" />
      </div>

      {/* Global Insomnis Noise Texture */}
      <div className="noise fixed inset-0 pointer-events-none select-none z-[1] opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'rules' ? (
            <motion.div
              key="rules-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  </div>
                }
              >
                <RulesView
                  locale={locale}
                  setLocale={setLocale}
                  initialSlug={initialRuleSlug}
                  onBackToHome={handleBackToHome}
                  onGoToStore={handleGoToStore}
                />
              </Suspense>
            </motion.div>
          ) : currentView === '404' ? (
            <motion.div
              key="notfound-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  </div>
                }
              >
                <NotFoundView
                  locale={locale}
                  onBackToHome={handleBackToHome}
                  onOpenRules={() => handleOpenRules()}
                  onGoToStore={handleGoToStore}
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Navbar
                locale={locale}
                setLocale={setLocale}
                onOpenDocs={() => handleOpenRules()}
                onGoToStore={handleGoToStore}
              />

              {/* Main Content: Hero -> Store / Privileges */}
              <main>
                <HeroSection
                  locale={locale}
                  onGoToStore={handleGoToStore}
                  onOpenRules={() => handleOpenRules()}
                />
                <StoreSection locale={locale} onSelectPlan={handleSelectPlan} />
              </main>

              {/* Footer */}
              <FooterSection
                locale={locale}
                onOpenDocs={() => handleOpenRules()}
                onGoToStore={handleGoToStore}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Checkout Modal */}
      {checkoutModal.isOpen && (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={checkoutModal.isOpen}
            plan={checkoutModal.plan}
            locale={locale}
            onClose={() => setCheckoutModal({ isOpen: false, plan: null })}
            onSuccess={() => {}}
          />
        </Suspense>
      )}
    </div>
  );
}
