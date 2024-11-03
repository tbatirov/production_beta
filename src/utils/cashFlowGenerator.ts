import { FinancialData, FinancialStatement, Transaction } from './types';
import { logger } from './logger';
import { parseTransactionAmount } from './numberParser';

interface CashFlowCategories {
  operating: Transaction[];
  investing: Transaction[];
  financing: Transaction[];
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function categorizeTransaction(row: Record<string, any>): keyof CashFlowCategories {
  try {
    const accountCode = String(row.account_code || row.account_number || '');
    const description = normalizeText(String(row.description || row.narrative || row.details || ''));

    // Operating activities keywords and patterns
    const operatingKeywords = [
      'sales', 'revenue', 'income', 'expense', 'salary', 'wages', 'rent',
      'utilities', 'supplies', 'inventory', 'operating', 'maintenance'
    ];

    // Investing activities keywords and patterns
    const investingKeywords = [
      'equipment', 'property', 'land', 'building', 'vehicle', 'investment',
      'purchase', 'sale of asset', 'acquisition', 'disposal'
    ];

    // Financing activities keywords and patterns
    const financingKeywords = [
      'loan', 'borrowing', 'dividend', 'share', 'stock', 'capital',
      'interest', 'debt', 'equity', 'financing'
    ];

    // Check account code patterns first
    if (accountCode) {
      const code = accountCode.toString();
      if (code.match(/^[478]/)) return 'operating';
      if (code.match(/^[012]/)) return 'investing';
      if (code.match(/^[356]/)) return 'financing';
    }

    // Check description keywords
    const normalizedDesc = normalizeText(description);
    
    if (operatingKeywords.some(keyword => normalizedDesc.includes(keyword))) {
      return 'operating';
    }
    
    if (investingKeywords.some(keyword => normalizedDesc.includes(keyword))) {
      return 'investing';
    }
    
    if (financingKeywords.some(keyword => normalizedDesc.includes(keyword))) {
      return 'financing';
    }

    logger.debug('Transaction defaulting to operating category', {
      accountCode,
      description: row.description
    });
    
    return 'operating';
  } catch (error) {
    logger.error('Error categorizing transaction', { error, row });
    return 'operating';
  }
}

export function generateCashFlow(data: FinancialData): FinancialStatement {
  logger.info('Starting cash flow statement generation');

  try {
    if (!data?.rows?.length) {
      throw new Error('No transaction data provided');
    }

    const categories: CashFlowCategories = {
      operating: [],
      investing: [],
      financing: []
    };

    // Process and categorize transactions
    data.rows.forEach((row, index) => {
      try {
        const amount = parseTransactionAmount(row);
        
        // Skip transactions with zero amount
        if (amount === 0) {
          logger.debug('Skipping zero amount transaction', { index, row });
          return;
        }

        const transaction: Transaction = {
          description: row.description || row.narrative || row.details || `Transaction ${index + 1}`,
          amount,
          date: row.date || row.transaction_date || new Date().toISOString(),
          accountCode: row.account_code || row.account_number || ''
        };

        const category = categorizeTransaction(row);
        categories[category].push(transaction);

      } catch (error) {
        logger.error('Error processing transaction row', { error, row, index });
      }
    });

    // Create sections with calculated totals
    const createSection = (transactions: Transaction[]) => ({
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      items: transactions.map(t => ({
        account: t.description,
        amount: t.amount
      }))
    });

    const sections = {
      operating: createSection(categories.operating),
      investing: createSection(categories.investing),
      financing: createSection(categories.financing)
    };

    // Calculate net cash flow
    const netCashFlow = Object.values(sections).reduce(
      (sum, section) => sum + section.total,
      0
    );

    const statement: FinancialStatement = {
      date: new Date().toISOString(),
      sections,
      total: netCashFlow
    };

    logger.info('Cash flow statement generated successfully', {
      operatingTotal: sections.operating.total,
      investingTotal: sections.investing.total,
      financingTotal: sections.financing.total,
      netCashFlow
    });

    return statement;

  } catch (error) {
    logger.error('Failed to generate cash flow statement', { error });
    throw new Error(`Failed to generate cash flow statement: ${error.message}`);
  }
}