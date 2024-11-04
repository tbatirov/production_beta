// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { BarChart3, TrendingUp, History } from 'lucide-react';
// import { useCompany } from '../../contexts/CompanyContext';
// import { getAnalysisHistory } from '../../utils/supabase/analysis';
// import { FinancialAnalysis } from '../../utils/types';
// import TabularStatements from '../TabularStatements';
// import ComprehensiveReport from '../analysis/ComprehensiveReport';
// import DashboardHeader from './DashboardHeader';
// import FinancialRatiosDashboard from './FinancialRatiosDashboard';
// import TrendAnalysis from './TrendAnalysis';
// import { logger } from '../../utils/logger';

// export default function CompanyDashboard() {
//   const { t } = useTranslation();
//   const { selectedCompany } = useCompany();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedAnalysis, setSelectedAnalysis] = useState<FinancialAnalysis | null>(null);
//   const [analysisHistory, setAnalysisHistory] = useState<FinancialAnalysis[]>([]);
//   const [activeTab, setActiveTab] = useState<'current' | 'history' | 'trends'>('current');

//   useEffect(() => {
//     if (selectedCompany) {
//       console.log(2)
//       loadAnalysisHistory();
//     }
//   }, [selectedCompany]);

//   const loadAnalysisHistory = async () => {
//     if (!selectedCompany) return;

//     try {
//       setLoading(true);
//       setError(null);
//       const history = await getAnalysisHistory(selectedCompany.id);
      
//       logger.info('Loaded analysis history:', { 
//         historyLength: history.length,
//         firstAnalysis: history[0] 
//       });
      
//       setAnalysisHistory(history);
      
//       if (history.length > 0) {
//         setSelectedAnalysis(history[0]);
//         logger.info('Selected analysis data:', { 
//           statements: history[0].statements,
//           hasBalanceSheet: !!history[0].statements?.balanceSheet,
//           hasIncomeStatement: !!history[0].statements?.incomeStatement,
//           hasCashFlow: !!history[0].statements?.cashFlow
//         });
//       }
//     } catch (err) {
//       logger.error('Error loading analysis history:', err);
//       setError(err instanceof Error ? err.message : t('common.error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderCurrentAnalysis = () => {
//     if (!selectedAnalysis?.statements) {
//       return (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             {t('dashboard.noStatements')}
//           </h3>
//           <p className="text-sm text-gray-500">
//             {t('dashboard.noStatementsDesc')}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-8">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">
//               {t('statements.financialStatements')}
//             </h2>
//             <TabularStatements statements={selectedAnalysis.statements} />
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">
//               {t('statements.financialAnalysis')}
//             </h2>
//             <ComprehensiveReport statements={selectedAnalysis.statements} />
//           </div>
//         </div>

//         {selectedAnalysis.ratios && (
//           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                 {t('analysis.ratios.title')}
//               </h2>
//               <FinancialRatiosDashboard ratios={selectedAnalysis.ratios} />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!selectedCompany) {
//     return (
//       <div className="space-y-6">
//         <DashboardHeader />
//         <div className="bg-yellow-50 rounded-lg p-4">
//           <p className="text-yellow-700">{t('company.noCompanySelected')}</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <DashboardHeader />
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-500">{t('common.loading')}</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <DashboardHeader />
//         <div className="bg-red-50 rounded-lg p-4">
//           <p className="text-red-700">{error}</p>
//           <button
//             onClick={loadAnalysisHistory}
//             className="mt-2 text-sm text-red-600 hover:text-red-500"
//           >
//             {t('common.tryAgain')}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!selectedAnalysis) {
//     return (
//       <div className="space-y-6">
//         <DashboardHeader />
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             {t('dashboard.noAnalysis')}
//           </h3>
//           <p className="text-sm text-gray-500">
//             {t('dashboard.noAnalysisDesc')}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'current', label: t('dashboard.currentAnalysis'), icon: BarChart3 },
//     { id: 'history', label: t('dashboard.historicalAnalysis'), icon: History },
//     { id: 'trends', label: t('dashboard.trendAnalysis'), icon: TrendingUp }
//   ];

//   return (
//     <div className="space-y-6">
//       <DashboardHeader />
      
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         <div className="flex space-x-1 mb-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id as any)}
//               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
//                 activeTab === tab.id
//                   ? 'bg-blue-50 text-blue-700'
//                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <tab.icon className="h-4 w-4" />
//               <span>{tab.label}</span>
//             </button>
//           ))}
//         </div>

//         {activeTab === 'current' && renderCurrentAnalysis()}

//         {activeTab === 'history' && analysisHistory.length > 0 && (
//           <div className="space-y-8">
//             {analysisHistory.map((analysis) => (
//               <div key={analysis.period} className="border-t pt-8 first:border-t-0 first:pt-0">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">
//                   {new Date(analysis.period).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'long'
//                   })}
//                 </h3>
//                 <TabularStatements statements={analysis.statements} />
//               </div>
//             ))}
//           </div>
//         )}

//         {activeTab === 'trends' && analysisHistory.length > 0 && (
//           <TrendAnalysis analysisHistory={analysisHistory} />
//         )}
//       </div>
//     </div>
//   );
// }