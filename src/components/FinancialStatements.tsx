import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { FinancialStatement, GeneratedStatements, StatementItem } from '../utils/types';

interface StatementSectionProps {
  title: string;
  statement: FinancialStatement | null;
  showCashBalance?: boolean;
}

function StatementSection({ title, statement, showCashBalance }: StatementSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatAmount = (amount: number | undefined | null) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!statement) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
      >
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-500">
            Total: {formatAmount(statement?.total)}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && statement.sections && (
        <div className="p-6">
          {showCashBalance && statement.beginningCash !== undefined && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Beginning Cash Balance: {formatAmount(statement.beginningCash)}
              </h4>
            </div>
          )}

          {Object.entries(statement.sections).map(([sectionName, section]) => (
            <div key={sectionName} className="mb-6 last:mb-0">
              <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                {sectionName.replace(/_/g, ' ')} ({formatAmount(section?.total)})
              </h4>
              <div className="space-y-2">
                {section?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-600">{item.account}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatAmount(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {showCashBalance && statement.endingCash !== undefined && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Ending Cash Balance: {formatAmount(statement.endingCash)}
              </h4>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FinancialStatements({ statements }: { statements: GeneratedStatements | null }) {
  const [showHealth, setShowHealth] = useState(false);

  if (!statements) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Financial Statements</h2>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="space-y-6">
          <StatementSection 
            title="Balance Sheet" 
            statement={statements.balanceSheet} 
          />
          <StatementSection 
            title="Income Statement" 
            statement={statements.incomeStatement} 
          />
          <StatementSection 
            title="Cash Flow Statement" 
            statement={statements.cashFlow} 
            showCashBalance={true}
          />
        </div>

        <div className="mt-8 pt-6 border-t flex justify-center">
          <button
            onClick={() => setShowHealth(!showHealth)}
            className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{showHealth ? 'Hide Financial Analysis' : 'Show Financial Health Analysis'}</span>
          </button>
        </div>
      </div>

      {showHealth && <FinancialHealth statements={statements} />}
    </div>
  );
}