import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import DocumentationModal from './ui/DocumentationModal';

export default function Header() {
  const { t } = useTranslation();
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t('common.financialAnalysis')}
              </h1>
              <p className="text-sm text-gray-500">
                {t('common.dashboard')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="btn-secondary"
              onClick={() => setIsDocModalOpen(true)}
            >
              {t('common.documentation')}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <DocumentationModal 
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </header>
  );
}