import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart2, FileText } from 'lucide-react';
import { GeneratedStatements, HistoricalData } from '../../utils/types';
import { calculateFinancialRatios } from '../../utils/ratioCalculator';
import { calculatePeriodComparison } from '../../utils/periodComparison';
import TabularStatements from '../TabularStatements';
import TrendVisualization from '../TrendVisualization';
import SaveAnalysisButton from './SaveAnalysisButton';

interface FinancialAnalysisToolProps {
  statements: GeneratedStatements;
  historicalData?: HistoricalData[];
  companyId: string;
  onSaved?: () => void;
}

export default function FinancialAnalysisTool({
  statements,
  historicalData = [],
  companyId,
  onSaved,
}: FinancialAnalysisToolProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    'statements' | 'health' | 'trends'
  >('statements');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const tabs = [
    {
      id: 'statements',
      label: t('statements.financialStatements'),
      icon: FileText,
    },
    { id: 'health', label: t('statements.financialAnalysis'), icon: BarChart2 },
    { id: 'trends', label: t('analysis.trends'), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <SaveAnalysisButton
          statements={statements}
          companyId={companyId}
          period={selectedPeriod}
          onSaved={onSaved}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {activeTab === 'statements' && (
          <TabularStatements statements={statements} />
        )}
        {activeTab === 'trends' && historicalData.length > 0 && (
          <div className="p-6 space-y-6">
            <TrendVisualization data={historicalData} metric="revenue" />
            <TrendVisualization data={historicalData} metric="netIncome" />
            <TrendVisualization data={historicalData} metric="assets" />
            <TrendVisualization data={historicalData} metric="cashFlow" />
          </div>
        )}
      </div>
    </div>
  );
}
