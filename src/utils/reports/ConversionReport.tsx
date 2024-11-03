import React from 'react';
import { ProcessedData, GeneratedStatements } from '../types';
import { logger } from '../logger';

interface ConversionReportProps {
  originalData: ProcessedData;
  statements: GeneratedStatements;
}

export default function ConversionReport({ originalData, statements }: ConversionReportProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Statement Conversion Report</h2>
        <p className="text-gray-600">
          This report details the conversion process from raw financial data to standardized financial statements
          following UzNAS (Uzbekistan National Accounting Standards).
        </p>
      </div>

      {/* Source Data Analysis */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Source Data Analysis</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Trial Balance Data:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Total Entries: {originalData.trialBalance?.rows?.length || 0}</li>
            <li>Available Fields: {originalData.trialBalance?.headers?.join(', ')}</li>
            <li>Period: {originalData.trialBalance?.period || 'Not specified'}</li>
          </ul>

          {originalData.transactions && (
            <>
              <h4 className="font-medium text-gray-700 mt-4 mb-2">Transaction Data:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Total Transactions: {originalData.transactions.rows.length}</li>
                <li>Available Fields: {originalData.transactions.headers.join(', ')}</li>
                <li>Period: {originalData.transactions.period || 'Not specified'}</li>
              </ul>
            </>
          )}
        </div>
      </section>

      {/* Conversion Process */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Conversion Process</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Account Classification:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Assets (0000-4999)</li>
              <li>Equity (5000-5999)</li>
              <li>Liabilities (6000-6999)</li>
              <li>Revenue (7000-7999)</li>
              <li>Expenses (8000-8999)</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Applied Rules:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Debit-normal accounts: Assets and Expenses</li>
              <li>Credit-normal accounts: Liabilities, Equity, and Revenue</li>
              <li>Contra accounts netted against their primary accounts</li>
              <li>Income statement items excluded from balance sheet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Generated Statements */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Generated Statements</h3>
        
        {/* Balance Sheet Summary */}
        {statements.balanceSheet && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Balance Sheet:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Assets</p>
                <p className="text-lg font-semibold">
                  {statements.balanceSheet.sections.assets.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Liabilities & Equity</p>
                <p className="text-lg font-semibold">
                  {(
                    statements.balanceSheet.sections.liabilities.total +
                    statements.balanceSheet.sections.equity.total
                  ).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Income Statement Summary */}
        {statements.incomeStatement && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Income Statement:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-lg font-semibold">
                  {statements.incomeStatement.sections.revenue.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className="text-lg font-semibold">
                  {statements.incomeStatement.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cash Flow Summary */}
        {statements.cashFlow && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">Cash Flow Statement:</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Operating Activities</p>
                <p className="text-lg font-semibold">
                  {statements.cashFlow.sections.operating.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Investing Activities</p>
                <p className="text-lg font-semibold">
                  {statements.cashFlow.sections.investing.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Financing Activities</p>
                <p className="text-lg font-semibold">
                  {statements.cashFlow.sections.financing.total.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Validation Results */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Validation Results</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Balance Sheet Equation:</h4>
          {statements.balanceSheet && (
            <div className="space-y-2">
              <p className="text-gray-600">
                Assets = Liabilities + Equity
              </p>
              <p className="text-gray-600">
                {statements.balanceSheet.sections.assets.total.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })} = {(
                  statements.balanceSheet.sections.liabilities.total +
                  statements.balanceSheet.sections.equity.total
                ).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </p>
              <p className="text-sm text-gray-500">
                Difference: {Math.abs(
                  statements.balanceSheet.sections.assets.total -
                  (statements.balanceSheet.sections.liabilities.total +
                   statements.balanceSheet.sections.equity.total)
                ).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Notes and Observations */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Notes and Observations</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>All amounts are presented in USD</li>
            <li>Account codes follow UzNAS classification system</li>
            <li>Contra accounts have been properly netted against their primary accounts</li>
            <li>Income statement items have been excluded from the balance sheet</li>
            <li>Cash flow categories are based on UzNAS account code ranges</li>
          </ul>
        </div>
      </section>
    </div>
  );
}