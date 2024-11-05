import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileSpreadsheet, FileText, FileBox } from 'lucide-react';
import { GeneratedStatements } from '../utils/types';
import { exportToExcel } from '../utils/exportUtils';
import { exportToPDF } from '../utils/exportUtils';
import { exportToWord, exportComprehensiveReport } from '../utils/exportToWord';
import { logger } from '../utils/logger';
import StatementSection from './StatementSection';

interface TabularStatementsProps {
  statements: GeneratedStatements;
}

export default function TabularStatements({ statements }: TabularStatementsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('balance');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Early return if no statements provided
  if (!statements) {
    logger.warn('No statements provided to TabularStatements component');
    return null;
  }

  // Log available statements for debugging
  logger.debug('Available statements:', {
    hasBalanceSheet: !!statements.balanceSheet,
    hasIncomeStatement: !!statements.incomeStatement,
    hasCashFlow: !!statements.cashFlow
  });

  // Filter tabs to only show available statements
  const tabs = [
    { id: 'balance', label: t('statements.balanceSheet'), statement: statements.balanceSheet },
    { id: 'income', label: t('statements.incomeStatement'), statement: statements.incomeStatement },
    { id: 'cashflow', label: t('statements.cashFlow'), statement: statements.cashFlow }
  ].filter(tab => tab.statement !== null);

  if (tabs.length === 0) {
    logger.warn('No valid statements found in provided data');
    return null;
  }

  // Set initial active tab to first available statement if current is not available
  React.useEffect(() => {
    if (!tabs.find(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleExport = async (format: 'excel' | 'pdf' | 'word' | 'comprehensive') => {
    try {
      setExportError(null);
      
      switch (format) {
        case 'excel':
          await exportToExcel(statements, activeTab);
          break;
        case 'pdf':
          await exportToPDF(statements, activeTab);
          break;
        case 'word':
          await exportToWord(statements, false);
          break;
        case 'comprehensive':
          await exportComprehensiveReport(statements);
          break;
        default:
          throw new Error('Invalid export format');
      }
      
      setShowExportMenu(false);
      logger.info('Export completed successfully', { format });
    } catch (error) {
      logger.error('Export failed:', error);
      setExportError(t('common.exportError'));
    }
  };

  const getCurrentStatement = () => {
    switch (activeTab) {
      case 'balance':
        return statements.balanceSheet;
      case 'income':
        return statements.incomeStatement;
      case 'cashflow':
        return statements.cashFlow;
      default:
        return null;
    }
  };

  const currentStatement = getCurrentStatement();
  if (!currentStatement) {
    logger.warn('No statement found for active tab:', activeTab);
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            <span>{t('common.export')}</span>
          </button>
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {t('common.exportToExcel')}
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('common.exportToPDF')}
                </button>
                <button
                  onClick={() => handleExport('comprehensive')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                >
                  <FileBox className="h-4 w-4 mr-2" />
                  {t('analysis.comprehensiveReport')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {exportError && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-600">{exportError}</p>
        </div>
      )}

      <div className="p-6">
        <StatementSection 
          sections={currentStatement.sections}
          total={currentStatement.total}
          beginningCash={currentStatement.beginningCash}
          endingCash={currentStatement.endingCash}
          sectionTitles={{
            assets: t('sections.assets'),
            liabilities: t('sections.liabilities'),
            equity: t('sections.equity'),
            revenue: t('sections.revenue'),
            expenses: t('sections.expenses'),
            operating: t('sections.operating'),
            investing: t('sections.investing'),
            financing: t('sections.financing')
          }}
        />
      </div>
    </div>
  );
}