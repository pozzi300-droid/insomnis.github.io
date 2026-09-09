import { useState, useEffect } from 'react';
import { Locale, StoreItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StoreSection } from './components/StoreSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FooterSection } from './components/FooterSection';
import { RulesView } from './components/RulesView';
import { CheckoutModal } from './components/CheckoutModal';

export default function App() {
  const [locale, setLocale] = useState<Locale>('ru');
  const [currentView, setCurrentView] = useState<'home' | 'rules'>('home');
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
        window.history.replaceState(null, '', cleanPath);
        return;
      }

      if (pathname === '/rules' || pathname.startsWith('/rules/')) {
        setCurrentView('rules');
        const match = pathname.match(/^\/rules\/([a-z0-9-]+)/);
        if (match) {
          setInitialRuleSlug(match[1]);
        } else {
          setInitialRuleSlug(null);
        }
      } else {
        setCurrentView('home');
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
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setInitialRuleSlug(slug || null);
    setCurrentView('rules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    setCurrentView('home');
    setInitialRuleSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStore = () => {
    if (currentView === 'rules') {
      handleBackToHome();
      setTimeout(() => {
        const elem = document.getElementById('store');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById('store');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#111216] text-[#fafafa] font-sans selection:bg-[#0abab5]/30 selection:text-white relative">
      {currentView === 'rules' ? (
        /* Server Rules view partitioned by sections and numbered points */
        <RulesView
          locale={locale}
          setLocale={setLocale}
          initialSlug={initialRuleSlug}
          onBackToHome={handleBackToHome}
          onGoToStore={handleGoToStore}
        />
      ) : (
        /* Main page layout */
        <>
          {/* Floating Pill Navbar */}
          <Navbar
            locale={locale}
            setLocale={setLocale}
            onOpenDocs={() => handleOpenRules()}
            onGoToStore={handleGoToStore}
          />

          {/* Main Sections: Hero -> Store & FAQ -> HowItWorks */}
          <main>
            <HeroSection
              locale={locale}
              onGoToStore={handleGoToStore}
              onOpenDocs={() => handleOpenRules()}
            />
            <StoreSection locale={locale} onSelectPlan={handleSelectPlan} />
            <HowItWorksSection locale={locale} />
          </main>

          {/* Footer */}
          <FooterSection
            locale={locale}
            onOpenDocs={() => handleOpenRules()}
            onGoToStore={handleGoToStore}
          />
        </>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        plan={checkoutModal.plan}
        locale={locale}
        onClose={() => setCheckoutModal({ isOpen: false, plan: null })}
        onSuccess={() => {}}
      />
    </div>
  );
}
