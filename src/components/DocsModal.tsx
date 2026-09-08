import React from 'react';
import { RulesView } from './RulesView';
import { Locale } from '../types';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: Locale;
  initialSlug?: string | null;
  onGoToStore?: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({
  isOpen,
  onClose,
  locale = 'ru',
  initialSlug = null,
  onGoToStore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111216]">
      <RulesView
        locale={locale}
        initialSlug={initialSlug}
        onBackToHome={onClose}
        onGoToStore={onGoToStore || onClose}
      />
    </div>
  );
};
