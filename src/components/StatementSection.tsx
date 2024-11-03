import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, ChevronRight } from 'lucide-react';

interface StatementSectionProps {
  sections?: Record<string, any>;
  total?: number;
  beginningCash?: number;
  endingCash?: number;
  sectionTitles?: Record<string, string>;
}

export default function StatementSection({ 
  sections = {},
  total, 
  beginningCash, 
  endingCash,
  sectionTitles = {}
}: StatementSectionProps) {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>([]);

  const formatAmount = (amount: number | undefined | null) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAccount = (accountId: string) => {
    setExpandedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  return (
    <div className="divide-y divide-gray-200">
      {typeof beginningCash !== 'undefined' && (
        <div className="py-4">
          <div className="flex justify-between text-sm font-medium bg-blue-50 p-3 rounded">
            <span className="text-blue-900">{t('cashFlow.beginningBalance')}</span>
            <span className="text-blue-900">{formatAmount(beginningCash)}</span>
          </div>
        </div>
      )}

      {sections && Object.entries(sections).map(([sectionName, section]) => {
        if (!section) return null;
        
        const sectionId = `section-${sectionName}`;
        const isExpanded = !expandedSections.includes(sectionId);
        const sectionTitle = sectionTitles[sectionName] || t(`sections.${sectionName}`);

        return (
          <div key={sectionName} className="py-4">
            <button
              onClick={() => toggleSection(sectionId)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-900 mb-3 hover:bg-gray-50 p-2 rounded"
            >
              <span className="capitalize">{sectionTitle}</span>
              <div className="flex items-center space-x-3">
                <span>{formatAmount(section?.total)}</span>
                {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </button>

            {isExpanded && section?.items && (
              <div className="space-y-2 ml-4">
                {section.items.map((item: any, index: number) => {
                  const accountId = `${sectionId}-${item?.accountCode || index}`;
                  const isAccountExpanded = expandedAccounts.includes(accountId);

                  return (
                    <div key={index} className="space-y-1">
                      <button
                        onClick={() => toggleAccount(accountId)}
                        className="w-full flex items-center justify-between text-sm bg-gray-50 p-2 rounded hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          {item?.accountCode && (
                            <span className="text-gray-500">{item.accountCode}</span>
                          )}
                          <span className="text-gray-600">{item?.account || t('common.unknown')}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`font-medium ${
                            (item?.amount || 0) < 0 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {formatAmount(item?.amount)}
                          </span>
                          {item?.details && (
                            isAccountExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />
                          )}
                        </div>
                      </button>

                      {isAccountExpanded && item?.details && (
                        <div className="ml-4 space-y-1 bg-gray-50 p-2 rounded">
                          {item.details.map((detail: any, detailIndex: number) => (
                            <div key={detailIndex} className="flex flex-col text-xs p-1 border-b border-gray-200 last:border-0">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <ChevronRight className="h-3 w-3 text-gray-400" />
                                  <span className="text-gray-600">{formatDate(detail?.date)}</span>
                                </div>
                                <span className={(detail?.amount || 0) < 0 ? 'text-red-500' : 'text-gray-900'}>
                                  {formatAmount(detail?.amount)}
                                </span>
                              </div>
                              {detail?.description && (
                                <div className="ml-5 mt-1 text-gray-500">
                                  {detail.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {typeof endingCash !== 'undefined' && (
        <div className="py-4">
          <div className="flex justify-between text-sm font-medium bg-blue-50 p-3 rounded">
            <span className="text-blue-900">{t('cashFlow.endingBalance')}</span>
            <span className="text-blue-900">{formatAmount(endingCash)}</span>
          </div>
        </div>
      )}

      {typeof total !== 'undefined' && (
        <div className="py-4">
          <div className="flex justify-between text-sm font-semibold bg-gray-100 p-3 rounded">
            <span className="text-gray-900">{t('common.netTotal')}</span>
            <span className={`${(total || 0) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatAmount(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}