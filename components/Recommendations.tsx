import React from 'react';
import { AlertCircle, TrendingUp, Lightbulb, Info } from 'lucide-react';
import { GeneratedStatements } from '../utils/types';
import { calculateFinancialRatios } from '../utils/ratioCalculator';

interface RecommendationsProps {
  statements: GeneratedStatements;
}

export default function Recommendations({ statements }: RecommendationsProps) {
  if (!statements || !statements.balanceSheet || !statements.incomeStatement) {
    return null;
  }

  const ratioCategories = calculateFinancialRatios(statements);

  const getRecommendations = () => {
    const recommendations = {
      urgentIssues: [] as string[],
      improvements: [] as string[],
      strengths: [] as string[]
    };

    ratioCategories.forEach(category => {
      category.ratios.forEach(ratio => {
        const value = ratio.value;
        const benchmark = ratio.benchmark;
        const deviation = Math.abs((value - benchmark) / benchmark);

        if (ratio.status === 'poor') {
          recommendations.urgentIssues.push(
            `${ratio.name} (${value.toFixed(2)}) is significantly below benchmark of ${benchmark}. ${ratio.interpretation}`
          );
        } else if (ratio.status === 'warning') {
          recommendations.improvements.push(
            `${ratio.name} could be improved from ${value.toFixed(2)} to reach benchmark of ${benchmark}`
          );
        } else if (ratio.status === 'good') {
          recommendations.strengths.push(
            `Strong ${ratio.name.toLowerCase()} at ${value.toFixed(2)} vs benchmark of ${benchmark}`
          );
        }
      });
    });

    return recommendations;
  };

  const getAccaDisclosures = () => [
    {
      title: "Liquidity and Working Capital",
      content: [
        "Current assets should be disclosed separately from non-current assets",
        "Trade receivables should show allowance for doubtful debts",
        "Inventory valuation method and carrying amount breakdown required",
        "Current liabilities should be clearly separated from non-current liabilities",
        "Working capital facility terms and conditions should be disclosed"
      ]
    },
    {
      title: "Fixed Assets and Depreciation",
      content: [
        "Detailed reconciliation of carrying amounts required",
        "Depreciation methods and useful lives must be disclosed",
        "Any impairment losses should be separately identified",
        "Capitalization policy for subsequent expenditure",
        "Details of assets pledged as security"
      ]
    },
    {
      title: "Revenue Recognition",
      content: [
        "Revenue recognition policies must be clearly stated",
        "Different revenue streams should be separately disclosed",
        "Contract assets and liabilities should be identified",
        "Performance obligations and their timing",
        "Significant payment terms"
      ]
    }
  ];

  const { urgentIssues, improvements, strengths } = getRecommendations();
  const accaDisclosures = getAccaDisclosures();

  return (
    <div className="space-y-8">
      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
        </div>

        {urgentIssues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-red-600 mb-3">Urgent Issues</h3>
            <ul className="space-y-2">
              {urgentIssues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-yellow-600 mb-3">Areas for Improvement</h3>
            <ul className="space-y-2">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-yellow-600">
                  <TrendingUp className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {strengths.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-green-600 mb-3">Key Strengths</h3>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ACCA Disclosures */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Required ACCA Disclosures</h2>
        </div>

        <div className="space-y-6">
          {accaDisclosures.map((section, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}