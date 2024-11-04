import { FinancialData } from '../types';
import { logger } from '../logger';
import { getAISettings, getOpenAIKey } from '../settings/apiSettings';
import i18n from '../i18n';


export async function analyzeCashFlow(data: FinancialData) {
  const aiSettings = getAISettings();
  const OPENAI_API_KEY = getOpenAIKey();

  if (!aiSettings.enabled) {
    throw new Error('AI analysis is disabled. Please enable it in settings.');
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const cleanedData = {
      headers: data.headers,
      rows: data.rows.map((row) => ({
        ...row
      }))
    };

    logger.info('[Cash Flow AI] Starting cash flow analysis with OpenAI', cleanedData);

    const CASH_FLOW_PROMPT = `Analyze the transaction data and generate a cash flow statement following UzNAS account code standards.

CRITICAL RULES:

1. Account Code Classification:
   Operating Activities:
   - Receivables (4000-4999)
   - Current Liabilities (6000-6799)
   - Revenue (7000-7999)
   - Expenses (8000-8999)
   
   Investing Activities:
   - Fixed Assets (0000-0999)
   - Long-term Investments (1000-1999)
   
   Financing Activities:
   - Equity (5000-5999)
   - Long-term Loans (6800-6899)

2. Cash Accounts (3000-3999):
   - Cash on hand (3010)
   - Cash in bank - UZS (3110)
   - Cash in bank - USD (3120)
   When these accounts are:
   - Debited = Cash inflow (+)
   - Credited = Cash outflow (-)

3. Transaction Processing Rules:
   - For each transaction, identify the cash account and non-cash account
   - Cash account movement determines inflow/outflow
   - Non-cash account code determines the category
   - Group similar transactions within each category
   - Calculate net movement for each category

4. Secondary Validation:
   Operating terms: sales, payment, salary, rent, inventory, revenue, expense
   Investing terms: equipment, property, investment, acquisition, asset
   Financing terms: loan, dividend, capital, share, borrowing

Return JSON in this exact format in "${i18n.language}" language:
{
  "cashFlow": {
    "date": "ISO date string",
    "sections": {
      "operating": {
        "total": number,
        "items": [
          {
            "account": string,
            "amount": number,
            "details": [
              {
                "date": "ISO date",
                "description": string,
                "amount": number
              }
            ]
          }
        ]
      },
      "investing": {
        "total": number,
        "items": [/* same structure as operating */]
      },
      "financing": {
        "total": number,
        "items": [/* same structure as operating */]
      }
    },
    "total": number,
    "beginningCash": number,
    "endingCash": number
  }
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: aiSettings.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analysis AI. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'system',
            content: CASH_FLOW_PROMPT,
          },
          {
            role: 'user',
            content: `Analyze these transactions and return ONLY a JSON response: ${JSON.stringify(cleanedData)}`,
          },
        ],
        temperature: 0,
        response_format: { type: 'json_object' },
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    try {
      const parsedResult = JSON.parse(content);
      
      // Post-process the results to ensure proper categorization
      if (parsedResult.cashFlow) {
        const { operating, investing, financing } = parsedResult.cashFlow.sections;
        
        // Ensure each section has items array and total
        operating.items = operating.items || [];
        investing.items = investing.items || [];
        financing.items = financing.items || [];
        
        operating.total = operating.items.reduce((sum, item) => sum + item.amount, 0);
        investing.total = investing.items.reduce((sum, item) => sum + item.amount, 0);
        financing.total = financing.items.reduce((sum, item) => sum + item.amount, 0);
        
        // Calculate total cash flow
        parsedResult.cashFlow.total = operating.total + investing.total + financing.total;
        
        // Ensure beginning and ending cash are numbers
        parsedResult.cashFlow.beginningCash = Number(parsedResult.cashFlow.beginningCash) || 0;
        parsedResult.cashFlow.endingCash = parsedResult.cashFlow.beginningCash + parsedResult.cashFlow.total;
      }

      logger.info('Cash flow analysis completed successfully', parsedResult);
      return parsedResult;
    } catch (parseError) {
      logger.error('Failed to parse OpenAI response', { error: parseError, content });
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    logger.error('Error analyzing cash flow with OpenAI', { error });
    throw error;
  }
}