import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import { GeneratedStatements } from './types';

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function exportToExcel(
  statements: GeneratedStatements,
  activeTab: string
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(activeTab.charAt(0).toUpperCase() + activeTab.slice(1));

  worksheet.columns = [
    { header: 'Account', key: 'account', width: 40 },
    { header: 'Amount', key: 'amount', width: 20 },
  ];

  let data: any[] = [];
  let statement: any;

  switch (activeTab) {
    case 'balance':
      statement = statements.balanceSheet;
      if (statement) {
        data = [
          { account: 'ASSETS', amount: '' },
          ...statement.sections.assets.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Total Assets', amount: statement.sections.assets.total },
          { account: '', amount: '' },
          { account: 'LIABILITIES', amount: '' },
          ...statement.sections.liabilities.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Total Liabilities', amount: statement.sections.liabilities.total },
          { account: '', amount: '' },
          { account: 'EQUITY', amount: '' },
          ...statement.sections.equity.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Total Equity', amount: statement.sections.equity.total },
        ];
      }
      break;

    case 'income':
      statement = statements.incomeStatement;
      if (statement) {
        data = [
          { account: 'REVENUE', amount: '' },
          ...statement.sections.revenue.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Total Revenue', amount: statement.sections.revenue.total },
          { account: '', amount: '' },
          { account: 'EXPENSES', amount: '' },
          ...statement.sections.expenses.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Total Expenses', amount: statement.sections.expenses.total },
          { account: '', amount: '' },
          { account: 'NET INCOME', amount: statement.total },
        ];
      }
      break;

    case 'cashflow':
      statement = statements.cashFlow;
      if (statement) {
        data = [
          { account: 'OPERATING ACTIVITIES', amount: '' },
          ...statement.sections.operating.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Net Operating Cash Flow', amount: statement.sections.operating.total },
          { account: '', amount: '' },
          { account: 'INVESTING ACTIVITIES', amount: '' },
          ...statement.sections.investing.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Net Investing Cash Flow', amount: statement.sections.investing.total },
          { account: '', amount: '' },
          { account: 'FINANCING ACTIVITIES', amount: '' },
          ...statement.sections.financing.items.map((item: any) => ({
            account: `  ${item.account}`,
            amount: item.amount,
          })),
          { account: 'Net Financing Cash Flow', amount: statement.sections.financing.total },
          { account: '', amount: '' },
          { account: 'NET CASH FLOW', amount: statement.total },
        ];
      }
      break;
  }

  worksheet.addRows(data);

  // Format amounts as currency
  worksheet.getColumn('amount').numFmt = '"$"#,##0;[Red]-"$"#,##0';

  // Style headers
  worksheet.getRow(1).font = { bold: true };

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${activeTab}-statement.xlsx`);
}

export async function exportToPDF(
  statements: GeneratedStatements,
  activeTab: string
) {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;
  const lineHeight = 8;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    doc.text(text, x, y, options);
    return y + lineHeight;
  };

  // Helper function to add section
  const addSection = (title: string, items: any[], total: number) => {
    yPos = addText(title.toUpperCase(), margin, yPos, { font: 'bold' });
    yPos += 2;

    items.forEach(item => {
      const amount = formatAmount(item.amount);
      doc.text(`  ${item.account}`, margin, yPos);
      doc.text(amount, 190 - margin, yPos, { align: 'right' });
      yPos += lineHeight;
    });

    yPos += 2;
    doc.text('Total ' + title, margin, yPos);
    doc.text(formatAmount(total), 190 - margin, yPos, { align: 'right' });
    yPos += lineHeight * 1.5;
  };

  // Add title
  doc.setFontSize(16);
  let title = '';
  switch (activeTab) {
    case 'balance':
      title = 'Balance Sheet';
      break;
    case 'income':
      title = 'Income Statement';
      break;
    case 'cashflow':
      title = 'Cash Flow Statement';
      break;
  }
  yPos = addText(title, margin, yPos);
  yPos += lineHeight;

  // Set font size for content
  doc.setFontSize(12);

  // Add content based on statement type
  switch (activeTab) {
    case 'balance':
      if (statements.balanceSheet) {
        const { assets, liabilities, equity } = statements.balanceSheet.sections;
        addSection('Assets', assets.items, assets.total);
        addSection('Liabilities', liabilities.items, liabilities.total);
        addSection('Equity', equity.items, equity.total);
      }
      break;

    case 'income':
      if (statements.incomeStatement) {
        const { revenue, expenses } = statements.incomeStatement.sections;
        addSection('Revenue', revenue.items, revenue.total);
        addSection('Expenses', expenses.items, expenses.total);
        yPos += 2;
        doc.text('NET INCOME', margin, yPos);
        doc.text(formatAmount(statements.incomeStatement.total), 190 - margin, yPos, { align: 'right' });
      }
      break;

    case 'cashflow':
      if (statements.cashFlow) {
        const { operating, investing, financing } = statements.cashFlow.sections;
        addSection('Operating Activities', operating.items, operating.total);
        addSection('Investing Activities', investing.items, investing.total);
        addSection('Financing Activities', financing.items, financing.total);
        yPos += 2;
        doc.text('NET CASH FLOW', margin, yPos);
        doc.text(formatAmount(statements.cashFlow.total), 190 - margin, yPos, { align: 'right' });
      }
      break;
  }

  // Save the PDF
  doc.save(`${activeTab}-statement.pdf`);
}