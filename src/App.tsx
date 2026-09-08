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
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/rules') || hash.startsWith('#rules')) {
        setCurrentView('rules');
        const match = hash.match(/#\/?rules\/([a-z0-9-]+)/);
        if (match) {
          setInitialRuleSlug(match[1]);
        } else {
          setInitialRuleSlug(null);
        }
      } else if (hash === '' || hash === '#') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPlan = (plan: StoreItem) => {
    setCheckoutModal({ isOpen: true, plan });
  };

  const handleOpenRules = (slug?: string) => {
    if (slug) {
      setInitialRuleSlug(slug);
      window.location.hash = `#/rules/${slug}`;
    } else {
      setInitialRuleSlug(null);
      window.location.hash = '#/rules';
    }
    setCurrentView('rules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setInitialRuleSlug(null);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState(null, '', window.location.pathname);
      } catch {}
      window.location.hash = '';
    }
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
