import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, TextRun, AlignmentType, BorderStyle, convertInchesToTwip, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { GeneratedStatements } from './types';
import { calculateFinancialRatios } from './ratioCalculator';
import { getCachedRecommendations } from './ai/recommendationsAI';
import { logger } from './logger';
import { generateAnalysisHTML } from './reportGenerator';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function createHeading(text: string, level: HeadingLevel = HeadingLevel.HEADING_1): Paragraph {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 400, after: 200 }
  });
}

function createTable(headers: string[], rows: string[][], showBorders: boolean = false): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: showBorders ? {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' }
    } : undefined,
    rows: [
      new TableRow({
        children: headers.map(header => 
          new TableCell({
            children: [new Paragraph({ 
              text: header,
              style: 'Strong',
              alignment: AlignmentType.LEFT
            })],
            shading: { fill: 'F3F4F6' }
          })
        )
      }),
      ...rows.map(row => 
        new TableRow({
          children: row.map(cell => 
            new TableCell({
              children: [new Paragraph({ 
                text: cell,
                alignment: AlignmentType.LEFT
              })]
            })
          )
        })
      )
    ],
    margins: {
      top: convertInchesToTwip(0.1),
      bottom: convertInchesToTwip(0.1),
      left: convertInchesToTwip(0.1),
      right: convertInchesToTwip(0.1)
    }
  });
}

function createStatementSection(title: string, sections: any): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      border: {
        bottom: {
          color: '4F46E5',
          size: 1,
          style: BorderStyle.SINGLE
        }
      }
    })
  );

  Object.entries(sections).forEach(([sectionName, section]: [string, any]) => {
    paragraphs.push(
      new Paragraph({
        text: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const rows = section.items.map((item: any) => [
      item.account,
      formatCurrency(item.amount)
    ]);

    rows.push([
      'Total ' + sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
      formatCurrency(section.total)
    ]);

    paragraphs.push(
      createTable(
        ['Account', 'Amount'],
        rows,
        true
      )
    );

    paragraphs.push(
      new Paragraph({
        text: '',
        spacing: { before: 200, after: 200 }
      })
    );
  });

  return paragraphs;
}

async function createStrategicRecommendationsSection(ratios: any, industry: string): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = [];
  
  try {
    const recommendations = await getCachedRecommendations(ratios, industry);
    
    // Add Strategic Recommendations heading
    paragraphs.push(
      new Paragraph({
        text: 'Strategic Recommendations',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: {
            color: '4F46E5',
            size: 1,
            style: BorderStyle.SINGLE
          }
        }
      })
    );

    // Add Summary
    paragraphs.push(
      new Paragraph({
        text: 'Executive Summary',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: recommendations.summary,
        spacing: { before: 100, after: 200 }
      })
    );

    // Add Industry Context
    paragraphs.push(
      new Paragraph({
        text: 'Industry Context',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: recommendations.industryContext,
        spacing: { before: 100, after: 200 }
      })
    );

    // Add Recommendations by category
    const categories = [
      { title: 'Immediate Actions', data: recommendations.recommendations.immediate },
      { title: 'Short-Term Actions', data: recommendations.recommendations.shortTerm },
      { title: 'Long-Term Actions', data: recommendations.recommendations.longTerm }
    ];

    categories.forEach(category => {
      paragraphs.push(
        new Paragraph({
          text: category.title,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        })
      );

      category.data.forEach((rec: any) => {
        paragraphs.push(
          new Paragraph({
            text: rec.title,
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 100, after: 50 }
          }),
          new Paragraph({
            text: rec.description,
            spacing: { before: 50, after: 50 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Impact: ', bold: true }),
              new TextRun(rec.impact),
              new TextRun({ text: ' | Complexity: ', bold: true }),
              new TextRun(rec.complexity)
            ],
            spacing: { before: 50, after: 50 }
          })
        );

        if (rec.resources.length > 0) {
          paragraphs.push(
            new Paragraph({
              text: 'Required Resources:',
              spacing: { before: 50, after: 50 }
            })
          );

          rec.resources.forEach((resource: string) => {
            paragraphs.push(
              new Paragraph({
                text: `• ${resource}`,
                spacing: { before: 0, after: 0 }
              })
            );
          });
        }

        paragraphs.push(
          new Paragraph({
            text: '',
            spacing: { before: 100, after: 100 }
          })
        );
      });
    });

  } catch (error) {
    logger.error('Error creating strategic recommendations section:', error);
    paragraphs.push(
      new Paragraph({
        text: 'Strategic recommendations could not be generated.',
        spacing: { before: 200, after: 200 }
      })
    );
  }

  return paragraphs;
}

export async function exportComprehensiveReport(
  statements: GeneratedStatements,
  industry: string = 'Unknown'
): Promise<void> {
  logger.info('Generating comprehensive report');
  
  try {
    const htmlContent = await generateAnalysisHTML(statements);
    const sections: Paragraph[] = [];
    
    sections.push(
      new Paragraph({
        text: 'Comprehensive Financial Analysis Report',
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated on ${new Date().toLocaleDateString()}`,
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    if (statements.balanceSheet) {
      sections.push(...createStatementSection(
        'Balance Sheet',
        statements.balanceSheet.sections
      ));
    }

    if (statements.incomeStatement) {
      sections.push(...createStatementSection(
        'Income Statement',
        statements.incomeStatement.sections
      ));
    }

    if (statements.cashFlow) {
      sections.push(...createStatementSection(
        'Cash Flow Statement',
        statements.cashFlow.sections
      ));
    }

    const ratios = calculateFinancialRatios(statements);
    sections.push(...htmlContent.sections);

    // Add Strategic Recommendations
    sections.push(...await createStrategicRecommendationsSection(ratios, industry));

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }],
      styles: {
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 24,
              font: 'Calibri',
            },
            paragraph: {
              spacing: {
                after: 200,
                line: 276,
                lineRule: 'auto',
              },
            },
          }
        ]
      }
    });

    // Use Packer to generate the Word document
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, 'comprehensive-financial-analysis.docx');
    logger.info('Comprehensive report generated successfully');
  } catch (error) {
    logger.error('Error generating comprehensive report:', error);
    throw error;
  }
}

export async function exportToWord(statements: GeneratedStatements, includeAnalysis: boolean = false): Promise<void> {
  try {
    const date = new Date().toLocaleDateString();
    const sections: Paragraph[] = [];

    sections.push(
      new Paragraph({
        text: 'Financial Statements Report',
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 }
      })
    );

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated on ${date}`,
            italics: true
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    if (statements.balanceSheet) {
      sections.push(...createStatementSection(
        'Balance Sheet',
        statements.balanceSheet.sections
      ));
    }

    if (statements.incomeStatement) {
      sections.push(...createStatementSection(
        'Income Statement',
        statements.incomeStatement.sections
      ));
    }

    if (statements.cashFlow) {
      sections.push(...createStatementSection(
        'Cash Flow Statement',
        statements.cashFlow.sections
      ));
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    // Use Packer to generate the Word document
    const buffer = await Packer.toBlob(doc);
    const fileName = includeAnalysis ? 'financial-analysis-report.docx' : 'financial-statements.docx';
    saveAs(buffer, fileName);
    logger.info('Word document generated successfully', { includeAnalysis });
  } catch (error) {
    logger.error('Error generating Word document:', error);
    throw error;
  }
}