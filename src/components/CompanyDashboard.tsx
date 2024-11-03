import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, DollarSign, History, AlertCircle } from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { getAnalysisHistory } from '../utils/supabase/analysis';
import { FinancialAnalysis } from '../utils/types';
import TabularStatements from './TabularStatements';
import DashboardHeader from './dashboard/DashboardHeader';
import ComprehensiveReport from './analysis/ComprehensiveReport';
import MonthToMonthComparison from './dashboard/MonthToMonthComparison';
import HistoricalAnalysis from './dashboard/HistoricalAnalysis';
import TrendAnalysisReport from './dashboard/TrendAnalysisReport';
import { logger } from '../utils/logger';

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const { selectedCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<FinancialAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FinancialAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'monthToMonth' | 'trends'>('current');

  useEffect(() => {
    if (selectedCompany) {
      loadAnalysisHistory();
    }
  }, [selectedCompany]);

  const loadAnalysisHistory = async () => {
    if (!selectedCompany) return;

    try {
      setLoading(true);
      setError(null);
      const history = await getAnalysisHistory(selectedCompany.id);
      setAnalysisHistory(history);
      
      if (history.length > 0) {
        setSelectedAnalysis(history[0]);
      }
    } catch (err) {
      logger.error('Error loading analysis history:', err);
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'current':
        return selectedAnalysis ? (
          <>
            <TabularStatements statements={selectedAnalysis.statements} />
            <ComprehensiveReport statements={selectedAnalysis.statements} />

                      </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('dashboard.noAnalysis')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('dashboard.noAnalysisDesc')}
            </p>
          </div>
        );

      case 'history':
        return <HistoricalAnalysis analysisHistory={analysisHistory} />;

      case 'monthToMonth':
        return <MonthToMonthComparison analysisHistory={analysisHistory} />;

      case 'trends':
        return analysisHistory.length >= 2 ? (
          <div className="space-y-6">
            {['revenue', 'netIncome', 'assets', 'cashFlow'].map((metric) => (
              <TrendAnalysisReport
                key={metric}
                currentPeriod={analysisHistory[0]}
                previousPeriod={analysisHistory[1]}
                metric={metric}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('analysis.trends.noData')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('analysis.trends.needMoreData')}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {!selectedCompany ? (
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-yellow-700">{t('company.noCompanySelected')}</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">{t('common.loading')}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadAnalysisHistory}
            className="mt-2 text-sm text-red-600 hover:text-red-500"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex space-x-4">
              {[
                { id: 'current', label: t('dashboard.currentAnalysis'), icon: BarChart3 },
                { id: 'history', label: t('dashboard.historicalAnalysis'), icon: History },
                { id: 'monthToMonth', label: t('dashboard.monthToMonth'), icon: DollarSign },
                { id: 'trends', label: t('dashboard.trendAnalysis'), icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
}