import { GeneratedStatements } from './types';
import { calculateFinancialRatios } from './ratioCalculator';
import { logger } from './logger';
import { Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface HTMLContent {
  sections: Paragraph[];
}

export async function generateAnalysisHTML(statements: GeneratedStatements): Promise<HTMLContent> {
  logger.info('Generating analysis HTML content');
  
  try {
    const ratios = calculateFinancialRatios(statements);
    const sections: Paragraph[] = [];

    // Financial Ratios Analysis
    sections.push(
      new Paragraph({
        text: 'Financial Ratios Analysis',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { color: '4F46E5', size: 1, style: 'single' }
        }
      })
    );

    // Profitability Ratios
    sections.push(
      new Paragraph({
        text: 'Profitability Ratios',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const profitabilityRows = [
      ['Net Profit Margin', `${ratios.profitability.netProfitMargin.toFixed(2)}%`],
      ['Return on Equity', `${ratios.profitability.returnOnEquity.toFixed(2)}%`],
      ['Return on Assets', `${ratios.profitability.returnOnAssets.toFixed(2)}%`]
    ];

    sections.push(createRatioTable(profitabilityRows));

    // Liquidity Ratios
    sections.push(
      new Paragraph({
        text: 'Liquidity Ratios',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const liquidityRows = [
      ['Current Ratio', ratios.liquidity.currentRatio.toFixed(2)],
      ['Quick Ratio', ratios.liquidity.quickRatio.toFixed(2)],
      ['Cash Ratio', ratios.liquidity.cashRatio.toFixed(2)]
    ];

    sections.push(createRatioTable(liquidityRows));

    // Efficiency Ratios
    sections.push(
      new Paragraph({
        text: 'Efficiency Ratios',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const efficiencyRows = [
      ['Asset Turnover', ratios.efficiency.assetTurnover.toFixed(2)],
      ['Inventory Turnover', ratios.efficiency.inventoryTurnover.toFixed(2)],
      ['Receivables Turnover', ratios.efficiency.receivablesTurnover.toFixed(2)]
    ];

    sections.push(createRatioTable(efficiencyRows));

    // Strengths and Weaknesses
    sections.push(
      new Paragraph({
        text: 'Analysis Summary',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { color: '4F46E5', size: 1, style: 'single' }
        }
      })
    );

    // Strengths
    sections.push(
      new Paragraph({
        text: 'Key Strengths',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const strengths = getStrengths(ratios);
    strengths.forEach(strength => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '• ',
              bold: true,
              color: '16A34A' // green-600
            }),
            new TextRun({
              text: strength,
              color: '166534' // green-800
            })
          ],
          spacing: { before: 80, after: 80 }
        })
      );
    });

    // Weaknesses
    sections.push(
      new Paragraph({
        text: 'Areas for Improvement',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const weaknesses = getWeaknesses(ratios);
    weaknesses.forEach(weakness => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '• ',
              bold: true,
              color: 'DC2626' // red-600
            }),
            new TextRun({
              text: weakness,
              color: '991B1B' // red-800
            })
          ],
          spacing: { before: 80, after: 80 }
        })
      );
    });

    // Recommendations
    sections.push(
      new Paragraph({
        text: 'Strategic Recommendations',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { color: '4F46E5', size: 1, style: 'single' }
        }
      })
    );

    const recommendations = getRecommendations(ratios);
    recommendations.forEach(recommendation => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '• ',
              bold: true,
              color: '2563EB' // blue-600
            }),
            new TextRun({
              text: recommendation,
              color: '1E40AF' // blue-800
            })
          ],
          spacing: { before: 80, after: 80 }
        })
      );
    });

    logger.info('Analysis HTML content generated successfully');
    return { sections };
  } catch (error) {
    logger.error('Error generating analysis HTML:', error);
    throw error;
  }
}

function createRatioTable(rows: string[][]): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: rows.map(row => `${row[0]}: ${row[1]}`).join('\n'),
        size: 24
      })
    ],
    spacing: { before: 100, after: 200 }
  });
}

function getStrengths(ratios: any): string[] {
  const strengths = [];
  if (ratios.profitability.netProfitMargin > 15) {
    strengths.push('Strong net profit margin indicating excellent operational efficiency');
  }
  if (ratios.liquidity.currentRatio > 2) {
    strengths.push('Healthy liquidity position with strong ability to meet short-term obligations');
  }
  if (ratios.efficiency.assetTurnover > 1.5) {
    strengths.push('Efficient asset utilization demonstrating effective resource management');
  }
  return strengths;
}

function getWeaknesses(ratios: any): string[] {
  const weaknesses = [];
  if (ratios.profitability.netProfitMargin < 5) {
    weaknesses.push('Low profit margins indicating potential operational inefficiencies');
  }
  if (ratios.liquidity.currentRatio < 1) {
    weaknesses.push('Poor liquidity position suggesting potential cash flow challenges');
  }
  if (ratios.efficiency.inventoryTurnover < 4) {
    weaknesses.push('Low inventory turnover indicating potential inventory management issues');
  }
  return weaknesses;
}

function getRecommendations(ratios: any): string[] {
  const recommendations = [];
  if (ratios.profitability.netProfitMargin < 10) {
    recommendations.push('Implement cost control measures to improve profit margins');
  }
  if (ratios.liquidity.currentRatio < 1.5) {
    recommendations.push('Consider strategies to improve working capital management');
  }
  if (ratios.efficiency.receivablesTurnover < 6) {
    recommendations.push('Review credit policies to improve accounts receivable collection');
  }
  if (ratios.leverage.debtToEquity > 2) {
    recommendations.push('Evaluate debt reduction strategies to improve financial stability');
  }
  return recommendations;
}